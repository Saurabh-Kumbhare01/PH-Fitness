import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';
import { Header } from '../../components/common/Header';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { authService } from '../../services/authService';
import { spacing, typography, borderRadius } from '../../theme';

interface ResetPasswordScreenProps {
  navigation: any;
}

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ navigation }) => {
  const { colors } = useThemeStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    let valid = true;
    setPasswordError('');
    setConfirmError('');

    if (password.length < 8) {
      setPasswordError('Password must contain at least 8 characters');
      valid = false;
    }

    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match');
      valid = false;
    }

    if (!valid) return;

    setLoading(true);
    await authService.resetPassword(password);
    setLoading(false);
    setSuccess(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Set New Password" showBack onBackPress={() => navigation.goBack()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {success ? (
            <Card style={styles.successCard}>
              <View style={[styles.successIconCircle, { backgroundColor: colors.successMuted }]}>
                <Ionicons name="checkmark-done" size={48} color={colors.success} />
              </View>
              <Text style={[styles.successTitle, { color: colors.text }]}>Password Updated!</Text>
              <Text style={[styles.successSubtitle, { color: colors.textMuted }]}>
                Your gym administrator password has been updated securely. You can now log in.
              </Text>
              <Button
                title="Back to Login"
                onPress={() => navigation.navigate('Login')}
                size="lg"
                style={{ width: '100%', marginTop: spacing.xl }}
              />
            </Card>
          ) : (
            <Card style={styles.card}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Create Secure Password</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textDim }]}>
                Choose a strong password with letters, numbers, and special characters.
              </Text>

              <Input
                label="New Password"
                placeholder="At least 8 characters"
                value={password}
                onChangeText={setPassword}
                isPassword
                leftIcon="lock-closed-outline"
                error={passwordError}
              />

              <Input
                label="Confirm New Password"
                placeholder="Re-type new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                isPassword
                leftIcon="shield-checkmark-outline"
                error={confirmError}
              />

              <View style={styles.checklist}>
                <View style={styles.checkItem}>
                  <Ionicons
                    name={password.length >= 8 ? 'checkmark-circle' : 'ellipse-outline'}
                    size={16}
                    color={password.length >= 8 ? colors.success : colors.textDim}
                  />
                  <Text style={[styles.checkText, { color: colors.textMuted }]}>
                    Minimum 8 characters
                  </Text>
                </View>
                <View style={styles.checkItem}>
                  <Ionicons
                    name={/[A-Z]/.test(password) ? 'checkmark-circle' : 'ellipse-outline'}
                    size={16}
                    color={/[A-Z]/.test(password) ? colors.success : colors.textDim}
                  />
                  <Text style={[styles.checkText, { color: colors.textMuted }]}>
                    At least one uppercase letter
                  </Text>
                </View>
              </View>

              <Button
                title="Update Password"
                onPress={handleReset}
                loading={loading}
                size="lg"
                style={{ marginTop: spacing.lg }}
              />
            </Card>
          )}
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
  checklist: {
    marginVertical: spacing.sm,
    gap: spacing.xs,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkText: {
    ...typography.bodySmall,
  },
  successCard: {
    padding: spacing.xl,
    alignItems: 'center',
    textAlign: 'center',
  },
  successIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  successTitle: {
    ...typography.h2,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  successSubtitle: {
    ...typography.bodyMedium,
    textAlign: 'center',
    lineHeight: 20,
  },
});
