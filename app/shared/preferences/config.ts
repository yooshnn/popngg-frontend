import { z } from 'zod';
import { defineCookie } from '../cookie';

export const titles = ['song', 'genre'] as const;

export type Title = (typeof titles)[number];

export interface Preferences {
  title: Title;
}

export const defaultPreferences: Preferences = Object.freeze({
  title: 'song',
});

export const preferencesCookie = defineCookie({
  name: 'popngg_preferences',
  schema: z.object({ title: z.enum(titles) }),
  fallback: defaultPreferences,
});
