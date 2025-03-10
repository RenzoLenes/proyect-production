import { UserPermissions } from "@/types/user";

export const mockRoles = [
    {
        name: "Administrador",
        permissions: {
          dashboard: true,
          production: true,
          suppliers: true,
          transport: true,
          config: true,
        } as UserPermissions,
      },
    {
        name: "Supervisor",
        permissions: {
            dashboard: true,
            production: true,
            suppliers: true,
            transport: true,
            config: false,
          } as UserPermissions,
    },
    {
        name: "Operador",
        permissions: {
            dashboard: false,
            production: true,
            suppliers: false,
            transport: false,
            config: false,
          } as UserPermissions,
    },
];