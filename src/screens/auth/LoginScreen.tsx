import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { APP_NAME } from '../../constants';
import { spacing, typography, borderRadius } from '../../theme';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { colors } = useThemeStore();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('admin@phfitness.com');
  const [password, setPassword] = useState('Admin@1234');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');

    if (!email.trim()) {
      setEmailError('Email address is required');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    const success = await login({ email, password });
    if (success) {
      navigation.replace('MainTabs');
    }
  };

  const handleQuickDemo = () => {
    setEmail('admin@phfitness.com');
    setPassword('Admin@1234');
    handleLogin();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}>
            <Ionicons name="barbell" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{APP_NAME}</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Admin & Owner Management Portal
          </Text>
        </View>

        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Sign In to Workspace</Text>
          <Text style={[styles.cardSubtitle, { color: colors.textDim }]}>
            Enter your credentials to manage members and payments
          </Text>

          {error && (
            <View style={[styles.errorBanner, { backgroundColor: colors.dangerMuted }]}>
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Text style={[styles.errorBannerText, { color: colors.danger }]}>{error}</Text>
            </View>
          )}

          <Input
            label="Email Address"
            placeholder="admin@phfitness.com"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              clearError();
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
            error={emailError}
          />

          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              clearError();
            }}
            isPassword
            leftIcon="lock-closed-outline"
            error={passwordError}
          />

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            size="lg"
            icon="log-in-outline"
            iconRight
          />

          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textDim }]}>OR QUICK ACCESS</Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>

          <Button
            title="One-Tap Demo Admin Sign In"
            onPress={handleQuickDemo}
            variant="secondary"
            size="md"
            icon="flash-outline"
          />
        </Card>

        <View style={styles.securityFooter}>
          <Ionicons name="shield-checkmark-outline" size={16} color={colors.primary} />
          <Text style={[styles.securityText, { color: colors.textDim }]}>
            Secure AES-256 Session Encrypted
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    letterSpacing: 1.5,
  },
  subtitle: {
    ...typography.bodySmall,
    marginTop: 4,
  },
  card: {
    padding: spacing.xl,
  },
  cardTitle: {
    ...typography.h3,
    marginBottom: 4,
  },
  cardSubtitle: {
    ...typography.bodySmall,
    marginBottom: spacing.lg,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  errorBannerText: {
    ...typography.bodySmall,
    flex: 1,
    fontWeight: '500',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    ...typography.caption,
    marginHorizontal: spacing.md,
    fontWeight: '600',
  },
  securityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    gap: 6,
  },
  securityText: {
    ...typography.caption,
  },
});
