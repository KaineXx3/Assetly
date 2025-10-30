import { differenceInDays, format } from 'date-fns';
import { Asset, AssetCalculations, AssetSummary } from '../types';
import { settingsStore } from '../store/settingsStore';

/**
 * Calculate days owned from purchase date to today
 */
export function calculateDaysOwned(purchaseDate: string): number {
  try {
    const purchase = new Date(purchaseDate);
    const today = new Date();
    const days = differenceInDays(today, purchase);
    return Math.max(1, days); // minimum 1 day
  } catch (error) {
    console.error('Error calculating days owned:', error);
    return 1;
  }
}

/**
 * Calculate daily cost based on price and days owned
 */
export function calculateDailyCost(price: number, daysOwned: number): number {
  if (daysOwned <= 0) return price;
  return price / daysOwned;
}

/**
 * Get all calculations for an asset
 */
export function getAssetCalculations(asset: Asset): AssetCalculations {
  // If custom daily price is specified, use it
  if (asset.specifiedDailyPrice !== null) {
    return {
      daysOwned: calculateDaysOwned(asset.purchaseDate),
      dailyCost: asset.specifiedDailyPrice,
      displayDailyPrice: formatCurrency(asset.specifiedDailyPrice),
    };
  }

  // If calculate by usage is enabled, use usage count
  if (asset.calculateByUsage && asset.usageCount) {
    const dailyCost = calculateDailyCost(asset.price, asset.usageCount);
    return {
      daysOwned: asset.usageCount,
      dailyCost,
      displayDailyPrice: formatCurrency(dailyCost),
    };
  }

  // Default: calculate by days owned
  const daysOwned = calculateDaysOwned(asset.purchaseDate);
  const dailyCost = calculateDailyCost(asset.price, daysOwned);

  return {
    daysOwned,
    dailyCost,
    displayDailyPrice: formatCurrency(dailyCost),
  };
}

/**
 * Format number as currency using selected currency from settings
 */
export function formatCurrency(amount: number, currency?: string): string {
  const symbol = currency || settingsStore.getCurrencySymbol();
  return `${symbol}${amount.toFixed(2)}`;
}

/**
 * Calculate summary statistics for all assets
 */
export function calculateAssetSummary(assets: Asset[]): AssetSummary {
  const activeAssets = assets.filter((a) => a.inService);

  const totalValue = activeAssets.reduce((sum, asset) => sum + asset.price, 0);
  const totalDailyCost = activeAssets.reduce((sum, asset) => {
    const calc = getAssetCalculations(asset);
    return sum + calc.dailyCost;
  }, 0);

  return {
    totalAssets: activeAssets.length,
    activeAssets: activeAssets.length,
    retiredAssets: assets.length - activeAssets.length,
    totalValue,
    totalDailyCost,
  };
}

/**
 * Format date for display
 */
export function formatPurchaseDate(dateString: string): string {
  try {
    return format(new Date(dateString), 'yyyy年MM月dd日');
  } catch (error) {
    return dateString;
  }
}

/**
 * Format days owned for display
 */
export function formatDaysOwned(daysOwned: number): string {
  if (daysOwned >= 365) {
    const years = Math.floor(daysOwned / 365);
    const remaining = daysOwned % 365;
    if (remaining === 0) {
      return `${years}Y`;
    }
    return `${years}Y${remaining}D`;
  }
  return `${daysOwned}Days`;
}
