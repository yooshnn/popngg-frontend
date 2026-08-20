import type { UserProfile } from '../model/types';
import type { ClearMilestone } from '~/entities/medal';
import { useTranslation } from 'react-i18next';
import { clearType } from '~/entities/medal';
import { popnClass } from '~/entities/popn-class';

interface MilestoneStat {
  color: string;
  id: ClearMilestone;
  label: string;
  maxLevel: number;
}

interface ProfileStatsViewProps {
  current: string;
  legacy: string;
  milestones: readonly MilestoneStat[];
  popnClassLabel: string;
}

export function ProfileStats({ profile }: { profile: UserProfile }) {
  const { t } = useTranslation();

  const current = popnClass.format(profile.popnClass);
  const legacy = `${t('user.profile.popnClass.legacyPrefix')}${popnClass.format(profile.legacyPopnClass)}`;
  const milestones = clearType.milestones.map(milestone => ({
    color: clearType.color(milestone),
    id: milestone,
    label: t(clearType.labelKey(milestone)),
    maxLevel: profile.clearSummaries[milestone].maxLevel,
  }));

  return (
    <section className="self-start md:pt-2 md:pl-10">
      <MobileProfileStats
        current={current}
        legacy={legacy}
        milestones={milestones}
        popnClassLabel={t('user.profile.popnClass.shortLabel')}
      />
      <DesktopProfileStats
        current={current}
        legacy={legacy}
        milestones={milestones}
        popnClassLabel={t('user.profile.popnClass.label')}
      />
    </section>
  );
}

function MobileProfileStats({
  current,
  legacy,
  milestones,
  popnClassLabel,
}: ProfileStatsViewProps) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-5 pt-4 pb-2 sm:grid-cols-4 md:hidden">
      <div>
        <dt className="text-xs font-medium text-fg-neutral-subtle">{popnClassLabel}</dt>
        <dd className="mt-2 text-base leading-none font-medium tracking-tight whitespace-nowrap">
          {current}
          <span className="ml-1 text-[.625rem] font-normal tracking-normal text-fg-neutral-muted">
            {legacy}
          </span>
        </dd>
      </div>

      {milestones.map(stat => (
        <div className="min-w-0" key={stat.id}>
          <dt className="text-xs font-medium" style={{ color: stat.color }}>
            {stat.label}
          </dt>
          <dd className="mt-2 text-base leading-none font-medium tracking-tight whitespace-nowrap">
            {stat.maxLevel}
            <span className="ml-0.5 text-[.625rem] font-normal tracking-normal text-fg-neutral-subtle">
              Lv
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function DesktopProfileStats({
  current,
  legacy,
  milestones,
  popnClassLabel,
}: ProfileStatsViewProps) {
  return (
    <div className="hidden md:block">
      <p className="text-sm text-fg-neutral-subtle">{popnClassLabel}</p>
      <p className="mt-1.5 tracking-[-.045em] whitespace-nowrap">
        <strong className="text-3xl leading-none font-bold">{current}</strong>
        <span className="ml-2 text-sm font-normal tracking-normal text-fg-neutral-muted">
          {legacy}
        </span>
      </p>

      <dl className="mt-7 space-y-4 border-t border-stroke-neutral-weak pt-5">
        {milestones.map(stat => (
          <div className="flex items-baseline justify-between gap-4" key={stat.id}>
            <dt className="flex items-center gap-2 text-sm font-medium" style={{ color: stat.color }}>
              <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-current" />
              {stat.label}
            </dt>
            <dd className="pr-2 text-base leading-none whitespace-nowrap">
              <span className="tracking-[-.045em]">{stat.maxLevel}</span>
              <span className="ml-1 text-xs font-medium text-fg-neutral-subtle">
                Lv
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
