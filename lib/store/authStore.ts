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
  role: string | null;
  email: string;
  password: string;
  permissions: Permission | null;
  setCredentials: (role: string, email: string, password: string, permissions: Permission) => void;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      role: null,
      email: "",
      password: "",
      permissions: null,
      setCredentials: (role, email, password, permissions) => 
        set({ role, email, password, permissions }),
      logout: () => set({ role: null, email: "", password: "", permissions: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);