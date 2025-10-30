import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ICON_CATEGORIES,
  getIconsByCategory,
  getIconById,
  getAllIcons,
} from '../constants/icons';
import { IconCategory, IconConfig } from '../types';
import { Button } from './ui/button';

interface IconPickerProps {
  visible: boolean;
  onSelect: (iconId: string) => void;
  onClose: () => void;
  selectedIconId?: string;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  visible,
  onSelect,
  onClose,
  selectedIconId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<IconCategory>('Basic');
  const [tempSelected, setTempSelected] = useState(selectedIconId);

  const categoryIcons = getIconsByCategory(selectedCategory);

  const handleIconSelect = (iconId: string) => {
    setTempSelected(iconId);
  };

  const handleConfirm = () => {
    if (tempSelected) {
      onSelect(tempSelected);
      onClose();
    }
  };

  const renderIconItem = ({ item }: { item: IconConfig }) => (
    <TouchableOpacity
      style={[
        styles.iconItem,
        tempSelected === item.id && styles.iconItemSelected,
      ]}
      onPress={() => handleIconSelect(item.id)}
      activeOpacity={0.7}
    >
      <Ionicons
        name={item.iconName as any}
        size={32}
        color={tempSelected === item.id ? '#FFFFFF' : '#6366F1'}
      />
      <Text
        style={[
          styles.iconName,
          tempSelected === item.id && styles.iconNameSelected,
        ]}
        numberOfLines={1}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.headerButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Icon</Text>
          <Button
            title="Sure"
            size="small"
            onPress={handleConfirm}
            style={styles.confirmButton}
          />
        </View>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContainer}
        >
          {ICON_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryTab,
                selectedCategory === category && styles.categoryTabActive,
              ]}
              onPress={() => setSelectedCategory(category)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryTabText,
                  selectedCategory === category && styles.categoryTabTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Icon Grid */}
        <FlatList
          data={categoryIcons}
          renderItem={renderIconItem}
          keyExtractor={(item) => item.id}
          numColumns={5}
          contentContainerStyle={styles.gridContainer}
          scrollEnabled={true}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
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
  headerButton: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  confirmButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  categoriesScroll: {
    maxHeight: 50,
  },
  categoriesContainer: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  categoryTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  categoryTabActive: {
    backgroundColor: '#6366F1',
  },
  categoryTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
  },
  gridContainer: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  iconItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
    margin: 4,
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  iconItemSelected: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  iconName: {
    fontSize: 9,
    marginTop: 4,
    color: '#666666',
    textAlign: 'center',
  },
  iconNameSelected: {
    color: '#FFFFFF',
  },
});
