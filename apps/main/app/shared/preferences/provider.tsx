import type { Preferences } from './config';
import { createContext, startTransition, use, useOptimistic } from 'react';
import { useRevalidator } from 'react-router';
import { preferencesCookie } from './config';

export interface PreferencesContextValue extends Preferences {
  setPreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children, preferences }: {
  children: React.ReactNode;
  preferences: Preferences;
}) {
  const [optimistic, setOptimistic] = useOptimistic(preferences);
  const { revalidate } = useRevalidator();

  function setPreference<K extends keyof Preferences>(key: K, value: Preferences[K]) {
    const next = { ...optimistic, [key]: value };

    startTransition(async () => {
      setOptimistic(next);
      await preferencesCookie.write(next);
      await revalidate();
    });
  }

  return (
    <PreferencesContext value={{ ...optimistic, setPreference }}>
      {children}
    </PreferencesContext>
  );
}

export function usePreferences() {
  const context = use(PreferencesContext);

  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }

  return context;
}
