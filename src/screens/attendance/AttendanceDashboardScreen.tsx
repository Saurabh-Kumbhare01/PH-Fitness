import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { BarChart } from '../../components/charts/BarChart';
import { formatDate } from '../../utils/formatters';
import { spacing, typography, borderRadius } from '../../theme';

interface AttendanceDashboardScreenProps {
  navigation: any;
}

export const AttendanceDashboardScreen: React.FC<AttendanceDashboardScreenProps> = ({
  navigation,
}) => {
  const { colors } = useThemeStore();
  const { logs, stats, fetchAttendance } = useAttendanceStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAttendance();
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Attendance Center"
        subtitle="AI Face Recognition & Check-In Logs"
        rightAction={
          <TouchableOpacity
            style={[styles.historyBtn, { backgroundColor: colors.surfaceHighlight }]}
            onPress={() => navigation.navigate('AttendanceHistory')}
          >
            <Ionicons name="calendar-outline" size={18} color={colors.text} />
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
        {/* AI Camera Hero CTA */}
        <Card style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
          <View style={styles.heroRow}>
            <View style={[styles.heroIconCircle, { backgroundColor: colors.primaryMuted }]}>
              <Ionicons name="scan-circle" size={36} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.heroTitle, { color: colors.text }]}>Smart Face Recognition</Text>
              <Text style={[styles.heroSubtitle, { color: colors.textMuted }]}>
                Real-time camera attendance terminal for members & staff.
              </Text>
            </View>
          </View>

          <Button
            title="Launch AI Face Scanner"
            onPress={() => navigation.navigate('CameraAttendance')}
            icon="camera-outline"
            size="lg"
            style={{ marginTop: spacing.md }}
          />
        </Card>

        {/* Primary Attendance Metrics */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Attendance Status</Text>
        <View style={styles.statsRow}>
          <StatCard
            title="Present Today"
            value={stats.presentToday}
            subtitle="Checked in members"
            icon="checkmark-circle"
            iconColor={colors.success}
            iconBg={colors.successMuted}
          />
          <StatCard
            title="Absent Today"
            value={stats.absentToday}
            subtitle="Active members missing"
            icon="close-circle-outline"
            iconColor={colors.danger}
            iconBg={colors.dangerMuted}
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            title="Weekly Average"
            value={stats.weeklyAvg}
            subtitle="Daily average footfall"
            icon="analytics-outline"
            iconColor={colors.accent}
            iconBg={colors.accentMuted}
          />
          <StatCard
            title="Attendance Rate"
            value={stats.monthlyAttendanceRate}
            subtitle="September 2025"
            icon="trophy-outline"
            iconColor={colors.secondary}
            iconBg={colors.secondaryMuted}
          />
        </View>

        {/* Weekly Trend BarChart */}
        <Card style={styles.chartCard}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Weekly Footfall Distribution</Text>
          <Text style={[styles.cardSub, { color: colors.textMuted }]}>
            Recorded daily member check-ins
          </Text>
          <BarChart
            data={stats.weeklyTrends.map((t) => ({ label: t.day, value: t.count }))}
            height={180}
          />
        </Card>

        {/* Peak Hours Crowd Insights */}
        <Card>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Gym Peak Hours & Density</Text>
          <View style={styles.peakList}>
            {stats.peakHours.map((slot, index) => (
              <View key={`slot-${index}`} style={styles.peakItem}>
                <View style={styles.peakTimeRow}>
                  <Text style={[styles.peakSlot, { color: colors.text }]}>{slot.slot}</Text>
                  <Text
                    style={[
                      styles.crowdBadge,
                      {
                        color:
                          slot.crowd === 'Very High'
                            ? colors.danger
                            : slot.crowd === 'High'
                            ? colors.warning
                            : colors.success,
                      },
                    ]}
                  >
                    {slot.crowd} ({slot.count} Members)
                  </Text>
                </View>
                <View style={[styles.peakTrack, { backgroundColor: colors.inputBackground }]}>
                  <View
                    style={[
                      styles.peakFill,
                      {
                        width: `${slot.percentage}%`,
                        backgroundColor:
                          slot.crowd === 'Very High'
                            ? colors.danger
                            : slot.crowd === 'High'
                            ? colors.warning
                            : colors.success,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Recent Attendance Logs */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Live Logs</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AttendanceHistory')}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>Full Log</Text>
          </TouchableOpacity>
        </View>

        {logs.map((record) => (
          <Card key={record.id} style={styles.logCard}>
            <View style={styles.logRow}>
              <Image
                source={{
                  uri:
                    record.memberPhoto ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
                }}
                style={styles.logAvatar}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.logName, { color: colors.text }]}>{record.memberName}</Text>
                <Text style={[styles.logTime, { color: colors.textMuted }]}>
                  In: {record.checkInTime}{' '}
                  {record.checkOutTime ? `• Out: ${record.checkOutTime}` : '• Workout in progress'}
                </Text>
              </View>
              <Badge
                label={record.method === 'ai_camera' ? 'AI Scanned' : 'Manual'}
                variant={record.method === 'ai_camera' ? 'primary' : 'neutral'}
              />
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
  scrollContent: {
    padding: spacing.lg,
  },
  historyBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    padding: spacing.lg,
    borderWidth: 1.5,
    marginBottom: spacing.lg,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  heroIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    ...typography.h3,
  },
  heroSubtitle: {
    ...typography.caption,
    marginTop: 2,
    lineHeight: 16,
  },
  sectionTitle: {
    ...typography.h4,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  chartCard: {
    marginVertical: spacing.md,
    padding: spacing.md,
  },
  cardTitle: {
    ...typography.h4,
  },
  cardSub: {
    ...typography.caption,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  peakList: {
    marginTop: spacing.md,
    gap: spacing.md,
  },
  peakItem: {},
  peakTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  peakSlot: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  crowdBadge: {
    ...typography.caption,
    fontWeight: '700',
  },
  peakTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  peakFill: {
    height: '100%',
    borderRadius: 3,
  },
  sectionHeader: {
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
  logCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  logName: {
    ...typography.bodyMedium,
    fontWeight: '700',
  },
  logTime: {
    ...typography.caption,
    marginTop: 2,
  },
});
