import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { Header } from '../../components/common/Header';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { trainerService } from '../../services/trainerService';
import { spacing } from '../../theme';

interface AddTrainerScreenProps {
  navigation: any;
}

export const AddTrainerScreen: React.FC<AddTrainerScreenProps> = ({ navigation }) => {
  const { colors } = useThemeStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [specialtyStr, setSpecialtyStr] = useState('Strength, Functional, Weight Loss');
  const [experienceStr, setExperienceStr] = useState('5');
  const [salaryStr, setSalaryStr] = useState('40000');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !phone.trim() || !email.trim()) {
      Alert.alert('Required Fields', 'Please fill name, phone, and email.');
      return;
    }

    setLoading(true);
    await trainerService.addTrainer({
      name,
      phone,
      email,
      specialty: specialtyStr.split(',').map((s) => s.trim()),
      experienceYears: parseInt(experienceStr) || 1,
      status: 'active',
      bio: bio || 'Professional certified coach at PowerHouse Fitness Arena.',
      monthlySalary: parseInt(salaryStr) || 35000,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    });
    setLoading(false);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Add Fitness Coach"
        subtitle="Onboard a new trainer to gym roster"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Card>
            <Input
              label="Trainer Full Name *"
              placeholder="e.g. Vikram Rawat"
              value={name}
              onChangeText={setName}
              leftIcon="person-outline"
            />

            <Input
              label="Contact Phone *"
              placeholder="+91 98..."
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              leftIcon="call-outline"
            />

            <Input
              label="Email Address *"
              placeholder="trainer@gym.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
            />

            <Input
              label="Specialties (Comma Separated)"
              placeholder="e.g. Bodybuilding, HIIT, Rehab"
              value={specialtyStr}
              onChangeText={setSpecialtyStr}
              leftIcon="barbell-outline"
            />

            <Input
              label="Years of Experience"
              placeholder="5"
              value={experienceStr}
              onChangeText={setExperienceStr}
              keyboardType="numeric"
              leftIcon="trophy-outline"
            />

            <Input
              label="Monthly Compensation (₹)"
              placeholder="45000"
              value={salaryStr}
              onChangeText={setSalaryStr}
              keyboardType="numeric"
              leftIcon="cash-outline"
            />

            <Input
              label="Professional Bio / Credentials"
              placeholder="e.g. ISSA Certified Master Trainer..."
              value={bio}
              onChangeText={setBio}
              multiline
            />
          </Card>

          <Button
            title="Register Fitness Coach"
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
});
