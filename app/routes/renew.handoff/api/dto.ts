import { z } from 'zod';

export const renewalResultDtoSchema = z.object({
  renewedAt: z.string().catch(() => new Date().toISOString()),
  summary: z.object({
    chartsScanned: z.number().catch(0),
    recordsAdded: z.number().catch(0),
    medalsImproved: z.number().catch(0),
    scoresImproved: z.number().catch(0),
    popnClassDelta: z.number().nullable().catch(null),
  }).catch({
    chartsScanned: 0,
    recordsAdded: 0,
    medalsImproved: 0,
    scoresImproved: 0,
    popnClassDelta: null,
  }),
});

export type RenewalResultDto = z.output<typeof renewalResultDtoSchema>;
