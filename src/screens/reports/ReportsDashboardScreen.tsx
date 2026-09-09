import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { LineChart } from '../../components/charts/LineChart';
import { BarChart } from '../../components/charts/BarChart';
import { DonutChart } from '../../components/charts/DonutChart';
import { Button } from '../../components/common/Button';
import { formatCurrency } from '../../utils/formatters';
import {
  MOCK_FINANCIAL_REPORTS,
  MOCK_EXPENSE_BREAKDOWN,
  MOCK_MEMBER_DISTRIBUTION,
} from '../../mock/reports';
import { spacing, typography, borderRadius } from '../../theme';

interface ReportsDashboardScreenProps {
  navigation: any;
}

type Period = 'today' | 'week' | 'month' | 'year';

export const ReportsDashboardScreen: React.FC<ReportsDashboardScreenProps> = ({
  navigation,
}) => {
  const { colors } = useThemeStore();
  const [period, setPeriod] = useState<Period>('month');

  const handleExport = (format: 'pdf' | 'excel') => {
    Alert.alert(
      `Export ${format.toUpperCase()} Report`,
      `Financial and operations report for ${period.toUpperCase()} has been downloaded to local device storage.`,
      [{ text: 'OK' }]
    );
  };

  const revenueLineData = MOCK_FINANCIAL_REPORTS.map((r) => ({
    label: r.month,
    value: Math.round(r.revenue / 1000),
  }));

  const profitBarData = MOCK_FINANCIAL_REPORTS.map((r) => ({
    label: r.month,
    value: Math.round(r.netProfit / 1000),
  }));

  const periods: { label: string; val: Period }[] = [
    { label: 'Today', val: 'today' },
    { label: 'This Week', val: 'week' },
    { label: 'This Month', val: 'month' },
    { label: 'Yearly', val: 'year' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Reports & Analytics"
        subtitle="Financial statements & business intelligence"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Period Selector Tabs */}
        <View style={[styles.periodNav, { backgroundColor: colors.surfaceHighlight }]}>
          {periods.map((p) => {
            const isSelected = period === p.val;
            return (
              <TouchableOpacity
                key={p.val}
                onPress={() => setPeriod(p.val)}
                style={[
                  styles.periodTab,
                  isSelected && { backgroundColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.periodText,
                    { color: isSelected ? '#FFFFFF' : colors.textMuted },
                  ]}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Executive Summary Metrics */}
        <View style={styles.statsRow}>
          <StatCard
            title="Total Revenue"
            value="₹3,42,800"
            subtitle="+14.2% vs last mo"
            icon="trending-up"
            iconColor={colors.primary}
            iconBg={colors.primaryMuted}
            trend={{ value: '+14%', isPositive: true }}
          />
          <StatCard
            title="Total Expenses"
            value="₹1,50,000"
            subtitle="Rent, salaries & utilities"
            icon="receipt-outline"
            iconColor={colors.danger}
            iconBg={colors.dangerMuted}
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            title="Net Gym Profit"
            value="₹1,92,800"
            subtitle="56.2% Net Margin"
            icon="cash"
            iconColor={colors.success}
            iconBg={colors.successMuted}
            trend={{ value: '+18%', isPositive: true }}
          />
          <StatCard
            title="New Signups"
            value="28"
            subtitle="Renewal Rate: 84%"
            icon="person-add-outline"
            iconColor={colors.accent}
            iconBg={colors.accentMuted}
          />
        </View>

        {/* Revenue Growth Trend */}
        <Card style={styles.chartCard}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Revenue Growth (₹ in '000s)</Text>
          <Text style={[styles.cardSub, { color: colors.textMuted }]}>
            Monthly gross collections over last 6 months
          </Text>
          <LineChart data={revenueLineData} height={190} />
        </Card>

        {/* Net Profit BarChart */}
        <Card style={styles.chartCard}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Net Operating Profit (₹ in '000s)</Text>
          <Text style={[styles.cardSub, { color: colors.textMuted }]}>
            After operational costs & staff payroll
          </Text>
          <BarChart data={profitBarData} height={180} barColor={colors.success} />
        </Card>

        {/* Member Status Ratio Donut Chart */}
        <Card>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Active vs Inactive Members</Text>
          <DonutChart data={MOCK_MEMBER_DISTRIBUTION} centerValue="136" centerLabel="Enrolled" />
        </Card>

        {/* Expense Category Breakdown */}
        <Card>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Monthly Expense Breakdown</Text>
          <View style={styles.expenseList}>
            {MOCK_EXPENSE_BREAKDOWN.map((exp, index) => (
              <View key={`exp-${index}`} style={styles.expenseItem}>
                <View style={styles.expenseRow}>
                  <Text style={[styles.expenseName, { color: colors.text }]}>{exp.category}</Text>
                  <Text style={[styles.expenseAmount, { color: colors.text }]}>
                    {formatCurrency(exp.amount)} ({exp.percentage}%)
                  </Text>
                </View>
                <View style={[styles.track, { backgroundColor: colors.inputBackground }]}>
                  <View
                    style={[
                      styles.fill,
                      { width: `${exp.percentage}%`, backgroundColor: colors.primary },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Export Report Actions */}
        <Card style={styles.exportCard}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Export Financial Statements</Text>
          <Text style={[styles.cardSub, { color: colors.textMuted }]}>
            Generate compliant accounting sheets with GST and audit logs.
          </Text>

          <View style={styles.exportBtnRow}>
            <Button
              title="Export as PDF"
              onPress={() => handleExport('pdf')}
              icon="document-text-outline"
              size="md"
              style={{ flex: 1 }}
            />
            <Button
              title="Export as Excel"
              onPress={() => handleExport('excel')}
              icon="grid-outline"
              variant="secondary"
              size="md"
              style={{ flex: 1 }}
            />
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  periodNav: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    padding: 4,
    marginBottom: spacing.lg,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  periodText: {
    ...typography.caption,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  chartCard: {
    padding: spacing.md,
    marginVertical: spacing.sm,
  },
  cardTitle: {
    ...typography.h4,
  },
  cardSub: {
    ...typography.caption,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  expenseList: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  expenseItem: {},
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  expenseName: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  expenseAmount: {
    ...typography.caption,
    fontWeight: '700',
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  exportCard: {
    marginVertical: spacing.md,
    marginBottom: spacing.xxxl,
    padding: spacing.lg,
  },
  exportBtnRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
});
