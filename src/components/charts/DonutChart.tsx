import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import { useThemeStore } from '../../store/useThemeStore';
import { typography, spacing } from '../../theme';

interface Segment {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

interface DonutChartProps {
  data: Segment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 160,
  strokeWidth = 20,
  centerLabel = 'Members',
  centerValue = '136',
}) => {
  const { colors } = useThemeStore();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeAngle = 0;

  return (
    <View style={styles.container}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            {/* Background ring */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.surfaceHighlight}
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Segments */}
            {data.map((item, index) => {
              const strokeDashoffset = circumference - (item.percentage / 100) * circumference;
              const rotation = (cumulativeAngle / 100) * 360;
              cumulativeAngle += item.percentage;

              return (
                <Circle
                  key={`donut-${index}`}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  origin={`${size / 2}, ${size / 2}`}
                  rotation={rotation}
                />
              );
            })}
          </G>
        </Svg>

        {/* Center Text */}
        <View style={styles.centerTextContainer}>
          <Text style={[styles.centerValue, { color: colors.text }]}>{centerValue}</Text>
          <Text style={[styles.centerLabel, { color: colors.textMuted }]}>{centerLabel}</Text>
        </View>
      </View>

      {/* Legend list */}
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={`legend-${index}`} style={styles.legendItem}>
            <View style={[styles.legendIndicator, { backgroundColor: item.color }]} />
            <Text style={[styles.legendLabel, { color: colors.textMuted }]}>
              {item.label}
            </Text>
            <Text style={[styles.legendCount, { color: colors.text }]}>
              {item.count} ({item.percentage}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  centerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerValue: {
    ...typography.h2,
    fontWeight: '700',
  },
  centerLabel: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  legendContainer: {
    width: '100%',
    marginTop: spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  legendIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
  },
  legendLabel: {
    ...typography.bodySmall,
    flex: 1,
  },
  legendCount: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
});
