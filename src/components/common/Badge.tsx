import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { typography, borderRadius } from '../../theme';

export type BadgeVariant =
  | 'active'
  | 'expiring'
  | 'expired'
  | 'suspended'
  | 'present'
  | 'absent'
  | 'paid'
  | 'partial'
  | 'pending'
  | 'primary'
  | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'neutral', size = 'sm' }) => {
  const { colors } = useThemeStore();

  const getStyle = () => {
    switch (variant) {
      case 'active':
      case 'present':
      case 'paid':
        return {
          bg: colors.successMuted,
          text: colors.success,
        };
      case 'expiring':
      case 'partial':
        return {
          bg: colors.warningMuted,
          text: colors.warning,
        };
      case 'expired':
      case 'absent':
        return {
          bg: colors.dangerMuted,
          text: colors.danger,
        };
      case 'suspended':
      case 'neutral':
        return {
          bg: colors.surfaceHighlight,
          text: colors.textDim,
        };
      case 'primary':
        return {
          bg: colors.primaryMuted,
          text: colors.primary,
        };
      case 'pending':
        return {
          bg: 'rgba(234, 179, 8, 0.16)',
          text: '#EAB308',
        };
      default:
        return {
          bg: colors.surfaceHighlight,
          text: colors.textMuted,
        };
    }
  };

  const current = getStyle();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: current.bg,
          paddingVertical: size === 'sm' ? 3 : 5,
          paddingHorizontal: size === 'sm' ? 8 : 12,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: current.text,
            fontSize: size === 'sm' ? 10.5 : 12,
          },
        ]}
      >
        {label.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.caption,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
