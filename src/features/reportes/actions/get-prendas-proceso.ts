"use server";

import { prisma } from "@/lib/prisma"
import { getPrendasPorProcesoParams, RptPrendasProcesoResponse, RptPrendasProcesoTransformed } from "../types/rpt-prendas-proceso.interface";


export const getPrendasPorProceso = async (
    params: getPrendasPorProcesoParams
): Promise<RptPrendasProcesoTransformed[]> => {
    try {
        const results = await prisma.$queryRaw<RptPrendasProcesoResponse[]>`
        EXEC dbo.RL_REPORTE_PRENDAS_PROCESO
            @vii_tipo_confeccion = ${params.pro_codtic},
            @vii_folder = ${params.pro_codfol},
            @vii_calidad = ${params.pro_codcal},
            @vii_tipo_corte = ${params.pro_codtco},
            @vii_fecha_inicio = ${params.fecha_inicio},
            @vii_fecha_fin = ${params.fecha_fin}
        `;

        // Transformar los resultados si es necesario
        const data = results.map((item) => ({
            pro_codpro: item.pro_codpro,
            pro_nompro: item.pro_nompro,
            total: Number(item.total), // Convertir Decimal a number
        }));

        return data;

    } catch (error) {
        console.error("Error al obtener prendas por proceso:", error);
        return [];
    }
}
