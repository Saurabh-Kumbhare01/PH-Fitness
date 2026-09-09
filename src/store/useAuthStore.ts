import { create } from 'zustand';
import { AuthUser, LoginCredentials, authService } from '../services/authService';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: 'usr-admin-01',
    name: 'Saurabh Sharma',
    email: 'admin@phfitness.com',
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    gymName: 'PowerHouse Fitness Arena',
  },
  token: 'mock-jwt-token-phfitness-2025',
  isAuthenticated: true, // Default to true for smooth instant mobile preview, with full logout/login testing capability
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      set({
        error: err.message || 'Login failed. Please verify your credentials.',
        isLoading: false,
      });
      return false;
    }
  },

  logout: async () => {
    await authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  clearError: () => set({ error: null }),
}));
