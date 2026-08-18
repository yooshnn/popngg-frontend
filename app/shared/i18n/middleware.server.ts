import { initReactI18next } from 'react-i18next';
import { createI18nextMiddleware } from 'remix-i18next';
import {
  defaultNamespace,
  fallbackLanguage,
  localeCookie,
  supportedLanguages,
} from './config';
import resources from './locales';

export const [i18nextMiddleware, getLocale, getInstance] = createI18nextMiddleware(
  {
    detection: {
      cookie: localeCookie.cookie,
      fallbackLanguage,
      order: ['cookie', 'header'],
      supportedLanguages: [...supportedLanguages],
    },
    i18next: {
      defaultNS: defaultNamespace,
      fallbackLng: fallbackLanguage,
      resources,
    },
    plugins: [initReactI18next],
  },
);
