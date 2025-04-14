import { Prisma } from "@prisma/client";

export interface RptPrendasProcesoResponse {
    pro_codpro: string; // Código del proceso
    pro_nompro: string; // Nombre del proceso
    total: Prisma.Decimal; // Total de prendas en el proceso
}


export interface RptPrendasProcesoTransformed {
    pro_codpro: string; // Código del proceso
    pro_nompro: string; // Nombre del proceso
    total: number; // Total de prendas en el proceso
}


export interface getPrendasPorProcesoParams {
    pro_codtic: string;
    pro_codfol: string;
    pro_codcal: string;
    pro_codtco: string;
    fecha_inicio: Date;
    fecha_fin: Date;
}
