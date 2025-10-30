import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { settingsStore } from '../store/settingsStore';

export function useColorScheme() {
  const systemColorScheme = useRNColorScheme();
  const [theme, setTheme] = useState(settingsStore.theme);

  useEffect(() => {
    // Subscribe to theme changes
    const unsubscribe = settingsStore.subscribe(() => {
      setTheme(settingsStore.theme);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Determine the actual color scheme based on settings
  if (theme === 'auto') {
    return systemColorScheme || 'light';
  }
  return theme;
}
