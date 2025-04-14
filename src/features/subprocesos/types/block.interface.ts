import { MovimientoProcesoResultado } from "@/features/procesoc/types/movproceso.interface";

export interface Block {
    id: string;
    pro_codtic: string;
    pro_codfol: string;
    pro_numser: string;
    pro_numdoc: string;
    pro_itemov: number;
    codigoProceso: string;
    procesoActual: string;
    procesoAnterior: string;
    procesoPosterior?: string | null;
    movimientos: MovimientoProcesoResultado[];
  }
  