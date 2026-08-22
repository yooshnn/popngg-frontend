import type { Difficulty } from '~/entities/difficulty';
import type { Medal } from '~/entities/medal';
import type { PopnClass } from '~/entities/popn-class';
import type { PopnVersion } from '~/entities/popn-version';
import type { Rank } from '~/entities/rank';
import type { Score } from '~/entities/score';

export const popnClassTargetViews = ['potential', 'actual', 'legacy'] as const;
export type PopnClassTargetView = (typeof popnClassTargetViews)[number];

export interface PopnClassTarget {
  id: string;
  title: string;
  genre: string;
  bannerUrl: string;
  difficulty: Difficulty;
  level: number;
  score: Score;
  medal: Medal;
  rank: Rank;
  version: PopnVersion;
  popnClass: PopnClass;
}

export interface PopnClassTargets {
  newSongs: PopnClassTarget[];
  oldSongs: PopnClassTarget[];
}

export type LegacyPopnClassTargets = PopnClassTarget[];

export interface LevelStats {
  level: number;
  total: number;
  medalCounts: Record<Medal, number>;
  rankCounts: Record<Rank, number>;
}
