"use server";

import { Calidad } from "@/interfaces/calidad.interface";
import { prisma } from "@/lib/prisma"


export interface getCalidadByTipoParams {
    pro_codtic?: string;
    pro_cotim?: string;
}

export const getCalidadByTipo = async (
    params: getCalidadByTipoParams
): Promise<Calidad[]> => {
    try {
        const calidades = await prisma.tb_calidad.findMany({
            where: {
                pro_codtic: params.pro_codtic,
                ...(params.pro_cotim ? { pro_codtim: params.pro_cotim } : {}),
                pro_estcal: 'ACTIVO'
            }
        });

        return calidades;

    } catch (error) {
        console.error("Error al obtener calidades por tipo de confeccion:", error);
        return [];
    }
}