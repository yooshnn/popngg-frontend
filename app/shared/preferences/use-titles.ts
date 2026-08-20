import { usePreferences } from './provider';

export function useTitles({ title, genre }: { title: string; genre: string }) {
  const { preferences } = usePreferences();

  return preferences.title === 'song'
    ? { primary: title, secondary: genre }
    : { primary: genre, secondary: title };
}
