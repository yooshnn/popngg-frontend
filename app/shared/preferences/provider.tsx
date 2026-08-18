import type { Preferences } from './config';
import { createContext, use, useCallback, useRef, useState } from 'react';
import { preferencesCookie } from './config';

interface PreferencesContextValue {
  preferences: Preferences;
  setPreference: <Key extends keyof Preferences>(key: Key, value: Preferences[Key]) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children, initialPreferences }: {
  children: React.ReactNode;
  initialPreferences: Preferences;
}) {
  const preferencesRef = useRef(initialPreferences);
  const [preferences, setPreferences] = useState(initialPreferences);

  const setPreference = useCallback(<Key extends keyof Preferences>(
    key: Key,
    value: Preferences[Key],
  ) => {
    const nextPreferences = { ...preferencesRef.current, [key]: value };

    preferencesRef.current = nextPreferences;
    setPreferences(nextPreferences);
    void preferencesCookie.write(nextPreferences);
  }, []);

  return (
    <PreferencesContext value={{ preferences, setPreference }}>
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
