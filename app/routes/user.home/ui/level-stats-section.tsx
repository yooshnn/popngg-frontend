import type { LevelStatsMode } from '../lib/level-stats';
import type { LevelStats } from '../model/types';
import { useQuery } from '@tanstack/react-query';
import { useQueryStates } from 'nuqs';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { EmptyState, QueryState } from '~/shared/ui/data-state';
import { SectionControlBar } from '~/shared/ui/section-control-bar';
import { SectionHeader } from '~/shared/ui/section-header';
import { SegmentedControl } from '~/shared/ui/segmented-control';
import { Skeleton } from '~/shared/ui/skeleton';
import { levelStatsQuery } from '../api/queries';
import { findDefaultLevelIndex, getLevelStatsPresentation, LEVEL_STATS_MODES } from '../lib/level-stats';
import { levelStatsSearchParams } from '../lib/level-stats-search-params';
import { LevelStatsChart } from './level-stats-chart';
import { LevelStepper } from './level-stepper';

const modeOptions = LEVEL_STATS_MODES.map(value => ({
  value,
  labelKey: `user.home.levelStats.mode.${value}` as const,
}));

export function LevelStatsSection({ userId }: { userId: string }) {
  const { t } = useTranslation();
  const stats = useQuery(levelStatsQuery(userId));

  return (
    <section className="relative mt-16 pt-14 before:absolute before:top-0 before:left-0 before:h-[3px] before:w-10 before:rounded-full before:bg-bg-brand-solid-pressed md:mt-22 md:pt-18" aria-labelledby="level-stats-title">
      <SectionHeader
        description={t('user.home.levelStats.description')}
        title={t('user.home.levelStats.title')}
        titleId="level-stats-title"
      />

      <QueryState pending={<LevelStatsSkeleton />} query={stats}>
        {data => isNonEmpty(data) ? <LevelStatsContent stats={data} userId={userId} /> : <EmptyState />}
      </QueryState>
    </section>
  );
}

function LevelStatsContent({ stats, userId }: { stats: NonEmptyArray<LevelStats>; userId: string }) {
  const [{ level, mode }, setSearchParams] = useQueryStates(levelStatsSearchParams);
  const { current, stepperProps } = useLevelSelection(stats, level, nextLevel => setSearchParams({ level: nextLevel }));
  const presentation = useMemo(
    () => getLevelStatsPresentation(mode, current),
    [current, mode],
  );

  return (
    <>
      <SectionControlBar className="mt-7 md:mt-9">
        <LevelStatsModeControl mode={mode} onModeChange={mode => setSearchParams({ mode })} />
        <LevelStepper {...stepperProps} />
      </SectionControlBar>

      <div className="mt-6">
        <LevelStatsChart
          level={current.level}
          presentation={presentation}
          total={current.total}
          userId={userId}
        />
      </div>
    </>
  );
}

function LevelStatsModeControl({
  mode,
  onModeChange,
}: {
  mode: LevelStatsMode;
  onModeChange: (mode: LevelStatsMode) => void;
}) {
  const { t } = useTranslation();

  return (
    <SegmentedControl
      aria-label={t('user.home.levelStats.mode.label')}
      options={modeOptions.map(option => ({
        value: option.value,
        label: t(option.labelKey),
      }))}
      value={mode}
      onValueChange={onModeChange}
    />
  );
}

type NonEmptyArray<Value> = [Value, ...Value[]];

function isNonEmpty<Value>(values: Value[] | undefined): values is NonEmptyArray<Value> {
  return Boolean(values?.length);
}

function useLevelSelection(
  stats: NonEmptyArray<LevelStats>,
  selectedLevel: number | null,
  onLevelChange: (level: number) => void,
) {
  const sortedStats = useMemo(
    () => [...stats].sort((left, right) => left.level - right.level) as NonEmptyArray<LevelStats>,
    [stats],
  );
  const selectedIndex = selectedLevel === null
    ? -1
    : sortedStats.findIndex(item => item.level === selectedLevel);
  const currentIndex = selectedIndex >= 0 ? selectedIndex : findDefaultLevelIndex(sortedStats);
  const current = sortedStats[currentIndex] ?? sortedStats[0];

  function move(offset: number) {
    const nextStats = sortedStats[currentIndex + offset];
    if (nextStats)
      onLevelChange(nextStats.level);
  }

  return {
    current,
    stepperProps: {
      canGoDown: currentIndex > 0,
      canGoUp: currentIndex < sortedStats.length - 1,
      level: current.level,
      onDown: () => move(-1),
      onUp: () => move(1),
    },
  };
}

function LevelStatsSkeleton() {
  return (
    <div className="mt-7 md:mt-9">
      <Skeleton className="h-14 w-full" />
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col items-center gap-5">
          <Skeleton className="size-[240px] rounded-full md:size-[264px]" />
          <Skeleton className="h-24 w-full max-w-[520px]" />
        </div>
        <div className="grid gap-4">
          {Array.from({ length: 5 }, (_, index) => <Skeleton className="h-20" key={index} />)}
        </div>
      </div>
    </div>
  );
}
