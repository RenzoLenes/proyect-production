import { create } from "zustand";

interface AuthState {
  role: string | null;
  email: string;
  password: string;
  permissions: Record<string, boolean> | null;
  setCredentials: (role: string, email: string, password: string, permissions: Record<string, boolean>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  email: "",
  password: "",
  permissions: null,
  setCredentials: (role, email, password, permissions) =>
    set({ role, email, password, permissions }),
  logout: () => set({ role: null, email: "", password: "", permissions: null }),
}));
