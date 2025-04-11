"use server";

import { Proceso } from "@/interfaces/proceso.interface";
import { RptPrendasProceso } from "@/interfaces/reportes/rpt-prendas-proceso";
import { prisma } from "@/lib/prisma"


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

export interface getPrendasPorProcesoParams {
    pro_codtic: string;
    pro_codfol: string;
    pro_codcal: string;
    pro_codtco: string;
    fecha_inicio: Date;
    fecha_fin: Date;
}


export const getPrendasPorProceso = async (
    params: getPrendasPorProcesoParams
): Promise<RptPrendasProceso[]> => {
    try {
        const results = await prisma.$queryRaw<RptPrendasProceso[]>`
        EXEC dbo.RL_REPORTE_PRENDAS_PROCESO
            @vii_tipo_confeccion = ${params.pro_codtic},
            @vii_folder = ${params.pro_codfol},
            @vii_calidad = ${params.pro_codcal},
            @vii_tipo_corte = ${params.pro_codtco},
            @vii_fecha_inicio = ${params.fecha_inicio},
            @vii_fecha_fin = ${params.fecha_fin}
        `;
        return results;

    } catch (error) {
        console.error("Error al obtener prendas por proceso:", error);
        return [];
    }
}

