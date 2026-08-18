import type { Language } from './config';
import { useCallback, useTransition } from 'react';
import { useTranslation } from 'react-i18next';
import { useRevalidator } from 'react-router';
import {
  fallbackLanguage,
  localeCookie,
  supportedLanguages,
} from './config';

function normalizeLanguage(value: string): Language {
  return (supportedLanguages as readonly string[]).includes(value)
    ? value as Language
    : fallbackLanguage;
}

export function useLanguage() {
  const { i18n } = useTranslation();
  const { revalidate } = useRevalidator();
  const [isPending, startTransition] = useTransition();
  const language = normalizeLanguage(i18n.language);

  const setLanguage = useCallback((requestedLanguage: Language) => {
    const nextLanguage = normalizeLanguage(requestedLanguage);

    if (nextLanguage === language) {
      return;
    }

    startTransition(async () => {
      await localeCookie.write(nextLanguage);
      await i18n.changeLanguage(nextLanguage);
      await revalidate();
    });
  }, [i18n, language, revalidate, startTransition]);

  return { language, isPending, setLanguage };
}
