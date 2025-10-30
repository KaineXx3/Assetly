import { Asset } from '../types';
import { assetStore } from '../store/assetStore';

export async function initializeSampleData() {
  try {
    const existingAssets = await assetStore.getAssets();
    
    // Only add sample data if store is empty
    if (existingAssets.length === 0) {
      const now = new Date();
      const sampleAssets: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
          name: 'iPad 9',
          icon: 'digital-tablet',
          category: 'Digital',
          price: 1050,
          purchaseDate: new Date(now.getTime() - 832 * 24 * 60 * 60 * 1000).toISOString(),
          warrantyDate: null,
          calculateByUsage: false,
          specifiedDailyPrice: null,
          inService: true,
          isFavorite: false,
          image: null,
        },
        {
          name: 'Poco X3 GT',
          icon: 'digital-phone',
          category: 'Digital',
          price: 2500,
          purchaseDate: new Date(now.getTime() - 500 * 24 * 60 * 60 * 1000).toISOString(),
          warrantyDate: null,
          calculateByUsage: false,
          specifiedDailyPrice: null,
          inService: true,
          isFavorite: false,
          image: null,
        },
        {
          name: 'Sony Headphones',
          icon: 'digital-headphones',
          category: 'Digital',
          price: 1500,
          purchaseDate: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString(),
          warrantyDate: null,
          calculateByUsage: false,
          specifiedDailyPrice: null,
          inService: true,
          isFavorite: false,
          image: null,
        },
        {
          name: 'MacBook Pro',
          icon: 'digital-laptop',
          category: 'Digital',
          price: 3999,
          purchaseDate: new Date(now.getTime() - 200 * 24 * 60 * 60 * 1000).toISOString(),
          warrantyDate: null,
          calculateByUsage: false,
          specifiedDailyPrice: null,
          inService: true,
          isFavorite: false,
          image: null,
        },
        {
          name: 'Canon EOS Camera',
          icon: 'digital-camera',
          category: 'Digital',
          price: 2200,
          purchaseDate: new Date(now.getTime() - 600 * 24 * 60 * 60 * 1000).toISOString(),
          warrantyDate: null,
          calculateByUsage: false,
          specifiedDailyPrice: null,
          inService: true,
          isFavorite: false,
          image: null,
        },
        {
          name: 'Apple Watch',
          icon: 'digital-watch',
          category: 'Digital',
          price: 450,
          purchaseDate: new Date(now.getTime() - 150 * 24 * 60 * 60 * 1000).toISOString(),
          warrantyDate: null,
          calculateByUsage: false,
          specifiedDailyPrice: null,
          inService: true,
          isFavorite: false,
          image: null,
        },
      ];

      for (const asset of sampleAssets) {
        await assetStore.addAsset(asset);
      }

      console.log('Sample data initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
}
