import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { trainerService } from '../../services/trainerService';
import { Trainer } from '../../types';
import { spacing, typography, borderRadius } from '../../theme';

interface TrainerListScreenProps {
  navigation: any;
}

export const TrainerListScreen: React.FC<TrainerListScreenProps> = ({ navigation }) => {
  const { colors } = useThemeStore();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    setLoading(true);
    const data = await trainerService.getTrainers();
    setTrainers(data);
    setLoading(false);
  };

  const renderTrainerItem = ({ item }: { item: Trainer }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('TrainerDetail', { trainerId: item.id })}
    >
      <Card style={styles.trainerCard}>
        <View style={styles.cardTop}>
          <Image
            source={{
              uri:
                item.photo ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
            }}
            style={styles.avatar}
          />

          <View style={{ flex: 1 }}>
            <View style={styles.nameRow}>
              <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
              <Badge
                label={item.status === 'active' ? 'Active' : 'On Leave'}
                variant={item.status === 'active' ? 'active' : 'suspended'}
              />
            </View>

            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={[styles.rating, { color: colors.text }]}>{item.rating}</Text>
              <Text style={[styles.exp, { color: colors.textDim }]}>
                • {item.experienceYears} Years Exp
              </Text>
            </View>

            {/* Specialties Chips */}
            <View style={styles.specialtyRow}>
              {item.specialty.slice(0, 2).map((spec, i) => (
                <View
                  key={`spec-${i}`}
                  style={[styles.specChip, { backgroundColor: colors.surfaceHighlight }]}
                >
                  <Text style={[styles.specText, { color: colors.textMuted }]}>{spec}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Footer info */}
        <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
          <View style={styles.clientCountBox}>
            <Ionicons name="people" size={14} color={colors.primary} />
            <Text style={[styles.clientText, { color: colors.textMuted }]}>
              {item.activeClientsCount} Assigned Clients
            </Text>
          </View>

          <View style={styles.quickBtns}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.surfaceHighlight }]}
              onPress={() => Linking.openURL(`tel:${item.phone}`)}
            >
              <Ionicons name="call" size={14} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.surfaceHighlight }]}
              onPress={() => Linking.openURL(`mailto:${item.email}`)}
            >
              <Ionicons name="mail" size={14} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Fitness Trainers"
        subtitle="Certified personal fitness coaches"
        showBack
        onBackPress={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('AddTrainer')}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.addBtnText}>Add Coach</Text>
          </TouchableOpacity>
        }
      />

      <FlatList
        data={trainers}
        keyExtractor={(item) => item.id}
        renderItem={renderTrainerItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: spacing.lg,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  addBtnText: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  trainerCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardTop: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  name: {
    ...typography.h4,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  rating: {
    ...typography.caption,
    fontWeight: '700',
  },
  exp: {
    ...typography.caption,
  },
  specialtyRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  specChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  specText: {
    ...typography.caption,
    fontSize: 10.5,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
    borderTopWidth: 1,
  },
  clientCountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clientText: {
    ...typography.caption,
    fontWeight: '600',
  },
  quickBtns: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
