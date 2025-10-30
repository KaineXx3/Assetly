import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

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
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.toggle, value ? styles.toggleOn : styles.toggleOff]}
        onPress={() => onValueChange(!value)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.thumb,
            value ? styles.thumbOn : styles.thumbOff,
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
