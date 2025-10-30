import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { settingsStore } from '../store/settingsStore';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const systemColorScheme = useRNColorScheme();
  const [theme, setTheme] = useState(settingsStore.theme);

  useEffect(() => {
    setHasHydrated(true);
    
    // Subscribe to theme changes
    const unsubscribe = settingsStore.subscribe(() => {
      setTheme(settingsStore.theme);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Determine the actual color scheme based on settings
  let resolvedTheme: 'light' | 'dark';
  if (theme === 'auto') {
    resolvedTheme = systemColorScheme || 'light';
  } else {
    resolvedTheme = theme as 'light' | 'dark';
  }

  if (hasHydrated) {
    return resolvedTheme;
  }

  return 'light';
}
