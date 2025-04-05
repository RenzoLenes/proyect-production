"use server";


import { TipoConfeccion } from "@/interfaces/tipoconfeccion.interface";
import { prisma } from "@/lib/prisma"

export const getAllTipos = async (): Promise<TipoConfeccion[]> => {

  try {
    const tipos = await prisma.tb_tipo_confeccion.findMany();
    return tipos;
  } catch (error) {
    console.error("Error al obtener movimientos:", error);
    return [];
  }

}
