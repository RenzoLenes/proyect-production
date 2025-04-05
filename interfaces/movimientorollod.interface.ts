import { Prisma } from "@prisma/client";

export interface MovimientoRolloD {
  pro_codtic: string;           // Código TIC (15 caracteres)
  pro_codtid: string;           // Código de Tipo de Documento (3 caracteres)
  pro_numser: string;           // Número de Serie (15 caracteres)
  pro_numdoc: string;           // Número de Documento (15 caracteres)
  pro_itemov: Prisma.Decimal;          // Ítem de Movimiento (numeric, 18 dígitos, 0 Prisma.Decimales)
  pro_codart: string;           // Código de Artículo (50 caracteres)
  pro_nomart: string;           // Nombre de Artículo (250 caracteres)
  pro_canart: Prisma.Decimal;          // Cantidad de Artículo (Prisma.Decimal, 18 dígitos, 2 Prisma.Decimales)
  pro_codrol: string;           // Código de Rollo (15 caracteres)
  pro_codcol: string;           // Código de Color (15 caracteres)
  pro_preart: Prisma.Decimal;          // Precio de Artículo (Prisma.Decimal, 18 dígitos, 4 Prisma.Decimales)
  pro_gasart: Prisma.Decimal;          // Gasto de Artículo (Prisma.Decimal, 18 dígitos, 4 Prisma.Decimales)
  pro_pretot: Prisma.Decimal;          // Precio Total (Prisma.Decimal, 18 dígitos, 4 Prisma.Decimales)
  pro_totart: Prisma.Decimal;          // Total de Artículo (Prisma.Decimal, 18 dígitos, 2 Prisma.Decimales)
  pro_codcof: string;           // Código de Color Final (15 caracteres)
  pro_numref: string;           // Número de Referencia (15 caracteres)
  pro_cancom: Prisma.Decimal;          // Cantidad de Compra (Prisma.Decimal, 18 dígitos, 2 Prisma.Decimales)
  pro_ubiart?: string | null;   // Ubicación de Artículo (50 caracteres, opcional)
  pro_nrolot?: string | null;   // Número de Lote (50 caracteres, opcional)
  pro_revmts?: Prisma.Decimal | null;  // Revisión de Metros (Prisma.Decimal, 18 dígitos, 2 Prisma.Decimales, opcional)
}