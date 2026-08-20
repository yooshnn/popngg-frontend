import { z } from 'zod';

export const medalSummaryDtoSchema = z.object({
  kind: z.string(),
  maxLevel: z.number(),
  achieved: z.number(),
  total: z.number(),
});

export const userProfileDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string().nullable(),
  character: z.string(),
  comment: z.string(),
  popnClass: z.number(),
  legacyPopnClass: z.number(),
  medalSummaries: z.array(medalSummaryDtoSchema),
  updatedAt: z.string(),
});

export type UserProfileDto = z.output<typeof userProfileDtoSchema>;
export type MedalSummaryDto = z.output<typeof medalSummaryDtoSchema>;
