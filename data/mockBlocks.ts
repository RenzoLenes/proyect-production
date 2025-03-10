import { Block, BlockStatus, ProcessType } from "@/types/block";

export const mockBlocks: Block[] = [
  {
    id: "B001",
    reference: "CG-2024-0001",
    processId: "P001", // Corte
    subprocesses: [
      {
        id: "S001", name: "Doblado", completed: true, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S002", name: "Tizado", completed: true, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S003", name: "Cortado", completed: false, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S004", name: "Etiquetado", completed: false, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
    ],
    quantity: 50,
    priority: "high",
    startDate: new Date("2024-03-20"),
    status: BlockStatus.in_progress
  },
  {
    id: "B002",
    reference: "CG-2024-0002",
    processId: "P001", // Corte
    subprocesses: [
      {
        id: "S001", name: "Doblado", completed: true, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S002", name: "Tizado", completed: true, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S003", name: "Cortado", completed: true, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S004", name: "Etiquetado", completed: false, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
    ],
    quantity: 50,
    priority: "high",
    startDate: new Date("2024-03-20"),
    status: BlockStatus.in_progress
  },
  {
    id: "B003",
    reference: "LC-2024-0003",
    processId: "P002", // Pre-Costura
    subprocesses: [
      {
        id: "S005", name: "Pinza", completed: true, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S006", name: "Bolsillo", completed: true, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S007", name: "Bordado", completed: true, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S008", name: "Sesgado", completed: false, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S009", name: "Materiales", completed: false, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
    ],
    quantity: 65,
    priority: "medium",
    startDate: new Date("2024-03-19"),
    status: BlockStatus.in_progress
  },
  {
    id: "B004",
    reference: "LC-2024-0010",
    processId: "P002", // Pre-Costura
    subprocesses: [
      {
        id: "S005", name: "Pinza", completed: true, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S006", name: "Bolsillo", completed: true, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S007", name: "Bordado", completed: true, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S008", name: "Sesgado", completed: true, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S009", name: "Materiales", completed: false, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
    ],
    quantity: 65,
    priority: "high",
    startDate: new Date("2024-03-19"),
    status: BlockStatus.in_progress
  },
  {
    id: "B005",
    reference: "LC-2024-0004",
    processId: "P004", // Costura
    subprocesses: [
      {
        id: "S012", name: "Cerrado", completed: true, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S013", name: "Sesgado Trasero", completed: true, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S014", name: "Presillado", completed: false, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S015", name: "Entallado", completed: false, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
    ],
    quantity: 65,
    priority: "medium",
    startDate: new Date("2024-03-19"),
    status: BlockStatus.in_progress
  },
  {
    id: "B006",
    reference: "LC-2024-0005",
    processId: "P004", // Costura
    subprocesses: [
      {
        id: "S012", name: "Cerrado", completed: true, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S013", name: "Sesgado Trasero", completed: true, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S014", name: "Presillado", completed: false, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S015", name: "Entallado", completed: false, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
    ],
    quantity: 65,
    priority: "medium",
    startDate: new Date("2024-03-19"),
    status: BlockStatus.in_progress
  },
  {
    id: "B007",
    reference: "LC-2024-00025",
    processId: "P006", // Acabado
    subprocesses: [
      {
        id: "S017", name: "Ojal", completed: true, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S018", name: "Basta", completed: true, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S019", name: "Atraque Delantero", completed: true, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S020", name: "Atraque Trasero", completed: true, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S021", name: "Atraque Presilla", completed: true, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S022", name: "Planchado Costura", completed: true, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S023", name: "Planchado Entero", completed: true, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S024", name: "Deshilachado", completed: true, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S025", name: "Botón", completed: true, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S026", name: "Entallado", completed: false, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
    ],
    quantity: 65,
    priority: "high",
    startDate: new Date("2024-03-19"),
    status: BlockStatus.in_progress
  },
  {
    id: "B008",
    reference: "LC-2024-0024",
    processId: "P005", // Pretinado
    subprocesses: [
      {
        id: "S016", name: "Pretinado", completed: false, type: ProcessType.Interno,
        status: BlockStatus.stored
      }
    ],
    quantity: 50,
    priority: "high",
    startDate: new Date("2024-03-20"),
    status: BlockStatus.pending
  },
  {
    id: "B009",
    reference: "LC-2024-0028",
    processId: "P003", // Armado
    subprocesses: [
      {
        id: "S010", name: "Armado Trasera", completed: true, type: ProcessType.Interno,
        status: BlockStatus.stored
      },
      {
        id: "S011", name: "Armado Delantera", completed: false, type: ProcessType.Externo,
        status: BlockStatus.stored
      }
    ],
    quantity: 80,
    priority: "low",
    startDate: new Date("2024-03-18"),
    status: BlockStatus.in_progress
  },
];
