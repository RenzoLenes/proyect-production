"use server";

import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client";
import { SubProceso } from "../types/subproceso.interface";
import { Block } from "../types/block.interface";

export const getSubprocesosByProceso = async (tipoConfeccion: string, proceso: string): Promise<SubProceso[]> => {
  try {
    const subprocesos = await prisma.tb_subproceso.findMany({
      where: {
        pro_codtic: tipoConfeccion,
        pro_codpro: proceso
      }
    });

    return subprocesos;

  } catch (error) {
    console.error("Error al obtener procesos por tipo de confeccion:", error);
    return [];
  }
}


export interface SubProcesoResponse {
  pro_codpro: string;
  pro_codper: string;
  pro_nomsup: string;
  pro_codsup: string;
  pro_fecini: Date | null;
  pro_fecter: Date | null;
  pro_supter: string | null;
}


export const getSubprocesosPorBloque = async (block: Block, proceso: string): Promise<SubProcesoResponse[]> => {
  try {
    const results = await prisma.$queryRaw<SubProcesoResponse[]>`
      EXEC dbo.SQ_GET_SUBPROCESOS
        @vi_tipo_confeccion = ${block.pro_codtic},
        @vi_folder = ${block.pro_codfol},
        @vi_serie = ${block.pro_numser},
        @vi_doc = ${block.pro_numdoc},
        @vi_item = ${block.pro_itemov},
        @vi_codpro = ${proceso}
      `;

    return results.map(item => ({
      pro_codpro: item.pro_codpro,
      pro_codper: item.pro_codper,
      pro_nomsup: item.pro_nomsup,
      pro_codsup: item.pro_codsup,
      pro_fecini: item.pro_fecini,
      pro_fecter: item.pro_fecter,
      pro_supter: item.pro_supter
    }));

  } catch (error) {
    console.error("Error al obtener procesos por tipo de confeccion:", error);
    return [];
  }
}


export interface SubprocesoUpdateParams {
  pro_codtic: string;
  pro_codpro: string;
  pro_codsup: string;
}

export interface SubprocesoUpdateData {
  pro_nomsup?: string;
  pro_cosint?: number;
  pro_cosext?: number;
}

export const updateSubproceso = async (
  params: SubprocesoUpdateParams,
  data: SubprocesoUpdateData
) => {
  try {


    const subproceso = await prisma.tb_subproceso.updateMany({
      where: {

        pro_codtic: params.pro_codtic,
        pro_codpro: params.pro_codpro,
        pro_codsup: params.pro_codsup,
      },
      data: {
        pro_nomsup: data.pro_nomsup,
        pro_cosint: data.pro_cosint ? new Prisma.Decimal(data.pro_cosint) : undefined,
        pro_cosext: data.pro_cosext ? new Prisma.Decimal(data.pro_cosext) : undefined,
      }
    });

    return subproceso;

  } catch (error) {
    console.error("Error al actualizar el subproceso:", error);
    return null;
  }
}

