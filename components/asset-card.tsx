import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Asset } from '../types';
import { getAssetCalculations, formatCurrency, formatDaysOwned } from '../utils/calculations';
import { getIconById } from '../constants/icons';
import { settingsStore } from '../store/settingsStore';

interface AssetCardProps {
  asset: Asset;
  onPress: () => void;
  onLongPress?: () => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  onPress,
  onLongPress,
}) => {
  const [currency, setCurrency] = useState(settingsStore.currency);
  const iconConfig = getIconById(asset.icon);

  // Memoize calculations based on currency
  const calculations = React.useMemo(() => {
    return getAssetCalculations(asset);
  }, [asset, currency]);

  useEffect(() => {
    // Subscribe to settings changes
    const unsubscribe = settingsStore.subscribe(() => {
      setCurrency(settingsStore.currency);
    });

    return () => {
      unsubscribe();
    };
  }, []); // Empty array - subscribe only once on mount

  // Determine card background color based on status
  const getCardBackgroundColor = () => {
    if (asset.isFavorite) return '#FFD700'; // Yellow for favorite
    if (!asset.inService) return '#CCCCCC'; // Grey for retired
    return '#E8F5E9'; // Green default
  };

  // Determine text color based on background
  const getTextColor = () => {
    if (asset.isFavorite) return '#333333';
    if (!asset.inService) return '#555555';
    return '#1B5E20';
  };

  // Map icon set to Ionicons or other vector icon libraries
  const getIconComponent = (setName: string, iconName: string) => {
    const iconColor = asset.isFavorite ? '#CC8800' : '#1976D2';
    return (
      <Ionicons
        name={iconName as any}
        size={40}
        color={iconColor}
        style={styles.icon}
      />
    );
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: getCardBackgroundColor() }]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      {/* Days Owned Badge */}
      <View style={styles.daysOwnedBadge}>
        <Text style={styles.daysOwnedText}>{formatDaysOwned(calculations.daysOwned)}</Text>
      </View>

      {/* Icon */}
      <View style={styles.iconContainer}>
        {iconConfig ? (
          getIconComponent(iconConfig.iconSet, iconConfig.iconName)
        ) : (
          <Ionicons name="cube" size={40} color="#1976D2" style={styles.icon} />
        )}
      </View>

      {/* Asset Name - Centered */}
      <Text style={[styles.name, { color: getTextColor() }]} numberOfLines={2}>
        {asset.name}
      </Text>

      {/* Price */}
      <Text style={[styles.price, { color: getTextColor() }]}>
        {formatCurrency(asset.price)}
      </Text>

      {/* Daily Cost */}
      <Text style={[styles.dailyCost, { color: getTextColor() }]}>
        {calculations.displayDailyPrice}/Day
      </Text>

      {/* Status Indicator */}
      {asset.isFavorite && (
        <View style={styles.favoriteBadge}>
          <Ionicons name="star" size={12} color="#FFD700" />
        </View>
      )}
      
      {!asset.inService && (
        <View style={styles.retiredBadge}>
          <Text style={styles.retiredText}>Retired</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
    position: 'relative',
    alignItems: 'center',
  },
  daysOwnedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#1976D2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  daysOwnedText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginBottom: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 8,
    textAlign: 'center',
    height: 'auto',
    minHeight: 32,
  },
  price: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
    marginBottom: 6,
  },
  dailyCost: {
    fontSize: 12,
    color: '#558B2F',
    fontWeight: '500',
  },
  retiredBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#BDBDBD',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  retiredText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
  },
  favoriteBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
});
