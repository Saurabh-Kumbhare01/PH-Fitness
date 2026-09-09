import React, { useState, useEffect } from 'react';
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
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { notificationService } from '../../services/notificationService';
import { NotificationItem, NotificationCategory } from '../../types';
import { spacing, typography, borderRadius } from '../../theme';

interface NotificationsScreenProps {
  navigation: any;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const { colors } = useThemeStore();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<NotificationCategory | 'all'>('all');

  useEffect(() => {
    loadNotifications();
  }, [categoryFilter]);

  const loadNotifications = async () => {
    const data = await notificationService.getNotifications(categoryFilter);
    setNotifications(data);
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    await loadNotifications();
    Alert.alert('Success', 'All notifications marked as read.');
  };

  const handleSendNotice = (item: NotificationItem) => {
    Alert.alert(
      'Notification Trigger',
      `Mock broadcast queued for member: "${item.title}". No real external SMS/WhatsApp API called.`,
      [{ text: 'Dismiss' }]
    );
  };

  const getCategoryIcon = (cat: NotificationCategory) => {
    switch (cat) {
      case 'expiry':
        return { icon: 'hourglass-outline' as const, color: colors.warning };
      case 'payment':
        return { icon: 'alert-circle-outline' as const, color: colors.danger };
      case 'birthday':
        return { icon: 'gift-outline' as const, color: colors.secondary };
      case 'promo':
        return { icon: 'megaphone-outline' as const, color: colors.accent };
      case 'general':
      default:
        return { icon: 'information-circle-outline' as const, color: colors.primary };
    }
  };

  const categories: { label: string; value: NotificationCategory | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Expiry Alerts', value: 'expiry' },
    { label: 'Payment Due', value: 'payment' },
    { label: 'Birthdays 🎂', value: 'birthday' },
    { label: 'Promotions', value: 'promo' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Notifications & Alerts"
        subtitle="Automated alerts and member notices"
        showBack
        onBackPress={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity
            style={[styles.templateBtn, { backgroundColor: colors.surfaceHighlight }]}
            onPress={() => navigation.navigate('NotificationTemplate')}
          >
            <Ionicons name="document-text-outline" size={18} color={colors.text} />
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        {/* Category Horizontal Pills */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item.value}
          contentContainerStyle={styles.categoryScroll}
          renderItem={({ item }) => {
            const isSelected = categoryFilter === item.value;
            return (
              <TouchableOpacity
                onPress={() => setCategoryFilter(item.value)}
                style={[
                  styles.catPill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.catText,
                    {
                      color: isSelected ? '#FFFFFF' : colors.textMuted,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        {/* Mark all read banner */}
        <TouchableOpacity style={styles.markReadRow} onPress={handleMarkAllRead}>
          <Ionicons name="checkmark-done" size={16} color={colors.primary} />
          <Text style={[styles.markReadText, { color: colors.primary }]}>Mark all as read</Text>
        </TouchableOpacity>

        {/* List of notifications */}
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
          renderItem={({ item }) => {
            const catInfo = getCategoryIcon(item.category);

            return (
              <Card
                style={[
                  styles.notifCard,
                  !item.read && { borderColor: colors.primary, borderWidth: 1.2 },
                ]}
              >
                <View style={styles.notifRow}>
                  <View style={[styles.iconBox, { backgroundColor: colors.surfaceHighlight }]}>
                    <Ionicons name={catInfo.icon} size={22} color={catInfo.color} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={styles.titleRow}>
                      <Text style={[styles.notifTitle, { color: colors.text }]}>{item.title}</Text>
                      {!item.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
                    </View>

                    <Text style={[styles.notifMsg, { color: colors.textMuted }]}>{item.message}</Text>
                    <Text style={[styles.notifTime, { color: colors.textDim }]}>{item.createdAt}</Text>

                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={[styles.noticeActionBtn, { backgroundColor: colors.surfaceHighlight }]}
                        onPress={() => handleSendNotice(item)}
                      >
                        <Ionicons name="paper-plane-outline" size={14} color={colors.primary} />
                        <Text style={[styles.noticeActionText, { color: colors.text }]}>
                          Send Template Notice
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Card>
            );
          }}
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
  templateBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryScroll: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  catText: {
    ...typography.caption,
  },
  markReadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginVertical: spacing.sm,
    alignSelf: 'flex-end',
  },
  markReadText: {
    ...typography.caption,
    fontWeight: '700',
  },
  notifCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  notifRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notifTitle: {
    ...typography.bodyMedium,
    fontWeight: '700',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notifMsg: {
    ...typography.bodySmall,
    marginTop: 2,
    lineHeight: 18,
  },
  notifTime: {
    ...typography.caption,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  noticeActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
  },
  noticeActionText: {
    ...typography.caption,
    fontWeight: '600',
  },
});
