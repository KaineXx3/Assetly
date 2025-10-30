import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Asset, AssetSummary } from '../../types';
import { assetStore } from '../../store/assetStore';
import { settingsStore } from '../../store/settingsStore';
import { calculateAssetSummary, formatCurrency } from '../../utils/calculations';
import { AssetCard } from '../../components/asset-card';
import { StatCard } from '../../components/stat-card';
import { initializeSampleData } from '../../utils/sample-data';
import AssetDetailModal from '../asset-detail';
import { setAssetRefreshCallback } from './_layout';

export default function AssetsScreen() {
  const insets = useSafeAreaInsets();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [summary, setSummary] = useState<AssetSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'date'>('name');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'retired' | 'favourite'>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [currency, setCurrency] = useState(settingsStore.currency);

  const loadAssets = useCallback(async () => {
    try {
      const loadedAssets = await assetStore.getAssets();
      setAssets(loadedAssets);
      setSummary(calculateAssetSummary(loadedAssets));
      filterAndSortAssets(loadedAssets, searchText, sortBy, filterStatus);
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [sortBy, filterStatus, searchText]);

  const filterAndSortAssets = (
    assetsToFilter: Asset[],
    search: string,
    sort: string,
    filter: string
  ) => {
    let result = assetsToFilter;

    // Filter by status
    if (filter === 'active') {
      result = result.filter((a) => a.inService);
    } else if (filter === 'retired') {
      result = result.filter((a) => !a.inService);
    } else if (filter === 'favourite') {
      result = result.filter((a) => a.isFavorite);
    }

    // Filter by search text
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter((a) =>
        a.name.toLowerCase().includes(searchLower) ||
        a.category.toLowerCase().includes(searchLower) ||
        (a.description && a.description.toLowerCase().includes(searchLower))
      );
    }

    // Sort
    const sorted = [...result];
    if (sort === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'price') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sort === 'date') {
      sorted.sort(
        (a, b) =>
          new Date(b.purchaseDate).getTime() -
          new Date(a.purchaseDate).getTime()
      );
    }

    setFilteredAssets(sorted);
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    filterAndSortAssets(assets, text, sortBy, filterStatus);
  };

  const handleSort = (newSort: 'name' | 'price' | 'date') => {
    setSortBy(newSort);
    filterAndSortAssets(assets, searchText, newSort, filterStatus);
  };

  const handleFilterChange = (newFilter: 'all' | 'active' | 'retired' | 'favourite') => {
    setFilterStatus(newFilter);
    filterAndSortAssets(assets, searchText, sortBy, newFilter);
    setShowFilterMenu(false);
  };

  // Initialize assets on mount
  useEffect(() => {
    setLoading(true);
    initializeSampleData().then(() => {
      loadAssets();
    });
    
    // Register the refresh callback
    setAssetRefreshCallback(() => {
      setLoading(true);
      loadAssets();
    });
  }, []); // Empty array - run only once on mount

  // Subscribe to currency changes - just trigger a re-render
  useEffect(() => {
    const unsubscribe = settingsStore.subscribe(() => {
      setCurrency(settingsStore.currency);
    });

    return () => {
      unsubscribe();
    };
  }, []); // Empty array - subscribe only once on mount

  useFocusEffect(
    useCallback(() => {
      loadAssets();
    }, [loadAssets])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadAssets();
  };

  const handleAssetPress = (assetId: string) => {
    const asset = assets.find((a) => a.id === assetId);
    if (asset) {
      setSelectedAsset(asset);
      setShowDetailModal(true);
    }
  };

  const activeAssets = assets.filter((a) => a.inService).length;

  const renderGridHeader = () => (
    <>
      {/* Stats are now part of sticky header - empty here */}
    </>
  );

  const renderHeader = () => (
    <>
      {/* This will be rendered as a sticky header now */}
    </>
  );

  const renderAssetCard = ({ item }: { item: Asset }) => (
    <View style={styles.gridItem}>
      <AssetCard
        asset={item}
        onPress={() => handleAssetPress(item.id)}
      />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cube-outline" size={64} color="#CCCCCC" />
      <Text style={styles.emptyText}>No assets yet</Text>
      <Text style={styles.emptySubtext}>Tap the + button to add your first asset</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1976D2" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      {/* Sticky Header Card - Outside SafeAreaView to avoid extra top padding */}
      <View style={[styles.stickyHeader, { paddingTop: insets.top }]}>
        <View style={styles.headerCard}>
          {/* Title and Controls */}
          <View style={styles.headerTitleRow}>
            <View style={styles.titleSection}>
              <Text style={styles.headerTitle}>My Assets</Text>
            </View>

            <View style={styles.headerControls}>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => {
                  if (showSearchInput) {
                    setShowSearchInput(false);
                    handleSearch('');
                  } else {
                    setShowSearchInput(true);
                  }
                }}
              >
                <Ionicons name={showSearchInput ? "close" : "search"} size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => handleSort(sortBy === 'name' ? 'price' : 'name')}
              >
                <Ionicons name="swap-vertical" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              
              {/* Filter Dropdown */}
              <View style={styles.filterDropdownContainer}>
                <TouchableOpacity 
                  style={styles.filterButton}
                  onPress={() => setShowFilterMenu(!showFilterMenu)}
                >
                  <Ionicons 
                    name="filter" 
                    size={16} 
                    color="#333333" 
                    style={styles.filterButtonIcon}
                  />
                  <Text style={styles.filterText}>
                    {filterStatus === 'all' ? 'All' : filterStatus === 'active' ? 'Active' : filterStatus === 'retired' ? 'Retired' : 'Favourite'}
                  </Text>
                  <Ionicons 
                    name={showFilterMenu ? "chevron-up" : "chevron-down"} 
                    size={16} 
                    color="#333333" 
                  />
                </TouchableOpacity>

                {showFilterMenu && (
                  <View style={styles.filterMenu}>
                    <TouchableOpacity 
                      style={[styles.filterMenuItem, filterStatus === 'all' && styles.filterMenuItemActive]}
                      onPress={() => handleFilterChange('all')}
                    >
                      <Ionicons name="layers" size={14} color={filterStatus === 'all' ? '#1976D2' : '#999999'} />
                      <Text style={[styles.filterMenuText, filterStatus === 'all' && styles.filterMenuTextActive]}>
                        All Assets
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.filterMenuItem, filterStatus === 'active' && styles.filterMenuItemActive]}
                      onPress={() => handleFilterChange('active')}
                    >
                      <Ionicons name="checkmark-circle" size={14} color={filterStatus === 'active' ? '#1976D2' : '#999999'} />
                      <Text style={[styles.filterMenuText, filterStatus === 'active' && styles.filterMenuTextActive]}>
                        Active
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.filterMenuItem, filterStatus === 'retired' && styles.filterMenuItemActive]}
                      onPress={() => handleFilterChange('retired')}
                    >
                      <Ionicons name="archive" size={14} color={filterStatus === 'retired' ? '#1976D2' : '#999999'} />
                      <Text style={[styles.filterMenuText, filterStatus === 'retired' && styles.filterMenuTextActive]}>
                        Retired
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.filterMenuItem, filterStatus === 'favourite' && styles.filterMenuItemActive]}
                      onPress={() => handleFilterChange('favourite')}
                    >
                      <Ionicons name="star" size={14} color={filterStatus === 'favourite' ? '#FFD700' : '#999999'} />
                      <Text style={[styles.filterMenuText, filterStatus === 'favourite' && styles.filterMenuTextActive]}>
                        Favourites
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
          {/* Summary Stats - Inside the header card */}
          {summary && (
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Assets</Text>
                <Text style={styles.statValue}>{formatCurrency(summary.totalValue)}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Daily Cost</Text>
                <Text style={styles.statValue}>{formatCurrency(summary.totalDailyCost)}</Text>
              </View>
            </View>
          )}

          {/* Search Input */}
          {showSearchInput && (
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={18} color="#999999" style={styles.searchIcon} />
              <TextInput
                placeholder="Search by name..."
                placeholderTextColor="#CCCCCC"
                value={searchText}
                onChangeText={handleSearch}
                style={styles.searchInput}
              />
              {searchText ? (
                <TouchableOpacity
                  onPress={() => handleSearch('')}
                  style={styles.clearButton}
                >
                  <Ionicons name="close-circle" size={18} color="#999999" />
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        </View>
      </View>

      {/* Scrollable Content Container */}
      <SafeAreaView style={styles.container}>
        <FlatList
          data={filteredAssets}
          renderItem={renderAssetCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          ListHeaderComponent={renderGridHeader}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#1976D2"
            />
          }
          scrollEnabled={true}
          nestedScrollEnabled={true}
          scrollEventThrottle={16}
          extraData={currency}
        />
      </SafeAreaView>

      {/* Asset Detail Modal */}
      <AssetDetailModal
        visible={showDetailModal}
        asset={selectedAsset}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedAsset(null);
        }}
        onUpdate={() => {
          loadAssets();
          setShowDetailModal(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickyHeader: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 8,
    paddingVertical: 8,
    zIndex: 100,
  },
  headerWrapper: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 0,
  },
  headerCard: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
  },
  titleSection: {
    flexDirection: 'column',
    flex: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  badge: {
    display: 'none',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0D47A1',
  },
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    gap: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterButtonIcon: {
    marginRight: 2,
  },
  filterText: {
    color: '#333333',
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 0,
  },
  gridItem: {
    width: '48%',
    marginBottom: 12,
  },
  contentContainer: {
    paddingHorizontal: 0,
    paddingBottom: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  gridContainer: {
    paddingHorizontal: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    marginTop: 8,
    textAlign: 'center',
  },
  filterDropdownContainer: {
    position: 'relative',
    zIndex: 1001,
  },
  filterMenu: {
    position: 'absolute',
    top: 42,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    minWidth: 160,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 2000,
    overflow: 'hidden',
  },
  filterMenuItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  filterMenuItemActive: {
    backgroundColor: '#F0F7FF',
  },
  filterMenuText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666666',
    flex: 1,
  },
  filterMenuTextActive: {
    color: '#1976D2',
    fontWeight: '600',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
});
