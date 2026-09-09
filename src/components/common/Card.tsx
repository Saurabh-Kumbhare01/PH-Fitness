import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { borderRadius, spacing } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  highlight?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, onPress, highlight }) => {
  const { colors } = useThemeStore();

  const cardContent = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: highlight ? colors.surfaceHighlight : colors.card,
          borderColor: colors.cardBorder,
        },
        style,
      ]}
    >
      {children}
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
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
});
