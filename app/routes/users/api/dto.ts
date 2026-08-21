import { z } from 'zod';
import { pageSchema } from '~/shared/api';

export const bestLevelDtoSchema = z.object({
  kind: z.string(),
  maxLevel: z.number().nullable(),
});

export const userSummaryDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string().nullable(),
  comment: z.string(),
  rank: z.number(),
  popnClass: z.number(),
  bestLevels: z.array(bestLevelDtoSchema),
  updatedAt: z.string(),
});

export const usersDtoSchema = pageSchema(userSummaryDtoSchema);

export type BestLevelDto = z.output<typeof bestLevelDtoSchema>;
export type UserSummaryDto = z.output<typeof userSummaryDtoSchema>;
export type UsersDto = z.output<typeof usersDtoSchema>;
