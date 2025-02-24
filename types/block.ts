// En types/block.ts
export type Block = {
  id: string;
  reference: string;
  processId: string;
  subprocesses: SubProcessStatus[];
  quantity: number;
  priority: "low" | "medium" | "high";
  startDate: Date;
  status: "Pendiente" | "En proceso" | "Completado";
};

export type SubProcessStatus = {
  id: string;
  name: string;
  completed: boolean;
  type: "Interno" | "Externo";
  assignedOperator?: string; 
};