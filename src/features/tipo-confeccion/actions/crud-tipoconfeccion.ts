"use server";


import { prisma } from "@/lib/prisma"
import { TipoConfeccion } from "../types/tipoconfeccion.interface";

export const getAllTipos = async (): Promise<TipoConfeccion[]> => {

  try {
    const tipos = await prisma.tb_tipo_confeccion.findMany();
    return tipos;
  } catch (error) {
    console.error("Error al obtener movimientos:", error);
    return [];
  }

}
