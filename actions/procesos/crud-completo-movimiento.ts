
"use server";

import { MovimientoProcesoD } from "@/interfaces/movimientoprocesod.interface";
import { prisma } from "@/lib/prisma"


export interface UnifiedMovementParams {
    // Parámetros base para ambos movimientos
    pro_codtic: string;
    pro_codfol: string;
    pro_numser: string;
    pro_numdoc: string;
    pro_itemov: number;
    pro_codpro: string; // Proceso actual

    // Datos para movimiento C
    siguienteProceso: string;
    fechaMovimiento: Date;
    operarioGeneral?: string;
    prioridad?: string;

    // Datos para movimientos D (opcional)
    asignacionesSubprocesos?: Record<string, {
        operario: string;
        fecha: Date;
    }>;
}

// movimientoService.ts
export const createUnifiedMovement = async (params: UnifiedMovementParams) => {
    return await prisma.$transaction(async (prisma) => {
        try {
            // 1. Parámetros base para los movimientos
            const baseParams = {
                pro_codtic: params.pro_codtic,
                pro_codfol: params.pro_codfol,
                pro_numser: params.pro_numser,
                pro_numdoc: params.pro_numdoc,
                pro_itemov: params.pro_itemov,
                pro_codpro: params.pro_codpro
            };

            // 2. Crear movimiento principal (C)
            const movimientoCData = {
                pro_codpros: params.siguienteProceso,
                pro_fecmov: params.fechaMovimiento,
                pro_codper: params.operarioGeneral,
                pro_priori: params.prioridad || 'N',
                pro_fecter: params.fechaMovimiento
            };

            const movimientosCreadosC = await prisma.tb_movimiento_procesoc.findMany({
                where: baseParams
            });

            if (movimientosCreadosC.length === 0) {
                throw new Error("No se encontraron movimientos actuales");
            }

            // Actualizar movimientos actuales como terminados
            await prisma.tb_movimiento_procesoc.updateMany({
                where: baseParams,
                data: {
                    pro_proter: 'S',
                    pro_fecter: params.fechaMovimiento
                }
            });

            // Crear nuevos movimientos C
            const nuevosMovimientosC = await Promise.all(
                movimientosCreadosC.map(mov => prisma.tb_movimiento_procesoc.create({
                    data: {
                        ...mov,
                        pro_codpro: params.siguienteProceso,
                        pro_fecmov: params.fechaMovimiento,
                        pro_codper: params.operarioGeneral || "00",
                        pro_priori: params.prioridad || mov.pro_priori || 'N',
                        pro_proter: 'N',
                        pro_fecter: new Date('1900-01-01T00:00:00Z'),
                        pro_codproa: params.pro_codpro
                    }
                }))
            );

            // 3. Crear movimientos D si hay asignaciones
            let movimientosCreadosD: MovimientoProcesoD[] = [];

            if (params.asignacionesSubprocesos && Object.keys(params.asignacionesSubprocesos).length > 0) {
                // Obtener subprocesos válidos
                const subprocesos = await prisma.tb_subproceso.findMany({
                    where: {
                        pro_codtic: params.pro_codtic,
                        pro_codpro: params.siguienteProceso
                    }
                });

                if (subprocesos.length === 0) {
                    throw new Error(`No hay subprocesos definidos para el proceso ${params.pro_codpro}`);
                }

                // 3.1 Imprimir datos antes de crear
                console.log("=== DATOS DE MOVIMIENTOS D A CREAR ===");
                console.log("Subprocesos encontrados:", subprocesos.map(s => s.pro_codsup));
                console.log("Asignaciones recibidas:", params.asignacionesSubprocesos);

                const movimientosDAImprimir = subprocesos.map(subproceso => {
                    const asignacion = params.asignacionesSubprocesos?.[subproceso.pro_codsup];
                    return {
                        ...baseParams,
                        pro_codpro: params.siguienteProceso,
                        pro_codsup: subproceso.pro_codsup,
                        pro_codper: asignacion?.operario || '00',
                        pro_fecsup: asignacion?.fecha || params.fechaMovimiento,
                        pro_cospro: movimientosCreadosC[0]?.pro_cospro || 0,
                        pro_grumes: null,
                        pro_fecini: null,
                        pro_fecter: null,
                        pro_supter: 'N'
                    };
                });

                console.log("Movimientos D preparados:", JSON.stringify(movimientosDAImprimir, null, 2));
                console.log("Claves únicas:",
                    movimientosDAImprimir.map(m =>
                        `${m.pro_codtic}-${m.pro_codfol}-${m.pro_numser}-${m.pro_numdoc}-${m.pro_itemov}-${m.pro_codpro}-${m.pro_codsup}`
                    )
                );

                // 3.2 Verificar si ya existen movimientos D con estos parámetros
                const movimientosDExistentes = await prisma.tb_movimiento_procesod.findMany({
                    where: baseParams
                });

                console.log(`Movimientos D existentes encontrados: ${movimientosDExistentes.length}`);
                if (movimientosDExistentes.length > 0) {
                    console.log("Ejemplo de movimiento D existente:", movimientosDExistentes[0]);
                }

                // 3.3 Crear movimientos D en lote
                console.log("Intentando crear movimientos D...");
                const { count } = await prisma.tb_movimiento_procesod.createMany({
                    data: movimientosDAImprimir,
                });
                console.log(`Movimientos D creados: ${count}`);

                // 3.4 Obtener los movimientos D creados
                movimientosCreadosD = await prisma.tb_movimiento_procesod.findMany({
                    where: {
                        ...baseParams,
                        pro_fecsup: params.fechaMovimiento
                    }
                });
                console.log(`Movimientos D recuperados después de creación: ${movimientosCreadosD.length}`);
            }

            return {
                movimientosC: nuevosMovimientosC,
                movimientosD: movimientosCreadosD,
                debugInfo: {
                    movimientosCCount: nuevosMovimientosC.length,
                    movimientosDCount: movimientosCreadosD.length
                }
            };

        } catch (error) {
            console.error("Error completo en createUnifiedMovement:", {
                params: JSON.stringify(params, null, 2),
                error: {
                    name: error instanceof Error ? error.name : 'UnknownError',
                    message: error instanceof Error ? error.message : String(error),
                    stack: error instanceof Error ? error.stack : undefined,
                    ...(typeof error === 'object' && error !== null ? error : {})
                }
            });
            throw new Error(`Error al crear movimientos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    });
};