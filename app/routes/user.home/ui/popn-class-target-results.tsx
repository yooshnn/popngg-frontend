import type { UseQueryResult } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import type {
  PopnClassTarget,
  PopnClassTargets,
  PopnClassTargetView,
} from '../model/types';
import { useQuery } from '@tanstack/react-query';
import { isHTTPError } from 'ky';
import { useTranslation } from 'react-i18next';
import { PlayRecordCardGridSkeleton } from '~/entities/play-record';
import { popnClass } from '~/entities/popn-class';
import { QueryState } from '~/shared/ui/data-state';
import { Notice } from '~/shared/ui/notice';
import { currentPopnClassTargetsQuery, legacyPopnClassTargetsQuery, potentialPopnClassTargetsQuery } from '../api/queries';
import { averagePopnClass, toClassEquivalent, totalPopnClass } from '../lib/popn-class-result';
import { PopnClassTargetList } from './popn-class-target-list';

interface PopnClassTargetResultsProps {
  userId: string;
  view: PopnClassTargetView;
}

export function PopnClassTargetResults({ userId, view }: PopnClassTargetResultsProps) {
  switch (view) {
    case 'actual': return <ActualTargets userId={userId} />;
    case 'potential': return <PotentialTargets userId={userId} />;
    case 'legacy': return <LegacyTargets userId={userId} />;
  }
}

function ActualTargets({ userId }: { userId: string }) {
  const { t } = useTranslation();
  const targets = useQuery(currentPopnClassTargetsQuery(userId));

  if (isHTTPError(targets.error) && targets.error.response.status === 404) {
    return <p className="text-sm text-fg-neutral-muted">{t('user.home.popnClassTargets.notRenewed')}</p>;
  }

  return <GroupedTargets query={targets} />;
}

function PotentialTargets({ userId }: { userId: string }) {
  const { t } = useTranslation();
  const targets = useQuery(potentialPopnClassTargetsQuery(userId));

  return (
    <GroupedTargets
      notice={t('user.home.popnClassTargets.potentialNotice')}
      query={targets}
    />
  );
}

function GroupedTargets({ notice, query }: { notice?: string; query: UseQueryResult<PopnClassTargets> }) {
  return (
    <QueryState
      isEmpty={data => data.newSongs.length === 0 && data.oldSongs.length === 0}
      pending={<PlayRecordCardGridSkeleton />}
      query={query}
    >
      {data => (
        <TargetsLayout
          notice={notice}
          value={totalPopnClass(data.newSongs) + totalPopnClass(data.oldSongs)}
        >
          <CurrentTargetGroups targets={data} />
        </TargetsLayout>
      )}
    </QueryState>
  );
}

function LegacyTargets({ userId }: { userId: string }) {
  const { t } = useTranslation();
  const targets = useQuery(legacyPopnClassTargetsQuery(userId));

  return (
    <QueryState
      isEmpty={data => data.length === 0}
      pending={<PlayRecordCardGridSkeleton />}
      query={targets}
    >
      {data => (
        <TargetsLayout
          notice={t('user.home.popnClassTargets.legacyNotice')}
          value={averagePopnClass(data)}
        >
          <TargetGroup id="legacy" showAverage={false} songs={data} />
        </TargetsLayout>
      )}
    </QueryState>
  );
}

function TargetsLayout({
  children,
  notice,
  value,
}: {
  children: ReactNode;
  notice?: string;
  value: number;
}) {
  const { t } = useTranslation();

  return (
    <div className="space-y-7 md:space-y-9">
      <div className="space-y-3">
        <p className="flex items-baseline gap-2 text-sm text-fg-neutral-muted">
          {t('user.home.popnClassTargets.result')}
          <strong className="font-semibold tracking-[-.02em] text-fg-neutral">
            {popnClass.format(value)}
          </strong>
        </p>
        {notice && <Notice variant="informative">{notice}</Notice>}
      </div>
      {children}
    </div>
  );
}

function CurrentTargetGroups({ targets }: { targets: PopnClassTargets }) {
  return (
    <div className="space-y-10 md:space-y-12">
      <TargetGroup asClassEquivalent id="newSongs" songs={targets.newSongs} />
      <TargetGroup asClassEquivalent id="oldSongs" songs={targets.oldSongs} />
    </div>
  );
}

function TargetGroup({
  asClassEquivalent = false,
  id,
  showAverage = true,
  songs,
}: {
  /** On for the current formula, whose raw per-target contributions are 1/60 of a popn class. */
  asClassEquivalent?: boolean;
  id: 'newSongs' | 'oldSongs' | 'legacy';
  /** Off when the group is the section's only one, where it would just repeat the section total. */
  showAverage?: boolean;
  songs: PopnClassTarget[];
}) {
  const { t } = useTranslation();
  const titleId = `popn-class-${id}-targets`;
  const scale = asClassEquivalent ? toClassEquivalent : (value: number) => value;
  const average = scale(averagePopnClass(songs));
  const shownSongs = asClassEquivalent
    ? songs.map(song => ({ ...song, popnClass: toClassEquivalent(song.popnClass) }))
    : songs;

  return (
    <section aria-labelledby={titleId}>
      <div className="flex items-center gap-3">
        <h3 className="text-base font-bold tracking-[-.02em]" id={titleId}>
          {t(`user.home.popnClassTargets.group.${id}`)}
        </h3>
        <span className="rounded-full bg-bg-neutral-weak px-2.5 py-1 text-xs font-semibold text-fg-neutral-muted">
          {t('user.home.popnClassTargets.songCount', { count: songs.length })}
        </span>
        {showAverage && (
          <span className="ml-auto text-xs text-fg-neutral-subtle">
            {t('user.home.popnClassTargets.average', { value: average.toFixed(2) })}
          </span>
        )}
      </div>
      <PopnClassTargetList songs={shownSongs} />
    </section>
  );
}
