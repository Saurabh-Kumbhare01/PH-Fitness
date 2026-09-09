import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';
import { useMemberStore } from '../../store/useMemberStore';
import { Header } from '../../components/common/Header';
import { SearchBar } from '../../components/common/SearchBar';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { Member, MembershipStatus } from '../../types';
import { formatDate, getRemainingDays } from '../../utils/formatters';
import { spacing, typography, borderRadius } from '../../theme';

interface MemberListScreenProps {
  navigation: any;
  route: any;
}

export const MemberListScreen: React.FC<MemberListScreenProps> = ({ navigation, route }) => {
  const { colors } = useThemeStore();
  const {
    members,
    fetchMembers,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    filteredMembers,
  } = useMemberStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMembers();
    if (route.params?.status) {
      setStatusFilter(route.params.status);
    }
  }, [route.params?.status]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMembers();
    setRefreshing(false);
  };

  const filterOptions: { label: string; value: string }[] = [
    { label: 'All Members', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Expiring Soon', value: 'expiring' },
    { label: 'Expired', value: 'expired' },
    { label: 'Suspended', value: 'suspended' },
  ];

  const renderMemberItem = ({ item }: { item: Member }) => {
    const daysLeft = getRemainingDays(item.membershipEndDate);

    return (
      <TouchableOpacity
        style={[
          styles.memberCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.cardBorder,
          },
        ]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('MemberDetail', { memberId: item.id })}
      >
        <View style={styles.cardHeader}>
          <Image
            source={{
              uri:
                item.photo ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
            }}
            style={styles.avatar}
          />

          <View style={styles.infoCol}>
            <View style={styles.nameRow}>
              <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                {item.fullName}
              </Text>
              <Badge label={item.membershipStatus} variant={item.membershipStatus as any} />
            </View>

            <Text style={[styles.planText, { color: colors.textMuted }]}>
              {item.planName}
            </Text>

            <View style={styles.metaRow}>
              <Ionicons name="call-outline" size={13} color={colors.textDim} />
              <Text style={[styles.metaText, { color: colors.textDim }]}>{item.phone}</Text>

              <Text style={[styles.dot, { color: colors.textDim }]}>•</Text>

              <Ionicons name="time-outline" size={13} color={colors.textDim} />
              <Text style={[styles.metaText, { color: colors.textDim }]}>
                {item.membershipStatus === 'expired'
                  ? `Expired ${formatDate(item.membershipEndDate)}`
                  : `${daysLeft} days left`}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Row */}
        <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
          <View style={styles.trainerBox}>
            <Ionicons name="fitness-outline" size={14} color={colors.primary} />
            <Text style={[styles.trainerName, { color: colors.textMuted }]}>
              {item.assignedTrainerName || 'No Trainer Assigned'}
            </Text>
          </View>

          <View style={styles.quickBtns}>
            <TouchableOpacity
              style={[styles.circleBtn, { backgroundColor: colors.surfaceHighlight }]}
              onPress={() => Linking.openURL(`tel:${item.phone}`)}
            >
              <Ionicons name="call" size={14} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.circleBtn, { backgroundColor: colors.surfaceHighlight }]}
              onPress={() => Linking.openURL(`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}`)}
            >
              <Ionicons name="logo-whatsapp" size={14} color="#25D366" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const listData = filteredMembers();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Members Directory"
        subtitle={`${listData.length} of ${members.length} members`}
        rightAction={
          <TouchableOpacity
            style={[styles.addHeaderBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('AddEditMember')}
          >
            <Ionicons name="person-add" size={16} color="#FFFFFF" />
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name, phone, or plan..."
        />

        {/* Status Filter Horizontal Pills */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filterOptions}
          keyExtractor={(item) => item.value}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const isSelected = statusFilter === item.value;
            return (
              <TouchableOpacity
                onPress={() => setStatusFilter(item.value)}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
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

        {/* Member FlatList */}
        <FlatList
          data={listData}
          keyExtractor={(item) => item.id}
          renderItem={renderMemberItem}
          contentContainerStyle={{ paddingBottom: 80, paddingTop: spacing.sm }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="people-outline"
              title="No Members Found"
              subtitle="No members match the current search filter or criteria."
              actionTitle="Clear Filters"
              onActionPress={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
            />
          }
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  addHeaderBtn: {
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
  filterList: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  filterText: {
    ...typography.caption,
  },
  memberCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  name: {
    ...typography.h4,
    flex: 1,
    marginRight: spacing.sm,
  },
  planText: {
    ...typography.bodySmall,
    fontWeight: '500',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...typography.caption,
  },
  dot: {
    marginHorizontal: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
  },
  trainerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  trainerName: {
    ...typography.caption,
    fontWeight: '500',
  },
  quickBtns: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  circleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
