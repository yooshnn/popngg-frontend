import type { Preferences } from './config';
import { createContext, use, useState } from 'react';
import { preferencesCookie } from './config';

export interface PreferencesContextValue extends Preferences {
  setPreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => Promise<void>;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children, initial }: {
  children: React.ReactNode;
  initial: Preferences;
}) {
  const [preferences, setPreferences] = useState(initial);

  async function setPreference<K extends keyof Preferences>(key: K, value: Preferences[K]) {
    const next = { ...preferences, [key]: value };

    setPreferences(next);
    await preferencesCookie.write(next);
  }

  return (
    <PreferencesContext value={{ ...preferences, setPreference }}>
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
