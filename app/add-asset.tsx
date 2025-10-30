import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Asset } from '../types';
import { assetStore } from '../store/assetStore';
import { Input } from '../components/ui/input';
import { Toggle } from '../components/ui/toggle';
import { Button } from '../components/ui/button';
import { DatePicker } from '../components/date-picker';
import { IconPicker } from '../components/icon-picker';
import { ICON_CATEGORIES, getAllIcons, getIconById } from '../constants/icons';

interface AddAssetModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddAssetModal({
  visible,
  onClose,
  onSuccess,
}: AddAssetModalProps) {
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [assetName, setAssetName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString());
  const [category, setCategory] = useState('Uncategorized');
  const [warrantyDate, setWarrantyDate] = useState<string | null>(null);
  const [setWarrantyMode, setSetWarrantyMode] = useState(false);
  const [calculateByUsage, setCalculateByUsage] = useState(false);
  const [usageCount, setUsageCount] = useState('');
  const [specifiedDailyPrice, setSpecifiedDailyPrice] = useState(false);
  const [dailyPrice, setDailyPrice] = useState('');
  const [inService, setInService] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAddAsset = async () => {
    // Validation
    if (!selectedIcon) {
      Alert.alert('Error', 'Please select an icon');
      return;
    }

    if (!assetName.trim()) {
      Alert.alert('Error', 'Please enter asset name');
      return;
    }

    if (!price || isNaN(parseFloat(price))) {
      Alert.alert('Error', 'Please enter valid price');
      return;
    }

    try {
      setLoading(true);

      const newAsset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'> = {
        name: assetName.trim(),
        description: description.trim() || undefined,
        icon: selectedIcon,
        category,
        price: parseFloat(price),
        purchaseDate,
        warrantyDate: setWarrantyMode ? warrantyDate : null,
        calculateByUsage,
        usageCount: calculateByUsage ? parseInt(usageCount) : undefined,
        specifiedDailyPrice: specifiedDailyPrice ? parseFloat(dailyPrice) : null,
        inService,
        isFavorite: false,
        image: null,
      };

      await assetStore.addAsset(newAsset);

      // Reset form
      resetForm();
      onClose();
      onSuccess?.();

      Alert.alert('Success', 'Asset added successfully!');
    } catch (error) {
      console.error('Error adding asset:', error);
      Alert.alert('Error', 'Failed to add asset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedIcon(null);
    setAssetName('');
    setDescription('');
    setPrice('');
    setPurchaseDate(new Date().toISOString());
    setCategory('Uncategorized');
    setWarrantyDate(null);
    setSetWarrantyMode(false);
    setCalculateByUsage(false);
    setUsageCount('');
    setSpecifiedDailyPrice(false);
    setDailyPrice('');
    setInService(true);
  };

  const handleSelectIcon = (iconId: string) => {
    setSelectedIcon(iconId);
    setShowIconPicker(false);
  };

  const getIconSelectButtonStyle = () => {
    if (!selectedIcon) {
      return styles.iconSelectButton;
    }
    return [styles.iconSelectButton, styles.iconSelectButtonSelected];
  };

  const handleModalClose = () => {
    // Reset form when closing the modal
    resetForm();
    onClose();
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleModalClose}
      >
        <SafeAreaView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleModalClose}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add New Asset</Text>
            <View style={{ width: 60 }} />
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Select Icon */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Icon</Text>
              <TouchableOpacity
                style={getIconSelectButtonStyle()}
                onPress={() => setShowIconPicker(true)}
              >
                {selectedIcon ? (
                  <>
                    <Ionicons
                      name={getIconById(selectedIcon)?.iconName as any || 'cube'}
                      size={48}
                      color="#6366F1"
                    />
                    <Text style={styles.iconSelectText}>
                      {getIconById(selectedIcon)?.name || 'Select Icon'}
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="cube" size={48} color="#CCCCCC" />
                    <Text style={styles.iconSelectText}>Select Icon</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Category */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category</Text>
              <View style={styles.categorySelector}>
                {['Uncategorized', 'Digital', 'Clothing', 'Other'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryButton,
                      category === cat && styles.categoryButtonActive,
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        category === cat && styles.categoryButtonTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Asset Name */}
            <View style={styles.section}>
              <Input
                label="Asset Name"
                placeholder="e.g., iPad 9, Poco x3gt"
                value={assetName}
                onChangeText={setAssetName}
              />
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Input
                label="Description"
                placeholder="e.g., 64GB, Space Gray"
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>

            {/* Price */}
            <View style={styles.section}>
              <Input
                label="Price"
                placeholder="e.g., 1050"
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
              />
            </View>

            {/* Purchase Date */}
            <View style={styles.section}>
              <DatePicker
                label="Purchase Date"
                value={purchaseDate}
                onChangeDate={setPurchaseDate}
                maxDate={new Date()}
              />
            </View>

            {/* Toggle Options */}
            <View style={styles.section}>
              {/* Warranty Date */}
              <Toggle
                label="Set Warranty Date"
                value={setWarrantyMode}
                onValueChange={setSetWarrantyMode}
              />
              {setWarrantyMode && (
                <DatePicker
                  label="Warranty Expiry Date"
                  value={warrantyDate || new Date().toISOString()}
                  onChangeDate={setWarrantyDate}
                />
              )}

              {/* Calculate by Usage */}
              <Toggle
                label="Calculate by Usage Count"
                value={calculateByUsage}
                onValueChange={setCalculateByUsage}
              />
              {calculateByUsage && (
                <Input
                  label="Usage Count (Days)"
                  placeholder="e.g., 100"
                  value={usageCount}
                  onChangeText={setUsageCount}
                  keyboardType="number-pad"
                />
              )}

              {/* In Service */}
              <Toggle
                label="In Service"
                value={inService}
                onValueChange={setInService}
              />
            </View>

            {/* Add Button */}
            <View style={styles.section}>
              <Button
                title={loading ? 'Adding...' : 'Add Asset'}
                onPress={handleAddAsset}
                disabled={loading}
                size="large"
                style={styles.addButton}
              />
            </View>

            <View style={styles.spacer} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Icon Picker Modal */}
      <IconPicker
        visible={showIconPicker}
        selectedIconId={selectedIcon ?? undefined}
        onSelect={handleSelectIcon}
        onClose={() => setShowIconPicker(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  cancelButton: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  iconSelectButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  iconSelectButtonSelected: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#6366F1',
    borderStyle: 'solid',
  },
  iconSelectText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  categorySelector: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOpacity: 0.3,
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  addButton: {
    marginVertical: 8,
  },
  spacer: {
    height: 32,
  },
});
