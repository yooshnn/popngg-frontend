import type { SupportedLanguage } from '~/shared/i18n';
import type { Title } from '~/shared/preferences';
import { containerStyles } from '@popngg/ui/components/container';
import { JP, KR } from 'country-flag-icons/react/3x2';
import { useTranslation } from 'react-i18next';
import { useRevalidator } from 'react-router';
import { fallbackLanguage, localeCookie, supportedLanguages } from '~/shared/i18n';
import { usePreferences } from '~/shared/preferences';

const TITLE_PREVIEW = { song: 'neu', genre: 'NIENTE' } as const satisfies Record<Title, string>;
const LOCALE_FLAG = { ko: KR, ja: JP } as const satisfies Record<SupportedLanguage, typeof KR>;

const toggleButtonClassName = 'flex w-[132px] cursor-pointer items-center justify-center gap-2 text-sm transition-colors hover:bg-bg-neutral-weak focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring';

function TitleModeToggle() {
  const { t } = useTranslation();
  const { title, setPreference } = usePreferences();
  const next: Title = title === 'song' ? 'genre' : 'song';
  const label = t(`header.titleToggle.${title}`);

  return (
    <button
      type="button"
      className={toggleButtonClassName}
      onClick={() => setPreference('title', next)}
      aria-label={t('header.titleToggle.ariaLabel', { label })}
    >
      <span className="text-fg-neutral-muted">{label}</span>
      <span className="text-xs text-fg-neutral-subtle">{TITLE_PREVIEW[title]}</span>
    </button>
  );
}

function LocaleSwitchToggle() {
  const { t, i18n } = useTranslation();
  const { revalidate } = useRevalidator();

  const current = supportedLanguages.find(lng => lng === i18n.language) ?? fallbackLanguage;
  const next: SupportedLanguage = current === 'ko' ? 'ja' : 'ko';
  const label = t(`header.localeToggle.${current}`);
  const Flag = LOCALE_FLAG[current];

  async function switchTo(lng: SupportedLanguage) {
    await localeCookie.write(lng);
    await i18n.changeLanguage(lng);
    await revalidate();
  }

  return (
    <button
      type="button"
      className={toggleButtonClassName}
      onClick={() => void switchTo(next)}
      aria-label={t('header.localeToggle.ariaLabel', { label })}
    >
      <span className="text-fg-neutral-muted">{label}</span>
      <Flag className="h-4 w-auto rounded-xs shadow-s2" />
    </button>
  );
}

export function UtilityBar() {
  return (
    <div className={containerStyles({ className: 'flex h-[42px] justify-end' })}>
      <TitleModeToggle />
      <LocaleSwitchToggle />
    </div>
  );
}
