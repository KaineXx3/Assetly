import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Asset } from '../types';
import { assetStore } from '../store/assetStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Toggle } from '../components/ui/toggle';
import { DatePicker } from '../components/date-picker';
import { IconPicker } from '../components/icon-picker';
import { getIconById } from '../constants/icons';

interface AddAssetFormProps {
  onClose: () => void;
  onAssetAdded: () => void;
}

export const AddAssetForm: React.FC<AddAssetFormProps> = ({ onClose, onAssetAdded }) => {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('basic-star');
  const [category, setCategory] = useState('Uncategorized');
  const [price, setPrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString());
  const [hasWarranty, setHasWarranty] = useState(false);
  const [warrantyDate, setWarrantyDate] = useState(new Date().toISOString());
  const [calculateByUsage, setCalculateByUsage] = useState(false);
  const [usageCount, setUsageCount] = useState('');
  const [hasSpecifiedDailyPrice, setHasSpecifiedDailyPrice] = useState(false);
  const [specifiedDailyPrice, setSpecifiedDailyPrice] = useState('');
  const [inService, setInService] = useState(true);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedIcon = getIconById(icon);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Asset name is required';
    }

    if (!price || isNaN(parseFloat(price))) {
      newErrors.price = 'Valid price is required';
    }

    if (calculateByUsage && (!usageCount || isNaN(parseFloat(usageCount)))) {
      newErrors.usageCount = 'Valid usage count is required';
    }

    if (hasSpecifiedDailyPrice && (!specifiedDailyPrice || isNaN(parseFloat(specifiedDailyPrice)))) {
      newErrors.specifiedDailyPrice = 'Valid daily price is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAsset = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const newAsset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'> = {
        name: name.trim(),
        icon,
        category,
        price: parseFloat(price),
        purchaseDate,
        warrantyDate: hasWarranty ? warrantyDate : null,
        calculateByUsage,
        usageCount: calculateByUsage ? parseInt(usageCount, 10) : undefined,
        specifiedDailyPrice: hasSpecifiedDailyPrice ? parseFloat(specifiedDailyPrice) : null,
        isFavorite: false,
        inService,
        image: null,
      };

      await assetStore.addAsset(newAsset);
      onAssetAdded();
      onClose();
    } catch (error) {
      console.error('Error adding asset:', error);
      setErrors({ submit: 'Failed to add asset. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { marginTop: insets.top }]}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Asset</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Icon Selector */}
        <TouchableOpacity
          style={styles.iconSelectorButton}
          onPress={() => setShowIconPicker(true)}
          activeOpacity={0.7}
        >
          {selectedIcon ? (
            <Ionicons
              name={selectedIcon.iconName as any}
              size={48}
              color="#6366F1"
            />
          ) : (
            <Ionicons name="cube" size={48} color="#6366F1" />
          )}
          <Text style={styles.iconSelectorText}>Select Icon</Text>
        </TouchableOpacity>

        {/* Category */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categorySelector}>
            <Text style={styles.categoryValue}>{category}</Text>
            <Ionicons name="chevron-down" size={20} color="#666666" />
          </View>
        </View>

        {/* Asset Name */}
        <Input
          label="Asset Name"
          placeholder="e.g., iPad 9, Poco x3gt"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />

        {/* Price */}
        <Input
          label="Price"
          placeholder="e.g., 1050.00"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
          error={errors.price}
        />

        {/* Purchase Date */}
        <DatePicker
          label="Purchase Date"
          value={purchaseDate}
          onChangeDate={setPurchaseDate}
          maxDate={new Date()}
        />

        {/* Warranty Toggle */}
        <Toggle
          label="Set Warranty Date"
          value={hasWarranty}
          onValueChange={setHasWarranty}
        />

        {hasWarranty && (
          <DatePicker
            label="Warranty Date"
            value={warrantyDate}
            onChangeDate={setWarrantyDate}
            minDate={new Date()}
          />
        )}

        {/* Calculate by Usage Toggle */}
        <Toggle
          label="Calculate by Usage Count"
          value={calculateByUsage}
          onValueChange={setCalculateByUsage}
        />

        {calculateByUsage && (
          <Input
            label="Usage Count"
            placeholder="Number of uses"
            value={usageCount}
            onChangeText={setUsageCount}
            keyboardType="number-pad"
            error={errors.usageCount}
          />
        )}

        {/* Specified Daily Price Toggle */}
        <Toggle
          label="Specified Daily Price"
          value={hasSpecifiedDailyPrice}
          onValueChange={setHasSpecifiedDailyPrice}
        />

        {hasSpecifiedDailyPrice && (
          <Input
            label="Daily Price"
            placeholder="e.g., 5.00"
            value={specifiedDailyPrice}
            onChangeText={setSpecifiedDailyPrice}
            keyboardType="decimal-pad"
            error={errors.specifiedDailyPrice}
          />
        )}

        {/* In Service Toggle */}
        <Toggle
          label="In Service"
          value={inService}
          onValueChange={setInService}
        />

        {/* Error Message */}
        {errors.submit && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color="#D32F2F" />
            <Text style={styles.errorText}>{errors.submit}</Text>
          </View>
        )}

        {/* Spacer */}
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Add Button */}
      <View style={styles.footer}>
        <Button
          title={loading ? 'Adding...' : 'Add Asset'}
          size="large"
          onPress={handleAddAsset}
          disabled={loading}
          style={styles.addButton}
        />
      </View>

      {/* Icon Picker Modal */}
      <IconPicker
        visible={showIconPicker}
        onSelect={setIcon}
        onClose={() => setShowIconPicker(false)}
        selectedIconId={icon}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
  },
  closeButton: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366F1',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  iconSelectorButton: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 24,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#333333',
    borderStyle: 'dashed',
  },
  iconSelectorText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#999999',
    marginTop: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#FFFFFF',
  },
  categorySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#2A2A2A',
  },
  categoryValue: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C62828',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 12,
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#FFFFFF',
    flex: 1,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  addButton: {
    width: '100%',
  },
});
