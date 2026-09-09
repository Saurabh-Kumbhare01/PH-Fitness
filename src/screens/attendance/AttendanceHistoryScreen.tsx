import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { AttendanceRecord } from '../../types';
import { formatDate } from '../../utils/formatters';
import { spacing, typography, borderRadius } from '../../theme';

interface AttendanceHistoryScreenProps {
  navigation: any;
}

export const AttendanceHistoryScreen: React.FC<AttendanceHistoryScreenProps> = ({
  navigation,
}) => {
  const { colors } = useThemeStore();
  const { logs } = useAttendanceStore();
  const [methodFilter, setMethodFilter] = useState<'all' | 'ai_camera' | 'manual'>('all');

  const filteredLogs = logs.filter((item) => {
    if (methodFilter === 'all') return true;
    return item.method === methodFilter;
  });

  const handleExport = () => {
    Alert.alert(
      'Export Attendance Report',
      'Daily Attendance Sheet has been generated as CSV and queued for download.',
      [{ text: 'OK' }]
    );
  };

  const renderItem = ({ item }: { item: AttendanceRecord }) => (
    <Card style={styles.historyCard}>
      <View style={styles.cardRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: colors.text }]}>{item.memberName}</Text>
          <Text style={[styles.date, { color: colors.textMuted }]}>
            Date: {formatDate(item.date)}
          </Text>
          <Text style={[styles.time, { color: colors.textDim }]}>
            Check-In: {item.checkInTime} {item.checkOutTime ? `• Check-Out: ${item.checkOutTime}` : ''}
          </Text>
        </View>

        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Badge
            label={item.method === 'ai_camera' ? 'AI Camera' : 'Manual'}
            variant={item.method === 'ai_camera' ? 'primary' : 'neutral'}
          />
          {item.confidence && (
            <Text style={[styles.confidence, { color: colors.primary }]}>
              Match: {(item.confidence * 100).toFixed(0)}%
            </Text>
          )}
        </View>
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Attendance Logs"
        subtitle="Complete chronological check-in history"
        showBack
        onBackPress={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity
            style={[styles.exportBtn, { backgroundColor: colors.surfaceHighlight }]}
            onPress={handleExport}
          >
            <Ionicons name="download-outline" size={18} color={colors.text} />
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        {/* Method filter chips */}
        <View style={styles.chipRow}>
          {[
            { label: 'All Methods', val: 'all' },
            { label: 'AI Facial Scan', val: 'ai_camera' },
            { label: 'Manual Check-in', val: 'manual' },
          ].map((c) => {
            const isSel = methodFilter === c.val;
            return (
              <TouchableOpacity
                key={c.val}
                onPress={() => setMethodFilter(c.val as any)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSel ? colors.primary : colors.surface,
                    borderColor: isSel ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: isSel ? '#FFFFFF' : colors.textMuted, fontWeight: isSel ? '700' : '500' },
                  ]}
                >
                  {c.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FlatList
          data={filteredLogs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  exportBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  chipText: {
    ...typography.caption,
  },
  historyCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    ...typography.bodyMedium,
    fontWeight: '700',
  },
  date: {
    ...typography.caption,
    marginTop: 2,
  },
  time: {
    ...typography.caption,
    marginTop: 2,
  },
  confidence: {
    ...typography.caption,
    fontWeight: '600',
    fontSize: 10,
  },
});
