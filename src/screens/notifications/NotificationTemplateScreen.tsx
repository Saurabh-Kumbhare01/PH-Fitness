import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { spacing, typography, borderRadius } from '../../theme';

interface NotificationTemplateScreenProps {
  navigation: any;
}

interface TemplateItem {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
}

const DEFAULT_TEMPLATES: TemplateItem[] = [
  {
    id: 't-1',
    title: 'Membership Expiry Reminder (7 Days)',
    category: 'Expiry',
    content:
      'Dear {{member_name}}, your {{plan_name}} membership at PowerHouse Fitness Arena expires on {{end_date}}. Renew today to retain your current pricing & locker priority!',
    tags: ['{{member_name}}', '{{plan_name}}', '{{end_date}}'],
  },
  {
    id: 't-2',
    title: 'Pending Fee Balance Alert',
    category: 'Payment',
    content:
      'Hello {{member_name}}, this is a friendly reminder that an outstanding balance of {{amount_due}} is pending for your gym membership. Pay via UPI or front desk.',
    tags: ['{{member_name}}', '{{amount_due}}'],
  },
  {
    id: 't-3',
    title: '🎂 Member Birthday Greeting',
    category: 'Birthday',
    content:
      'Happy Birthday {{member_name}}! 🎉 Team PowerHouse wishes you peak strength and health this year. Drop by the front desk for your free Protein Shake voucher!',
    tags: ['{{member_name}}'],
  },
  {
    id: 't-4',
    title: 'Diwali Festive Fitness Blast (30% Off)',
    category: 'Promo',
    content:
      'Festive Season Special! Upgrade to our Annual VIP Athlete Plan this week and get flat 30% OFF + 1 Month Complimentary personal coaching. Visit now!',
    tags: ['{{discount_code}}'],
  },
];

export const NotificationTemplateScreen: React.FC<NotificationTemplateScreenProps> = ({
  navigation,
}) => {
  const { colors } = useThemeStore();
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem>(DEFAULT_TEMPLATES[0]);

  const handleTestBroadcast = (tpl: TemplateItem) => {
    Alert.alert(
      'Simulate Notification Blast',
      `Template "${tpl.title}" dispatched to mock messaging queue. (Zero external API costs)`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Message Templates"
        subtitle="Pre-configured SMS & WhatsApp formats"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Pre-built Gym Templates</Text>

        {templates.map((tpl) => {
          const isSelected = selectedTemplate.id === tpl.id;
          return (
            <Card
              key={tpl.id}
              style={[
                styles.templateCard,
                isSelected && { borderColor: colors.primary, borderWidth: 1.5 },
              ]}
              onPress={() => setSelectedTemplate(tpl)}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.tplTitle, { color: colors.text }]}>{tpl.title}</Text>
                <View style={[styles.catBadge, { backgroundColor: colors.primaryMuted }]}>
                  <Text style={[styles.catBadgeText, { color: colors.primary }]}>{tpl.category}</Text>
                </View>
              </View>

              <Text style={[styles.tplContent, { color: colors.textMuted }]}>{tpl.content}</Text>

              {/* Variable tags */}
              <View style={styles.tagRow}>
                {tpl.tags.map((tag, i) => (
                  <View key={`tag-${i}`} style={[styles.tag, { backgroundColor: colors.surfaceHighlight }]}>
                    <Text style={[styles.tagText, { color: colors.accent }]}>{tag}</Text>
                  </View>
                ))}
              </View>

              <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
                <Button
                  title="Send Test Blast"
                  onPress={() => handleTestBroadcast(tpl)}
                  size="sm"
                  variant="outline"
                  icon="send-outline"
                />
              </View>
            </Card>
          );
        })}
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
  sectionTitle: {
    ...typography.h4,
    marginBottom: spacing.md,
  },
  templateCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  tplTitle: {
    ...typography.bodyMedium,
    fontWeight: '700',
    flex: 1,
    marginRight: spacing.sm,
  },
  catBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  catBadgeText: {
    ...typography.caption,
    fontWeight: '700',
  },
  tplContent: {
    ...typography.bodySmall,
    lineHeight: 20,
    marginVertical: spacing.sm,
  },
  tagRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  tagText: {
    ...typography.caption,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
  },
});
