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
          backgroundColor: disabled ? '#CCCCCC' : '#1976D2',
        },
        text: {
          color: '#FFFFFF',
        },
      };
    case 'secondary':
      return {
        container: {
          backgroundColor: disabled ? '#EEEEEE' : '#F5F5F5',
          borderWidth: 1,
          borderColor: '#D0D0D0',
        },
        text: {
          color: disabled ? '#999999' : '#333333',
        },
      };
    case 'danger':
      return {
        container: {
          backgroundColor: disabled ? '#CCCCCC' : '#D32F2F',
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
          borderColor: disabled ? '#CCCCCC' : '#1976D2',
        },
        text: {
          color: disabled ? '#CCCCCC' : '#1976D2',
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
  },
  text: {
    fontWeight: '500',
  },
});
