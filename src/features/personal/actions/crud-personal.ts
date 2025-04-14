"use server";
import { Personal } from "@/features/personal/types/personal.interface";
import { prisma } from "@/lib/prisma"



export const getPersonalByTipo = async (tipo?: string): Promise<Personal[]> => {
    try {
        const personal = await prisma.tb_personal.findMany({
            where: {
                ...(tipo ? { pro_intext: tipo } : {}),
                
                pro_estper: 'ACTIVO'
            }   
        });

        return personal;

    } catch (error) {
        console.error("Error al obtener procesos por tipo de confeccion:", error);
        return [];
    }
}

