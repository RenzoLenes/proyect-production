"use server";

import { prisma } from "@/lib/prisma"
import { Empresa } from "../types/empresa.interface";



export const getEmpresas = async (): Promise<Empresa[]> => {

    try {
        const empresas = await prisma.tb_empresa.findMany();
        return empresas;
    } catch (error) {
        console.error("Error al obtener empresas:", error);
        return [];
    }

}


export const getEmpresaById = async (id: string):Promise<Empresa | null> => {
    try {
        const empresa = await prisma.tb_empresa.findUnique({
            where: {
                pro_codemp: id
            }
        })

        return empresa;
    } catch (error) {
        console.error("Error al obtener empresa por id:", error);
        return null
    }
}