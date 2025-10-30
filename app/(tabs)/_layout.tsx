import { Tabs } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HapticTab } from '@/components/haptic-tab';
import AddAssetModal from '../add-asset';
import { useThemeColors } from '@/hooks/use-theme-colors';

// Global state for asset refresh
let assetRefreshCallback: (() => void) | null = null;

export function setAssetRefreshCallback(callback: () => void) {
  assetRefreshCallback = callback;
}

export default function TabLayout() {
  const colors = useThemeColors();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddAssetSuccess = useCallback(() => {
    // Call the refresh callback if it's been set
    if (assetRefreshCallback) {
      assetRefreshCallback();
    }
    setShowAddModal(false);
  }, []);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: '#999999',
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            height: 64,
            paddingBottom: 8,
            paddingTop: 8,
            backgroundColor: colors.cardBackground,
            borderTopWidth: 1,
            borderTopColor: colors.cardBorder,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Assets',
            tabBarIcon: ({ color }) => <Ionicons name="cube" size={24} color={color} />,
          }}
        />
        
        {/* Center Add Button - not part of tabs */}
        <Tabs.Screen
          name="dummy"
          options={{
            title: '',
            tabBarButton: () => (
              <TouchableOpacity
                onPress={() => setShowAddModal(true)}
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  paddingBottom: 12,
                }}
                activeOpacity={0.7}
              >
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: colors.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.35,
                    shadowRadius: 6,
                    elevation: 8,
                  }}
                >
                  <Ionicons name="add" size={32} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />,
          }}
        />
      </Tabs>

      {/* Add Asset Modal */}
      <AddAssetModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddAssetSuccess}
      />
    </>
  );
}
