import { z } from 'zod';
import { pageSchema } from '~/shared/api';

export const chartSummaryDtoSchema = z.object({
  difficulty: z.number(),
  level: z.number(),
});

export const songSummaryDtoSchema = z.object({
  songHash: z.string(),
  title: z.string(),
  genre: z.string(),
  bannerUrl: z.string(),
  version: z.number(),
  isUpper: z.boolean(),
  charts: z.array(chartSummaryDtoSchema),
});

export const chartsDtoSchema = pageSchema(songSummaryDtoSchema);

export type ChartSummaryDto = z.output<typeof chartSummaryDtoSchema>;
export type SongSummaryDto = z.output<typeof songSummaryDtoSchema>;
export type ChartsDto = z.output<typeof chartsDtoSchema>;
