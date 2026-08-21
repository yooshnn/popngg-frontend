import type { Medal } from '~/entities/medal';
import type { Rank } from '~/entities/rank';
import type { Score } from '~/entities/score';

export const axes = ['level', 'difficulty'] as const;

export type ProgressAxis = (typeof axes)[number];

export interface ProgressCounts {
  total: number;
  averageScore: Score;
  medalCounts: Record<Medal, number>;
  rankCounts: Record<Rank, number>;
}

export interface ProgressRow extends ProgressCounts {
  key: number;
}

export interface Progress {
  rows: ProgressRow[];
  summary: ProgressCounts;
}
