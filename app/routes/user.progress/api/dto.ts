import { z } from 'zod';

export const progressCountDtoSchema = z.object({
  code: z.number(),
  count: z.number(),
});

export const progressCountsDtoSchema = z.object({
  total: z.number(),
  averageScore: z.number(),
  medals: z.array(progressCountDtoSchema),
  ranks: z.array(progressCountDtoSchema),
});

export const progressRowDtoSchema = progressCountsDtoSchema.extend({
  key: z.number(),
});

export const progressDtoSchema = z.object({
  rows: z.array(progressRowDtoSchema),
  summary: progressCountsDtoSchema,
});

export type ProgressCountDto = z.output<typeof progressCountDtoSchema>;
export type ProgressCountsDto = z.output<typeof progressCountsDtoSchema>;
export type ProgressRowDto = z.output<typeof progressRowDtoSchema>;
export type ProgressDto = z.output<typeof progressDtoSchema>;
