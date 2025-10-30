import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface ModernAlertProps {
  visible: boolean;
  type: AlertType;
  title: string;
  message: string;
  onClose: () => void;
  duration?: number; // Auto-close in ms (0 = manual)
  actionLabel?: string;
  onAction?: () => void;
}

const COLORS = {
  success: {
    bg: '#D1FAE5',
    border: '#A7F3D0',
    icon: '#059669',
    text: '#065F46',
  },
  error: {
    bg: '#FEE2E2',
    border: '#FECACA',
    icon: '#DC2626',
    text: '#7F1D1D',
  },
  warning: {
    bg: '#FEF3C7',
    border: '#FDE68A',
    icon: '#D97706',
    text: '#78350F',
  },
  info: {
    bg: '#DBEAFE',
    border: '#BFDBFE',
    icon: '#0284C7',
    text: '#0C2340',
  },
};

const ICONS = {
  success: 'checkmark-circle',
  error: 'close-circle',
  warning: 'alert-circle',
  info: 'information-circle',
};

export const ModernAlert: React.FC<ModernAlertProps> = ({
  visible,
  type,
  title,
  message,
  onClose,
  duration = 3000,
  actionLabel,
  onAction,
}) => {
  const slideAnim = React.useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      if (duration > 0) {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
      }
    } else {
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, duration, onClose, slideAnim]);

  if (!visible) return null;

  const colors = COLORS[type];
  const icon = ICONS[type];

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.alertWrapper,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={[styles.alert, { backgroundColor: colors.bg, borderColor: colors.border }]}>
            {/* Top accent line */}
            <View style={[styles.accentLine, { backgroundColor: colors.icon }]} />

            {/* Content */}
            <View style={styles.content}>
              {/* Header with Icon, Title, and Close Button */}
              <View style={styles.header}>
                <Ionicons name={icon as any} size={24} color={colors.icon} />
                <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Ionicons name="close" size={20} color={colors.icon} />
                </TouchableOpacity>
              </View>

              {/* Message */}
              <Text style={[styles.message, { color: colors.text }]}>{message}</Text>

              {/* Action Button */}
              {actionLabel && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.icon }]}
                  onPress={() => {
                    onAction?.();
                    onClose();
                  }}
                >
                  <Text style={styles.actionButtonText}>{actionLabel}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  alertWrapper: {
    width: '90%',
    maxWidth: 400,
  },
  alert: {
    borderRadius: 12,
    borderLeftWidth: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  accentLine: {
    height: 3,
    width: '100%',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 12,
    flex: 1,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
    lineHeight: 20,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});
