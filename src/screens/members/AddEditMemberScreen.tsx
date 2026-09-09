import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';
import { useMemberStore } from '../../store/useMemberStore';
import { Header } from '../../components/common/Header';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { MOCK_PLANS } from '../../mock/memberships';
import { MOCK_TRAINERS } from '../../mock/trainers';
import { BLOOD_GROUPS, GENDERS } from '../../constants';
import { calculateBmi, getBmiCategory } from '../../utils/formatters';
import { Gender, Member } from '../../types';
import { spacing, typography, borderRadius } from '../../theme';

interface AddEditMemberScreenProps {
  navigation: any;
  route: any;
}

export const AddEditMemberScreen: React.FC<AddEditMemberScreenProps> = ({
  navigation,
  route,
}) => {
  const { colors } = useThemeStore();
  const { members, addMember, updateMember } = useMemberStore();

  const editId = route.params?.memberId;
  const existingMember = editId ? members.find((m) => m.id === editId) : null;

  // Personal
  const [fullName, setFullName] = useState(existingMember?.fullName || '');
  const [phone, setPhone] = useState(existingMember?.phone || '');
  const [email, setEmail] = useState(existingMember?.email || '');
  const [gender, setGender] = useState<Gender>(existingMember?.gender || 'male');
  const [dob, setDob] = useState(existingMember?.dob || '1996-05-15');
  const [address, setAddress] = useState(existingMember?.address || '');
  const [photo, setPhoto] = useState(
    existingMember?.photo ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'
  );

  // Emergency
  const [emergencyName, setEmergencyName] = useState(
    existingMember?.emergencyContact.name || ''
  );
  const [emergencyPhone, setEmergencyPhone] = useState(
    existingMember?.emergencyContact.phone || ''
  );
  const [emergencyRel, setEmergencyRel] = useState(
    existingMember?.emergencyContact.relationship || 'Spouse'
  );

  // Health
  const [heightCm, setHeightCm] = useState(
    existingMember?.heightCm ? existingMember.heightCm.toString() : '175'
  );
  const [weightKg, setWeightKg] = useState(
    existingMember?.weightKg ? existingMember.weightKg.toString() : '75'
  );
  const [bloodGroup, setBloodGroup] = useState(existingMember?.bloodGroup || 'B+');
  const [medicalConditions, setMedicalConditions] = useState(
    existingMember?.medicalConditions || ''
  );

  // Membership & Trainer
  const [selectedPlanId, setSelectedPlanId] = useState(
    existingMember?.planId || MOCK_PLANS[2].id
  );
  const [selectedTrainerId, setSelectedTrainerId] = useState(
    existingMember?.assignedTrainerId || MOCK_TRAINERS[0].id
  );
  const [notes, setNotes] = useState(existingMember?.notes || '');

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Calculate live BMI
  const numWeight = parseFloat(weightKg) || 0;
  const numHeight = parseFloat(heightCm) || 0;
  const bmi = calculateBmi(numWeight, numHeight);
  const bmiInfo = getBmiCategory(bmi);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!phone.trim()) errs.phone = 'Phone number is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email is required';
    if (!emergencyName.trim()) errs.emergencyName = 'Emergency contact name is required';
    if (!emergencyPhone.trim()) errs.emergencyPhone = 'Emergency phone is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);

    const selectedPlan = MOCK_PLANS.find((p) => p.id === selectedPlanId) || MOCK_PLANS[0];
    const selectedTrainer = MOCK_TRAINERS.find((t) => t.id === selectedTrainerId);

    const today = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + selectedPlan.durationDays * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    try {
      if (existingMember) {
        await updateMember(existingMember.id, {
          fullName,
          phone,
          email,
          gender,
          dob,
          address,
          photo,
          emergencyContact: {
            name: emergencyName,
            phone: emergencyPhone,
            relationship: emergencyRel,
          },
          heightCm: numHeight,
          weightKg: numWeight,
          bmi,
          bloodGroup,
          medicalConditions,
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          assignedTrainerId: selectedTrainer?.id,
          assignedTrainerName: selectedTrainer?.name,
          notes,
        });
      } else {
        await addMember({
          fullName,
          phone,
          email,
          gender,
          dob,
          address,
          photo,
          emergencyContact: {
            name: emergencyName,
            phone: emergencyPhone,
            relationship: emergencyRel,
          },
          heightCm: numHeight,
          weightKg: numWeight,
          bmi,
          bloodGroup,
          medicalConditions,
          joinDate: today,
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          membershipStatus: 'active',
          membershipStartDate: today,
          membershipEndDate: endDate,
          assignedTrainerId: selectedTrainer?.id,
          assignedTrainerName: selectedTrainer?.name,
          notes,
          lastVisit: 'Never',
        });
      }

      setLoading(false);
      navigation.goBack();
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title={existingMember ? 'Edit Member Profile' : 'Enroll New Member'}
        subtitle="Complete gym member registration"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* SECTION 1: PERSONAL INFORMATION */}
          <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-outline" size={18} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                1. Personal Information
              </Text>
            </View>

            <Input
              label="Full Name *"
              placeholder="e.g. Arjun Singhania"
              value={fullName}
              onChangeText={setFullName}
              error={errors.fullName}
              leftIcon="person-outline"
            />

            <Input
              label="Contact Phone Number *"
              placeholder="e.g. +91 98765 43210"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              error={errors.phone}
              leftIcon="call-outline"
            />

            <Input
              label="Email Address *"
              placeholder="e.g. arjun.s@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              leftIcon="mail-outline"
            />

            {/* Gender Selection */}
            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>GENDER</Text>
            <View style={styles.genderRow}>
              {GENDERS.map((g) => (
                <TouchableOpacity
                  key={g.value}
                  onPress={() => setGender(g.value)}
                  style={[
                    styles.genderBtn,
                    {
                      backgroundColor: gender === g.value ? colors.primary : colors.inputBackground,
                      borderColor: gender === g.value ? colors.primary : colors.inputBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.genderBtnText,
                      { color: gender === g.value ? '#FFFFFF' : colors.textMuted },
                    ]}
                  >
                    {g.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input
              label="Date of Birth"
              placeholder="YYYY-MM-DD"
              value={dob}
              onChangeText={setDob}
              leftIcon="calendar-outline"
            />

            <Input
              label="Residential Address"
              placeholder="Apartment, Street, Sector"
              value={address}
              onChangeText={setAddress}
              leftIcon="location-outline"
            />
          </Card>

          {/* SECTION 2: HEALTH & FITNESS */}
          <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="heart-outline" size={18} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                2. Health & Fitness Metrics
              </Text>
            </View>

            <View style={styles.twoCol}>
              <Input
                label="Height (cm)"
                placeholder="175"
                value={heightCm}
                onChangeText={setHeightCm}
                keyboardType="numeric"
                containerStyle={{ flex: 1 }}
              />
              <Input
                label="Weight (kg)"
                placeholder="75"
                value={weightKg}
                onChangeText={setWeightKg}
                keyboardType="numeric"
                containerStyle={{ flex: 1 }}
              />
            </View>

            {/* Live BMI Banner */}
            <View style={[styles.bmiBox, { backgroundColor: colors.surfaceHighlight }]}>
              <View>
                <Text style={[styles.bmiLabel, { color: colors.textMuted }]}>Calculated BMI</Text>
                <Text style={[styles.bmiValue, { color: colors.text }]}>{bmi || '--'}</Text>
              </View>
              <Badge label={bmiInfo.label} variant="primary" />
            </View>

            {/* Blood Group */}
            <Text style={[styles.fieldLabel, { color: colors.textMuted, marginTop: spacing.md }]}>
              BLOOD GROUP
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bloodGroupRow}>
              {BLOOD_GROUPS.map((bg) => (
                <TouchableOpacity
                  key={bg}
                  onPress={() => setBloodGroup(bg)}
                  style={[
                    styles.bgPill,
                    {
                      backgroundColor: bloodGroup === bg ? colors.primary : colors.inputBackground,
                      borderColor: bloodGroup === bg ? colors.primary : colors.inputBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.bgPillText,
                      { color: bloodGroup === bg ? '#FFFFFF' : colors.textMuted },
                    ]}
                  >
                    {bg}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Input
              label="Medical Conditions / Allergies"
              placeholder="e.g. Asthma, Knee surgery, High BP"
              value={medicalConditions}
              onChangeText={setMedicalConditions}
              leftIcon="medkit-outline"
              containerStyle={{ marginTop: spacing.md }}
            />
          </Card>

          {/* SECTION 3: EMERGENCY CONTACT */}
          <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="call-outline" size={18} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                3. Emergency Contact
              </Text>
            </View>

            <Input
              label="Contact Person Name *"
              placeholder="e.g. Spouse / Parent name"
              value={emergencyName}
              onChangeText={setEmergencyName}
              error={errors.emergencyName}
            />

            <View style={styles.twoCol}>
              <Input
                label="Emergency Phone *"
                placeholder="+91 98..."
                value={emergencyPhone}
                onChangeText={setEmergencyPhone}
                keyboardType="phone-pad"
                error={errors.emergencyPhone}
                containerStyle={{ flex: 1 }}
              />
              <Input
                label="Relationship"
                placeholder="e.g. Spouse"
                value={emergencyRel}
                onChangeText={setEmergencyRel}
                containerStyle={{ flex: 1 }}
              />
            </View>
          </Card>

          {/* SECTION 4: MEMBERSHIP & TRAINER */}
          <Card style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="ribbon-outline" size={18} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                4. Membership & Trainer
              </Text>
            </View>

            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>SELECT PLAN</Text>
            <View style={styles.planSelectorGroup}>
              {MOCK_PLANS.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <TouchableOpacity
                    key={plan.id}
                    onPress={() => setSelectedPlanId(plan.id)}
                    style={[
                      styles.planOption,
                      {
                        backgroundColor: isSelected ? colors.primaryMuted : colors.inputBackground,
                        borderColor: isSelected ? colors.primary : colors.inputBorder,
                      },
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.planOptionName, { color: colors.text }]}>
                        {plan.name} ({plan.durationType})
                      </Text>
                      <Text style={[styles.planOptionDesc, { color: colors.textDim }]}>
                        {plan.durationDays} Days validity
                      </Text>
                    </View>
                    <Text style={[styles.planOptionPrice, { color: colors.primary }]}>
                      ₹{plan.price}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.fieldLabel, { color: colors.textMuted, marginTop: spacing.lg }]}>
              ASSIGN PERSONAL TRAINER
            </Text>
            <View style={styles.trainerSelectorGroup}>
              {MOCK_TRAINERS.map((trainer) => {
                const isSelected = selectedTrainerId === trainer.id;
                return (
                  <TouchableOpacity
                    key={trainer.id}
                    onPress={() => setSelectedTrainerId(trainer.id)}
                    style={[
                      styles.trainerOption,
                      {
                        backgroundColor: isSelected ? colors.primaryMuted : colors.inputBackground,
                        borderColor: isSelected ? colors.primary : colors.inputBorder,
                      },
                    ]}
                  >
                    <Ionicons
                      name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                      size={18}
                      color={isSelected ? colors.primary : colors.textDim}
                    />
                    <Text style={[styles.trainerOptionName, { color: colors.text }]}>
                      {trainer.name}
                    </Text>
                    <Text style={[styles.trainerOptionSpec, { color: colors.textMuted }]}>
                      ({trainer.specialty[0]})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Input
              label="Special Notes / Goals"
              placeholder="e.g. Weight loss target 5kg, preparing for marathon..."
              value={notes}
              onChangeText={setNotes}
              multiline
              containerStyle={{ marginTop: spacing.md }}
            />
          </Card>

          <Button
            title={existingMember ? 'Save Changes' : 'Complete Enrollment'}
            onPress={handleSave}
            loading={loading}
            size="lg"
            icon="checkmark-circle-outline"
            iconRight
            style={{ marginVertical: spacing.xl }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
  sectionCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
  },
  fieldLabel: {
    ...typography.caption,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  genderRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  genderBtnText: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  twoCol: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  bmiBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginVertical: spacing.xs,
  },
  bmiLabel: {
    ...typography.caption,
  },
  bmiValue: {
    ...typography.h3,
    marginTop: 2,
  },
  bloodGroupRow: {
    gap: spacing.sm,
    paddingVertical: 4,
  },
  bgPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  bgPillText: {
    ...typography.caption,
    fontWeight: '700',
  },
  planSelectorGroup: {
    gap: spacing.sm,
  },
  planOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  planOptionName: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
  planOptionDesc: {
    ...typography.caption,
    marginTop: 2,
  },
  planOptionPrice: {
    ...typography.h4,
    fontWeight: '700',
  },
  trainerSelectorGroup: {
    gap: spacing.sm,
  },
  trainerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  trainerOptionName: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
  trainerOptionSpec: {
    ...typography.caption,
  },
});
