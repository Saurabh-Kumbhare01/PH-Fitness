import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useThemeStore } from '../../store/useThemeStore';
import { typography, spacing } from '../../theme';

interface BarDataPoint {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarDataPoint[];
  height?: number;
  barColor?: string;
  gradientTo?: string;
  valuePrefix?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 180,
  barColor,
  gradientTo,
  valuePrefix = '',
}) => {
  const { colors } = useThemeStore();
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - spacing.lg * 2 - 32;

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const barWidth = Math.min(32, (chartWidth - (data.length - 1) * 12) / data.length);
  const gap = (chartWidth - barWidth * data.length) / Math.max(1, data.length - 1);

  const primaryColor = barColor || colors.primary;
  const secondaryColor = gradientTo || colors.accent;

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={height}>
        <Defs>
          <LinearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={primaryColor} stopOpacity="1" />
            <Stop offset="100%" stopColor={secondaryColor} stopOpacity="0.6" />
          </LinearGradient>
        </Defs>

        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 45);
          const x = index * (barWidth + gap);
          const y = height - barHeight - 24;

          return (
            <React.Fragment key={`bar-${index}`}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={6}
                fill="url(#barGradient)"
              />
              {/* Value on top */}
              <SvgText
                x={x + barWidth / 2}
                y={y - 6}
                fontSize="10"
                fontWeight="600"
                fill={colors.textMuted}
                textAnchor="middle"
              >
                {`${valuePrefix}${item.value}`}
              </SvgText>

              {/* Label at bottom */}
              <SvgText
                x={x + barWidth / 2}
                y={height - 6}
                fontSize="11"
                fontWeight="500"
                fill={colors.textDim}
                textAnchor="middle"
              >
                {item.label}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
  },
});
