import { z } from 'zod';

export const popnClassTargetDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  genre: z.string(),
  bannerUrl: z.string(),
  difficulty: z.number(),
  level: z.number(),
  score: z.number(),
  medal: z.number(),
  rank: z.number(),
  version: z.number(),
  value: z.number(),
});

export const currentPopnClassTargetsDtoSchema = z.object({
  newSongs: z.array(popnClassTargetDtoSchema),
  oldSongs: z.array(popnClassTargetDtoSchema),
});

export const legacyPopnClassTargetsDtoSchema = z.array(popnClassTargetDtoSchema);

export const levelStatsCountDtoSchema = z.object({
  code: z.number(),
  count: z.number(),
});

export const levelStatsDtoSchema = z.object({
  level: z.number(),
  total: z.number(),
  medals: z.array(levelStatsCountDtoSchema),
  ranks: z.array(levelStatsCountDtoSchema),
});

export const levelStatsListDtoSchema = z.array(levelStatsDtoSchema);

export type PopnClassTargetDto = z.output<typeof popnClassTargetDtoSchema>;
export type CurrentPopnClassTargetsDto = z.output<typeof currentPopnClassTargetsDtoSchema>;
export type LegacyPopnClassTargetsDto = z.output<typeof legacyPopnClassTargetsDtoSchema>;
export type LevelStatsCountDto = z.output<typeof levelStatsCountDtoSchema>;
export type LevelStatsDto = z.output<typeof levelStatsDtoSchema>;
export type LevelStatsListDto = z.output<typeof levelStatsListDtoSchema>;
