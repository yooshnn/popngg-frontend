import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { defaultNS, fallbackLanguage } from './config';
import resources from './resources';

let i18nPromise: Promise<typeof i18next> | undefined;

/**
 * Browser only — returns the client i18next singleton, initializing it on first call.
 *
 * Idempotent: repeated calls resolve to the same instance. Takes its language from
 * `<html lang>` rather than detecting one, so it always agrees with what the server
 * already rendered.
 */
export function getClientI18n() {
  if (!i18nPromise) {
    i18nPromise = i18next
      .use(initReactI18next)
      .init({
        resources,
        fallbackLng: fallbackLanguage,
        defaultNS,
        lng: document.documentElement.lang || undefined,
      })
      .then(() => i18next);
  }

  return i18nPromise;
}
