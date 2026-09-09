import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';
import { useMemberStore } from '../../store/useMemberStore';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { MOCK_PLANS } from '../../mock/memberships';
import { MembershipPlan } from '../../types';
import { spacing, typography, borderRadius } from '../../theme';

interface MembershipPlansScreenProps {
  navigation: any;
}

export const MembershipPlansScreen: React.FC<MembershipPlansScreenProps> = ({ navigation }) => {
  const { colors } = useThemeStore();
  const { members, renewMember } = useMemberStore();

  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [renewalModalVisible, setRenewalModalVisible] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');

  const getSubscriberCount = (planId: string) => {
    return members.filter((m) => m.planId === planId).length;
  };

  const handleOpenRenew = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    setRenewalModalVisible(true);
  };

  const handleExecuteRenewal = async () => {
    if (!selectedMemberId || !selectedPlan) {
      Alert.alert('Selection Required', 'Please select a member to renew.');
      return;
    }
    const member = members.find((m) => m.id === selectedMemberId);
    if (!member) return;

    await renewMember(member.id, selectedPlan.id, selectedPlan.name, selectedPlan.durationDays);
    setRenewalModalVisible(false);
    setSelectedMemberId('');
    Alert.alert('Renewal Successful', `${member.fullName} has been renewed under ${selectedPlan.name}.`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Membership Plans"
        subtitle="Tier packages, pricing & subscriber counts"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <Card style={[styles.bannerCard, { backgroundColor: colors.surfaceHighlight }]}>
          <View style={styles.bannerRow}>
            <Ionicons name="ribbon" size={28} color={colors.primary} />
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={[styles.bannerTitle, { color: colors.text }]}>6 Active Membership Tiers</Text>
              <Text style={[styles.bannerSub, { color: colors.textMuted }]}>
                Easily renew or switch plans for enrolled gym athletes.
              </Text>
            </View>
          </View>
        </Card>

        {/* Plan Cards */}
        {MOCK_PLANS.map((plan) => {
          const subscribers = getSubscriberCount(plan.id);

          return (
            <Card
              key={plan.id}
              style={[
                styles.planCard,
                plan.isPopular && { borderColor: colors.primary, borderWidth: 1.8 },
              ]}
            >
              {plan.isPopular && (
                <View style={[styles.popularBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.popularText}>MOST POPULAR</Text>
                </View>
              )}

              <View style={styles.planHeader}>
                <View>
                  <Text style={[styles.planName, { color: colors.text }]}>{plan.name}</Text>
                  <Text style={[styles.planDuration, { color: colors.textMuted }]}>
                    {plan.durationDays} Days Duration ({plan.durationType})
                  </Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.planPrice, { color: colors.primary }]}>₹{plan.price}</Text>
                  {plan.discountPercentage ? (
                    <Badge label={`${plan.discountPercentage}% OFF`} variant="expiring" />
                  ) : null}
                </View>
              </View>

              <Text style={[styles.planDesc, { color: colors.textDim }]}>{plan.description}</Text>

              {/* Feature Checklist */}
              <View style={styles.featureList}>
                {plan.features.map((feat, index) => (
                  <View key={`feat-${index}`} style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                    <Text style={[styles.featureText, { color: colors.textMuted }]}>{feat}</Text>
                  </View>
                ))}
              </View>

              {/* Footer */}
              <View style={[styles.planFooter, { borderTopColor: colors.border }]}>
                <View style={styles.subscriberBox}>
                  <Ionicons name="people" size={16} color={colors.textMuted} />
                  <Text style={[styles.subText, { color: colors.text }]}>
                    {subscribers} Active Subscribers
                  </Text>
                </View>

                <Button
                  title="Assign / Renew"
                  onPress={() => handleOpenRenew(plan)}
                  size="sm"
                  variant="primary"
                />
              </View>
            </Card>
          );
        })}
      </ScrollView>

      {/* RENEWAL / ASSIGN MODAL */}
      <Modal visible={renewalModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Renew with {selectedPlan?.name}
              </Text>
              <TouchableOpacity onPress={() => setRenewalModalVisible(false)}>
                <Ionicons name="close-circle-outline" size={24} color={colors.textDim} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalSubtitle, { color: colors.textMuted }]}>
              Select the member to assign this {selectedPlan?.durationDays}-day subscription:
            </Text>

            <ScrollView style={{ maxHeight: 240, marginVertical: spacing.md }}>
              {members.map((m) => {
                const isSelected = selectedMemberId === m.id;
                return (
                  <TouchableOpacity
                    key={m.id}
                    onPress={() => setSelectedMemberId(m.id)}
                    style={[
                      styles.memberSelectOption,
                      {
                        backgroundColor: isSelected ? colors.primaryMuted : colors.inputBackground,
                        borderColor: isSelected ? colors.primary : colors.inputBorder,
                      },
                    ]}
                  >
                    <Text style={[styles.memberSelectName, { color: colors.text }]}>
                      {m.fullName}
                    </Text>
                    <Badge label={m.membershipStatus} variant={m.membershipStatus as any} />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Button
              title="Confirm Plan Renewal"
              onPress={handleExecuteRenewal}
              size="lg"
              style={{ marginTop: spacing.sm }}
            />
          </View>
        </View>
      </Modal>
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
  bannerCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerTitle: {
    ...typography.h4,
  },
  bannerSub: {
    ...typography.caption,
    marginTop: 2,
  },
  planCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 18,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  popularText: {
    ...typography.caption,
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planName: {
    ...typography.h3,
  },
  planDuration: {
    ...typography.caption,
    marginTop: 2,
  },
  planPrice: {
    ...typography.h2,
    fontWeight: '800',
  },
  planDesc: {
    ...typography.bodySmall,
    marginVertical: spacing.md,
    lineHeight: 18,
  },
  featureList: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    ...typography.bodySmall,
  },
  planFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
  subscriberBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subText: {
    ...typography.caption,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modalBox: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    ...typography.h3,
  },
  modalSubtitle: {
    ...typography.bodySmall,
    marginTop: 4,
  },
  memberSelectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.xs,
  },
  memberSelectName: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
});
