export const darkPalette = {
  background: '#090D16',
  surface: '#111726',
  surfaceHighlight: '#1A233A',
  card: '#131C31',
  cardBorder: '#202D49',
  border: '#1E293B',
  
  // Brand
  primary: '#10B981', // Electric Emerald
  primaryDark: '#059669',
  primaryLight: '#34D399',
  primaryMuted: 'rgba(16, 185, 129, 0.15)',
  
  secondary: '#6366F1', // Indigo Accent
  secondaryMuted: 'rgba(99, 102, 241, 0.15)',
  
  accent: '#06B6D4', // Cyan
  accentMuted: 'rgba(6, 182, 212, 0.15)',

  // Text
  text: '#F8FAFC',
  textMuted: '#94A3B8',
  textDim: '#64748B',
  textInverse: '#090D16',

  // Status
  success: '#10B981',
  successMuted: 'rgba(16, 185, 129, 0.16)',
  warning: '#F59E0B',
  warningMuted: 'rgba(245, 158, 11, 0.16)',
  danger: '#EF4444',
  dangerMuted: 'rgba(239, 68, 68, 0.16)',
  info: '#3B82F6',
  infoMuted: 'rgba(59, 130, 246, 0.16)',

  // Elements
  inputBackground: '#0D1424',
  inputBorder: '#1E2B45',
  modalBackground: '#111827',
  navBar: '#0B101D',
  tabBar: '#0C1222',
  tabBarBorder: '#1A243C',
};

export const lightPalette = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceHighlight: '#F1F5F9',
  card: '#FFFFFF',
  cardBorder: '#E2E8F0',
  border: '#E2E8F0',
  
  // Brand
  primary: '#059669',
  primaryDark: '#047857',
  primaryLight: '#10B981',
  primaryMuted: 'rgba(5, 150, 105, 0.12)',
  
  secondary: '#4F46E5',
  secondaryMuted: 'rgba(79, 70, 229, 0.12)',
  
  accent: '#0891B2',
  accentMuted: 'rgba(8, 145, 178, 0.12)',

  // Text
  text: '#0F172A',
  textMuted: '#475569',
  textDim: '#94A3B8',
  textInverse: '#FFFFFF',

  // Status
  success: '#059669',
  successMuted: 'rgba(5, 150, 105, 0.12)',
  warning: '#D97706',
  warningMuted: 'rgba(217, 119, 6, 0.12)',
  danger: '#DC2626',
  dangerMuted: 'rgba(220, 38, 38, 0.12)',
  info: '#2563EB',
  infoMuted: 'rgba(37, 99, 235, 0.12)',

  // Elements
  inputBackground: '#F8FAFC',
  inputBorder: '#CBD5E1',
  modalBackground: '#FFFFFF',
  navBar: '#FFFFFF',
  tabBar: '#FFFFFF',
  tabBarBorder: '#E2E8F0',
};

export type ThemeColors = typeof darkPalette;
