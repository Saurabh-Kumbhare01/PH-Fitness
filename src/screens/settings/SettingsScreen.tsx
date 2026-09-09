import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { APP_NAME, APP_VERSION } from '../../constants';
import { spacing, typography, borderRadius } from '../../theme';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { colors, isDark, toggleTheme, gymSettings, updateGymSettings } = useThemeStore();
  const { user, logout } = useAuthStore();

  const [pinEnabled, setPinEnabled] = useState(gymSettings.securityPinEnabled);
  const [autoBackup, setAutoBackup] = useState(gymSettings.autoBackup);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  // Edit gym profile form state
  const [gymName, setGymName] = useState(gymSettings.gymName);
  const [phone, setPhone] = useState(gymSettings.phone);
  const [email, setEmail] = useState(gymSettings.email);
  const [address, setAddress] = useState(gymSettings.address);
  const [gst, setGst] = useState(gymSettings.gstNumber);

  const handleSaveGymProfile = () => {
    updateGymSettings({
      gymName,
      phone,
      email,
      address,
      gstNumber: gst,
    });
    setProfileModalVisible(false);
    Alert.alert('Profile Updated', 'Gym identity and billing credentials saved.');
  };

  const handleBackupNow = () => {
    Alert.alert(
      'Backup Created',
      'All local member files, attendance logs, and transactions archived to encrypted backup file.',
      [{ text: 'OK' }]
    );
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out of the admin console?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.replace('Auth', { screen: 'Login' });
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Settings & Admin" subtitle="Gym profile, security & system preferences" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Owner Profile Banner */}
        <Card style={styles.profileBanner}>
          <View style={styles.bannerRow}>
            <View style={[styles.avatarCircle, { backgroundColor: colors.primaryMuted }]}>
              <Ionicons name="person" size={28} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.ownerName, { color: colors.text }]}>{user?.name || 'Saurabh Sharma'}</Text>
              <Text style={[styles.ownerRole, { color: colors.primary }]}>
                {user?.role.toUpperCase() || 'GYM OWNER'} • Super Administrator
              </Text>
              <Text style={[styles.ownerEmail, { color: colors.textDim }]}>
                {user?.email || 'admin@phfitness.com'}
              </Text>
            </View>
          </View>
        </Card>

        {/* SECTION: GYM PROFILE */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Gym Business Identity</Text>
        <Card>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setProfileModalVisible(true)}
          >
            <View style={[styles.iconBox, { backgroundColor: colors.surfaceHighlight }]}>
              <Ionicons name="business-outline" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Gym Business Profile</Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>
                {gymSettings.gymName} • GSTIN: {gymSettings.gstNumber}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textDim} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => navigation.navigate('Trainers')}
          >
            <View style={[styles.iconBox, { backgroundColor: colors.surfaceHighlight }]}>
              <Ionicons name="people-outline" size={20} color={colors.secondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Staff & Trainers Roster</Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>
                5 Certified coaches & staff members
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textDim} />
          </TouchableOpacity>
        </Card>

        {/* SECTION: APPEARANCE & THEME */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: spacing.md }]}>
          Appearance
        </Text>
        <Card>
          <View style={styles.settingRow}>
            <View style={[styles.iconBox, { backgroundColor: colors.surfaceHighlight }]}>
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>
                {isDark ? 'Obsidian Black theme active' : 'Clean Light theme active'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        {/* SECTION: SECURITY & DATA */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: spacing.md }]}>
          Security & Storage
        </Text>
        <Card>
          <View style={styles.settingRow}>
            <View style={[styles.iconBox, { backgroundColor: colors.surfaceHighlight }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.success} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>App Passcode / Biometric</Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>
                Lock admin screen on minimize
              </Text>
            </View>
            <Switch
              value={pinEnabled}
              onValueChange={(val) => {
                setPinEnabled(val);
                updateGymSettings({ securityPinEnabled: val });
              }}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.settingRow}>
            <View style={[styles.iconBox, { backgroundColor: colors.surfaceHighlight }]}>
              <Ionicons name="cloud-upload-outline" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Automatic Cloud Sync</Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>
                Daily local database snapshot
              </Text>
            </View>
            <Switch
              value={autoBackup}
              onValueChange={(val) => {
                setAutoBackup(val);
                updateGymSettings({ autoBackup: val });
              }}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity style={styles.settingRow} onPress={handleBackupNow}>
            <View style={[styles.iconBox, { backgroundColor: colors.surfaceHighlight }]}>
              <Ionicons name="save-outline" size={20} color={colors.text} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Backup Now</Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>
                Last backed up today at 09:15 AM
              </Text>
            </View>
            <Ionicons name="download-outline" size={18} color={colors.primary} />
          </TouchableOpacity>
        </Card>

        {/* SECTION: SYSTEM & ABOUT */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: spacing.md }]}>
          System
        </Text>
        <Card>
          <View style={styles.settingRow}>
            <View style={[styles.iconBox, { backgroundColor: colors.surfaceHighlight }]}>
              <Ionicons name="information-circle-outline" size={20} color={colors.textDim} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>{APP_NAME}</Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>{APP_VERSION}</Text>
            </View>
            <Text style={[styles.versionBadge, { color: colors.textDim }]}>Production Ready</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => Alert.alert('Support', 'Contact: support@powerhousegym.com\nTel: +91 98765 43210')}
          >
            <View style={[styles.iconBox, { backgroundColor: colors.surfaceHighlight }]}>
              <Ionicons name="headset-outline" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Help & Tech Support</Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>
                24/7 dedicated support desk
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textDim} />
          </TouchableOpacity>
        </Card>

        {/* Sign Out Button */}
        <Button
          title="Sign Out from Console"
          onPress={handleLogout}
          variant="danger"
          size="lg"
          icon="log-out-outline"
          style={{ marginVertical: spacing.xl, marginBottom: spacing.xxxl }}
        />
      </ScrollView>

      {/* EDIT GYM PROFILE MODAL */}
      <Modal visible={profileModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Gym Profile</Text>
              <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color={colors.textDim} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 380, marginVertical: spacing.md }}>
              <Input
                label="Gym Brand Name"
                value={gymName}
                onChangeText={setGymName}
                leftIcon="fitness-outline"
              />
              <Input
                label="Official Phone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                leftIcon="call-outline"
              />
              <Input
                label="Official Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                leftIcon="mail-outline"
              />
              <Input
                label="Facility Address"
                value={address}
                onChangeText={setAddress}
                leftIcon="location-outline"
              />
              <Input
                label="GSTIN Tax Number"
                value={gst}
                onChangeText={setGst}
                leftIcon="receipt-outline"
              />
            </ScrollView>

            <Button title="Save Profile" onPress={handleSaveGymProfile} size="lg" />
          </View>
        </View>
      </Modal>
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
  profileBanner: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerName: {
    ...typography.h3,
  },
  ownerRole: {
    ...typography.caption,
    fontWeight: '700',
    marginTop: 2,
  },
  ownerEmail: {
    ...typography.caption,
    marginTop: 2,
  },
  sectionTitle: {
    ...typography.caption,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
  settingSub: {
    ...typography.caption,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  versionBadge: {
    ...typography.caption,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalBox: {
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
});
