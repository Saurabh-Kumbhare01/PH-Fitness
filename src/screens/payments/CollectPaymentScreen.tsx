import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';
import { useMemberStore } from '../../store/useMemberStore';
import { usePaymentStore } from '../../store/usePaymentStore';
import { Header } from '../../components/common/Header';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { PAYMENT_METHODS } from '../../constants';
import { PaymentMethod, PaymentStatus } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { spacing, typography, borderRadius } from '../../theme';

interface CollectPaymentScreenProps {
  navigation: any;
  route: any;
}

export const CollectPaymentScreen: React.FC<CollectPaymentScreenProps> = ({
  navigation,
  route,
}) => {
  const { colors } = useThemeStore();
  const { members } = useMemberStore();
  const { collectPayment } = usePaymentStore();

  const preselectedId = route.params?.memberId;
  const [selectedMemberId, setSelectedMemberId] = useState(
    preselectedId || (members[0] ? members[0].id : '')
  );

  const [amountStr, setAmountStr] = useState('7499');
  const [discountStr, setDiscountStr] = useState('500');
  const [method, setMethod] = useState<PaymentMethod>('upi');
  const [status, setStatus] = useState<PaymentStatus>('paid');
  const [description, setDescription] = useState('Quarterly Power Membership Plan');
  const [notes, setNotes] = useState('Paid via UPI QR code scan at front desk');
  const [loading, setLoading] = useState(false);

  const baseAmount = parseFloat(amountStr) || 0;
  const discount = parseFloat(discountStr) || 0;
  const taxableAmount = Math.max(0, baseAmount - discount);
  const taxAmount = Math.round(taxableAmount * 0.18);
  const finalTotal = taxableAmount;

  const handleCollect = async () => {
    if (!selectedMemberId) {
      Alert.alert('Required', 'Please select a member.');
      return;
    }
    if (finalTotal <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    const member = members.find((m) => m.id === selectedMemberId);
    if (!member) return;

    setLoading(true);
    const tx = await collectPayment({
      memberId: member.id,
      memberName: member.fullName,
      memberPhone: member.phone,
      amount: finalTotal,
      originalAmount: baseAmount,
      discount,
      taxAmount,
      paymentMethod: method,
      paymentStatus: status,
      description,
      notes,
    });
    setLoading(false);

    // Navigate to receipt preview
    navigation.replace('PaymentReceipt', { transactionId: tx.id });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Collect Payment"
        subtitle="Generate digital invoice & receipt"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Member Picker */}
          <Card>
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>SELECT MEMBER</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.memberScroll}>
              {members.map((m) => {
                const isSelected = selectedMemberId === m.id;
                return (
                  <TouchableOpacity
                    key={m.id}
                    onPress={() => {
                      setSelectedMemberId(m.id);
                      setDescription(`${m.planName} Membership Subscription`);
                    }}
                    style={[
                      styles.memberChip,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.inputBackground,
                        borderColor: isSelected ? colors.primary : colors.inputBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.memberChipText,
                        { color: isSelected ? '#FFFFFF' : colors.text },
                      ]}
                    >
                      {m.fullName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Card>

          {/* Amount and Billing Form */}
          <Card>
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>PAYMENT DETAILS</Text>

            <Input
              label="Plan / Item Description"
              placeholder="e.g. Annual VIP Plan"
              value={description}
              onChangeText={setDescription}
              leftIcon="receipt-outline"
            />

            <View style={styles.twoCol}>
              <Input
                label="Base Amount (₹)"
                placeholder="7499"
                value={amountStr}
                onChangeText={setAmountStr}
                keyboardType="numeric"
                containerStyle={{ flex: 1 }}
              />
              <Input
                label="Discount (₹)"
                placeholder="0"
                value={discountStr}
                onChangeText={setDiscountStr}
                keyboardType="numeric"
                containerStyle={{ flex: 1 }}
              />
            </View>

            {/* Payment Method Selector */}
            <Text style={[styles.sectionLabel, { color: colors.textMuted, marginTop: spacing.sm }]}>
              PAYMENT METHOD
            </Text>
            <View style={styles.methodGrid}>
              {PAYMENT_METHODS.map((pm) => {
                const isSelected = method === pm.value;
                return (
                  <TouchableOpacity
                    key={pm.value}
                    onPress={() => setMethod(pm.value)}
                    style={[
                      styles.methodCard,
                      {
                        backgroundColor: isSelected ? colors.primaryMuted : colors.inputBackground,
                        borderColor: isSelected ? colors.primary : colors.inputBorder,
                      },
                    ]}
                  >
                    <Ionicons
                      name={pm.icon as any}
                      size={20}
                      color={isSelected ? colors.primary : colors.textDim}
                    />
                    <Text
                      style={[
                        styles.methodLabel,
                        { color: isSelected ? colors.primary : colors.text },
                      ]}
                    >
                      {pm.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Payment Status Selector */}
            <Text style={[styles.sectionLabel, { color: colors.textMuted, marginTop: spacing.md }]}>
              SET STATUS
            </Text>
            <View style={styles.statusRow}>
              {(['paid', 'partial', 'pending'] as const).map((s) => {
                const isSelected = status === s;
                return (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setStatus(s)}
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.inputBackground,
                        borderColor: isSelected ? colors.primary : colors.inputBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        { color: isSelected ? '#FFFFFF' : colors.textMuted },
                      ]}
                    >
                      {s.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Input
              label="Transaction Notes / Reference"
              placeholder="e.g. GPay UPI Ref 524901923"
              value={notes}
              onChangeText={setNotes}
              containerStyle={{ marginTop: spacing.md }}
            />
          </Card>

          {/* Invoice Summary Box */}
          <Card style={[styles.summaryCard, { backgroundColor: colors.surfaceHighlight }]}>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Summary Breakdown</Text>
            <View style={styles.summaryRow}>
              <Text style={{ color: colors.textMuted }}>Gross Amount</Text>
              <Text style={{ color: colors.text }}>{formatCurrency(baseAmount)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={{ color: colors.textMuted }}>Discount Applied</Text>
              <Text style={{ color: colors.success }}>- {formatCurrency(discount)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={{ color: colors.textMuted }}>Estimated GST (18% incl.)</Text>
              <Text style={{ color: colors.text }}>{formatCurrency(taxAmount)}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>Net Payable</Text>
              <Text style={[styles.totalValue, { color: colors.primary }]}>
                {formatCurrency(finalTotal)}
              </Text>
            </View>
          </Card>

          <Button
            title={`Collect ${formatCurrency(finalTotal)} & Issue Receipt`}
            onPress={handleCollect}
            loading={loading}
            size="lg"
            icon="receipt-outline"
            iconRight
            style={{ marginVertical: spacing.xl }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
  sectionLabel: {
    ...typography.caption,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  memberScroll: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  memberChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  memberChipText: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  twoCol: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  methodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  methodCard: {
    width: '48%',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  methodLabel: {
    ...typography.caption,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statusPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  statusPillText: {
    ...typography.caption,
    fontWeight: '700',
  },
  summaryCard: {
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  summaryTitle: {
    ...typography.h4,
    marginBottom: spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  divider: {
    height: 1,
    marginVertical: spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  totalLabel: {
    ...typography.bodyLarge,
    fontWeight: '700',
  },
  totalValue: {
    ...typography.h2,
    fontWeight: '800',
  },
});
