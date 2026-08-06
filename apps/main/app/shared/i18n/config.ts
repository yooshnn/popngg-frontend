import { z } from 'zod';
import { defineCookie } from '../cookie';

export const supportedLanguages = ['ko', 'ja'] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export const fallbackLanguage: SupportedLanguage = 'ko';

export const defaultNS = 'common';

export const localeCookie = defineCookie({
  name: 'popngg_locale',
  schema: z.enum(supportedLanguages),
  fallback: fallbackLanguage,
});
