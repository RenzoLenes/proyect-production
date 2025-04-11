"use server";


import { TipoCorte } from "@/interfaces/tipocorte.interface";
import { prisma } from "@/lib/prisma"

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
