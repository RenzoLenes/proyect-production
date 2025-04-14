import { SubProcess } from './process';




export enum ShippingOrdeStatus {
  Pendiente = "Pendiente de recojo",
  Transito = "En tránsito",
  Entregado = "Entregado"
}


export type ShippingOrder = {
  id: string; // ID único del envío
  orderIds: string[]; // Lista de órdenes transportadas en este envío
  transportProvider: string; // Transportista encargado
  departureDate?: Date; // Fecha de salida del transporte
  arrivalDate?: Date; // Fecha real de entrega
  status: ShippingOrdeStatus;
};


export enum ProcessType {
  Interno = "Interno",
  Externo = "Externo"
}


export type Order = {
  id: string; // ID único de la orden de envío
  blockId: string; // Lista de bloques a enviar
  origin: number;
  destination: number; // Destino del envío
  scheduledDate: Date; // Fecha programada de envío
  subprocesses: SubProcess[]; // Lista de subprocesos a realizar
  status: String
};


export type Operator = {
  id: number;
  name: string;
};

export enum BlockStatus {
  stored = "Almacenado",
  pending = "Pendiente",
  in_progress = "En proceso",
  completed = "Completado"
}


export type SubProcessStatus = {
  id: string;
  name: string;
  completed: boolean;
  type: ProcessType;
  assignedOperator?: string;
  status: BlockStatus; // Estado del subproceso
};

export const BlockStatusLabels = {
  stored: {
    label: "Almacenado",
    color: "primary",
  },
  pending: {
    label: "Pendiente",
    color: "secondary",
  },
  in_progress: {
    label: "En Proceso",
    color: "default",
  },
  completed: {
    label: "Completado",
    color: "destructive",
  },
};
