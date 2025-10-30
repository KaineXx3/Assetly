import AsyncStorage from '@react-native-async-storage/async-storage';

export type Theme = 'light' | 'dark' | 'auto';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'INR' | 'CAD' | 'AUD' | 'MYR' | 'SGD';

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  INR: '₹',
  CAD: 'C$',
  AUD: 'A$',
  MYR: 'RM',
  SGD: 'S$',
};

const CURRENCY_NAMES: Record<Currency, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen',
  INR: 'Indian Rupee',
  CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar',
  MYR: 'Malaysian Ringgit',
  SGD: 'Singapore Dollar',
};

class SettingsStore {
  theme: Theme = 'auto';
  currency: Currency = 'USD';
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadSettings();
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  async loadSettings() {
    try {
      const [savedTheme, savedCurrency] = await Promise.all([
        AsyncStorage.getItem('theme'),
        AsyncStorage.getItem('currency'),
      ]);

      if (savedTheme) {
        this.theme = (savedTheme as Theme) || 'auto';
      }
      if (savedCurrency) {
        this.currency = (savedCurrency as Currency) || 'USD';
      }
      this.notify();
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  async setTheme(theme: Theme) {
    this.theme = theme;
    this.notify();
    try {
      await AsyncStorage.setItem('theme', theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }

  async setCurrency(currency: Currency) {
    this.currency = currency;
    this.notify();
    try {
      await AsyncStorage.setItem('currency', currency);
    } catch (error) {
      console.error('Error saving currency:', error);
    }
  }

  getCurrencySymbol(currencyCode?: Currency): string {
    const code = currencyCode || this.currency;
    return CURRENCY_SYMBOLS[code];
  }

  getCurrencyName(currencyCode?: Currency): string {
    const code = currencyCode || this.currency;
    return CURRENCY_NAMES[code];
  }

  getAvailableCurrencies(): Array<{ code: Currency; name: string; symbol: string }> {
    const currencies = Object.keys(CURRENCY_NAMES).map((code) => ({
      code: code as Currency,
      name: CURRENCY_NAMES[code as Currency],
      symbol: CURRENCY_SYMBOLS[code as Currency],
    }));
    
    // Move MYR to the front
    const myrIndex = currencies.findIndex(c => c.code === 'MYR');
    if (myrIndex > -1) {
      const myr = currencies.splice(myrIndex, 1)[0];
      currencies.unshift(myr);
    }
    
    return currencies;
  }
}

export const settingsStore = new SettingsStore();
