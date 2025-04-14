"use server";


import { prisma } from "@/lib/prisma"
import { TipoCorte } from "../types/tipocorte.interface";

export const getAllTiposCorte = async (tipo?: string): Promise<TipoCorte[]> => {

  try {
    const tipos = await prisma.tb_tipo_corte.findMany({
        where: {
            pro_codtic: tipo,
            pro_esttco: "ACTIVO",
        },
    });
    return tipos;
  } catch (error) {
    console.error("Error al obtener movimientos:", error);
    return [];
  }

}
