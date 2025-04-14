"use server";

import { prisma } from "@/lib/prisma"
import { Proceso } from "../types/proceso.interface";


export const getProcesosByTipoConfeccion = async (tipoConfeccion: string): Promise<Proceso[]> => {
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


