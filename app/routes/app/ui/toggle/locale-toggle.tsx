import type { Language } from '~/shared/i18n';
import { JP, KR } from 'country-flag-icons/react/3x2';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '~/shared/i18n';
import { ToggleButton } from './toggle-button';

const LANGUAGE_FLAGS = { ko: KR, ja: JP } as const satisfies Record<Language, typeof KR>;

export function LocaleToggle() {
  const { t } = useTranslation();
  const { language, isPending, setLanguage } = useLanguage();

  const nextLanguage: Language = language === 'ko' ? 'ja' : 'ko';
  const Flag = LANGUAGE_FLAGS[language];

  return (
    <ToggleButton
      disabled={isPending}
      onClick={() => setLanguage(nextLanguage)}
    >
      {t(`header.localeToggle.${language}`)}
      <Flag className="h-4 w-auto rounded-xs shadow-s2" />
    </ToggleButton>
  );
}
