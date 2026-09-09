import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';
import { useMemberStore } from '../../store/useMemberStore';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { MOCK_TRAINERS } from '../../mock/trainers';
import { formatCurrency } from '../../utils/formatters';
import { spacing, typography, borderRadius } from '../../theme';

interface TrainerDetailScreenProps {
  navigation: any;
  route: any;
}

export const TrainerDetailScreen: React.FC<TrainerDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { colors } = useThemeStore();
  const { members } = useMemberStore();

  const trainerId = route.params?.trainerId;
  const trainer = MOCK_TRAINERS.find((t) => t.id === trainerId) || MOCK_TRAINERS[0];

  const assignedMembers = members.filter((m) => m.assignedTrainerId === trainer.id);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Coach Profile"
        subtitle={trainer.name}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.topRow}>
            <Image source={{ uri: trainer.photo }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: colors.text }]}>{trainer.name}</Text>
              <View style={styles.ratingBox}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={[styles.ratingText, { color: colors.text }]}>
                  {trainer.rating} Rating
                </Text>
                <Text style={{ color: colors.textDim }}>•</Text>
                <Badge
                  label={trainer.status === 'active' ? 'On Duty' : 'On Leave'}
                  variant={trainer.status === 'active' ? 'active' : 'suspended'}
                />
              </View>
              <Text style={[styles.expText, { color: colors.textMuted }]}>
                {trainer.experienceYears} Years Industry Experience
              </Text>
            </View>
          </View>

          {/* Specialties */}
          <View style={styles.specSection}>
            <Text style={[styles.sectionHeading, { color: colors.textDim }]}>SPECIALIZATION</Text>
            <View style={styles.specChips}>
              {trainer.specialty.map((spec, i) => (
                <View
                  key={`spec-${i}`}
                  style={[styles.specChip, { backgroundColor: colors.surfaceHighlight }]}
                >
                  <Text style={[styles.specText, { color: colors.primary }]}>{spec}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Quick Actions */}
          <View style={[styles.quickBar, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={styles.quickBtn}
              onPress={() => Linking.openURL(`tel:${trainer.phone}`)}
            >
              <Ionicons name="call" size={16} color={colors.primary} />
              <Text style={[styles.quickText, { color: colors.text }]}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickBtn}
              onPress={() => Linking.openURL(`mailto:${trainer.email}`)}
            >
              <Ionicons name="mail" size={16} color={colors.primary} />
              <Text style={[styles.quickText, { color: colors.text }]}>Email</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickBtn}
              onPress={() =>
                Linking.openURL(`https://wa.me/${trainer.phone.replace(/[^0-9]/g, '')}`)
              }
            >
              <Ionicons name="logo-whatsapp" size={16} color="#25D366" />
              <Text style={[styles.quickText, { color: colors.text }]}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Bio Card */}
        <Card>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Coach Biography & Background</Text>
          <Text style={[styles.bioBody, { color: colors.textMuted }]}>{trainer.bio}</Text>
        </Card>

        {/* Assigned Clients List */}
        <Card>
          <View style={styles.assignedHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Assigned Members ({assignedMembers.length})
            </Text>
            <Badge label="Personal Training" variant="primary" />
          </View>

          {assignedMembers.length === 0 ? (
            <Text style={{ color: colors.textMuted, marginVertical: spacing.sm }}>
              No members currently assigned to this coach.
            </Text>
          ) : (
            assignedMembers.map((m) => (
              <TouchableOpacity
                key={m.id}
                onPress={() => navigation.navigate('Members', { screen: 'MemberDetail', params: { memberId: m.id } })}
                style={[styles.memberRow, { borderBottomColor: colors.border }]}
              >
                <Image source={{ uri: m.photo }} style={styles.memberThumb} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.memberName, { color: colors.text }]}>{m.fullName}</Text>
                  <Text style={[styles.memberPlan, { color: colors.textMuted }]}>{m.planName}</Text>
                </View>
                <Badge label={m.membershipStatus} variant={m.membershipStatus as any} />
              </TouchableOpacity>
            ))
          )}
        </Card>
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
  profileCard: {
    padding: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  name: {
    ...typography.h3,
    marginBottom: 2,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  ratingText: {
    ...typography.caption,
    fontWeight: '700',
  },
  expText: {
    ...typography.caption,
  },
  specSection: {
    marginTop: spacing.md,
  },
  sectionHeading: {
    ...typography.caption,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  specChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  specChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  specText: {
    ...typography.caption,
    fontWeight: '600',
  },
  quickBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    marginTop: spacing.md,
    borderTopWidth: 1,
  },
  quickBtn: {
    alignItems: 'center',
    gap: 4,
  },
  quickText: {
    ...typography.caption,
    fontWeight: '600',
  },
  cardTitle: {
    ...typography.h4,
    marginBottom: spacing.xs,
  },
  bioBody: {
    ...typography.bodyMedium,
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  assignedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  memberThumb: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  memberName: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
  memberPlan: {
    ...typography.caption,
  },
});
