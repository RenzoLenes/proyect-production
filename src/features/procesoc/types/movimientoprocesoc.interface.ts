import { Prisma } from "@prisma/client";

export interface MovimientoProcesoC {
  pro_codtic: string;
  pro_codfol: string;
  pro_numser: string;
  pro_numdoc: string;
  pro_itemov: Prisma.Decimal; // Usar Decimal en lugar de number
  pro_codpro: string;
  pro_codrol: string;
  pro_codart: string;
  pro_fecmov: Date;
  pro_codper: string;
  pro_canpro: Prisma.Decimal; // Decimal para campos decimales
  pro_cospro: Prisma.Decimal; // Decimal para campos decimales
  pro_proter: string;
  pro_codcal: string;
  pro_coddis: string;
  pro_codtco: string;
  pro_codtal: string;
  pro_codcol: string;
  pro_fecter: Date;
  pro_codalm: string;
  pro_seralm?: string | null;
  pro_numalm?: string | null;
  codigo_merca?: string | null;
  pro_cancom?: Prisma.Decimal | null; // Decimal para campos decimales
  pro_codproa?: string | null;
  pro_procur?: string | null;
  pro_grumes?: string | null;
  pro_perpro?: string | null;
  pro_fecpro?: Date | null;
  pro_priori?: string | null;
}