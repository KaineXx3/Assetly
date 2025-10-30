import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { settingsStore } from '../store/settingsStore';

/**
 * Always returns 'light' theme
 */
export function useColorScheme() {
  return 'light';
}
