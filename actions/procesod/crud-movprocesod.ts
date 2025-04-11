"use server";

import { prisma } from "@/lib/prisma"
import { MovimientoProcesoD } from '../../interfaces/movimientoprocesod.interface';


export const getMovimientos = async (): Promise<MovimientoProcesoD[]> => {

  try {
    const movimientos = await prisma.tb_movimiento_procesod.findMany();
    return movimientos;
  } catch (error) {
    console.error("Error al obtener movimientos:", error);
    return [];
  }

}


export const createMovimiento = async (movimiento: MovimientoProcesoD) => {
  try {
    const nuevoMovimiento = await prisma.tb_movimiento_procesod.create({
      data: movimiento,
    });
    return nuevoMovimiento;
  } catch (error) {
    console.error("Error al crear movimiento:", error);
    throw new Error("No se pudo crear el movimiento");
  }
}

export interface UpdateMovimientoDParams {
  pro_codtic: string;
  pro_codfol: string;
  pro_numser: string;
  pro_numdoc: string;
  pro_itemov: number;
  pro_codpro: string;
  pro_codsup: string;
}

export interface UpdateMovimientoDData {
  pro_codper?: string;
  pro_fecini?: Date;
  pro_fecter?: Date;
  pro_supter?: string;
}

export const updateMovimientoDByParams = async (
  params: UpdateMovimientoDParams,
  data: UpdateMovimientoDData
) => {
  try {
    // Filtrar solo los campos que tienen valor para actualizar
    const updateData = {
      ...(data.pro_codper && { pro_codper: data.pro_codper }),
      ...(data.pro_fecini && { pro_fecini: data.pro_fecini }),
      ...(data.pro_fecter && { pro_fecter: data.pro_fecter }),
      ...(data.pro_supter && { pro_supter: data.pro_supter }),
    };

    // Verificar que al menos un campo a actualizar tiene valor
    if (Object.keys(updateData).length === 0) {
      throw new Error("No se proporcionaron datos para actualizar");
    }

    const updatedMovimiento = await prisma.tb_movimiento_procesod.updateMany({
      where: {
        pro_codtic: params.pro_codtic,
        pro_codfol: params.pro_codfol,
        pro_numser: params.pro_numser,
        pro_numdoc: params.pro_numdoc,
        pro_itemov: params.pro_itemov,
        pro_codpro: params.pro_codpro,
        pro_codsup: params.pro_codsup
      },
      data: updateData
    });

    // Verificar si se actualizó algún registro
    if (updatedMovimiento.count === 0) {
      console.warn("No se encontraron registros para actualizar con los parámetros proporcionados");
    }

    return updatedMovimiento;

  } catch (error) {
    console.error("Error al actualizar movimientod:", error);
    throw new Error("No se pudo actualizar el movimientod");
  }
}



export interface CreateMovimientoDParams {
  pro_codtic: string;
  pro_codfol: string;
  pro_numser: string;
  pro_numdoc: string;
  pro_itemov: number;
  pro_codpro: string;
}

export interface CreateMovimientoDData {
  pro_codper?: string;
  pro_fecsup?: Date;
}

export const createNewMovimientoD = async (
  params: CreateMovimientoDParams,
  data: CreateMovimientoDData
) => {
  return await prisma.$transaction(async (prisma) => {

    try {
      // 1. Validar que existe el movimiento principal
      const movimientoPrincipal = await prisma.tb_movimiento_procesoc.findFirst({
        where: {
          pro_codtic: params.pro_codtic,
          pro_codfol: params.pro_codfol,
          pro_numser: params.pro_numser,
          pro_numdoc: params.pro_numdoc,
          pro_itemov: params.pro_itemov,
          pro_codpro: params.pro_codpro
        },
      });

      if (!movimientoPrincipal) {
        throw new Error("No existe el movimiento principal asociado");
      }

      // 2. Obtener subprocesos del proceso
      const subprocesos = await prisma.tb_subproceso.findMany({
        where: {
          pro_codtic: params.pro_codtic,
          pro_codpro: params.pro_codpro
        }
      });

      if (subprocesos.length === 0) {
        throw new Error(`No hay subprocesos definidos para el proceso ${params.pro_codpro}`);
      }

      // 3. Crear movimientos detalle en una transacción
      const movimientosCreados = await Promise.all(
        subprocesos.map(subproceso =>
          prisma.tb_movimiento_procesod.create({
            data: {
              pro_codtic: params.pro_codtic,
              pro_codfol: params.pro_codfol,
              pro_numser: params.pro_numser,
              pro_numdoc: params.pro_numdoc,
              pro_itemov: params.pro_itemov,
              pro_codpro: params.pro_codpro,
              pro_codsup: subproceso.pro_codsup,
              pro_codper: data.pro_codper || '00',
              pro_fecsup: data.pro_fecsup || new Date(),
              pro_cospro: movimientoPrincipal.pro_cospro || 0,
              pro_grumes: null,
              pro_fecini: null,
              pro_fecter: null,
              pro_supter: 'N'
            }
          })
        )
      );

      return movimientosCreados;

    } catch (error) {
      console.error("Error en createMovimientosProcesoD:", error);
      throw new Error(error instanceof Error ? error.message : "Error al crear movimientos detalle");
    }
  })
};


export interface DeleteMovimientoDParams {
  pro_codtic: string;
  pro_codfol: string;
  pro_numser: string;
  pro_numdoc: string;
  pro_itemov: number;
  pro_codpro: string;
}

export const deleteMovimientoD = async (params: DeleteMovimientoDParams) => {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const deletedMovimiento = await prisma.tb_movimiento_procesod.deleteMany({
        where: {
          pro_codtic: params.pro_codtic,
          pro_codfol: params.pro_codfol,
          pro_numser: params.pro_numser,
          pro_numdoc: params.pro_numdoc,
          pro_itemov: params.pro_itemov,
          pro_codpro: params.pro_codpro
        }
      });

      // Verificar si se eliminó algún registro
      if (deletedMovimiento.count === 0) {
        console.warn("No se encontraron registros para eliminar con los parámetros proporcionados");
      }

      return deletedMovimiento;
    });

    return result;

  } catch (error) {
    console.error("Error al eliminar movimientoc:", error);
    throw new Error("No se pudo eliminar el movimientoc");
  }
}