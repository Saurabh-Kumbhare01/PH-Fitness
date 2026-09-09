import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';
import { useMemberStore } from '../../store/useMemberStore';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { usePaymentStore } from '../../store/usePaymentStore';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { LineChart } from '../../components/charts/LineChart';
import { BarChart } from '../../components/charts/BarChart';
import { DonutChart } from '../../components/charts/DonutChart';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { spacing, typography, borderRadius } from '../../theme';

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { colors, isDark, toggleTheme, gymSettings } = useThemeStore();
  const { members, fetchMembers } = useMemberStore();
  const { stats: attStats, fetchAttendance } = useAttendanceStore();
  const { metrics: payMetrics, fetchPayments } = usePaymentStore();

  const [refreshing, setRefreshing] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState<'revenue' | 'attendance' | 'growth'>('revenue');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([fetchMembers(), fetchAttendance(), fetchPayments()]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Derived stats
  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.membershipStatus === 'active').length;
  const expiringSoon = members.filter((m) => m.membershipStatus === 'expiring').length;
  const expiredMembers = members.filter((m) => m.membershipStatus === 'expired').length;

  const revenueChartData = [
    { label: 'Apr', value: 285 },
    { label: 'May', value: 310 },
    { label: 'Jun', value: 295 },
    { label: 'Jul', value: 350 },
    { label: 'Aug', value: 385 },
    { label: 'Sep', value: 342 },
  ];

  const attendanceChartData = [
    { label: 'Mon', value: 52 },
    { label: 'Tue', value: 48 },
    { label: 'Wed', value: 55 },
    { label: 'Thu', value: 50 },
    { label: 'Fri', value: 58 },
    { label: 'Sat', value: 62 },
    { label: 'Sun', value: 32 },
  ];

  const donutData = [
    { label: 'Active', count: activeMembers || 8, percentage: 67, color: colors.primary },
    { label: 'Expiring', count: expiringSoon || 2, percentage: 17, color: colors.warning },
    { label: 'Expired', count: expiredMembers || 2, percentage: 16, color: colors.danger },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top App Header */}
      <View style={[styles.topHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.avatarCircle, { backgroundColor: colors.primaryMuted }]}>
            <Ionicons name="fitness" size={24} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.gymTitle, { color: colors.text }]}>{gymSettings.gymName}</Text>
            <Text style={[styles.welcomeSubtitle, { color: colors.textMuted }]}>
              Admin Dashboard • {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.headerIconBtn, { backgroundColor: colors.surfaceHighlight }]}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={20} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.headerIconBtn, { backgroundColor: colors.surfaceHighlight }]}
            onPress={() => navigation.navigate('More', { screen: 'Notifications' })}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={20} color={colors.text} />
            <View style={[styles.notifDot, { backgroundColor: colors.danger }]} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* Quick Actions Panel */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
            onPress={() => navigation.navigate('Members', { screen: 'AddEditMember' })}
            activeOpacity={0.75}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.primaryMuted }]}>
              <Ionicons name="person-add" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>Add Member</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
            onPress={() => navigation.navigate('Attendance', { screen: 'CameraAttendance' })}
            activeOpacity={0.75}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.accentMuted }]}>
              <Ionicons name="camera" size={20} color={colors.accent} />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>AI Scan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
            onPress={() => navigation.navigate('Payments', { screen: 'CollectPayment' })}
            activeOpacity={0.75}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.secondaryMuted }]}>
              <Ionicons name="wallet" size={20} color={colors.secondary} />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>Collect Pay</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
            onPress={() => navigation.navigate('More', { screen: 'Memberships' })}
            activeOpacity={0.75}
          >
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(245, 158, 11, 0.16)' }]}>
              <Ionicons name="ribbon" size={20} color="#F59E0B" />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>Plans</Text>
          </TouchableOpacity>
        </View>

        {/* Primary Metrics Grid */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: spacing.md }]}>
          Key Performance Indicators
        </Text>

        <View style={styles.statsRow}>
          <StatCard
            title="Total Members"
            value={totalMembers || 12}
            subtitle="Enrolled lifetime"
            icon="people"
            trend={{ value: '+14% mo', isPositive: true }}
            onPress={() => navigation.navigate('Members')}
          />
          <StatCard
            title="Active Members"
            value={activeMembers || 8}
            subtitle="Valid subscriptions"
            icon="shield-checkmark"
            iconColor={colors.success}
            iconBg={colors.successMuted}
            onPress={() => navigation.navigate('Members', { status: 'active' })}
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            title="Expiring Soon"
            value={expiringSoon || 2}
            subtitle="Within next 7 days"
            icon="hourglass-outline"
            iconColor={colors.warning}
            iconBg={colors.warningMuted}
            onPress={() => navigation.navigate('Members', { status: 'expiring' })}
          />
          <StatCard
            title="Expired Members"
            value={expiredMembers || 2}
            subtitle="Renewal overdue"
            icon="alert-circle-outline"
            iconColor={colors.danger}
            iconBg={colors.dangerMuted}
            onPress={() => navigation.navigate('Members', { status: 'expired' })}
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            title="Today's Footfall"
            value={attStats.presentToday || 48}
            subtitle="Peak: 6 PM - 8 PM"
            icon="walk-outline"
            iconColor={colors.accent}
            iconBg={colors.accentMuted}
            trend={{ value: '+8%', isPositive: true }}
            onPress={() => navigation.navigate('Attendance')}
          />
          <StatCard
            title="Today's Collection"
            value={formatCurrency(payMetrics.todayCollection || 14500)}
            subtitle="Cash + UPI + Card"
            icon="cash-outline"
            iconColor={colors.success}
            iconBg={colors.successMuted}
            onPress={() => navigation.navigate('Payments')}
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            title="Pending Payments"
            value={formatCurrency(payMetrics.pendingTotal || 18499)}
            subtitle="Unsettled dues"
            icon="time-outline"
            iconColor={colors.warning}
            iconBg={colors.warningMuted}
            onPress={() => navigation.navigate('Payments', { filter: 'pending' })}
          />
          <StatCard
            title="Monthly Revenue"
            value={formatCurrency(payMetrics.monthlyTotal || 342800)}
            subtitle="September 2025"
            icon="trending-up-outline"
            iconColor={colors.primary}
            iconBg={colors.primaryMuted}
            trend={{ value: '+19%', isPositive: true }}
            onPress={() => navigation.navigate('More', { screen: 'Reports' })}
          />
        </View>

        {/* Interactive Analytics Charts */}
        <Card style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={[styles.chartTitle, { color: colors.text }]}>Gym Performance Analytics</Text>
              <Text style={[styles.chartSubtitle, { color: colors.textMuted }]}>
                {activeChartTab === 'revenue'
                  ? 'Revenue trend (in thousands ₹)'
                  : activeChartTab === 'attendance'
                  ? 'Daily footfall over current week'
                  : 'Active vs Expired membership ratio'}
              </Text>
            </View>

            {/* Tab switchers */}
            <View style={[styles.chartTabGroup, { backgroundColor: colors.surfaceHighlight }]}>
              <TouchableOpacity
                onPress={() => setActiveChartTab('revenue')}
                style={[
                  styles.chartTabBtn,
                  activeChartTab === 'revenue' && { backgroundColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.chartTabText,
                    { color: activeChartTab === 'revenue' ? '#FFFFFF' : colors.textMuted },
                  ]}
                >
                  Rev
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveChartTab('attendance')}
                style={[
                  styles.chartTabBtn,
                  activeChartTab === 'attendance' && { backgroundColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.chartTabText,
                    { color: activeChartTab === 'attendance' ? '#FFFFFF' : colors.textMuted },
                  ]}
                >
                  Att
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveChartTab('growth')}
                style={[
                  styles.chartTabBtn,
                  activeChartTab === 'growth' && { backgroundColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.chartTabText,
                    { color: activeChartTab === 'growth' ? '#FFFFFF' : colors.textMuted },
                  ]}
                >
                  Ratio
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {activeChartTab === 'revenue' ? (
            <LineChart data={revenueChartData} height={190} valuePrefix="k" />
          ) : activeChartTab === 'attendance' ? (
            <BarChart data={attendanceChartData} height={190} />
          ) : (
            <DonutChart data={donutData} centerLabel="Active %" centerValue="67%" />
          )}
        </Card>

        {/* Expiring Soon Action List */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Expiring Memberships</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Members', { status: 'expiring' })}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>View All ({expiringSoon})</Text>
          </TouchableOpacity>
        </View>

        {members
          .filter((m) => m.membershipStatus === 'expiring')
          .slice(0, 3)
          .map((member) => (
            <Card
              key={member.id}
              style={styles.memberCard}
              onPress={() => navigation.navigate('Members', { screen: 'MemberDetail', params: { memberId: member.id } })}
            >
              <View style={styles.memberRow}>
                <Image source={{ uri: member.photo }} style={styles.memberThumb} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.memberName, { color: colors.text }]}>{member.fullName}</Text>
                  <Text style={[styles.memberPlan, { color: colors.textMuted }]}>
                    {member.planName} • Ends {formatDate(member.membershipEndDate)}
                  </Text>
                </View>
                <Badge label="Expiring" variant="expiring" />
              </View>
            </Card>
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  gymTitle: {
    ...typography.h3,
    fontSize: 17,
  },
  welcomeSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    marginBottom: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  seeAllText: {
    ...typography.bodySmall,
    fontWeight: '700',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  actionText: {
    ...typography.caption,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  chartCard: {
    marginTop: spacing.md,
    padding: spacing.md,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  chartTitle: {
    ...typography.h4,
  },
  chartSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  chartTabGroup: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    padding: 3,
    gap: 2,
  },
  chartTabBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  chartTabText: {
    ...typography.caption,
    fontWeight: '700',
  },
  memberCard: {
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  memberThumb: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  memberName: {
    ...typography.bodyMedium,
    fontWeight: '700',
  },
  memberPlan: {
    ...typography.caption,
    marginTop: 2,
  },
});
