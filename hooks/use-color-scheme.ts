import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { settingsStore } from '../store/settingsStore';

export function useColorScheme() {
  // Always return 'light' theme
  return 'light';
}
