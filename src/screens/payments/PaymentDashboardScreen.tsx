import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';
import { usePaymentStore } from '../../store/usePaymentStore';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatCurrency } from '../../utils/formatters';
import { PaymentTransaction } from '../../types';
import { spacing, typography, borderRadius } from '../../theme';

interface PaymentDashboardScreenProps {
  navigation: any;
  route: any;
}

export const PaymentDashboardScreen: React.FC<PaymentDashboardScreenProps> = ({
  navigation,
  route,
}) => {
  const { colors } = useThemeStore();
  const { transactions, metrics, fetchPayments, setSelectedReceipt } = usePaymentStore();

  const [refreshing, setRefreshing] = useState(false);
  const [filterTab, setFilterTab] = useState<string>('all');

  useEffect(() => {
    fetchPayments(filterTab === 'all' ? undefined : filterTab);
  }, [filterTab]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPayments(filterTab === 'all' ? undefined : filterTab);
    setRefreshing(false);
  };

  const handleOpenReceipt = (tx: PaymentTransaction) => {
    setSelectedReceipt(tx);
    navigation.navigate('PaymentReceipt', { transactionId: tx.id });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Payments & Billing"
        subtitle="Revenue tracking, receipts, and dues"
        rightAction={
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('CollectPayment')}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.addBtnText}>Collect</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* KPI Grid */}
        <View style={styles.statsRow}>
          <StatCard
            title="Today's Collection"
            value={formatCurrency(metrics.todayCollection)}
            subtitle="Cash + UPI + Card"
            icon="wallet"
            iconColor={colors.success}
            iconBg={colors.successMuted}
          />
          <StatCard
            title="Monthly Revenue"
            value={formatCurrency(metrics.monthlyTotal)}
            subtitle="September 2025"
            icon="cash-outline"
            iconColor={colors.primary}
            iconBg={colors.primaryMuted}
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            title="Pending Payments"
            value={formatCurrency(metrics.pendingTotal)}
            subtitle="Unpaid dues"
            icon="alert-circle-outline"
            iconColor={colors.danger}
            iconBg={colors.dangerMuted}
          />
          <StatCard
            title="Partial Balances"
            value={formatCurrency(metrics.partialTotal)}
            subtitle="Instalment plans"
            icon="time-outline"
            iconColor={colors.warning}
            iconBg={colors.warningMuted}
          />
        </View>

        {/* Payment Methods Breakdown */}
        <Card>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Payment Method Share</Text>
          <View style={styles.methodGrid}>
            <View style={[styles.methodItem, { backgroundColor: colors.surfaceHighlight }]}>
              <Ionicons name="qr-code" size={20} color={colors.accent} />
              <Text style={[styles.methodVal, { color: colors.text }]}>
                {metrics.methodBreakdown.upi}
              </Text>
              <Text style={[styles.methodLbl, { color: colors.textDim }]}>UPI / QR</Text>
            </View>

            <View style={[styles.methodItem, { backgroundColor: colors.surfaceHighlight }]}>
              <Ionicons name="card-outline" size={20} color={colors.secondary} />
              <Text style={[styles.methodVal, { color: colors.text }]}>
                {metrics.methodBreakdown.card}
              </Text>
              <Text style={[styles.methodLbl, { color: colors.textDim }]}>POS Card</Text>
            </View>

            <View style={[styles.methodItem, { backgroundColor: colors.surfaceHighlight }]}>
              <Ionicons name="cash-outline" size={20} color={colors.success} />
              <Text style={[styles.methodVal, { color: colors.text }]}>
                {metrics.methodBreakdown.cash}
              </Text>
              <Text style={[styles.methodLbl, { color: colors.textDim }]}>Cash</Text>
            </View>

            <View style={[styles.methodItem, { backgroundColor: colors.surfaceHighlight }]}>
              <Ionicons name="business-outline" size={20} color={colors.warning} />
              <Text style={[styles.methodVal, { color: colors.text }]}>
                {metrics.methodBreakdown.bank_transfer}
              </Text>
              <Text style={[styles.methodLbl, { color: colors.textDim }]}>Net Banking</Text>
            </View>
          </View>
        </Card>

        {/* Transaction History Header & Filter Pills */}
        <View style={styles.transHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Transactions</Text>

          <View style={[styles.tabGroup, { backgroundColor: colors.surfaceHighlight }]}>
            {(['all', 'paid', 'pending', 'partial'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setFilterTab(tab)}
                style={[
                  styles.tabBtn,
                  filterTab === tab && { backgroundColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: filterTab === tab ? '#FFFFFF' : colors.textMuted },
                  ]}
                >
                  {tab.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Transaction List */}
        {transactions.map((tx) => (
          <TouchableOpacity
            key={tx.id}
            onPress={() => handleOpenReceipt(tx)}
            activeOpacity={0.8}
          >
            <Card style={styles.txCard}>
              <View style={styles.txRow}>
                <View
                  style={[
                    styles.txIconBox,
                    {
                      backgroundColor:
                        tx.paymentMethod === 'upi'
                          ? colors.accentMuted
                          : tx.paymentMethod === 'card'
                          ? colors.secondaryMuted
                          : colors.successMuted,
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      tx.paymentMethod === 'upi'
                        ? 'qr-code'
                        : tx.paymentMethod === 'card'
                        ? 'card'
                        : 'cash'
                    }
                    size={20}
                    color={
                      tx.paymentMethod === 'upi'
                        ? colors.accent
                        : tx.paymentMethod === 'card'
                        ? colors.secondary
                        : colors.success
                    }
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.txName, { color: colors.text }]}>{tx.memberName}</Text>
                  <Text style={[styles.txDesc, { color: colors.textMuted }]} numberOfLines={1}>
                    {tx.description}
                  </Text>
                  <Text style={[styles.txMeta, { color: colors.textDim }]}>
                    {tx.invoiceNumber} • {tx.date}
                  </Text>
                </View>

                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Text style={[styles.txAmount, { color: colors.text }]}>
                    {formatCurrency(tx.amount)}
                  </Text>
                  <Badge label={tx.paymentStatus} variant={tx.paymentStatus as any} />
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  addBtnText: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    ...typography.h4,
    marginBottom: spacing.md,
  },
  methodGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  methodItem: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  methodVal: {
    ...typography.h4,
    marginTop: spacing.xs,
    fontWeight: '700',
  },
  methodLbl: {
    ...typography.caption,
    marginTop: 2,
  },
  transHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
  },
  tabGroup: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    padding: 2,
  },
  tabBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  tabText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '700',
  },
  txCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  txIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txName: {
    ...typography.bodyMedium,
    fontWeight: '700',
  },
  txDesc: {
    ...typography.caption,
    marginTop: 1,
  },
  txMeta: {
    ...typography.caption,
    marginTop: 2,
    fontSize: 10,
  },
  txAmount: {
    ...typography.bodyLarge,
    fontWeight: '800',
  },
});
