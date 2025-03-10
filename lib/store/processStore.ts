import { create } from 'zustand';
import { Process, SubProcess } from '@/types/process';

interface ProcessStore {
  processes: Process[];
  setProcesses: (processes: Process[]) => void;
  addProcess: (process: Process) => void;
  updateProcess: (id: string, updatedProcess: Partial<Process>) => void;
  toggleProcess: (id: string) => void;
  addSubprocess: (processId: string, subprocess: SubProcess) => void;
  removeSubprocess: (processId: string, subprocessId: string) => void;
}

export const useProcessStore = create<ProcessStore>((set) => ({
  processes: [], // Inicializar con tus datos o cargar desde API
  setProcesses: (processes) => set({ processes }),
  addProcess: (process) => 
    set((state) => ({ processes: [...state.processes, process] })),

  updateProcess: (id, updatedProcess) =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.id === id ? { ...p, ...updatedProcess } : p
      ),
    })),

  toggleProcess: (id) =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.id === id ? { ...p, enabled: !p.enabled } : p
      ),
    })),

  addSubprocess: (processId, subprocess) =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.id === processId
          ? { ...p, subprocesses: [...p.subprocesses, subprocess] }
          : p
      ),
    })),

  removeSubprocess: (processId, subprocessId) =>
    set((state) => ({
      processes: state.processes.map((p) =>
        p.id === processId
          ? {
              ...p,
              subprocesses: p.subprocesses.filter((sp) => sp.id !== subprocessId),
            }
          : p
      ),
    })),
}));