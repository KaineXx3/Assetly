import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColors } from '../../hooks/use-theme-colors';

interface ToggleProps {
  label?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  containerStyle?: ViewStyle;
}

export const Toggle: React.FC<ToggleProps> = ({
  label,
  value,
  onValueChange,
  containerStyle,
}) => {
  const colors = useThemeColors();
  const dynamicStyles = createDynamicStyles(colors);

  return (
    <View style={[dynamicStyles.container, containerStyle]}>
      {label && <Text style={dynamicStyles.label}>{label}</Text>}
      <TouchableOpacity
        style={[dynamicStyles.toggle, value ? dynamicStyles.toggleOn : dynamicStyles.toggleOff]}
        onPress={() => onValueChange(!value)}
        activeOpacity={0.7}
      >
        <View
          style={[
            dynamicStyles.thumb,
            value ? dynamicStyles.thumbOn : dynamicStyles.thumbOff,
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    flex: 1,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleOn: {
    backgroundColor: '#4CAF50',
  },
  toggleOff: {
    backgroundColor: '#CCCCCC',
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  thumbOn: {
    alignSelf: 'flex-end',
  },
  thumbOff: {
    alignSelf: 'flex-start',
  },
});

function createDynamicStyles(colors: ReturnType<typeof useThemeColors>) {
  return {
    container: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      paddingVertical: 12,
      paddingHorizontal: 0,
    },
    label: {
      fontSize: 14,
      fontWeight: '500' as const,
      color: colors.text,
      flex: 1,
    },
    toggle: {
      width: 50,
      height: 28,
      borderRadius: 14,
      justifyContent: 'center' as const,
      paddingHorizontal: 2,
    },
    toggleOn: {
      backgroundColor: '#4CAF50',
    },
    toggleOff: {
      backgroundColor: colors.cardBorder,
    },
    thumb: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.cardBackground,
    },
    thumbOn: {
      alignSelf: 'flex-end' as const,
    },
    thumbOff: {
      alignSelf: 'flex-start' as const,
    },
  };
}
