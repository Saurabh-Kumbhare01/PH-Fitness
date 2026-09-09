import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';
import { borderRadius, spacing, typography } from '../../theme';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBg?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconColor,
  iconBg,
  trend,
  onPress,
  style,
}) => {
  const { colors } = useThemeStore();

  const cardContent = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
        style,
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: iconBg || colors.primaryMuted,
            },
          ]}
        >
          <Ionicons name={icon} size={20} color={iconColor || colors.primary} />
        </View>

        {trend && (
          <View
            style={[
              styles.trendBadge,
              {
                backgroundColor: trend.isPositive
                  ? colors.successMuted
                  : colors.dangerMuted,
              },
            ]}
          >
            <Ionicons
              name={trend.isPositive ? 'trending-up' : 'trending-down'}
              size={12}
              color={trend.isPositive ? colors.success : colors.danger}
              style={{ marginRight: 2 }}
            />
            <Text
              style={[
                styles.trendText,
                { color: trend.isPositive ? colors.success : colors.danger },
              ]}
            >
              {trend.value}
            </Text>
          </View>
        )}
      </View>

      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.title, { color: colors.textMuted }]}>{title}</Text>

      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textDim }]}>{subtitle}</Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.75} onPress={onPress}>
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.md,
    flex: 1,
    minWidth: 140,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  trendText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '700',
  },
  value: {
    ...typography.statValue,
    marginBottom: 2,
  },
  title: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  subtitle: {
    ...typography.caption,
    marginTop: 4,
  },
});
