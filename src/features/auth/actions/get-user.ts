"use server";
import { prisma } from "@/lib/prisma"
import { PersonalUser } from "../types/personal-user";


export const getPersonalUser = async (id: string): Promise<PersonalUser | null> => {
    try {
        const personal = await prisma.tb_personal.findUnique({
            where: {
                pro_codper: id,
            },
            select: {
                pro_codper: true,
                pro_nomper: true,
                pro_apeper: true,
                pro_conper: true,
                pro_rolper: true,
            }
        });

        return personal;
        
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        return null;
    }
}