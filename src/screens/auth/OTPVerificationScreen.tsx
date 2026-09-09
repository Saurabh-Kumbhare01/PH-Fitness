import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { authService } from '../../services/authService';
import { spacing, typography, borderRadius } from '../../theme';

interface OTPVerificationScreenProps {
  navigation: any;
  route: any;
}

export const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({
  navigation,
  route,
}) => {
  const { colors } = useThemeStore();
  const email = route.params?.email || 'admin@phfitness.com';

  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [timer, setTimer] = useState(45);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    const entered = otp.join('');
    if (entered.length < 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    setError('');
    const result = await authService.verifyOtp(entered);
    setLoading(false);

    if (result.valid) {
      navigation.navigate('ResetPassword');
    } else {
      setError('Invalid verification code. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Verify OTP" showBack onBackPress={() => navigation.goBack()} />

      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primaryMuted }]}>
            <Ionicons name="shield-checkmark-outline" size={36} color={colors.primary} />
          </View>
        </View>

        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Enter 6-Digit Security Code</Text>
          <Text style={[styles.cardSubtitle, { color: colors.textDim }]}>
            We have sent a verification code to{' '}
            <Text style={{ color: colors.text, fontWeight: '600' }}>{email}</Text>
          </Text>

          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <View
                key={`digit-${index}`}
                style={[
                  styles.otpBox,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: digit ? colors.primary : colors.inputBorder,
                  },
                ]}
              >
                <Text style={[styles.otpDigit, { color: colors.text }]}>{digit}</Text>
              </View>
            ))}
          </View>

          {error ? (
            <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
          ) : null}

          <Button
            title="Verify Code"
            onPress={handleVerify}
            loading={loading}
            size="lg"
            style={{ marginTop: spacing.xl }}
          />

          <View style={styles.resendRow}>
            <Text style={[styles.resendLabel, { color: colors.textMuted }]}>
              Didn't receive code?{' '}
            </Text>
            {timer > 0 ? (
              <Text style={[styles.timerText, { color: colors.primary }]}>
                Resend in {timer}s
              </Text>
            ) : (
              <TouchableOpacity onPress={() => setTimer(45)}>
                <Text style={[styles.resendAction, { color: colors.primary }]}>Resend Now</Text>
              </TouchableOpacity>
            )}
          </View>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    flex: 1,
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
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.md,
  },
  otpBox: {
    width: 44,
    height: 52,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpDigit: {
    ...typography.h3,
    fontWeight: '700',
  },
  errorText: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  resendLabel: {
    ...typography.bodySmall,
  },
  timerText: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  resendAction: {
    ...typography.bodySmall,
    fontWeight: '700',
  },
});
