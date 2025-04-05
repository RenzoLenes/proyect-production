"use server";

import { prisma } from "@/lib/prisma"


export const getProcesosByTipoConfeccion = async (tipoConfeccion: string) => {
    try {
        const procesos = await prisma.tb_proceso.findMany({
            where: {
                pro_codtic: tipoConfeccion
            }
        });
        return procesos;

    } catch (error) {
        console.error("Error al obtener procesos por tipo de confeccion:", error);
        return [];
    }
}

