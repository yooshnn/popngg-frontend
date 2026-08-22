import { z } from 'zod';

export const medalSummaryDtoSchema = z.object({
  kind: z.string(),
  maxLevel: z.number(),
  achieved: z.number(),
  total: z.number(),
});

export const creditsDtoSchema = z.object({
  normal: z.number(),
  extra: z.number(),
  timePlay10: z.number(),
  timePlay16: z.number(),
});

export const userProfileDtoSchema = z.object({
  poptomoId: z.string(),
  userName: z.string(),
  characterName: z.string(),
  comment: z.string(),
  profileImageUrl: z.string().nullable(),
  hidden: z.boolean(),
  displayPopclass: z.number(),
  potentialPopclass: z.number(),
  legacyPopclass: z.number(),
  credits: creditsDtoSchema,
  medalSummaries: z.array(medalSummaryDtoSchema),
  updatedAt: z.string(),
});

export type UserProfileDto = z.output<typeof userProfileDtoSchema>;
export type MedalSummaryDto = z.output<typeof medalSummaryDtoSchema>;
export type CreditsDto = z.output<typeof creditsDtoSchema>;
