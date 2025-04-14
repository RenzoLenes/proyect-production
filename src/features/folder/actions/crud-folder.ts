"use server";

import { Folder } from "@/features/folder/types/folder.interface";
import { prisma } from "@/lib/prisma"



export const getFolderByTipo = async (tipo?: string): Promise<Folder[]> => {
    try {
        const folders = await prisma.tb_folder.findMany({
            where: {
                pro_codtic: tipo,
            }
        });

        return folders;

    } catch (error) {
        console.error("Error al obtener folders por tipo de confeccion:", error);
        return [];
    }
}