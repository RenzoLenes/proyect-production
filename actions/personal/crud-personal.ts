"use server";
import { Personal } from "@/interfaces/personal.interface";
import { prisma } from "@/lib/prisma"



export const getPersonalByTipo = async (tipo?: string): Promise<Personal[]> => {
    try {
        const personal = await prisma.tb_personal.findMany({
            where: {
                ...(tipo ? { pro_intext: tipo } : {}),
                
                pro_estper: 'ACTIVO'
            }   
        });

        return personal.map(p => ({
            ...p,
        }));

    } catch (error) {
        console.error("Error al obtener procesos por tipo de confeccion:", error);
        return [];
    }
}

export interface PersonalUser {
    pro_codper?: string;
    pro_nomper?: string;
    pro_apeper?: string | null;
    pro_conper?: string | null;
}

export const getPersonalUser = async (id: string): Promise<PersonalUser | null> => {
    try {
        const personal = await prisma.tb_personal.findUnique({
            where: {
                pro_codper: id,
            },
            select: {
                pro_codper: true,
                pro_nomper: true,
                pro_apeper: true,
                pro_conper: true,
                pro_rolper: true,
            }
        });

        return personal;
        
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        return null;
    }
}