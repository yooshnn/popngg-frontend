import type {
  PopnClassTarget,
  PopnClassTargetCalculation,
  PopnClassTargets,
} from '../model/types';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { PlayRecordCardGridSkeleton } from '~/entities/play-record';
import { QueryState } from '~/shared/ui/data-state';
import { currentPopnClassTargetsQuery, legacyPopnClassTargetsQuery } from '../api/queries';
import { PopnClassTargetList } from './popn-class-target-list';

interface PopnClassTargetResultsProps {
  calculation: PopnClassTargetCalculation;
  userId: string;
}

export function PopnClassTargetResults({ calculation, userId }: PopnClassTargetResultsProps) {
  return calculation === 'current'
    ? <CurrentTargets userId={userId} />
    : <LegacyTargets userId={userId} />;
}

function CurrentTargets({ userId }: { userId: string }) {
  const targets = useQuery(currentPopnClassTargetsQuery(userId));

  return (
    <QueryState
      isEmpty={data => data.newSongs.length === 0 && data.oldSongs.length === 0}
      pending={<PlayRecordCardGridSkeleton />}
      query={targets}
    >
      {data => <CurrentTargetGroups targets={data} />}
    </QueryState>
  );
}

function LegacyTargets({ userId }: { userId: string }) {
  const targets = useQuery(legacyPopnClassTargetsQuery(userId));

  return (
    <QueryState
      isEmpty={data => data.length === 0}
      pending={<PlayRecordCardGridSkeleton />}
      query={targets}
    >
      {data => <TargetGroup id="legacy" songs={data} />}
    </QueryState>
  );
}

function CurrentTargetGroups({ targets }: { targets: PopnClassTargets }) {
  return (
    <div className="space-y-10 md:space-y-12">
      <TargetGroup id="newSongs" songs={targets.newSongs} />
      <TargetGroup id="oldSongs" songs={targets.oldSongs} />
    </div>
  );
}

function TargetGroup({
  id,
  songs,
}: {
  id: 'newSongs' | 'oldSongs' | 'legacy';
  songs: PopnClassTarget[];
}) {
  const { t } = useTranslation();
  const titleId = `popn-class-${id}-targets`;
  const average = songs.length === 0
    ? 0
    : songs.reduce((sum, song) => sum + song.popnClass, 0) / songs.length;

  return (
    <section aria-labelledby={titleId}>
      <div className="flex items-center gap-3">
        <h3 className="text-base font-bold tracking-[-.02em]" id={titleId}>
          {t(`user.home.popnClassTargets.group.${id}`)}
        </h3>
        <span className="rounded-full bg-bg-neutral-weak px-2.5 py-1 text-xs font-semibold text-fg-neutral-muted">
          {t('user.home.popnClassTargets.songCount', { count: songs.length })}
        </span>
        <span className="ml-auto text-xs text-fg-neutral-subtle">
          {t('user.home.popnClassTargets.average', { value: average.toFixed(2) })}
        </span>
      </div>
      <PopnClassTargetList songs={songs} />
    </section>
  );
}
