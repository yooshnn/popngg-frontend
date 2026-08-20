import type { Rank } from './rank';
import { color as rankColor, all as ranks } from './rank';

// Types

export const all = ['S', 'AAA', 'AA', 'A', 'B', 'belowB'] as const;

export type RankFamily = (typeof all)[number];

type RankFamilyByRank = Record<Rank, RankFamily>;

// Grouping

const familyByRank = {
  'S+': 'S',
  'S': 'S',
  'AAA': 'AAA',
  'AA+': 'AA',
  'AA': 'AA',
  'A+': 'A',
  'A': 'A',
  'B+': 'B',
  'B': 'B',
  'C': 'belowB',
  'D': 'belowB',
  'E': 'belowB',
  'none': 'belowB',
} as const satisfies RankFamilyByRank;

const byFamily = ranks.reduce<Record<RankFamily, Rank[]>>(
  (groups, value) => {
    const family = familyByRank[value];
    (groups[family] ??= []).push(value);
    return groups;
  },
  {} as Record<RankFamily, Rank[]>,
);

export function of(value: Rank): RankFamily {
  return familyByRank[value];
}

export function members(value: RankFamily): readonly Rank[] {
  return byFamily[value];
}

// Display properties

const representativeRankByFamily = {
  S: 'S+',
  AAA: 'AAA',
  AA: 'AA+',
  A: 'A+',
  B: 'B+',
  belowB: 'C',
} as const satisfies Record<RankFamily, Rank>;

export function color(value: RankFamily): string {
  return rankColor(representativeRankByFamily[value]);
}

const scoreLabelByFamily = {
  S: '98+',
  AAA: '95+',
  AA: '90+',
  A: '82+',
  B: '72+',
  belowB: '~72',
} as const satisfies Record<RankFamily, string>;

export function scoreLabel(value: RankFamily): string {
  return scoreLabelByFamily[value];
}

export function labelKey(value: RankFamily): `rank.family.${RankFamily}` {
  return `rank.family.${value}`;
}
