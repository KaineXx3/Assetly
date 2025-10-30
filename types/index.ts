/**
 * Asset data model for tracking personal electronics
 */
export interface Asset {
  id: string; // UUID
  name: string;
  description?: string; // optional asset description
  icon: string; // icon identifier
  category: string;
  price: number; // in currency units (e.g., ¥)
  purchaseDate: string; // ISO string
  warrantyDate: string | null; // ISO string or null
  calculateByUsage: boolean;
  usageCount?: number; // if calculateByUsage is true
  specifiedDailyPrice: number | null; // if specified daily price is enabled
  inService: boolean;
  isFavorite: boolean; // marked as favorite
  image: string | null; // base64 or URI
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

/**
 * Store state for managing assets
 */
export interface AssetStore {
  assets: Asset[];
  addAsset: (asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Asset>;
  updateAsset: (id: string, updates: Partial<Asset>) => Promise<Asset>;
  deleteAsset: (id: string) => Promise<void>;
  getAssets: () => Promise<Asset[]>;
  getAssetById: (id: string) => Promise<Asset | null>;
  getActiveAssets: () => Promise<Asset[]>;
}

/**
 * Icon configuration
 */
export interface IconConfig {
  id: string;
  name: string;
  category: IconCategory;
  iconName: string; // expo vector icon name
  iconSet: 'Ionicons' | 'FontAwesome' | 'MaterialCommunityIcons' | 'Feather';
}

export type IconCategory = 'Basic' | 'Digital' | 'Clothing' | 'Beauty' | 'Brand' | 'Musical' | 'Transport' | 'Fitness';

/**
 * Calculation results
 */
export interface AssetCalculations {
  daysOwned: number;
  dailyCost: number;
  displayDailyPrice: string;
}

/**
 * Summary statistics
 */
export interface AssetSummary {
  totalAssets: number;
  activeAssets: number;
  retiredAssets: number;
  totalValue: number;
  totalDailyCost: number;
}
