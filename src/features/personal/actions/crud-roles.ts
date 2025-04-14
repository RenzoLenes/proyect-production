"use server";
import { prisma } from "@/lib/prisma"
import { Role } from "../types/role.interface";



export const getRoles = async (tipo?: string): Promise<Role[]> => {
    try {
        const roles = await prisma.tb_roles.findMany({
            where: {
                rol_activo: true
            }
        });

        return roles;

    } catch (error) {
        console.error("Error al obtener procesos por tipo de confeccion:", error);
        return [];
    }
}



export const updateRole = async (role: Role): Promise<Role> => {
    try {
        const { rol_id, ...updateData } = role;

        const updatedRole = await prisma.tb_roles.update({
            where: { rol_id: rol_id },
            data: updateData,
        });
        return updatedRole;
    } catch (error) {
        console.error("Error al actualizar el rol:", error);
        throw new Error("No se pudo actualizar el rol");
    }
}

export const createRole = async (role: Omit<Role, 'rol_id'>): Promise<Role> => {
    try {
        const newRole = await prisma.tb_roles.create({
            data: {
                rol_nombre: role.rol_nombre,
                dashboard: role.dashboard || false,
                production: role.production || false,
                suppliers: role.suppliers || false,
                transport: role.transport || false,
                config: role.config || false
            }
        });

        return newRole as Role;
    } catch (error) {
        console.error('Error al crear rol:', error);
        throw error;
    }
};

export const deleteRole = async (roleId: number): Promise<void> => {
    try {
        await prisma.tb_roles.delete({
            where: {
                rol_id: roleId
            }
        });
    } catch (error) {
        console.error('Error al eliminar rol:', error);
        throw new Error("No se pudo eliminar el rol");
    }
};