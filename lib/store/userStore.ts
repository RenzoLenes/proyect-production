import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist<{
    role: string | null;
    setRole: (role: string) => void;
    clear: () => void;
  }>(
    (set) => ({
      role: null,
      setRole: (role) => set({ role }),
      clear: () => set({ role: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);