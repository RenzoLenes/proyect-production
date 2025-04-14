import { Prisma } from "@prisma/client";

export interface MovimientoProcesoD{
    pro_codtic: string;           // Código TIC (15 caracteres)
    pro_codfol: string;           // Código Folio (15 caracteres)
    pro_numser: string;           // Número de Serie (15 caracteres)
    pro_numdoc: string;           // Número de Documento (15 caracteres)
    pro_itemov: Prisma.Decimal;           // Ítem de Movimiento (numeric, 18 dígitos, 0 decimales)
    pro_codpro: string;           // Código de Proceso (6 caracteres)
    pro_codsup: string;           // Código de Supervisión (6 caracteres)
    pro_codper: string;           // Código de Personal (15 caracteres)
    pro_fecsup: Date;             // Fecha de Supervisión (datetime)
    pro_cospro: Prisma.Decimal;           // Costo de Proceso (decimal, 18 dígitos, 2 decimales)
    pro_grumes?: string | null;   // Grupo de Merma (10 caracteres, opcional)
    pro_fecini?: Date | null;     // Fecha de Inicio (date, opcional)
    pro_fecter?: Date | null;
    pro_supter?: string | null;
}