import { create } from 'zustand';
import { darkPalette, lightPalette, ThemeColors } from '../theme/colors';
import { GymSettings } from '../types';
import { DEFAULT_GYM_SETTINGS } from '../constants';

interface ThemeState {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  setDark: (val: boolean) => void;
  gymSettings: GymSettings;
  updateGymSettings: (settings: Partial<GymSettings>) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDark: true,
  colors: darkPalette,
  toggleTheme: () => {
    const next = !get().isDark;
    set({
      isDark: next,
      colors: next ? darkPalette : lightPalette,
    });
  },
  setDark: (val: boolean) => {
    set({
      isDark: val,
      colors: val ? darkPalette : lightPalette,
    });
  },
  gymSettings: DEFAULT_GYM_SETTINGS,
  updateGymSettings: (updates) => {
    set((state) => ({
      gymSettings: { ...state.gymSettings, ...updates },
    }));
  },
}));
