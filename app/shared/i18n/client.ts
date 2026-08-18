import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { defaultNamespace, fallbackLanguage } from './config';
import resources from './locales';

export async function getClientI18n() {
  if (!i18next.isInitialized) {
    await i18next.use(initReactI18next).init({
      defaultNS: defaultNamespace,
      fallbackLng: fallbackLanguage,
      lng: document.documentElement.lang || fallbackLanguage,
      resources,
    });
  }

  return i18next;
}
