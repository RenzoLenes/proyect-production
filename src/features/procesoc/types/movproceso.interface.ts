export interface MovimientoProcesoResultado {
    activo: string;
    nombre_proceso: string;
    cantidad: number;
    inicio: string;
    personal: string;
    n_mesa: string;
    calidad: string;
    diseno: string;
    tipo_corte: string;
    color: string;
    costo: number;
    codigo_rollo: string;
    codigo_folder: string;
    serie: string;
    numero: string;
    item: string; // Cambiado de Decimal a string
    codigo_personal?: string | null;
    codigo_proceso: string;
    almacen: string;
    serie_almacen: string;
    numero_almacen: string;
    fecha: string;
    tallas: string;
    proceso_ant: string;
    proceso_sup?: string | null;
    blavanderia: string;
    curso: string;
    procedencia: string;
    prioridad: string;
    armador: string;
  }