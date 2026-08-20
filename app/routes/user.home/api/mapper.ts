import type { LegacyPopnClassTargets, LevelStats, PopnClassTarget, PopnClassTargets } from '../model/types';
import type {
  CurrentPopnClassTargetsDto,
  LegacyPopnClassTargetsDto,
  LevelStatsListDto,
  PopnClassTargetDto,
} from './dto';
import { difficulty } from '~/entities/difficulty';
import { medal } from '~/entities/medal';
import { popnClass } from '~/entities/popn-class';
import { popnVersion } from '~/entities/popn-version';
import { rank } from '~/entities/rank';

export function toCurrentPopnClassTargets(dto: CurrentPopnClassTargetsDto): PopnClassTargets {
  return {
    newSongs: dto.newSongs.map((target, index) => toTarget(target, 'current new-song', index)),
    oldSongs: dto.oldSongs.map((target, index) => toTarget(target, 'current old-song', index)),
  };
}

export function toLegacyPopnClassTargets(dto: LegacyPopnClassTargetsDto): LegacyPopnClassTargets {
  return dto.map((target, index) => toTarget(target, 'legacy', index));
}

export function toLevelStats(dto: LevelStatsListDto): LevelStats[] {
  const levels = new Set<number>();

  return dto.map((stats) => {
    if (!Number.isInteger(stats.level) || stats.level < 1) {
      throw new Error(`Invalid level stats level: ${stats.level}`);
    }

    if (levels.has(stats.level)) {
      throw new Error(`Duplicate level stats level: ${stats.level}`);
    }

    levels.add(stats.level);
    assertCount(stats.total, `level ${stats.level} total`);

    const medalCounts = toCounts(stats.medals, medal.all, medal.from, `level ${stats.level} medal`);
    const rankCounts = toCounts(stats.ranks, rank.all, rank.from, `level ${stats.level} rank`);

    assertTotal(medalCounts, stats.total, `level ${stats.level} medal`);
    assertTotal(rankCounts, stats.total, `level ${stats.level} rank`);

    return {
      level: stats.level,
      total: stats.total,
      medalCounts,
      rankCounts,
    };
  });
}

function toTarget(dto: PopnClassTargetDto, calculation: string, index: number): PopnClassTarget {
  const difficultyValue = difficulty.from(dto.difficulty);
  const medalValue = medal.from(dto.medal);
  const rankValue = rank.from(dto.rank);
  const versionValue = popnVersion.from(dto.version);

  if (!difficultyValue) {
    throw new Error(`Unknown difficulty code in ${calculation} target ${index}: ${dto.difficulty}`);
  }

  if (!medalValue) {
    throw new Error(`Unknown medal code in ${calculation} target ${index}: ${dto.medal}`);
  }

  if (!rankValue) {
    throw new Error(`Unknown rank code in ${calculation} target ${index}: ${dto.rank}`);
  }

  if (!versionValue) {
    throw new Error(`Unknown pop'n version code in ${calculation} target ${index}: ${dto.version}`);
  }

  return {
    id: dto.id,
    title: dto.title,
    genre: dto.genre,
    bannerUrl: dto.bannerUrl,
    difficulty: difficultyValue,
    level: dto.level,
    score: dto.score,
    medal: medalValue,
    rank: rankValue,
    version: versionValue,
    popnClass: popnClass.from(dto.value),
  };
}

function toCounts<T extends string>(
  entries: Array<{ code: number; count: number }>,
  values: readonly T[],
  fromCode: (code: number) => T | null,
  label: string,
): Record<T, number> {
  const counts = Object.fromEntries(values.map(value => [value, 0])) as Record<T, number>;
  const seen = new Set<T>();

  for (const entry of entries) {
    const value = fromCode(entry.code);

    if (!value) {
      throw new Error(`Unknown ${label} code: ${entry.code}`);
    }

    if (seen.has(value)) {
      throw new Error(`Duplicate ${label} code: ${entry.code}`);
    }

    assertCount(entry.count, `${label} ${value}`);
    seen.add(value);
    counts[value] = entry.count;
  }

  return counts;
}

function assertCount(value: number, label: string) {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`Invalid ${label}: ${value}`);
  }
}

function assertTotal<T extends string>(counts: Record<T, number>, total: number, label: string) {
  const count = (Object.values(counts) as number[]).reduce((sum, value) => sum + value, 0);

  if (count !== total) {
    throw new Error(`Invalid ${label} total: expected ${total}, received ${count}`);
  }
}
