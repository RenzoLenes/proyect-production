import { UserPermissions } from "./user";

export interface Role {
  name: string;
  permissions: UserPermissions;
}

export interface RolesState {
  roles: Role[];
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  updateRole: (roleName: string, permissions: UserPermissions) => void;
}