import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';
import { useMemberStore } from '../../store/useMemberStore';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { usePaymentStore } from '../../store/usePaymentStore';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatDate, getRemainingDays, getBmiCategory } from '../../utils/formatters';
import { spacing, typography, borderRadius } from '../../theme';

interface MemberDetailScreenProps {
  navigation: any;
  route: any;
}

export const MemberDetailScreen: React.FC<MemberDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { colors } = useThemeStore();
  const { members, deleteMember, suspendMember, renewMember } = useMemberStore();
  const { logs, markAttendance } = useAttendanceStore();
  const { transactions } = usePaymentStore();

  const memberId = route.params?.memberId;
  const member = members.find((m) => m.id === memberId);

  const [activeTab, setActiveTab] = useState<'overview' | 'membership' | 'attendance' | 'payments'>('overview');

  if (!member) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Member Details" showBack onBackPress={() => navigation.goBack()} />
        <View style={styles.centerBox}>
          <Text style={{ color: colors.text }}>Member not found</Text>
        </View>
      </View>
    );
  }

  const daysLeft = getRemainingDays(member.membershipEndDate);
  const bmiCategory = getBmiCategory(member.bmi);
  const memberAttendance = logs.filter((l) => l.memberId === member.id);
  const memberPayments = transactions.filter((t) => t.memberId === member.id);

  const handleDelete = () => {
    Alert.alert(
      'Delete Member',
      `Are you sure you want to delete ${member.fullName}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteMember(member.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleSuspend = () => {
    Alert.alert(
      'Suspend Membership',
      `Are you sure you want to suspend ${member.fullName}'s membership?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Suspend',
          onPress: async () => {
            await suspendMember(member.id);
          },
        },
      ]
    );
  };

  const handleQuickAttendance = async () => {
    await markAttendance(member.id, member.fullName, member.photo, 'manual');
    Alert.alert('Attendance Marked', `Checked in ${member.fullName} successfully.`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Member Profile"
        showBack
        onBackPress={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity
            onPress={() => navigation.navigate('AddEditMember', { memberId: member.id })}
            style={[styles.editIconBtn, { backgroundColor: colors.surfaceHighlight }]}
          >
            <Ionicons name="create-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Image
              source={{
                uri:
                  member.photo ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
              }}
              style={styles.avatarLarge}
            />
            <View style={{ flex: 1 }}>
              <View style={styles.nameBadgeRow}>
                <Text style={[styles.profileName, { color: colors.text }]}>{member.fullName}</Text>
              </View>
              <Badge label={member.membershipStatus} variant={member.membershipStatus as any} />
              <Text style={[styles.profileMeta, { color: colors.textMuted, marginTop: 4 }]}>
                Enrolled: {formatDate(member.joinDate)}
              </Text>
              <Text style={[styles.profileMeta, { color: colors.textDim }]}>
                Last Visit: {member.lastVisit || 'Today, 08:30 AM'}
              </Text>
            </View>
          </View>

          {/* Quick Action Shortcuts */}
          <View style={[styles.quickBar, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => Linking.openURL(`tel:${member.phone}`)}
            >
              <View style={[styles.quickIconCircle, { backgroundColor: colors.primaryMuted }]}>
                <Ionicons name="call" size={16} color={colors.primary} />
              </View>
              <Text style={[styles.quickActionLabel, { color: colors.text }]}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => Linking.openURL(`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`)}
            >
              <View style={[styles.quickIconCircle, { backgroundColor: 'rgba(37, 211, 102, 0.16)' }]}>
                <Ionicons name="logo-whatsapp" size={16} color="#25D366" />
              </View>
              <Text style={[styles.quickActionLabel, { color: colors.text }]}>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionItem} onPress={handleQuickAttendance}>
              <View style={[styles.quickIconCircle, { backgroundColor: colors.accentMuted }]}>
                <Ionicons name="checkmark-circle" size={16} color={colors.accent} />
              </View>
              <Text style={[styles.quickActionLabel, { color: colors.text }]}>Check-In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() =>
                navigation.navigate('Payments', {
                  screen: 'CollectPayment',
                  params: { memberId: member.id },
                })
              }
            >
              <View style={[styles.quickIconCircle, { backgroundColor: colors.secondaryMuted }]}>
                <Ionicons name="card" size={16} color={colors.secondary} />
              </View>
              <Text style={[styles.quickActionLabel, { color: colors.text }]}>Pay</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Segmented Tab Navigation */}
        <View style={[styles.tabsNav, { backgroundColor: colors.surfaceHighlight }]}>
          {(['overview', 'membership', 'attendance', 'payments'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tabItem,
                activeTab === tab && { backgroundColor: colors.primary },
              ]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  { color: activeTab === tab ? '#FFFFFF' : colors.textMuted },
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* TAB CONTENT */}
        {activeTab === 'overview' && (
          <View>
            {/* Fitness & Physical Card */}
            <Card>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Physical & Health Metrics</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={[styles.statVal, { color: colors.text }]}>{member.heightCm} cm</Text>
                  <Text style={[styles.statLbl, { color: colors.textMuted }]}>Height</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={[styles.statVal, { color: colors.text }]}>{member.weightKg} kg</Text>
                  <Text style={[styles.statLbl, { color: colors.textMuted }]}>Weight</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={[styles.statVal, { color: colors.text }]}>{member.bmi}</Text>
                  <Text style={[styles.statLbl, { color: bmiCategory.color }]}>
                    {bmiCategory.label}
                  </Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={[styles.statVal, { color: colors.text }]}>{member.bloodGroup}</Text>
                  <Text style={[styles.statLbl, { color: colors.textMuted }]}>Blood Group</Text>
                </View>
              </View>

              {member.medicalConditions ? (
                <View style={[styles.notesBox, { backgroundColor: colors.surfaceHighlight, marginTop: spacing.md }]}>
                  <Ionicons name="warning-outline" size={16} color={colors.warning} />
                  <Text style={[styles.notesText, { color: colors.text }]}>
                    {member.medicalConditions}
                  </Text>
                </View>
              ) : null}
            </Card>

            {/* Emergency Contact */}
            <Card>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Emergency Contact</Text>
              <View style={styles.contactRow}>
                <Ionicons name="people-outline" size={18} color={colors.primary} />
                <View style={{ flex: 1, marginLeft: spacing.sm }}>
                  <Text style={[styles.contactName, { color: colors.text }]}>
                    {member.emergencyContact.name} ({member.emergencyContact.relationship})
                  </Text>
                  <Text style={[styles.contactPhone, { color: colors.textMuted }]}>
                    {member.emergencyContact.phone}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${member.emergencyContact.phone}`)}
                  style={[styles.smallBtn, { backgroundColor: colors.primaryMuted }]}
                >
                  <Ionicons name="call" size={14} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </Card>

            {/* Personal Notes */}
            <Card>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Personal Goals & Notes</Text>
              <Text style={[styles.notesBody, { color: colors.textMuted }]}>
                {member.notes || 'No special notes logged for this member.'}
              </Text>
            </Card>
          </View>
        )}

        {activeTab === 'membership' && (
          <Card>
            <View style={styles.planHeader}>
              <View>
                <Text style={[styles.planNameTitle, { color: colors.text }]}>{member.planName}</Text>
                <Text style={[styles.planSub, { color: colors.textMuted }]}>
                  {formatDate(member.membershipStartDate)} to {formatDate(member.membershipEndDate)}
                </Text>
              </View>
              <Badge label={member.membershipStatus} variant={member.membershipStatus as any} />
            </View>

            {/* Remaining Days Box */}
            <View style={[styles.remainingCard, { backgroundColor: colors.surfaceHighlight }]}>
              <View style={styles.daysRow}>
                <Text style={[styles.daysNum, { color: colors.primary }]}>{daysLeft}</Text>
                <Text style={[styles.daysText, { color: colors.text }]}>
                  Days Remaining in Subscription
                </Text>
              </View>
              <View style={[styles.progressBar, { backgroundColor: colors.inputBorder }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(100, (daysLeft / 90) * 100)}%`,
                      backgroundColor: colors.primary,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.assignedTrainerRow}>
              <Ionicons name="fitness" size={20} color={colors.secondary} />
              <View style={{ flex: 1, marginLeft: spacing.sm }}>
                <Text style={[styles.trainerLabel, { color: colors.textDim }]}>
                  Assigned Personal Trainer
                </Text>
                <Text style={[styles.trainerVal, { color: colors.text }]}>
                  {member.assignedTrainerName || 'None'}
                </Text>
              </View>
            </View>

            <Button
              title="Renew Subscription"
              onPress={() => renewMember(member.id, member.planId, member.planName, 90)}
              icon="repeat-outline"
              size="md"
              style={{ marginTop: spacing.lg }}
            />
          </Card>
        )}

        {activeTab === 'attendance' && (
          <Card>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Attendance Check-In Logs</Text>
            {memberAttendance.length === 0 ? (
              <Text style={{ color: colors.textMuted, marginVertical: spacing.md }}>
                No recent attendance records found.
              </Text>
            ) : (
              memberAttendance.map((log) => (
                <View
                  key={log.id}
                  style={[styles.attendanceItem, { borderBottomColor: colors.border }]}
                >
                  <View>
                    <Text style={[styles.attDate, { color: colors.text }]}>
                      {formatDate(log.date)}
                    </Text>
                    <Text style={[styles.attTime, { color: colors.textDim }]}>
                      In: {log.checkInTime} {log.checkOutTime ? `• Out: ${log.checkOutTime}` : ''}
                    </Text>
                  </View>
                  <Badge
                    label={log.method === 'ai_camera' ? 'AI Face Scan' : 'Manual'}
                    variant={log.method === 'ai_camera' ? 'primary' : 'neutral'}
                  />
                </View>
              ))
            )}
          </Card>
        )}

        {activeTab === 'payments' && (
          <Card>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Payment & Billing History</Text>
            {memberPayments.length === 0 ? (
              <Text style={{ color: colors.textMuted, marginVertical: spacing.md }}>
                No payment history available for this member.
              </Text>
            ) : (
              memberPayments.map((p) => (
                <View key={p.id} style={[styles.payItem, { borderBottomColor: colors.border }]}>
                  <View>
                    <Text style={[styles.payInv, { color: colors.text }]}>{p.invoiceNumber}</Text>
                    <Text style={[styles.payDate, { color: colors.textMuted }]}>{p.date}</Text>
                    <Text style={[styles.payMethod, { color: colors.textDim }]}>
                      Method: {p.paymentMethod.toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.payAmount, { color: colors.text }]}>₹{p.amount}</Text>
                    <Badge label={p.paymentStatus} variant={p.paymentStatus as any} />
                  </View>
                </View>
              ))
            )}
          </Card>
        )}

        {/* Destructive Actions Section */}
        <View style={styles.dangerZone}>
          <Button
            title="Suspend Membership"
            onPress={handleSuspend}
            variant="outline"
            size="md"
            icon="pause-circle-outline"
            style={{ borderColor: colors.warning, marginBottom: spacing.sm }}
            textStyle={{ color: colors.warning }}
          />

          <Button
            title="Delete Member Account"
            onPress={handleDelete}
            variant="danger"
            size="md"
            icon="trash-outline"
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
  editIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    padding: spacing.lg,
  },
  profileRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    alignItems: 'center',
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileName: {
    ...typography.h3,
    flex: 1,
  },
  profileMeta: {
    ...typography.caption,
  },
  quickBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    marginTop: spacing.md,
    borderTopWidth: 1,
  },
  quickActionItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  quickActionLabel: {
    ...typography.caption,
    fontWeight: '600',
  },
  tabsNav: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    padding: 4,
    marginVertical: spacing.md,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  tabLabel: {
    ...typography.caption,
    fontWeight: '700',
  },
  cardTitle: {
    ...typography.h4,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  statVal: {
    ...typography.h3,
    fontWeight: '700',
  },
  statLbl: {
    ...typography.caption,
    marginTop: 2,
    fontWeight: '600',
  },
  notesBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  notesText: {
    ...typography.bodySmall,
    flex: 1,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactName: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
  contactPhone: {
    ...typography.caption,
    marginTop: 2,
  },
  smallBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notesBody: {
    ...typography.bodyMedium,
    lineHeight: 22,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  planNameTitle: {
    ...typography.h3,
  },
  planSub: {
    ...typography.caption,
    marginTop: 2,
  },
  remainingCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  daysRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  daysNum: {
    ...typography.h1,
    fontWeight: '800',
  },
  daysText: {
    ...typography.bodyMedium,
    fontWeight: '600',
    flex: 1,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  assignedTrainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  trainerLabel: {
    ...typography.caption,
  },
  trainerVal: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
  attendanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  attDate: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
  attTime: {
    ...typography.caption,
    marginTop: 2,
  },
  payItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  payInv: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
  payDate: {
    ...typography.caption,
  },
  payMethod: {
    ...typography.caption,
  },
  payAmount: {
    ...typography.bodyLarge,
    fontWeight: '700',
    marginBottom: 2,
  },
  dangerZone: {
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
});
