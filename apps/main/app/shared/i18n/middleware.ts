import { initReactI18next } from 'react-i18next';
import { createI18nextMiddleware } from 'remix-i18next';
import { defaultNS, fallbackLanguage, localeCookie, supportedLanguages } from './config';
import resources from './resources';

/**
 * Per-request i18next middleware and its router-context accessor.
 *
 * `i18nextMiddleware` must be registered on `root.tsx`; `getInstance` reads the
 * request's instance out of the router context in `entry.server.tsx`.
 */
export const [i18nextMiddleware, , getInstance] = createI18nextMiddleware({
  detection: {
    supportedLanguages: [...supportedLanguages],
    fallbackLanguage,
    cookie: localeCookie.cookie,
    order: ['cookie', 'header'],
  },
  i18next: {
    resources,
    fallbackLng: fallbackLanguage,
    defaultNS,
  },
  plugins: [initReactI18next],
});
