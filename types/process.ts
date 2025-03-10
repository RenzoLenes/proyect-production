import { ProcessType } from "./block";

export type SubProcess = {
  id: string;
  name: string;
  price_int: number;
  price_ext: number;
  type: ProcessType;
  estimatedTime?: number;
};

export type Process = {
  id: string;
  name: string;
  enabled: boolean;
  subprocesses: SubProcess[];
  estimatedTime?: number;
};

// 🔹 Base de datos de procesos (editable para cada empresa en el SaaS)
export const processes: Process[] = [
  {
    id: "P001",
    name: "Corte",
    enabled: true,
    subprocesses: [
      {
        id: "S001", name: "Doblado", price_int: 0, price_ext: 0,
        type: ProcessType.Interno,
        estimatedTime: 0
      },
      {
        id: "S002", name: "Tizado", price_int: 0, price_ext: 0,
        type: ProcessType.Interno,
        estimatedTime: 0
      },
      {
        id: "S003", name: "Cortado", price_int: 0, price_ext: 0,
        type: ProcessType.Interno,
        estimatedTime: 0
      },
      {
        id: "S004", name: "Etiquetado", price_int: 0, price_ext: 0,
        type: ProcessType.Interno,
        estimatedTime: 0
      }
    ],
    estimatedTime: 0
  },
  {
    id: "P002",
    name: "Pre-Costura",
    enabled: true,
    subprocesses: [
      {
        id: "S005", name: "Pinza", price_int: 0, price_ext: 0,
        type: ProcessType.Interno,
        estimatedTime: 0
      },
      {
        id: "S006", name: "Bolsillo", price_int: 0, price_ext: 0,
        type: ProcessType.Interno,
        estimatedTime: 0
      },
      {
        id: "S007", name: "Bordado", price_int: 0, price_ext: 0,
        type: ProcessType.Interno,
        estimatedTime: 0
      },
      {
        id: "S008", name: "Sesgado", price_int: 0, price_ext: 0,
        type: ProcessType.Interno,
        estimatedTime: 0
      },
      {
        id: "S009", name: "Materiales", price_int: 0, price_ext: 0,
        type: ProcessType.Interno,
        estimatedTime: 0
      }
    ],
    estimatedTime: 0
  },
  {
    id: "P003",
    name: "Armado",
    enabled: true,
    subprocesses: [
      {
        id: "S010", name: "Armado Trasera", price_int: 0, price_ext: 0,
        type: ProcessType.Externo,
        estimatedTime: 0
      },
      {
        id: "S011", name: "Armado Delantera", price_int: 0, price_ext: 0,
        type: ProcessType.Externo,
        estimatedTime: 0
      }
    ],
    estimatedTime: 0
  },
  {
    id: "P004",
    name: "Costura",
    enabled: true,
    subprocesses: [
      {
        id: "S012", name: "Cerrado", price_int: 0.15, price_ext: 0,
        type: ProcessType.Interno,
        estimatedTime: 0
      },
      {
        id: "S013", name: "Sesgado Trasero", price_int: 0, price_ext: 0,
        type: ProcessType.Interno,
        estimatedTime: 0
      },
      {
        id: "S014", name: "Presillado", price_int: 0, price_ext: 0,
        type: ProcessType.Interno,
        estimatedTime: 0
      },
      {
        id: "S015", name: "Entallado", price_int: 0, price_ext: 0,
        type: ProcessType.Interno,
        estimatedTime: 0
      }
    ],
    estimatedTime: 0
  },
  {
    id: "P005",
    name: "Pretinado",
    enabled: true,
    subprocesses: [{
      id: "S016", name: "Pretinado", price_int: 0, price_ext: 0,
      type: ProcessType.Externo,
      estimatedTime: 0
    }],
    estimatedTime: 0
  },
  {
    id: "P006",
    name: "Acabado",
    enabled: true,
    subprocesses: [
      {
        id: "S017", name: "Ojal", price_int: 0, price_ext: 0,
        type: ProcessType.Interno,
        estimatedTime: 0
      },
      {
        id: "S018", name: "Basta", price_int: 0, price_ext: 0,
        type: ProcessType.Interno,
        estimatedTime: 0
      },
      {
        id: "S019", name: "Atraque Delantero", price_int: 0, price_ext: 0,
        type: ProcessType.Interno,
        estimatedTime: 0
      },
      {
        id: "S020", name: "Atraque Trasero", price_int: 0, price_ext: 0,
        type: ProcessType.Interno,
        estimatedTime: 0
      },
      {
        id: "S021", name: "Atraque Presilla", price_int: 0, price_ext: 0,
        type: ProcessType.Interno,
        estimatedTime: 0
      },
      {
        id: "S022", name: "Planchado Costura", price_int: 0, price_ext: 0,
        type: ProcessType.Interno,
        estimatedTime: 0
      },
      {
        id: "S023", name: "Planchado Entero", price_int: 0, price_ext: 0,
        type: ProcessType.Interno,
        estimatedTime: 0
      },
      {
        id: "S024", name: "Deshilachado", price_int: 0, price_ext: 0,
        type: ProcessType.Interno,
        estimatedTime: 0
      },
      {
        id: "S025", name: "Botón", price_int: 0, price_ext: 0,
        type: ProcessType.Interno,
        estimatedTime: 0
      },
      {
        id: "S026", name: "Entallado", price_int: 0, price_ext: 0,
        type: ProcessType.Interno,
        estimatedTime: 0
      }
    ],
    estimatedTime: 0
  }
];
