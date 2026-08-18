import type { Language } from '~/shared/i18n';
import { JP, KR } from 'country-flag-icons/react/3x2';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { useLanguage } from '~/shared/i18n';
import { Button } from '~/shared/ui/button';
import { Wordmark } from '~/shared/ui/wordmark';

const LANGUAGE_FLAGS = { ko: KR, ja: JP } as const satisfies Record<Language, typeof KR>;

export interface FocusHeaderProps {
  className?: string;
  homeHref?: string | null;
}

export function FocusHeader({ className = '', homeHref = '/' }: FocusHeaderProps) {
  const { t } = useTranslation();
  const { language, isPending, setLanguage } = useLanguage();
  const nextLanguage: Language = language === 'ko' ? 'ja' : 'ko';
  const Flag = LANGUAGE_FLAGS[language];

  return (
    <header className={`flex w-full items-center justify-between ${className}`}>
      {homeHref === null && <Wordmark />}
      {homeHref !== null && (
        <RouterLink
          className="inline-flex shrink-0 items-center focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stroke-focus-ring"
          to={homeHref}
        >
          <Wordmark />
        </RouterLink>
      )}
      <Button
        className="h-9 w-24 rounded-md px-2.5 font-normal focus-visible:-outline-offset-2"
        disabled={isPending}
        size="sm"
        type="button"
        variant="neutral-ghost"
        onClick={() => setLanguage(nextLanguage)}
      >
        {t(`header.localeToggle.${language}`)}
        <Flag className="h-4 w-auto rounded-xs shadow-s2" />
      </Button>
    </header>
  );
}
