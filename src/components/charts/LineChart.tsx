import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Text as SvgText, Defs, LinearGradient, Stop, Line } from 'react-native-svg';
import { useThemeStore } from '../../store/useThemeStore';
import { spacing } from '../../theme';

interface LineDataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: LineDataPoint[];
  height?: number;
  lineColor?: string;
  fillColor?: string;
  valuePrefix?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 180,
  lineColor,
  fillColor,
  valuePrefix = '₹',
}) => {
  const { colors } = useThemeStore();
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - spacing.lg * 2 - 32;

  const strokeColor = lineColor || colors.primary;
  const gradientFill = fillColor || colors.primary;

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const minValue = Math.min(...data.map((d) => d.value), 0);
  const paddingBottom = 30;
  const paddingTop = 20;
  const availableHeight = height - paddingTop - paddingBottom;

  const points = data.map((d, index) => {
    const x = (index / Math.max(1, data.length - 1)) * (chartWidth - 20) + 10;
    const y =
      height -
      paddingBottom -
      ((d.value - minValue) / Math.max(1, maxValue - minValue)) * availableHeight;
    return { x, y, ...d };
  });

  // Construct SVG path for line
  const linePath = points.reduce((acc, point, index) => {
    return `${acc} ${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
  }, '');

  // Construct SVG area under path
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${
    height - paddingBottom
  } L ${points[0].x} ${height - paddingBottom} Z`;

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={height}>
        <Defs>
          <LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={gradientFill} stopOpacity="0.35" />
            <Stop offset="100%" stopColor={gradientFill} stopOpacity="0.0" />
          </LinearGradient>
        </Defs>

        {/* Subtle grid lines */}
        {[0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = height - paddingBottom - ratio * availableHeight;
          return (
            <Line
              key={`grid-${i}`}
              x1={0}
              y1={y}
              x2={chartWidth}
              y2={y}
              stroke={colors.border}
              strokeDasharray="4 4"
              strokeWidth={0.8}
            />
          );
        })}

        {/* Fill Area */}
        <Path d={areaPath} fill="url(#areaGradient)" />

        {/* Line Curve */}
        <Path d={linePath} fill="none" stroke={strokeColor} strokeWidth={3} strokeLinecap="round" />

        {/* Data points and labels */}
        {points.map((p, i) => (
          <React.Fragment key={`point-${i}`}>
            <Circle cx={p.x} cy={p.y} r={4.5} fill={colors.card} stroke={strokeColor} strokeWidth={2.5} />

            {/* X-axis label */}
            <SvgText
              x={p.x}
              y={height - 8}
              fontSize="11"
              fontWeight="500"
              fill={colors.textDim}
              textAnchor="middle"
            >
              {p.label}
            </SvgText>
          </React.Fragment>
        ))}
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
