import { z } from 'zod';

export const renewalResultDtoSchema = z.object({
  renewedAt: z.string(),
  summary: z.object({
    chartsScanned: z.number(),
    recordsAdded: z.number(),
    medalsImproved: z.number(),
    scoresImproved: z.number(),
    popnClassDelta: z.number().nullable(),
  }),
});

export type RenewalResultDto = z.output<typeof renewalResultDtoSchema>;
