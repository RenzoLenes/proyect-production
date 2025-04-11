"use server";

import { MovimientoProcesoC } from "@/interfaces/movimientoprocesoc.interface";
import { prisma } from "@/lib/prisma"
import { MovimientoProcesoResultado } from '../../interfaces/movproceso.interface';


export const getAllMovimientos = async (): Promise<MovimientoProcesoC[]> => {

  try {
    const movimientos = await prisma.tb_movimiento_procesoc.findMany();
    return movimientos;
  } catch (error) {
    console.error("Error al obtener movimientos:", error);
    return [];
  }

}

export const getMovimientosByProceso = async (pro_codpro: string): Promise<MovimientoProcesoC[]> => {

  try {
    const movimientos = await prisma.tb_movimiento_procesoc.findMany({
      where: {
        pro_codtic: '001',
        pro_codpro: pro_codpro,
        pro_proter: 'N'
      }
    });
    return movimientos;
  } catch (error) {
    console.error("Error al obtener movimientos:", error);
    return [];
  }


}


export const createMovimiento = async (movimiento: MovimientoProcesoC) => {
  try {
    const nuevoMovimiento = await prisma.tb_movimiento_procesoc.create({
      data: movimiento,
    });
    return nuevoMovimiento;
  } catch (error) {
    console.error("Error al crear movimiento:", error);
    throw new Error("No se pudo crear el movimiento");
  }
}



export interface ParametrosMovimiento {
  tipoConfeccion?: string;
  proceso?: string;
  calidad?: string;
  tipo?: string;
  color?: string;
  costurero?: string;
  tipoModa?: string;
}

export const obtenerMovimientosPendientes = async (
  params?: ParametrosMovimiento
): Promise<MovimientoProcesoResultado[]> => {
  try {
    // Valores predeterminados si no se proporcionan parámetros
    const parametros: ParametrosMovimiento = params || {};

    // Asignar valores predeterminados para cada parámetro si no se proporciona
    const tipoConfeccion = parametros.tipoConfeccion || "001";
    const proceso = parametros.proceso || "(TODOS)";
    const calidad = parametros.calidad || "(TODOS)";
    const tipo = parametros.tipo || "(TODOS)";
    const color = parametros.color || "(TODOS)";
    const costurero = parametros.costurero || "(TODOS)";
    const tipoModa = parametros.tipoModa || "(TODOS)";

    // Ejecutar el procedimiento almacenado con tipado
    const movimientos = await prisma.$queryRaw<MovimientoProcesoResultado[]>`
      EXEC dbo.SQ_MOV_PROCESO
        @vi_tipo_confeccion = ${tipoConfeccion},
        @vi_proceso = ${proceso},
        @vi_calidad = ${calidad},
        @vi_tipo = ${tipo},
        @vi_color = ${color},
        @vi_costurero = ${costurero},
        @vi_tipo_moda = ${tipoModa}
    `;

    const data = JSON.parse(JSON.stringify(movimientos));
    return data;
  } catch (error) {
    console.error("Error al ejecutar el procedimiento almacenado:", error);
    return [];
  }
};


export interface UpdateMovimientoCParams {
  pro_codtic: string;
  pro_codfol: string;
  pro_numser: string;
  pro_numdoc: string;
  pro_itemov: number;
  pro_codpro: string;
}

export interface UpdateMovimientoCData {
  pro_codper?: string;
  pro_fecmov?: Date;
  pro_fecter?: Date;
  pro_proter?: string;
}

export const updateMovimientoCByParams = async (
  params: UpdateMovimientoCParams,
  data: UpdateMovimientoCData
) => {
  try {
    // Filtrar solo los campos que tienen valor para actualizar
    const updateData = {
      ...(data.pro_codper && { pro_codper: data.pro_codper }),
      ...(data.pro_fecmov && { pro_fecini: data.pro_fecmov }),
      ...(data.pro_fecter && { pro_fecter: data.pro_fecter }),
      ...(data.pro_proter && { pro_supter: data.pro_proter }),
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
      },
      data: updateData
    });

    // Verificar si se actualizó algún registro
    if (updatedMovimiento.count === 0) {
      console.warn("No se encontraron registros para actualizar con los parámetros proporcionados");
    }

    return updatedMovimiento;

  } catch (error) {
    console.error("Error al actualizar movimientoc:", error);
    throw new Error("No se pudo actualizar el movimientoc");
  }
}



export interface CreateNewMovimientoCParams {
  pro_codtic: string;
  pro_codfol: string;
  pro_numser: string;
  pro_numdoc: string;
  pro_itemov: number;
  pro_codpro: string;
}

export interface CreateNewMovimientoCData {
  pro_codpros?: string;  // Código del proceso siguiente
  pro_fecmov?: Date;     // Fecha de movimiento
  pro_codper?: string;   // Código del personal/operario
  pro_priori?: string;   // Prioridad (opcional)
  pro_fecter?: Date;     // Fecha de término (opcional)
}

export const createNewMovimientoC = async (
  params: CreateNewMovimientoCParams,
  data: CreateNewMovimientoCData
) => {
  return await prisma.$transaction(async (prisma) => {
    try {
      // 1. Validar si es proceso final
      const esProcesoFinal = !data.pro_codpros;
      if (esProcesoFinal) {
        throw new Error("Se encuentra en el proceso final, no se puede crear un nuevo movimiento");
      }

      // 2. Obtener el movimiento actual
      const movimientosActuales = await prisma.tb_movimiento_procesoc.findMany({
        where: {
          pro_codtic: params.pro_codtic,
          pro_codfol: params.pro_codfol,
          pro_numser: params.pro_numser,
          pro_numdoc: params.pro_numdoc,
          pro_itemov: params.pro_itemov,
          pro_codpro: params.pro_codpro
        }
      });

      if (movimientosActuales.length === 0) {
        throw new Error("No se encontró el movimiento actual");
      }

      // 3. Actualizar el movimiento actual como terminado
      await prisma.tb_movimiento_procesoc.updateMany({
        where: {
          pro_codtic: params.pro_codtic,
          pro_codfol: params.pro_codfol,
          pro_numser: params.pro_numser,
          pro_numdoc: params.pro_numdoc,
          pro_itemov: params.pro_itemov,
          pro_codpro: params.pro_codpro
        },
        data: {
          pro_proter: 'S', // Marcamos como terminado
          pro_fecter: data.pro_fecter || new Date() // Fecha de terminación
        }
      });

      // 4. Crear el nuevo movimiento
      const nuevosMovimientos = await Promise.all(
        movimientosActuales.map(async (movimientoActual) => {
          return await prisma.tb_movimiento_procesoc.create({
            data: {
              // Campos copiados del movimiento actual
              ...movimientoActual,
              // Campos actualizados
              pro_codpro: data.pro_codpros!,
              pro_fecmov: data.pro_fecmov || new Date(),
              pro_codper: data.pro_codper || movimientoActual.pro_codper,
              pro_priori: data.pro_priori || movimientoActual.pro_priori,
              // Campos reseteados
              pro_proter: 'N',
              pro_fecter: new Date('1900-01-01T00:00:00Z'),
              pro_codproa: params.pro_codpro
            }
          });
        })
      );

      return nuevosMovimientos;

    } catch (error) {
      console.error("Error en la transacción de movimiento:", error);
      throw new Error(error instanceof Error ? error.message : "Error al crear nuevo movimiento");
    }
  });
};



export interface DeleteMovimientoCParams {
  pro_codtic: string;
  pro_codfol: string;
  pro_numser: string;
  pro_numdoc: string;
  pro_itemov: number;
  pro_codpro: string;
}

export const deleteMovimientoD = async (params: DeleteMovimientoCParams) => {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const deletedMovimiento = await prisma.tb_movimiento_procesoc.deleteMany({
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