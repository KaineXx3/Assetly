import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { settingsStore, Theme, Currency } from '../../store/settingsStore';
import { useThemeColors } from '../../hooks/use-theme-colors';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const [theme, setTheme] = useState<Theme>(settingsStore.theme);
  const [currency, setCurrency] = useState<Currency>(settingsStore.currency);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure settings are loaded, then subscribe to changes
    const initializeSettings = async () => {
      await settingsStore.loadSettings();
      setTheme(settingsStore.theme);
      setCurrency(settingsStore.currency);
      setIsLoading(false);
    };

    initializeSettings();

    // Subscribe to settings changes
    const unsubscribe = settingsStore.subscribe(() => {
      setTheme(settingsStore.theme);
      setCurrency(settingsStore.currency);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleThemeChange = async (selectedTheme: Theme) => {
    setTheme(selectedTheme);
    setShowThemeModal(false);
    await settingsStore.setTheme(selectedTheme);
  };

  const handleCurrencyChange = async (selectedCurrency: Currency) => {
    setCurrency(selectedCurrency);
    setShowCurrencyModal(false);
    await settingsStore.setCurrency(selectedCurrency);
  };

  const getThemeLabel = (t: Theme) => {
    const labels: Record<Theme, string> = {
      light: 'Light',
      dark: 'Dark',
      auto: 'Auto',
    };
    return labels[t];
  };

  const getCurrencyDisplay = () => {
    const currencies = settingsStore.getAvailableCurrencies();
    const current = currencies.find((c) => c.code === currency);
    return current ? `${current.symbol} ${current.code}` : currency;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with proper padding for notification bar */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Preferences Section */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Preferences</Text>
        </View>

        <View style={styles.section}>
          {/* Currency Setting */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowCurrencyModal(true)}
          >
            <Ionicons name="cash" size={24} color="#6366F1" />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Currency</Text>
              <Text style={styles.menuSubtitle}>
                {settingsStore.getAvailableCurrencies().find(c => c.code === currency)?.name || 'Select Currency'}
              </Text>
            </View>
            <View style={styles.menuRight}>
              <Text style={styles.menuValue}>{getCurrencyDisplay()}</Text>
              <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
            </View>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>About</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.menuItem}>
            <Ionicons name="information-circle" size={24} color="#6366F1" />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>About MyAssetly</Text>
              <Text style={styles.menuSubtitle}>Version 1.0.0</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>MyAssetly v1.0.0</Text>
        </View>
      </ScrollView>


      {/* Currency Selection Modal */}
      <Modal
        visible={showCurrencyModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCurrencyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Currency</Text>
              <TouchableOpacity onPress={() => setShowCurrencyModal(false)}>
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={settingsStore.getAvailableCurrencies()}
              keyExtractor={(item) => item.code}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => handleCurrencyChange(item.code)}
                >
                  <View style={styles.optionContent}>
                    <View style={styles.currencyBadge}>
                      <Text style={styles.currencySymbol}>{item.symbol}</Text>
                    </View>
                    <View style={styles.optionTextContainer}>
                      <Text style={styles.optionTitle}>{item.name}</Text>
                      <Text style={styles.optionSubtitle}>{item.code}</Text>
                    </View>
                  </View>
                  {currency === item.code && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#6366F1"
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionTitleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#999999',
    marginTop: 2,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366F1',
  },
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  currencyBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366F1',
  },
});
