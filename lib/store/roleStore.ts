import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserPermissions } from '@/types/user';
import { Role } from '@/types/role';
import { mockRoles } from '@/data/mockRole';


export const useRolesStore = create(
  persist<{
    roles: Role[];
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
  }>(
    (set) => ({
      roles: mockRoles,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'roles-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);