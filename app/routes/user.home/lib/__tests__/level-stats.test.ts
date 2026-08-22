import type { LevelStats } from '../../model/types';
import type { Medal } from '~/entities/medal';
import { describe, expect, it } from 'vitest';
import { medal } from '~/entities/medal';
import { rank } from '~/entities/rank';
import { findDefaultLevelIndex } from '../level-stats';

function levelStats(level: number, medals: Partial<Record<Medal, number>> = {}): LevelStats {
  const medalCounts = Object.fromEntries(medal.all.map(value => [value, medals[value] ?? 0])) as Record<Medal, number>;
  const rankCounts = Object.fromEntries(rank.all.map(value => [value, 0])) as Record<typeof rank.all[number], number>;
  const total = Object.values(medalCounts).reduce((sum, count) => sum + count, 0);

  return { level, total, medalCounts, rankCounts };
}

describe('findDefaultLevelIndex', () => {
  it('skips a top level whose attempts all failed, down to the next cleared level', () => {
    const sortedStats = [
      levelStats(48, { 'bronze-circle': 5 }),
      levelStats(49, { 'bronze-circle': 3 }),
      levelStats(50, { none: 9 }),
    ];

    expect(findDefaultLevelIndex(sortedStats)).toBe(1);
  });

  it('keeps the top level when it already has a clear', () => {
    const sortedStats = [
      levelStats(49, { 'bronze-circle': 3 }),
      levelStats(50, { 'gold-star': 1 }),
    ];

    expect(findDefaultLevelIndex(sortedStats)).toBe(1);
  });

  it('does not count an assist clear (easy/long-off) as clearing the level', () => {
    const sortedStats = [
      levelStats(48, { 'bronze-circle': 3 }),
      levelStats(49, { 'easy': 2, 'long-off': 1 }),
      levelStats(50, { none: 9 }),
    ];

    expect(findDefaultLevelIndex(sortedStats)).toBe(0);
  });

  it('falls back to the top level when nothing has been cleared at all', () => {
    const sortedStats = [
      levelStats(49, { none: 4 }),
      levelStats(50, { easy: 1, none: 8 }),
    ];

    expect(findDefaultLevelIndex(sortedStats)).toBe(1);
  });
});
