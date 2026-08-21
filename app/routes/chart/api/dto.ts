import { z } from 'zod';

export const chartSummaryDtoSchema = z.object({
  difficulty: z.number(),
  level: z.number(),
});

export const chartDetailDtoSchema = z.object({
  songHash: z.string(),
  title: z.string(),
  genre: z.string(),
  artist: z.string(),
  bannerUrl: z.string(),
  version: z.number(),
  isUpper: z.boolean(),
  charts: z.array(chartSummaryDtoSchema),
});

export type ChartSummaryDto = z.output<typeof chartSummaryDtoSchema>;
export type ChartDetailDto = z.output<typeof chartDetailDtoSchema>;
