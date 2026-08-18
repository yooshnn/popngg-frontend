import { z } from 'zod';
import { defineCookie } from '~/shared/cookie';

export const supportedLanguages = ['ko', 'ja'] as const;

export type Language = (typeof supportedLanguages)[number];

export const fallbackLanguage: Language = 'ko';
export const defaultNamespace = 'common';

export const localeCookie = defineCookie({
  name: 'popngg_locale',
  schema: z.enum(supportedLanguages),
  fallback: fallbackLanguage,
});
