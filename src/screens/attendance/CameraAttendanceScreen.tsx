import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';
import { useMemberStore } from '../../store/useMemberStore';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Member, AttendanceRecord } from '../../types';
import { spacing, typography, borderRadius } from '../../theme';

interface CameraAttendanceScreenProps {
  navigation: any;
}

type ScanPhase = 'searching' | 'detecting' | 'identified' | 'completed';

export const CameraAttendanceScreen: React.FC<CameraAttendanceScreenProps> = ({
  navigation,
}) => {
  const { colors } = useThemeStore();
  const { members } = useMemberStore();
  const { markAttendance } = useAttendanceStore();

  const [phase, setPhase] = useState<ScanPhase>('searching');
  const [identifiedMember, setIdentifiedMember] = useState<Member | null>(null);
  const [markedRecord, setMarkedRecord] = useState<AttendanceRecord | null>(null);
  const [manualModalVisible, setManualModalVisible] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('front');

  // Animation for laser scan beam
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 240,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();

    return () => loop.stop();
  }, [scanLineAnim]);

  // Run the simulated AI recognition cycle
  const triggerSimulation = (targetMember?: Member) => {
    const memberToScan =
      targetMember || members[Math.floor(Math.random() * members.length)] || members[0];
    setPhase('detecting');

    setTimeout(() => {
      setPhase('identified');
      setIdentifiedMember(memberToScan);

      setTimeout(async () => {
        const rec = await markAttendance(
          memberToScan.id,
          memberToScan.fullName,
          memberToScan.photo,
          'ai_camera',
          0.99
        );
        setMarkedRecord(rec);
        setPhase('completed');

        // Reset back to searching after 3.5 seconds
        setTimeout(() => {
          setPhase('searching');
          setIdentifiedMember(null);
          setMarkedRecord(null);
        }, 3500);
      }, 1000);
    }, 1200);
  };

  const getStatusText = () => {
    switch (phase) {
      case 'detecting':
        return 'Analyzing Face Biometrics (Cosine Similarity)...';
      case 'identified':
        return 'Face Detected • Member Identified';
      case 'completed':
        return 'Attendance Marked • Welcome to Gym!';
      case 'searching':
      default:
        return 'Point camera towards member face';
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Overlay Controls */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.circleBtn}
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.topBadge}>
          <Ionicons name="sparkles" size={14} color="#10B981" />
          <Text style={styles.topBadgeText}>AI VISION CORE</Text>
        </View>

        <TouchableOpacity
          onPress={() => setCameraFacing(cameraFacing === 'front' ? 'back' : 'front')}
          style={styles.circleBtn}
          activeOpacity={0.8}
        >
          <Ionicons name="camera-reverse-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Camera Viewfinder Mock / Placeholder Area */}
      <View style={styles.viewfinderArea}>
        {/* Background Simulated Camera Feed */}
        <Image
          source={{
            uri:
              identifiedMember?.photo ||
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
          }}
          style={styles.feedImage}
          blurRadius={phase === 'searching' ? 8 : 1}
        />

        {/* Viewfinder Bounding Box */}
        <View
          style={[
            styles.targetBox,
            {
              borderColor:
                phase === 'completed'
                  ? '#10B981'
                  : phase === 'identified'
                  ? '#06B6D4'
                  : phase === 'detecting'
                  ? '#F59E0B'
                  : 'rgba(255,255,255,0.7)',
            },
          ]}
        >
          {/* Target Corners */}
          <View style={[styles.corner, styles.cornerTL, { borderColor: colors.primary }]} />
          <View style={[styles.corner, styles.cornerTR, { borderColor: colors.primary }]} />
          <View style={[styles.corner, styles.cornerBL, { borderColor: colors.primary }]} />
          <View style={[styles.corner, styles.cornerBR, { borderColor: colors.primary }]} />

          {/* Animated Laser Scanning Beam */}
          {phase !== 'completed' && (
            <Animated.View
              style={[
                styles.scanLine,
                {
                  transform: [{ translateY: scanLineAnim }],
                  backgroundColor: phase === 'detecting' ? '#F59E0B' : colors.primary,
                },
              ]}
            />
          )}

          {/* Center Recognition HUD Icon */}
          {phase === 'completed' && (
            <View style={styles.successHUD}>
              <Ionicons name="checkmark-circle" size={72} color="#10B981" />
            </View>
          )}
        </View>

        {/* Status Prompt Banner */}
        <View style={styles.statusBanner}>
          <Ionicons
            name={
              phase === 'completed'
                ? 'checkmark-circle'
                : phase === 'identified'
                ? 'finger-print'
                : phase === 'detecting'
                ? 'hourglass-outline'
                : 'scan-outline'
            }
            size={18}
            color={phase === 'completed' ? '#10B981' : '#FFFFFF'}
          />
          <Text style={styles.statusBannerText}>{getStatusText()}</Text>
        </View>
      </View>

      {/* Identified Member Card Popup */}
      {identifiedMember && (
        <View style={[styles.identifiedCard, { backgroundColor: colors.surface }]}>
          <Image source={{ uri: identifiedMember.photo }} style={styles.identifiedAvatar} />
          <View style={{ flex: 1 }}>
            <View style={styles.cardHeaderRow}>
              <Text style={[styles.identifiedName, { color: colors.text }]}>
                {identifiedMember.fullName}
              </Text>
              <Badge label="Confidence: 99%" variant="present" />
            </View>
            <Text style={[styles.identifiedPlan, { color: colors.textMuted }]}>
              {identifiedMember.planName} • Status: {identifiedMember.membershipStatus.toUpperCase()}
            </Text>
            {markedRecord && (
              <Text style={[styles.timestampText, { color: colors.primary }]}>
                Checked In: {markedRecord.checkInTime}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Bottom Control Bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.surface }]}>
        <Button
          title="Simulate AI Face Detection"
          onPress={() => triggerSimulation()}
          disabled={phase !== 'searching'}
          size="lg"
          icon="sparkles-outline"
          style={{ flex: 1 }}
        />

        <TouchableOpacity
          style={[styles.manualBtn, { backgroundColor: colors.surfaceHighlight }]}
          onPress={() => setManualModalVisible(true)}
        >
          <Ionicons name="search-outline" size={20} color={colors.text} />
          <Text style={[styles.manualBtnText, { color: colors.text }]}>Manual</Text>
        </TouchableOpacity>
      </View>

      {/* MANUAL MEMBER SELECTOR MODAL */}
      <Modal visible={manualModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={[styles.manualModal, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Manual Check-In</Text>
              <TouchableOpacity onPress={() => setManualModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color={colors.textDim} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalSub, { color: colors.textMuted }]}>
              Select a member to simulate facial match:
            </Text>

            <ScrollView style={{ maxHeight: 300, marginVertical: spacing.md }}>
              {members.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.memberItem, { borderBottomColor: colors.border }]}
                  onPress={() => {
                    setManualModalVisible(false);
                    triggerSimulation(m);
                  }}
                >
                  <Image source={{ uri: m.photo }} style={styles.memberSmallAvatar} />
                  <View style={{ flex: 1, marginLeft: spacing.sm }}>
                    <Text style={[styles.memberNameText, { color: colors.text }]}>
                      {m.fullName}
                    </Text>
                    <Text style={[styles.memberPlanText, { color: colors.textMuted }]}>
                      {m.planName}
                    </Text>
                  </View>
                  <Ionicons name="scan" size={18} color={colors.primary} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
    zIndex: 10,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  topBadgeText: {
    ...typography.caption,
    color: '#10B981',
    fontWeight: '800',
    letterSpacing: 1,
  },
  viewfinderArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  feedImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.45,
  },
  targetBox: {
    width: 250,
    height: 250,
    borderWidth: 1.5,
    borderRadius: borderRadius.xl,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderWidth: 3,
  },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 3,
    shadowColor: '#10B981',
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  successHUD: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
    marginTop: spacing.xl,
  },
  statusBannerText: {
    ...typography.bodySmall,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  identifiedCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  identifiedAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  identifiedName: {
    ...typography.h4,
    fontWeight: '700',
  },
  identifiedPlan: {
    ...typography.caption,
    marginTop: 2,
  },
  timestampText: {
    ...typography.caption,
    fontWeight: '700',
    marginTop: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  manualBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  manualBtnText: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  manualModal: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    ...typography.h3,
  },
  modalSub: {
    ...typography.bodySmall,
    marginTop: 4,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  memberSmallAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  memberNameText: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
  memberPlanText: {
    ...typography.caption,
  },
});
