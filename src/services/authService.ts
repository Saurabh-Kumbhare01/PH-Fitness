export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'manager' | 'staff';
  avatar?: string;
  gymName: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> => {
    // Simulated network latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }

    return {
      user: {
        id: 'usr-admin-01',
        name: 'Saurabh Sharma',
        email: credentials.email,
        role: 'owner',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
        gymName: 'PowerHouse Fitness Arena',
      },
      token: 'mock-jwt-token-phfitness-2025',
    };
  },

  requestPasswordReset: async (email: string): Promise<{ success: boolean; message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      message: `A 6-digit verification OTP has been sent to ${email}`,
    };
  },

  verifyOtp: async (otp: string): Promise<{ success: boolean; valid: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    // Default valid mock OTP is 123456 or any 6 digits
    return {
      success: true,
      valid: otp.length === 6,
    };
  },

  resetPassword: async (newPassword: string): Promise<{ success: boolean; message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      message: 'Your password has been reset successfully. Please log in.',
    };
  },

  logout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
  },
};
