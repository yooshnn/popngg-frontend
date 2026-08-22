import type { PieArcDatum } from 'd3';
import type { ReactNode } from 'react';
import type {
  LevelStatsChartGroup,
  LevelStatsChartItem,
  LevelStatsPresentation,
  LevelStatsSummary,
  LevelStatsSummaryItem,
} from '../lib/level-stats';
import { arc, pie } from 'd3';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { clearType, medal } from '~/entities/medal';
import { rank, rankFamily } from '~/entities/rank';
import { formatLevelStatsPercent } from '../lib/level-stats';
import { recordsLink } from '../lib/records-link';

interface LevelStatsChartProps {
  level: number;
  presentation: LevelStatsPresentation;
  total: number;
  userId: string;
}

export function LevelStatsChart({
  level,
  presentation,
  total,
  userId,
}: LevelStatsChartProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(280px,.85fr)_minmax(380px,1.15fr)] lg:items-start lg:gap-10">
      <div className="flex min-w-0 flex-col items-center lg:pr-6">
        <PieChart
          groups={presentation.groups}
          level={level}
          mode={presentation.mode}
          total={total}
        />
        <StatsSummary level={level} summary={presentation.summary} total={total} userId={userId} />
      </div>

      <div className="grid gap-4 lg:border-l lg:border-stroke-neutral-weak lg:pl-10">
        {presentation.groups.map(group => (
          <StatsLegendGroup group={group} key={`${group.kind}-${group.id}`} level={level} total={total} userId={userId} />
        ))}
      </div>
    </div>
  );
}

function PieChart({
  groups,
  level,
  mode,
  total,
}: {
  groups: LevelStatsChartGroup[];
  level: number;
  mode: LevelStatsPresentation['mode'];
  total: number;
}) {
  const { t } = useTranslation();
  const items: LevelStatsChartItem[] = groups
    .flatMap((group): LevelStatsChartItem[] => group.items)
    .filter(item => item.count > 0);
  const radius = 50;
  const createArc = arc<PieArcDatum<LevelStatsChartItem>>()
    .innerRadius(0)
    .outerRadius(radius);
  const arcs = pie<LevelStatsChartItem>()
    .sort(null)
    .value(item => item.count)(items);

  return (
    <figure className="flex flex-col items-center">
      <svg
        aria-label={t('user.home.levelStats.chartLabel', {
          count: total,
          level,
          mode: t(`user.home.levelStats.mode.${mode}`),
        })}
        className="size-[240px] md:size-[264px]"
        role="img"
        viewBox={`${-radius} ${-radius} ${radius * 2} ${radius * 2}`}
      >
        {total === 0
          ? <circle className="fill-bg-neutral-weak" cx="0" cy="0" r={radius} />
          : arcs.map((datum) => {
              const path = createArc(datum);
              return path && (
                <path d={path} fill={datum.data.color} key={`${datum.data.kind}-${datum.data.id}`} />
              );
            })}
      </svg>
    </figure>
  );
}

/** Links a legend row to its matching records, unless it has nothing to show. */
function StatsLink({ children, count, to }: { children: ReactNode; count: number; to: string }) {
  if (count === 0) {
    return children;
  }

  return (
    <Link className="after:absolute after:inset-0 hover:underline" to={to}>
      {children}
    </Link>
  );
}

function StatsSummary({
  level,
  summary,
  total,
  userId,
}: {
  level: number;
  summary: LevelStatsSummary;
  total: number;
  userId: string;
}) {
  const { t } = useTranslation();

  return (
    <div className="relative mt-6 w-full max-w-[520px] border-t border-stroke-neutral-weak pt-7">
      <p className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg-layer-default px-3 text-[.6875rem] text-fg-neutral-subtle">
        {t('user.home.levelStats.totalLabel')}
        <span className="ml-1 font-medium text-fg-neutral-muted">{total}</span>
      </p>
      <dl className="grid grid-cols-3">
        {summary.primary.map(item => (
          <SummaryItem item={item} key={`${item.kind}-${item.id}`} level={level} primary total={total} userId={userId} />
        ))}
      </dl>
      {summary.secondary.length > 0 && (
        <dl className="mt-5 flex flex-wrap justify-center">
          {summary.secondary.map(item => (
            <SummaryItem item={item} key={`${item.kind}-${item.id}`} level={level} total={total} userId={userId} />
          ))}
        </dl>
      )}
    </div>
  );
}

function SummaryItem({
  item,
  level,
  primary = false,
  total,
  userId,
}: {
  item: LevelStatsSummaryItem;
  level: number;
  primary?: boolean;
  total: number;
  userId: string;
}) {
  const label = useSummaryLabel(item);
  const to = recordsLink(
    userId,
    level,
    item.kind === 'clear-type' ? { kind: 'medal', values: item.members } : { kind: 'rank', values: item.members },
  );

  if (primary) {
    return (
      <div className="relative text-center not-last:after:absolute not-last:after:top-2 not-last:after:right-0 not-last:after:h-10 not-last:after:w-px not-last:after:bg-stroke-neutral-weak">
        <dt className="text-xs font-semibold" style={{ color: item.color }}>
          <StatsLink count={item.count} to={to}>{label}</StatsLink>
        </dt>
        <dd className="mt-1.5 text-xl leading-none font-semibold tracking-[-.03em]">{item.count}</dd>
        <span className="mt-1 block text-[.6875rem] text-fg-neutral-subtle">
          {formatLevelStatsPercent(item.count, total)}
        </span>
      </div>
    );
  }

  return (
    <div className="relative min-w-24 px-5 text-center not-last:after:absolute not-last:after:top-1 not-last:after:right-0 not-last:after:h-7 not-last:after:w-px not-last:after:bg-stroke-neutral-weak">
      <dt className="text-xs font-semibold" style={{ color: item.color }}>
        <StatsLink count={item.count} to={to}>{label}</StatsLink>
      </dt>
      <dd className="mt-1 text-sm leading-none font-semibold">
        {item.count}
        <span className="ml-1 text-[.625rem] font-normal text-fg-neutral-subtle">
          (
          {formatLevelStatsPercent(item.count, total)}
          )
        </span>
      </dd>
    </div>
  );
}

function StatsLegendGroup({
  group,
  level,
  total,
  userId,
}: {
  group: LevelStatsChartGroup;
  level: number;
  total: number;
  userId: string;
}) {
  const groupCount = group.items.reduce((sum, item) => sum + item.count, 0);
  const titleId = `level-stats-${group.kind}-${group.id}`;
  const { t } = useTranslation();
  const label = group.kind === 'medal'
    ? t(clearType.labelKey(group.id))
    : t(rankFamily.labelKey(group.id));
  const groupTo = recordsLink(
    userId,
    level,
    group.kind === 'medal'
      ? { kind: 'medal', values: group.items.map(item => item.id) }
      : { kind: 'rank', values: group.items.map(item => item.id) },
  );

  return (
    <section aria-labelledby={titleId}>
      <header className="relative grid grid-cols-[1rem_minmax(0,1fr)_2.25rem_3.75rem] items-baseline gap-1.5 border-b border-dashed border-stroke-neutral-weak pb-1.5 md:grid-cols-[1.125rem_minmax(0,1fr)_2.5rem_4rem] md:gap-2 md:pb-2">
        <h3 className="col-span-2 text-xs font-bold tracking-[.03em]" id={titleId}>
          <StatsLink count={groupCount} to={groupTo}>{label}</StatsLink>
        </h3>
        <p className="text-right text-sm font-semibold">{groupCount}</p>
        <p className="text-right text-xs text-fg-neutral-subtle">{formatLevelStatsPercent(groupCount, total)}</p>
      </header>
      <dl className="mt-1 grid">
        {group.items.map(item => (
          <LegendItem item={item} key={`${item.kind}-${item.id}`} level={level} total={total} userId={userId} />
        ))}
      </dl>
    </section>
  );
}

function LegendItem({
  item,
  level,
  total,
  userId,
}: {
  item: LevelStatsChartItem;
  level: number;
  total: number;
  userId: string;
}) {
  const { t } = useTranslation();
  const label = item.kind === 'medal'
    ? t(medal.labelKey(item.id))
    : t(rank.labelKey(item.id));
  const to = recordsLink(
    userId,
    level,
    item.kind === 'medal' ? { kind: 'medal', values: [item.id] } : { kind: 'rank', values: [item.id] },
  );

  return (
    <div className={`relative grid min-h-6 grid-cols-[1rem_minmax(0,1fr)_2.25rem_3.75rem] items-center gap-1.5 text-xs md:min-h-7 md:grid-cols-[1.125rem_minmax(0,1fr)_2.5rem_4rem] md:gap-2 md:text-sm ${item.count === 0 ? 'opacity-35' : ''}`}>
      <span aria-hidden="true" className="size-4 rounded-[3px]" style={{ backgroundColor: item.color }} />
      <dt className="truncate text-fg-neutral-muted">
        <StatsLink count={item.count} to={to}>{label}</StatsLink>
      </dt>
      <dd className="text-right font-medium">{item.count}</dd>
      <span className="text-right text-xs text-fg-neutral-subtle">{formatLevelStatsPercent(item.count, total)}</span>
    </div>
  );
}

function useSummaryLabel(item: LevelStatsSummaryItem): string {
  const { t } = useTranslation();
  return item.kind === 'clear-type'
    ? t(clearType.labelKey(item.id))
    : t(rankFamily.labelKey(item.id));
}
