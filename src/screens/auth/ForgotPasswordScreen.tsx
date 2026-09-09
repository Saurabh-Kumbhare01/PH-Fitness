import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';
import { Header } from '../../components/common/Header';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { authService } from '../../services/authService';
import { spacing, typography } from '../../theme';

interface ForgotPasswordScreenProps {
  navigation: any;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const { colors } = useThemeStore();
  const [email, setEmail] = useState('admin@phfitness.com');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid registered email');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authService.requestPasswordReset(email);
      setLoading(false);
      navigation.navigate('OTPVerification', { email });
    } catch (e) {
      setLoading(false);
      setError('Failed to send OTP. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Forgot Password" showBack onBackPress={() => navigation.goBack()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.iconWrapper}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primaryMuted }]}>
              <Ionicons name="key-outline" size={36} color={colors.primary} />
            </View>
          </View>

          <Card style={styles.card}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Reset Your Password</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textDim }]}>
              Enter your registered gym administrator email address. We will send a 6-digit security code.
            </Text>

            <Input
              label="Registered Email"
              placeholder="admin@phfitness.com"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
              error={error}
            />

            <Button
              title="Send Verification Code"
              onPress={handleSendOtp}
              loading={loading}
              size="lg"
              icon="arrow-forward-outline"
              iconRight
              style={{ marginTop: spacing.md }}
            />
          </Card>
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
    padding: spacing.xl,
    flexGrow: 1,
    justifyContent: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    padding: spacing.xl,
  },
  cardTitle: {
    ...typography.h3,
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    ...typography.bodyMedium,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
});
