import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { APP_NAME, APP_TAGLINE, APP_VERSION } from '../../constants';
import { typography, spacing } from '../../theme';

interface SplashScreenProps {
  navigation: any;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const { colors } = useThemeStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigation.replace('MainTabs');
      } else {
        navigation.replace('Login');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.logoContainer}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}>
          <Ionicons name="barbell" size={56} color={colors.primary} />
        </View>

        <Text style={[styles.appName, { color: colors.text }]}>{APP_NAME}</Text>
        <Text style={[styles.tagline, { color: colors.textMuted }]}>{APP_TAGLINE}</Text>
      </View>

      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} style={{ marginBottom: spacing.sm }} />
        <Text style={[styles.version, { color: colors.textDim }]}>{APP_VERSION}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xxxl * 2,
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  appName: {
    ...typography.h1,
    letterSpacing: 2,
    fontWeight: '800',
  },
  tagline: {
    ...typography.bodyMedium,
    marginTop: spacing.xs,
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
  },
  version: {
    ...typography.caption,
  },
});
