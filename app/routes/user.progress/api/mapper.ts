import type { Progress, ProgressCounts } from '../model/types';
import type { ProgressCountsDto, ProgressDto } from './dto';
import { medal } from '~/entities/medal';
import { rank } from '~/entities/rank';
import { score } from '~/entities/score';

export function toProgress(dto: ProgressDto): Progress {
  const keys = new Set<number>();

  return {
    rows: dto.rows.map((row) => {
      if (!Number.isInteger(row.key) || row.key < 1) {
        throw new Error(`Invalid progress row key: ${row.key}`);
      }

      if (keys.has(row.key)) {
        throw new Error(`Duplicate progress row key: ${row.key}`);
      }

      keys.add(row.key);

      return { key: row.key, ...toCounts(row, `row ${row.key}`) };
    }),
    summary: toCounts(dto.summary, 'summary'),
  };
}

function toCounts(dto: ProgressCountsDto, label: string): ProgressCounts {
  assertCount(dto.total, `${label} total`);
  assertCount(dto.averageScore, `${label} average score`);

  if (dto.averageScore > score.MAX) {
    throw new Error(`Invalid ${label} average score: ${dto.averageScore}`);
  }

  const medalCounts = toCodeCounts(dto.medals, medal.all, medal.from, `${label} medal`);
  const rankCounts = toCodeCounts(dto.ranks, rank.all, rank.from, `${label} rank`);

  assertTotal(medalCounts, dto.total, `${label} medal`);
  assertTotal(rankCounts, dto.total, `${label} rank`);

  return {
    total: dto.total,
    averageScore: dto.averageScore,
    medalCounts,
    rankCounts,
  };
}

function toCodeCounts<T extends string>(
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
