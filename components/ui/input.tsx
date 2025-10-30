import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { useThemeColors } from '../../hooks/use-theme-colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: any;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  ...props
}) => {
  const colors = useThemeColors();
  const dynamicStyles = createDynamicStyles(colors);

  return (
    <View style={[dynamicStyles.container, containerStyle]}>
      {label && <Text style={dynamicStyles.label}>{label}</Text>}
      <TextInput
        style={[dynamicStyles.input, error && dynamicStyles.inputError]}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
      {error && <Text style={dynamicStyles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  error: {
    color: '#D32F2F',
    fontSize: 12,
    marginTop: 4,
  },
});

function createDynamicStyles(colors: ReturnType<typeof useThemeColors>) {
  return {
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '600' as const,
      marginBottom: 8,
      color: colors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 6,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 14,
      color: colors.text,
      backgroundColor: colors.inputBackground,
    },
    inputError: {
      borderColor: '#D32F2F',
    },
    error: {
      color: '#D32F2F',
      fontSize: 12,
      marginTop: 4,
    },
  };
}
