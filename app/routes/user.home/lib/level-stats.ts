import type { LevelStats } from '../model/types';
import type { ClearType, Medal } from '~/entities/medal';
import type { Rank, RankFamily } from '~/entities/rank';
import { clearType, medal } from '~/entities/medal';
import { rank, rankFamily } from '~/entities/rank';

export const LEVEL_STATS_MODES = ['medal', 'rank'] as const;
export type LevelStatsMode = typeof LEVEL_STATS_MODES[number];

export interface MedalChartItem {
  kind: 'medal';
  id: Medal;
  count: number;
  color: string;
}

export interface RankChartItem {
  kind: 'rank';
  id: Rank;
  count: number;
  color: string;
}

export type LevelStatsChartItem = MedalChartItem | RankChartItem;

export interface MedalChartGroup {
  kind: 'medal';
  id: ClearType;
  items: MedalChartItem[];
}

export interface RankChartGroup {
  kind: 'rank';
  id: RankFamily;
  items: RankChartItem[];
}

export type LevelStatsChartGroup = MedalChartGroup | RankChartGroup;

export interface MedalSummaryItem {
  kind: 'clear-type';
  id: ClearType;
  count: number;
  color: string;
}

export interface RankSummaryItem {
  kind: 'rank-family';
  id: RankFamily;
  count: number;
  color: string;
}

export type LevelStatsSummaryItem = MedalSummaryItem | RankSummaryItem;

export interface LevelStatsSummary<Item extends LevelStatsSummaryItem = LevelStatsSummaryItem> {
  primary: Item[];
  secondary: Item[];
}

export type LevelStatsPresentation
  = | {
    mode: 'medal';
    groups: MedalChartGroup[];
    summary: LevelStatsSummary<MedalSummaryItem>;
  }
  | {
    mode: 'rank';
    groups: RankChartGroup[];
    summary: LevelStatsSummary<RankSummaryItem>;
  };

const primaryClearTypes = ['perfect', 'full-combo', 'clear'] as const satisfies readonly ClearType[];
const secondaryClearTypes = ['assist', 'failed'] as const satisfies readonly ClearType[];
const primaryRankFamilies = ['S', 'AAA', 'AA'] as const satisfies readonly RankFamily[];
const secondaryRankFamilies = ['A', 'B', 'belowB'] as const satisfies readonly RankFamily[];

export function getLevelStatsPresentation(
  mode: LevelStatsMode,
  stats: LevelStats,
): LevelStatsPresentation {
  return mode === 'medal'
    ? {
        mode,
        groups: createMedalGroups(stats),
        summary: createMedalSummary(stats),
      }
    : {
        mode,
        groups: createRankGroups(stats),
        summary: createRankSummary(stats),
      };
}

export function formatLevelStatsPercent(value: number, total: number): string {
  const percent = total === 0 ? 0 : value / total * 100;
  return `${percent.toFixed(1)}%`;
}

function createMedalGroups(stats: LevelStats): MedalChartGroup[] {
  return clearType.all.map(type => ({
    kind: 'medal',
    id: type,
    items: clearType.members(type).map(value => ({
      kind: 'medal',
      id: value,
      count: stats.medalCounts[value],
      color: medal.color(value),
    })),
  }));
}

function createRankGroups(stats: LevelStats): RankChartGroup[] {
  return rankFamily.all.map(family => ({
    kind: 'rank',
    id: family,
    items: rankFamily.members(family).map(value => ({
      kind: 'rank',
      id: value,
      count: stats.rankCounts[value],
      color: rank.color(value),
    })),
  }));
}

function createMedalSummary(stats: LevelStats): LevelStatsSummary<MedalSummaryItem> {
  return {
    primary: primaryClearTypes.map(type => createMedalSummaryItem(stats, type)),
    secondary: secondaryClearTypes.map(type => createMedalSummaryItem(stats, type)),
  };
}

function createMedalSummaryItem(stats: LevelStats, type: ClearType): MedalSummaryItem {
  return {
    kind: 'clear-type',
    id: type,
    count: sumCounts(stats.medalCounts, clearType.members(type)),
    color: clearType.color(type),
  };
}

function createRankSummary(stats: LevelStats): LevelStatsSummary<RankSummaryItem> {
  return {
    primary: primaryRankFamilies.map(family => createRankSummaryItem(stats, family)),
    secondary: secondaryRankFamilies.map(family => createRankSummaryItem(stats, family)),
  };
}

function createRankSummaryItem(stats: LevelStats, family: RankFamily): RankSummaryItem {
  return {
    kind: 'rank-family',
    id: family,
    count: sumCounts(stats.rankCounts, rankFamily.members(family)),
    color: rankFamily.color(family),
  };
}

function sumCounts<Value extends string>(
  counts: Record<Value, number>,
  values: readonly Value[],
): number {
  return values.reduce((sum, value) => sum + counts[value], 0);
}
