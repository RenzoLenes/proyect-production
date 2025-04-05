"use server";

import { SubProceso } from "@/interfaces/subproceso.interface";
import { prisma } from "@/lib/prisma"
import { Block } from '../../types/block';


export const getSubprocesosByProceso = async (tipoConfeccion: string, proceso: string): Promise<SubProceso[]> => {
  try {
    const subprocesos = await prisma.tb_subproceso.findMany({
      where: {
        pro_codtic: tipoConfeccion,
        pro_codpro: proceso
      }
    });

    return subprocesos.map(subproceso => ({
      ...subproceso,
      pro_cosext: subproceso.pro_cosext.toNumber(),
    }));

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


