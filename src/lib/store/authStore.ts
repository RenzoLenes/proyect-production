import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Permission {
  dashboard: boolean;
  production: boolean;
  suppliers: boolean;
  transport: boolean;
  config: boolean;
}

interface AuthState {
  userId: string | null;
  name: string | null;
  role: number | null;
  permissions: Permission | null;
  token: string | null;
  login: (userData: {
    userId: string;
    name: string;
    role: number;
    permissions: Permission;
    token: string;
  }) => void;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      userId: null,
      name: null,
      role: null,
      permissions: null,
      token: null,
      login: (userData) => set({
        userId: userData.userId,
        name: userData.name,
        role: userData.role,
        permissions: userData.permissions,
        token: userData.token
      }),
      logout: async () => {
        try {
          // 1. Llamar al endpoint de logout
          await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
          });

          // 2. Limpiar el estado local
          set({
            userId: null,
            name: null,
            role: null,
            permissions: null,
            token: null
          });
        } catch (error) {
          console.error('Error during logout:', error);
        }
      },
      isAuthenticated: () => !!get().token
    }),
    {
      name: 'auth-storage',
    }
  )
);