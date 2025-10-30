import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Asset } from '../types';
import { assetStore } from '../store/assetStore';
import { calculateAssetSummary, formatCurrency } from '../utils/calculations';
import { AssetCard } from '../components/asset-card';
import { StatCard } from '../components/stat-card';

interface AssetsListProps {
  onAddPress: () => void;
  onAssetPress: (asset: Asset) => void;
}

export const AssetsList: React.FC<AssetsListProps> = ({ onAddPress, onAssetPress }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCount, setActiveCount] = useState(0);

  const loadAssets = useCallback(async () => {
    try {
      const loadedAssets = await assetStore.getAssets();
      setAssets(loadedAssets);
      const active = loadedAssets.filter((a) => a.inService).length;
      setActiveCount(active);
      setLoading(false);
    } catch (error) {
      console.error('Error loading assets:', error);
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAssets();
    setRefreshing(false);
  }, [loadAssets]);

  useFocusEffect(
    useCallback(() => {
      loadAssets();
    }, [loadAssets])
  );

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  const summary = calculateAssetSummary(assets);
  const totalRetired = assets.length - activeCount;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  const renderHeader = () => (
    <View>
      {/* Header with Title and Count */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle}>My Assets</Text>
          <Text style={styles.headerCount}>
            {activeCount}/{assets.length}
          </Text>
        </View>
        <View style={styles.headerControls}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Ionicons name="search" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Ionicons name="settings" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
            <Text style={styles.filterText}>All</Text>
            <Ionicons name="chevron-down" size={14} color="#666666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <StatCard
          title="Total Assets"
          value={formatCurrency(summary.totalValue)}
          subtitle={`${activeCount} active`}
        />
        <StatCard
          title="Total Daily Cost"
          value={formatCurrency(summary.totalDailyCost)}
          subtitle="/day"
        />
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cube-outline" size={64} color="#CCCCCC" />
      <Text style={styles.emptyText}>No Assets Yet</Text>
      <Text style={styles.emptySubtext}>
        Tap the + button to add your first asset
      </Text>
    </View>
  );

  const handleAssetPress = (asset: Asset) => {
    onAssetPress(asset);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={assets}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <AssetCard
              asset={item}
              onPress={() => handleAssetPress(item)}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  header: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 16,
  },
  headerTitleRow: {
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerCount: {
    fontSize: 14,
    color: '#E0E0E0',
    marginTop: 4,
  },
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    gap: 4,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  cardContainer: {
    width: '48%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#999999',
    marginTop: 8,
    textAlign: 'center',
  },
});
