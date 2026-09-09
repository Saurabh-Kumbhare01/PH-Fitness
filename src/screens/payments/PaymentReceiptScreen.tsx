import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';
import { usePaymentStore } from '../../store/usePaymentStore';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatCurrency } from '../../utils/formatters';
import { spacing, typography, borderRadius } from '../../theme';

interface PaymentReceiptScreenProps {
  navigation: any;
  route: any;
}

export const PaymentReceiptScreen: React.FC<PaymentReceiptScreenProps> = ({
  navigation,
  route,
}) => {
  const { colors, gymSettings } = useThemeStore();
  const { transactions, selectedReceipt } = usePaymentStore();

  const transactionId = route.params?.transactionId;
  const payment =
    selectedReceipt ||
    transactions.find((t) => t.id === transactionId) ||
    transactions[0];

  if (!payment) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Invoice Receipt" showBack onBackPress={() => navigation.goBack()} />
        <View style={styles.centerBox}>
          <Text style={{ color: colors.text }}>Receipt not found.</Text>
        </View>
      </View>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Gym Fee Receipt: ${gymSettings.gymName}\nInvoice: ${payment.invoiceNumber}\nMember: ${payment.memberName}\nAmount Paid: ${formatCurrency(payment.amount)}\nDate: ${payment.date}\nThank you for working out with us!`,
      });
    } catch (e) {
      // Ignored
    }
  };

  const handlePrintPdf = () => {
    Alert.alert(
      'Print / Export PDF',
      `Digital receipt for invoice ${payment.invoiceNumber} rendered to PDF viewer simulation.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Payment Receipt"
        subtitle="Digital tax invoice preview"
        showBack
        onBackPress={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity
            style={[styles.shareBtn, { backgroundColor: colors.surfaceHighlight }]}
            onPress={handleShare}
          >
            <Ionicons name="share-social-outline" size={18} color={colors.text} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* PRINTABLE RECEIPT CARD */}
        <Card style={styles.receiptCard}>
          {/* Gym Header */}
          <View style={styles.receiptHeader}>
            <View style={[styles.gymLogoCircle, { backgroundColor: colors.primaryMuted }]}>
              <Ionicons name="barbell" size={26} color={colors.primary} />
            </View>
            <Text style={[styles.gymName, { color: colors.text }]}>{gymSettings.gymName}</Text>
            <Text style={[styles.gymAddress, { color: colors.textMuted }]}>
              {gymSettings.address}, {gymSettings.city}
            </Text>
            <Text style={[styles.gymGst, { color: colors.textDim }]}>
              GSTIN: {gymSettings.gstNumber} • Ph: {gymSettings.phone}
            </Text>
          </View>

          {/* Divider with jagged receipt edge look */}
          <View style={[styles.receiptDivider, { borderColor: colors.border }]} />

          {/* Invoice Meta */}
          <View style={styles.invoiceMetaRow}>
            <View>
              <Text style={[styles.metaLabel, { color: colors.textDim }]}>INVOICE NUMBER</Text>
              <Text style={[styles.metaVal, { color: colors.text }]}>{payment.invoiceNumber}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.metaLabel, { color: colors.textDim }]}>ISSUE DATE</Text>
              <Text style={[styles.metaVal, { color: colors.text }]}>{payment.date}</Text>
            </View>
          </View>

          {/* Billed To */}
          <View style={[styles.billedToCard, { backgroundColor: colors.surfaceHighlight }]}>
            <Text style={[styles.metaLabel, { color: colors.textDim }]}>BILLED TO</Text>
            <Text style={[styles.billedName, { color: colors.text }]}>{payment.memberName}</Text>
            <Text style={[styles.billedPhone, { color: colors.textMuted }]}>
              {payment.memberPhone || '+91 98765 43210'}
            </Text>
          </View>

          {/* Line Items */}
          <View style={styles.itemTable}>
            <View style={[styles.itemHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.itemHeaderTitle, { color: colors.textDim }]}>DESCRIPTION</Text>
              <Text style={[styles.itemHeaderTitle, { color: colors.textDim }]}>AMOUNT</Text>
            </View>

            <View style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemDesc, { color: colors.text }]}>{payment.description}</Text>
                <Text style={[styles.itemTaxNote, { color: colors.textDim }]}>
                  Includes 18% GST (CGST 9% + SGST 9%)
                </Text>
              </View>
              <Text style={[styles.itemAmount, { color: colors.text }]}>
                {formatCurrency(payment.originalAmount || payment.amount)}
              </Text>
            </View>

            {payment.discount > 0 && (
              <View style={styles.itemRow}>
                <Text style={[styles.itemDesc, { color: colors.success }]}>
                  Promotional Discount
                </Text>
                <Text style={[styles.itemAmount, { color: colors.success }]}>
                  - {formatCurrency(payment.discount)}
                </Text>
              </View>
            )}

            {/* Total Row */}
            <View style={[styles.grandTotalRow, { borderTopColor: colors.border }]}>
              <View>
                <Text style={[styles.totalWord, { color: colors.text }]}>TOTAL RECEIVED</Text>
                <Text style={[styles.totalMode, { color: colors.textDim }]}>
                  Via {payment.paymentMethod.toUpperCase()}
                </Text>
              </View>
              <Text style={[styles.totalNumber, { color: colors.primary }]}>
                {formatCurrency(payment.amount)}
              </Text>
            </View>
          </View>

          {/* Digital Signature & Paid Stamp */}
          <View style={styles.stampSection}>
            <View style={[styles.paidStamp, { borderColor: colors.primary }]}>
              <Text style={[styles.stampText, { color: colors.primary }]}>
                VERIFIED & PAID
              </Text>
              <Text style={[styles.stampSub, { color: colors.primary }]}>
                PH-FITNESS SECURE
              </Text>
            </View>

            {/* Simulated QR Code Graphic */}
            <View style={[styles.qrPlaceholder, { backgroundColor: colors.surfaceHighlight }]}>
              <Ionicons name="qr-code" size={48} color={colors.text} />
              <Text style={[styles.qrCaption, { color: colors.textDim }]}>Scan to verify</Text>
            </View>
          </View>

          <Text style={[styles.receiptFooterNote, { color: colors.textDim }]}>
            This is a computer-generated tax invoice and requires no physical signature. Terms &
            Conditions apply.
          </Text>
        </Card>

        {/* Actions */}
        <View style={styles.actionButtons}>
          <Button
            title="Download PDF"
            onPress={handlePrintPdf}
            icon="download-outline"
            variant="secondary"
            size="lg"
            style={{ flex: 1 }}
          />
          <Button
            title="Share via WhatsApp"
            onPress={handleShare}
            icon="share-social-outline"
            size="lg"
            style={{ flex: 1 }}
          />
        </View>
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
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptCard: {
    padding: spacing.xl,
  },
  receiptHeader: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  gymLogoCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  gymName: {
    ...typography.h3,
    textAlign: 'center',
  },
  gymAddress: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: 2,
  },
  gymGst: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: 2,
  },
  receiptDivider: {
    borderStyle: 'dashed',
    borderBottomWidth: 1.5,
    marginVertical: spacing.md,
  },
  invoiceMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  metaLabel: {
    ...typography.caption,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metaVal: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
  billedToCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  billedName: {
    ...typography.bodyMedium,
    fontWeight: '700',
  },
  billedPhone: {
    ...typography.caption,
    marginTop: 2,
  },
  itemTable: {
    marginVertical: spacing.sm,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    marginBottom: spacing.xs,
  },
  itemHeaderTitle: {
    ...typography.caption,
    fontWeight: '700',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  itemDesc: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
  itemTaxNote: {
    ...typography.caption,
    marginTop: 2,
  },
  itemAmount: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    marginTop: spacing.md,
    borderTopWidth: 1.5,
  },
  totalWord: {
    ...typography.bodyMedium,
    fontWeight: '700',
  },
  totalMode: {
    ...typography.caption,
  },
  totalNumber: {
    ...typography.h2,
    fontWeight: '800',
  },
  stampSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.lg,
  },
  paidStamp: {
    borderWidth: 2,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    transform: [{ rotate: '-8deg' }],
  },
  stampText: {
    ...typography.h4,
    fontWeight: '900',
    letterSpacing: 1,
  },
  stampSub: {
    ...typography.caption,
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
  },
  qrPlaceholder: {
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  qrCaption: {
    ...typography.caption,
    fontSize: 9,
    marginTop: 2,
  },
  receiptFooterNote: {
    ...typography.caption,
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
});
