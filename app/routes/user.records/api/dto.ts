import { z } from 'zod';
import { pageSchema } from '~/shared/api';

export const userRecordDtoSchema = z.object({
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
  popnClass: z.number(),
});

export const userRecordsDtoSchema = pageSchema(userRecordDtoSchema);

export type UserRecordDto = z.output<typeof userRecordDtoSchema>;
export type UserRecordsDto = z.output<typeof userRecordsDtoSchema>;
