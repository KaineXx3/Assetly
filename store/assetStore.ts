import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateUUID } from '../utils/uuid';
import { Asset, AssetStore } from '../types';

const ASSETS_KEY = '@myassetly_assets';

/**
 * Asset Store for managing persistent storage using AsyncStorage
 */
class AssetStoreImpl implements AssetStore {
  assets: Asset[] = [];
  private initialized = false;

  /**
   * Initialize the store by loading assets from AsyncStorage
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const data = await AsyncStorage.getItem(ASSETS_KEY);
      this.assets = data ? JSON.parse(data) : [];
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing asset store:', error);
      this.assets = [];
      this.initialized = true;
    }
  }

  /**
   * Save assets to AsyncStorage
   */
  private async saveToStorage(): Promise<void> {
    try {
      await AsyncStorage.setItem(ASSETS_KEY, JSON.stringify(this.assets));
    } catch (error) {
      console.error('Error saving assets to storage:', error);
      throw error;
    }
  }

  /**
   * Add a new asset
   */
  async addAsset(assetData: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): Promise<Asset> {
    await this.initialize();

    const asset: Asset = {
      ...assetData,
      id: generateUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.assets.push(asset);
    await this.saveToStorage();

    return asset;
  }

  /**
   * Update an existing asset
   */
  async updateAsset(id: string, updates: Partial<Asset>): Promise<Asset> {
    await this.initialize();

    const index = this.assets.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error(`Asset with id ${id} not found`);
    }

    const updated: Asset = {
      ...this.assets[index],
      ...updates,
      id: this.assets[index].id,
      createdAt: this.assets[index].createdAt,
      updatedAt: new Date().toISOString(),
    };

    this.assets[index] = updated;
    await this.saveToStorage();

    return updated;
  }

  /**
   * Delete an asset
   */
  async deleteAsset(id: string): Promise<void> {
    await this.initialize();

    const index = this.assets.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error(`Asset with id ${id} not found`);
    }

    this.assets.splice(index, 1);
    await this.saveToStorage();
  }

  /**
   * Get all assets
   */
  async getAssets(): Promise<Asset[]> {
    await this.initialize();
    return [...this.assets];
  }

  /**
   * Get a specific asset by ID
   */
  async getAssetById(id: string): Promise<Asset | null> {
    await this.initialize();
    return this.assets.find((a) => a.id === id) || null;
  }

  /**
   * Get only active (in service) assets
   */
  async getActiveAssets(): Promise<Asset[]> {
    await this.initialize();
    return this.assets.filter((a) => a.inService);
  }

  /**
   * Clear all data (for development/testing)
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ASSETS_KEY);
      this.assets = [];
    } catch (error) {
      console.error('Error clearing asset store:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const assetStore = new AssetStoreImpl();
