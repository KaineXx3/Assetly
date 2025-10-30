import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Asset } from '../types';
import { assetStore } from '../store/assetStore';
import { settingsStore } from '../store/settingsStore';
import { formatCurrency, getAssetCalculations } from '../utils/calculations';
import { DatePicker } from '../components/date-picker';
import { IconPicker } from '../components/icon-picker';
import { Input } from '../components/ui/input';
import { Toggle } from '../components/ui/toggle';
import { getIconById } from '../constants/icons';

interface AssetDetailProps {
  visible: boolean;
  asset: Asset | null;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function AssetDetailModal({
  visible,
  asset,
  onClose,
  onUpdate,
}: AssetDetailProps) {
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(asset?.isFavorite ?? false);
  const [isRetired, setIsRetired] = useState(asset?.inService === false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [editIcon, setEditIcon] = useState(asset?.icon ?? null);
  const [editName, setEditName] = useState(asset?.name ?? '');
  const [editDescription, setEditDescription] = useState(asset?.description ?? '');
  const [editPrice, setEditPrice] = useState(asset?.price.toString() ?? '');
  const [editPurchaseDate, setEditPurchaseDate] = useState(asset?.purchaseDate ?? new Date().toISOString());
  const [editCategory, setEditCategory] = useState(asset?.category ?? 'Uncategorized');
  const [editWarrantyDate, setEditWarrantyDate] = useState(asset?.warrantyDate ?? null);
  const [editSetWarrantyMode, setEditSetWarrantyMode] = useState(!!asset?.warrantyDate);
  const [editInService, setEditInService] = useState(asset?.inService ?? true);
  const [currency, setCurrency] = useState(settingsStore.currency);

  // Update state when asset changes
  useEffect(() => {
    if (asset) {
      setIsFavorite(asset.isFavorite ?? false);
      setIsRetired(!asset.inService);
      setEditIcon(asset.icon ?? null);
      setEditName(asset.name ?? '');
      setEditDescription(asset.description ?? '');
      setEditPrice(asset.price.toString() ?? '');
      setEditPurchaseDate(asset.purchaseDate ?? new Date().toISOString());
      setEditCategory(asset.category ?? 'Uncategorized');
      setEditWarrantyDate(asset.warrantyDate ?? null);
      setEditSetWarrantyMode(!!asset.warrantyDate);
      setEditInService(asset.inService ?? true);
      setIsEditMode(false);
    }
  }, [asset?.id, visible]);

  // Subscribe to currency changes
  useEffect(() => {
    const unsubscribe = settingsStore.subscribe(() => {
      setCurrency(settingsStore.currency);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!asset) return null;

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSaveEdit = async () => {
    if (!editIcon) {
      Alert.alert('Error', 'Please select an icon');
      return;
    }

    if (!editName.trim()) {
      Alert.alert('Error', 'Please enter asset name');
      return;
    }

    if (!editPrice || isNaN(parseFloat(editPrice))) {
      Alert.alert('Error', 'Please enter valid price');
      return;
    }

    try {
      setLoading(true);
      const updatedAsset = await assetStore.updateAsset(asset.id, {
        icon: editIcon,
        name: editName.trim(),
        description: editDescription.trim() || undefined,
        price: parseFloat(editPrice),
        purchaseDate: editPurchaseDate,
        category: editCategory,
        warrantyDate: editSetWarrantyMode ? editWarrantyDate : null,
        inService: editInService,
      });
      
      // Sync the component state with the updated asset
      setIsFavorite(updatedAsset.isFavorite ?? false);
      setIsRetired(!updatedAsset.inService);
      setEditIcon(updatedAsset.icon ?? null);
      setEditName(updatedAsset.name ?? '');
      setEditDescription(updatedAsset.description ?? '');
      setEditPrice(updatedAsset.price.toString() ?? '');
      setEditPurchaseDate(updatedAsset.purchaseDate ?? new Date().toISOString());
      setEditCategory(updatedAsset.category ?? 'Uncategorized');
      setEditWarrantyDate(updatedAsset.warrantyDate ?? null);
      setEditSetWarrantyMode(!!updatedAsset.warrantyDate);
      setEditInService(updatedAsset.inService ?? true);
      
      setIsEditMode(false);
      onUpdate?.();
    } catch (error) {
      console.error('Error updating asset:', error);
      Alert.alert('Error', 'Failed to update asset');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditIcon(asset.icon ?? null);
    setEditName(asset.name ?? '');
    setEditDescription(asset.description ?? '');
    setEditPrice(asset.price.toString() ?? '');
    setEditPurchaseDate(asset.purchaseDate ?? new Date().toISOString());
    setEditCategory(asset.category ?? 'Uncategorized');
    setEditWarrantyDate(asset.warrantyDate ?? null);
    setEditSetWarrantyMode(!!asset.warrantyDate);
    setEditInService(asset.inService ?? true);
    setIsEditMode(false);
  };

  const handleToggleFavorite = async () => {
    try {
      setLoading(true);
      await assetStore.updateAsset(asset.id, {
        isFavorite: !isFavorite,
      });
      setIsFavorite(!isFavorite);
      onUpdate?.();
    } catch (error) {
      console.error('Error updating favorite:', error);
      Alert.alert('Error', 'Failed to update favorite status');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRetired = async () => {
    try {
      setLoading(true);
      await assetStore.updateAsset(asset.id, {
        inService: isRetired,
      });
      setIsRetired(!isRetired);
      onUpdate?.();
    } catch (error) {
      console.error('Error updating retired status:', error);
      Alert.alert('Error', 'Failed to update retired status');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Asset',
      `Are you sure you want to delete "${asset.name}"?`,
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              setLoading(true);
              await assetStore.deleteAsset(asset.id);
              onUpdate?.();
              onClose();
              Alert.alert('Success', 'Asset deleted successfully');
            } catch (error) {
              console.error('Error deleting asset:', error);
              Alert.alert('Error', 'Failed to delete asset');
            } finally {
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  // Determine card background color based on status
  const getCardBackgroundColor = () => {
    if (isFavorite) return '#FFD700'; // Yellow for favorite
    if (isRetired) return '#CCCCCC'; // Grey for retired
    return '#E8F5E9'; // Default green
  };

  const purchaseDate = new Date(asset.purchaseDate);
  const purchaseDateString = purchaseDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Asset Details</Text>
          <View style={{ width: 60 }} />
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366F1" />
          </View>
        )}

        {!loading && (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {isEditMode ? (
              // Edit Mode
              <>
                <Text style={styles.editModeTitle}>Edit Asset</Text>
                
                {/* Icon Picker Section */}
                <View style={styles.editSection}>
                  <Text style={styles.sectionTitle}>Icon</Text>
                  <TouchableOpacity
                    style={[
                      styles.iconSelectButton,
                      editIcon && styles.iconSelectButtonSelected,
                    ]}
                    onPress={() => setShowIconPicker(true)}
                  >
                    {editIcon ? (
                      <>
                        <Ionicons
                          name={getIconById(editIcon)?.iconName as any || 'cube'}
                          size={48}
                          color="#6366F1"
                        />
                        <Text style={styles.iconSelectText}>
                          {getIconById(editIcon)?.name || 'Select Icon'}
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

                {/* Asset Name */}
                <View style={styles.editSection}>
                  <Input
                    label="Asset Name"
                    placeholder="e.g., iPad 9, Poco x3gt"
                    value={editName}
                    onChangeText={setEditName}
                  />
                </View>

                {/* Description */}
                <View style={styles.editSection}>
                  <Input
                    label="Description"
                    placeholder="e.g., 64GB, Space Gray"
                    value={editDescription}
                    onChangeText={setEditDescription}
                    multiline
                  />
                </View>

                {/* Price */}
                <View style={styles.editSection}>
                  <Input
                    label="Price"
                    placeholder="e.g., 1050"
                    value={editPrice}
                    onChangeText={setEditPrice}
                    keyboardType="decimal-pad"
                  />
                </View>

                {/* Purchase Date */}
                <View style={styles.editSection}>
                  <DatePicker
                    label="Purchase Date"
                    value={editPurchaseDate}
                    onChangeDate={setEditPurchaseDate}
                    maxDate={new Date()}
                  />
                </View>

                {/* Category */}
                <View style={styles.editSection}>
                  <Text style={styles.sectionTitle}>Category</Text>
                  <View style={styles.categorySelector}>
                    {['Uncategorized', 'Digital', 'Clothing', 'Other'].map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.categoryButton,
                          editCategory === cat && styles.categoryButtonActive,
                        ]}
                        onPress={() => setEditCategory(cat)}
                      >
                        <Text
                          style={[
                            styles.categoryButtonText,
                            editCategory === cat && styles.categoryButtonTextActive,
                          ]}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Warranty Date */}
                <View style={styles.editSection}>
                  <Toggle
                    label="Set Warranty Date"
                    value={editSetWarrantyMode}
                    onValueChange={setEditSetWarrantyMode}
                  />
                  {editSetWarrantyMode && (
                    <DatePicker
                      label="Warranty Expiry Date"
                      value={editWarrantyDate || new Date().toISOString()}
                      onChangeDate={setEditWarrantyDate}
                    />
                  )}
                </View>

                {/* In Service */}
                <View style={styles.editSection}>
                  <Toggle
                    label="In Service"
                    value={editInService}
                    onValueChange={setEditInService}
                  />
                </View>

                <View style={styles.editButtonsContainer}>
                  <TouchableOpacity
                    style={[styles.editActionButton, styles.saveButton]}
                    onPress={handleSaveEdit}
                  >
                    <Text style={styles.editActionButtonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.editActionButton, styles.cancelButton]}
                    onPress={handleCancelEdit}
                  >
                    <Text style={[styles.editActionButtonText, styles.editActionButtonTextCancel]}>Cancel</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.spacer} />
              </>
            ) : (
              // View Mode
              <>
            {/* Asset Card Display */}
            <View style={[styles.assetCard, { backgroundColor: getCardBackgroundColor() }]}>
              <View style={styles.assetCardHeader}>
                <View style={styles.assetInfo}>
                  <Ionicons name={getIconById(asset.icon)?.iconName as any || 'cube'} size={40} color="#6366F1" />
                  <View style={styles.assetNameSection}>
                    <Text style={styles.assetName}>{asset.name}</Text>
                    <Text style={styles.assetPrice}>{formatCurrency(asset.price)}</Text>
                    <Text style={styles.dailyCost}>{getAssetCalculations(asset).displayDailyPrice}/Day</Text>
                  </View>
                </View>
                <Text style={styles.daysLabel}>
                  {Math.floor(
                    (new Date().getTime() - new Date(asset.purchaseDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}
                  Days
                </Text>
              </View>
            </View>

            {/* Asset Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Asset Information</Text>
              {asset.description && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Description</Text>
                  <Text style={styles.infoValue}>{asset.description}</Text>
                </View>
              )}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Category</Text>
                <Text style={styles.infoValue}>{asset.category}</Text>
              </View>
            </View>

            {/* Purchase Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Purchase Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Purchase Date</Text>
                <Text style={styles.infoValue}>{purchaseDateString}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Purchase Price</Text>
                <Text style={styles.infoValue}>{formatCurrency(asset.price)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Total Price</Text>
                <Text style={styles.infoValue}>{formatCurrency(asset.price)}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.favoriteButton]}
                onPress={handleToggleFavorite}
                disabled={loading}
              >
                <Ionicons
                  name={isFavorite ? 'star' : 'star-outline'}
                  size={24}
                  color="#FFD700"
                />
                <Text style={styles.actionLabel}>Favorite</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={handleEdit}
                disabled={loading}
              >
                <Ionicons name="create" size={24} color="#6366F1" />
                <Text style={styles.actionLabel}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.retiredButton]}
                onPress={handleToggleRetired}
                disabled={loading}
              >
                <Ionicons
                  name={isRetired ? 'close-circle' : 'close-circle-outline'}
                  size={24}
                  color={isRetired ? '#999999' : '#6366F1'}
                />
                <Text style={styles.actionLabel}>Retired</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={handleDelete}
                disabled={loading}
              >
                <Ionicons name="trash" size={24} color="#FF6B6B" />
                <Text style={styles.actionLabel}>Delete</Text>
              </TouchableOpacity>
            </View>
              </>
            )}
          </ScrollView>
        )}
      </SafeAreaView>

      {/* Icon Picker Modal */}
      <IconPicker
        visible={showIconPicker}
        onClose={() => setShowIconPicker(false)}
        onSelect={(icon) => {
          setEditIcon(icon);
          setShowIconPicker(false);
        }}
        selectedIconId={editIcon || undefined}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  assetCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  assetCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  assetInfo: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  assetNameSection: {
    flex: 1,
  },
  assetName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  assetPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
    marginBottom: 2,
  },
  dailyCost: {
    fontSize: 13,
    color: '#666666',
  },
  daysLabel: {
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: '#6366F1',
    color: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 13,
    color: '#666666',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    marginHorizontal: 12,
    marginBottom: 16,
  },
  actionButton: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  favoriteButton: {
    backgroundColor: '#FEF3C7',
  },
  editButton: {
    backgroundColor: '#EDE9FE',
  },
  retiredButton: {
    backgroundColor: '#F3F4F6',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333333',
  },
  editModeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 20,
  },
  editSection: {
    marginBottom: 16,
  },
  editLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  editInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  editButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  editActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButton: {
    backgroundColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOpacity: 0.3,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  editActionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  editActionButtonTextCancel: {
    color: '#333333',
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
  },
  categoryButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  spacer: {
    height: 32,
  },
});
