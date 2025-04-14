import { Prisma } from "@prisma/client";

    export interface SubProceso {
        pro_codtic: string;
        pro_codsup: string;
        pro_nomsup: string;
        pro_codpro: string;
        pro_cosint : Prisma.Decimal;
        pro_cosext: Prisma.Decimal;
    }