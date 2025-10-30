import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
}) => {
  const variantStyles = getVariantStyles(variant, disabled);
  const sizeStyles = getSizeStyles(size);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, variantStyles.container, sizeStyles.container, style]}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, variantStyles.text, sizeStyles.text, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

function getVariantStyles(variant: string, disabled: boolean) {
  switch (variant) {
    case 'primary':
      return {
        container: {
          backgroundColor: disabled ? '#CCCCCC' : '#6366F1',
        },
        text: {
          color: '#FFFFFF',
        },
      };
    case 'secondary':
      return {
        container: {
          backgroundColor: disabled ? '#EEEEEE' : '#F0F9FF',
          borderWidth: 1,
          borderColor: '#E0F2FE',
        },
        text: {
          color: disabled ? '#999999' : '#0C4A6E',
        },
      };
    case 'danger':
      return {
        container: {
          backgroundColor: disabled ? '#CCCCCC' : '#DC2626',
        },
        text: {
          color: '#FFFFFF',
        },
      };
    case 'outlined':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: disabled ? '#CCCCCC' : '#6366F1',
        },
        text: {
          color: disabled ? '#CCCCCC' : '#6366F1',
        },
      };
    default:
      return { container: {}, text: {} };
  }
}

function getSizeStyles(size: string) {
  switch (size) {
    case 'small':
      return {
        container: {
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 4,
        },
        text: {
          fontSize: 12,
          fontWeight: '500' as const,
        },
      };
    case 'large':
      return {
        container: {
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 8,
        },
        text: {
          fontSize: 16,
          fontWeight: '600' as const,
        },
      };
    case 'medium':
    default:
      return {
        container: {
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 6,
        },
        text: {
          fontSize: 14,
          fontWeight: '500' as const,
        },
      };
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontWeight: '500',
  },
});
