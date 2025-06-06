import { Prisma } from "@prisma/client";

export interface ParteProduccionC {
  pro_codtic: string;           // Código TIC (15 caracteres)
  pro_codfol: string;           // Código Folio (15 caracteres)
  pro_numser: string;           // Número de Serie (15 caracteres)
  pro_numdoc: string;           // Número de Documento (15 caracteres)
  pro_fecmov: Date;             // Fecha de Movimiento (datetime)
  pro_canmts: Prisma.Decimal;          // Cantidad de Metros (Prisma.Decimal, 18 dígitos, 2 Prisma.Decimales)
  pro_labtal1: string;          // Laboratorio Talla 1 (4 caracteres)
  pro_labtal2: string;          // Laboratorio Talla 2 (4 caracteres)
  pro_labtal3: string;          // Laboratorio Talla 3 (4 caracteres)
  pro_labtal4: string;          // Laboratorio Talla 4 (4 caracteres)
  pro_labtal5: string;          // Laboratorio Talla 5 (4 caracteres)
  pro_labtal6: string;          // Laboratorio Talla 6 (4 caracteres)
  pro_textal1: Prisma.Decimal;         // Textil Talla 1 (numeric, 18 dígitos, 0 Prisma.Decimales)
  pro_textal2: Prisma.Decimal;         // Textil Talla 2 (numeric, 18 dígitos, 0 Prisma.Decimales)
  pro_textal3: Prisma.Decimal;         // Textil Talla 3 (numeric, 18 dígitos, 0 Prisma.Decimales)
  pro_textal4: Prisma.Decimal;         // Textil Talla 4 (numeric, 18 dígitos, 0 Prisma.Decimales)
  pro_textal5: Prisma.Decimal;         // Textil Talla 5 (numeric, 18 dígitos, 0 Prisma.Decimales)
  pro_textal6: Prisma.Decimal;         // Textil Talla 6 (numeric, 18 dígitos, 0 Prisma.Decimales)
  pro_codtco: string;           // Código de Tipo de Corte (15 caracteres)
  pro_codper: string;           // Código de Personal (15 caracteres)
  pro_labad1: string;           // Laboratorio Adicional 1 (4 caracteres)
  pro_labad2: string;           // Laboratorio Adicional 2 (4 caracteres)
  pro_labad3: string;           // Laboratorio Adicional 3 (4 caracteres)
  pro_estmov: string;           // Estado de Movimiento (15 caracteres)
  pro_numref: string;           // Número de Referencia (15 caracteres)
  pro_glomov: string;           // Glosa de Movimiento (200 caracteres)
  pro_ancmes: Prisma.Decimal;          // Ancho de Mesa (Prisma.Decimal, 18 dígitos, 2 Prisma.Decimales)
  pro_tipurg: string;           // Tipo de Urgencia (30 caracteres)
  pro_boolav: string;           // Booleano de Disponibilidad (1 carácter)
  pro_codcal?: string | null;   // Código de Calidad (15 caracteres, opcional)
  pro_grumes?: string | null;   // Grupo de Merma (10 caracteres, opcional)
  pro_talcom?: string | null;   // Talla Comercial (4 caracteres, opcional)
  pro_coddob1?: string | null;  // Código Doble 1 (15 caracteres, opcional)
  pro_coddob2?: string | null;  // Código Doble 2 (15 caracteres, opcional)
  pro_codtiz1?: string | null;  // Código Tiza 1 (15 caracteres, opcional)
  pro_codtiz2?: string | null;  // Código Tiza 2 (15 caracteres, opcional)
  pro_codcor1?: string | null;  // Código Corrida 1 (15 caracteres, opcional)
  pro_codcor2?: string | null;  // Código Corrida 2 (15 caracteres, opcional)
  pro_codetd?: string | null;   // Código Etiqueta D (15 caracteres, opcional)
  pro_codett?: string | null;   // Código Etiqueta T (15 caracteres, opcional)
  pro_codaum?: string | null;   // Código Aumento (15 caracteres, opcional)
}