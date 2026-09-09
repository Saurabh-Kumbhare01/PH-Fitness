import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { APP_NAME, APP_VERSION } from '../../constants';
import { spacing, typography, borderRadius } from '../../theme';

interface MoreHubScreenProps {
  navigation: any;
}

export const MoreHubScreen: React.FC<MoreHubScreenProps> = ({ navigation }) => {
  const { colors, gymSettings } = useThemeStore();

  const menuSections = [
    {
      title: 'MANAGEMENT MODULES',
      items: [
        {
          title: 'Membership Plans & Tiers',
          subtitle: 'Daily, Weekly, Monthly, Quarterly, Half-Yearly, Annual',
          icon: 'ribbon-outline' as const,
          color: colors.primary,
          route: 'Memberships',
        },
        {
          title: 'Fitness Coaches & Trainers',
          subtitle: 'Personal trainers, specialties, client allocations',
          icon: 'barbell-outline' as const,
          color: colors.secondary,
          route: 'Trainers',
        },
        {
          title: 'Business Reports & Analytics',
          subtitle: 'Revenue curves, footfall trends, profit & loss',
          icon: 'analytics-outline' as const,
          color: colors.accent,
          route: 'Reports',
        },
        {
          title: 'Notifications & Alerts',
          subtitle: 'Expiry warnings, payment reminders, greetings',
          icon: 'notifications-outline' as const,
          color: '#F59E0B',
          route: 'Notifications',
        },
      ],
    },
    {
      title: 'OPERATIONS & SETUP',
      items: [
        {
          title: 'Gym Profile & Admin Settings',
          subtitle: 'Branding, GST credentials, security & backups',
          icon: 'settings-outline' as const,
          color: colors.textMuted,
          route: 'Settings',
        },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="More Features" subtitle="Enterprise gym management modules" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Gym Brand Summary Header */}
        <Card style={[styles.brandCard, { backgroundColor: colors.surfaceHighlight }]}>
          <View style={styles.brandRow}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primaryMuted }]}>
              <Ionicons name="fitness" size={28} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.gymName, { color: colors.text }]}>{gymSettings.gymName}</Text>
              <Text style={[styles.gymTag, { color: colors.textDim }]}>{gymSettings.tagline}</Text>
            </View>
          </View>
        </Card>

        {menuSections.map((section, sIdx) => (
          <View key={`sec-${sIdx}`} style={styles.sectionBlock}>
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>{section.title}</Text>
            <Card style={styles.menuCard}>
              {section.items.map((item, iIdx) => (
                <View key={`item-${iIdx}`}>
                  <TouchableOpacity
                    style={styles.menuRow}
                    onPress={() => navigation.navigate(item.route)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.iconBox, { backgroundColor: colors.surfaceHighlight }]}>
                      <Ionicons name={item.icon} size={22} color={item.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
                      <Text style={[styles.itemSub, { color: colors.textMuted }]}>
                        {item.subtitle}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={colors.textDim} />
                  </TouchableOpacity>
                  {iIdx < section.items.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  )}
                </View>
              ))}
            </Card>
          </View>
        ))}

        <View style={styles.appFooter}>
          <Text style={[styles.appFooterText, { color: colors.textDim }]}>
            {APP_NAME} • {APP_VERSION}
          </Text>
          <Text style={[styles.appFooterSub, { color: colors.textDim }]}>
            Phase 1 Frontend Architecture
          </Text>
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
  brandCard: {
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gymName: {
    ...typography.h3,
    fontSize: 16,
  },
  gymTag: {
    ...typography.caption,
    marginTop: 2,
  },
  sectionBlock: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.caption,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
    marginLeft: 4,
  },
  menuCard: {
    padding: spacing.xs,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    ...typography.bodyMedium,
    fontWeight: '700',
  },
  itemSub: {
    ...typography.caption,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginHorizontal: spacing.md,
  },
  appFooter: {
    alignItems: 'center',
    marginVertical: spacing.xl,
    gap: 2,
  },
  appFooterText: {
    ...typography.caption,
    fontWeight: '700',
  },
  appFooterSub: {
    ...typography.caption,
    fontSize: 10,
  },
});
