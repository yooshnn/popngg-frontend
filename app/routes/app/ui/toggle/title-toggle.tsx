import type { Title } from '~/shared/preferences';
import { useTranslation } from 'react-i18next';
import { usePreferences } from '~/shared/preferences';
import { ToggleButton } from './toggle-button';

const TITLE_PREVIEW = { song: 'neu', genre: 'NIENTE' } as const satisfies Record<Title, string>;

export function TitleToggle() {
  const { t } = useTranslation();
  const { preferences, setPreference } = usePreferences();

  const nextTitle: Title = preferences.title === 'song' ? 'genre' : 'song';

  return (
    <ToggleButton
      onClick={() => setPreference('title', nextTitle)}
    >
      {t(`header.titleToggle.${preferences.title}`)}
      <span className="text-xs text-fg-neutral-subtle">{TITLE_PREVIEW[preferences.title]}</span>
    </ToggleButton>
  );
}
