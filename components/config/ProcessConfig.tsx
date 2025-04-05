import { useProcessStore } from "@/lib/store/processStore";
import { ProcessType } from "@/types/block";
import { Process, SubProcess } from "@/types/process";
import { useState } from "react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { ChevronDown, ChevronUp, GripVertical, Plus } from "lucide-react";

export const ProcessConfig = () => {
    const { processes, updateProcess, toggleProcess, addProcess, addSubprocess, removeSubprocess, setProcesses, updateSubprocess } = useProcessStore();
    const [newSubprocessName, setNewSubprocessName] = useState("");
    const [newProcessName, setNewProcessName] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [expandedProcessId, setExpandedProcessId] = useState<string | null>(null);
    const [draggedProcessId, setDraggedProcessId] = useState<string | null>(null);

    // Manejo de procesos
    const handleAddProcess = () => {
        if (!newProcessName) return;

        const newProcess: Process = {
            id: `P${Date.now()}`,
            name: newProcessName,
            enabled: true,
            estimatedTime: 0,
            subprocesses: []
        };

        addProcess(newProcess);
        setNewProcessName("");
        setDialogOpen(false);
    };

    const handleAddSubprocess = (processId: string) => {
        if (!newSubprocessName) return;

        const newSubprocess: SubProcess = {
            id: `S${Date.now()}`,
            name: newSubprocessName,
            price_int: 0,
            price_ext: 0,
            type: ProcessType.Interno,
            estimatedTime: 0
        };

        addSubprocess(processId, newSubprocess);
        setNewSubprocessName("");
    };

    const handleUpdateProcess = (processId: string, field: keyof Process, value: any) => {
        updateProcess(processId, { [field]: value });
    };

    const handleUpdateSubprocess = (processId: string, subprocessId: string, field: keyof SubProcess, value: any) => {
        updateProcess(processId, {
            subprocesses: processes.find(p => p.id === processId)?.subprocesses.map(sp =>
                sp.id === subprocessId ? { ...sp, [field]: value } : sp
            ) || []
        });
    };

    // Manejo de drag and drop
    const handleDragStart = (processId: string) => {
        setDraggedProcessId(processId);
    };

    const handleDragOver = (e: React.DragEvent, targetProcessId: string) => {
        e.preventDefault();
        if (draggedProcessId && draggedProcessId !== targetProcessId) {
            const dragIndex = processes.findIndex(p => p.id === draggedProcessId);
            const hoverIndex = processes.findIndex(p => p.id === targetProcessId);

            if (dragIndex !== -1 && hoverIndex !== -1) {
                // Crear nueva lista reordenada
                const newOrder = [...processes];
                const [movedItem] = newOrder.splice(dragIndex, 1);
                newOrder.splice(hoverIndex, 0, movedItem);

                // Actualizar store con nuevo orden
                setProcesses(newOrder);
                console.log("new-order",newOrder);

            }

        }
        console.log("processes",processes);
    };

    const handleDragEnd = () => {
        setDraggedProcessId(null);
    };

    const toggleExpand = (processId: string) => {
        setExpandedProcessId(expandedProcessId === processId ? null : processId);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Procesos y Subprocesos</h2>
                <Button onClick={() => setDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Proceso
                </Button>
            </div>

            <div className="grid gap-3">
                {processes.map((process) => (
                    <div
                        key={process.id}
                        className={`border rounded-lg ${draggedProcessId === process.id ? 'border-primary bg-primary/10' : ''}`}
                        draggable
                        onDragStart={() => handleDragStart(process.id)}
                        onDragOver={(e) => handleDragOver(e, process.id)}
                        onDragEnd={handleDragEnd}
                    >
                        <div
                            className="flex items-center justify-between p-4 cursor-pointer"
                            onClick={() => toggleExpand(process.id)}
                        >
                            <div className="flex items-center gap-3">
                                <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                                <h3 className="text-lg font-medium">{process.name}</h3>
                                <span className="text-sm text-muted-foreground">
                                    ({process.subprocesses.length} subprocesos)
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Switch
                                    checked={process.enabled}
                                    onCheckedChange={() => toggleProcess(process.id)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                {expandedProcessId === process.id ?
                                    <ChevronUp className="h-5 w-5" /> :
                                    <ChevronDown className="h-5 w-5" />
                                }
                            </div>
                        </div>

                        {expandedProcessId === process.id && (
                            <div className="p-4 pt-0 border-t">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Subprocesos</Label>
                                        <div className="space-y-4">
                                            {process.subprocesses.map((subprocess) => (
                                                <div
                                                    key={subprocess.id}
                                                    className="bg-accent p-4 rounded-lg space-y-3"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium">{subprocess.name}</span>
                                                        <div className="flex items-center gap-2">
                                                            <Select
                                                                value={subprocess.type}
                                                                onValueChange={(value) =>
                                                                    updateSubprocess(
                                                                        process.id,
                                                                        subprocess.id,
                                                                        { type: value as ProcessType }
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger className="h-8 w-24">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Interno">Interno</SelectItem>
                                                                    <SelectItem value="Externo">Externo</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    removeSubprocess(process.id, subprocess.id);
                                                                }}
                                                            >
                                                                ×
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div className="space-y-2">
                                                            <Label>Costo Interno ($/unidad)</Label>
                                                            <Input
                                                                type="number"
                                                                value={subprocess.price_int || 0}
                                                                onChange={(e) =>
                                                                    handleUpdateSubprocess(
                                                                        process.id,
                                                                        subprocess.id,
                                                                        'price_int',
                                                                        parseFloat(e.target.value)
                                                                    )
                                                                }
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Costo Externo ($/unidad)</Label>
                                                            <Input
                                                                type="number"
                                                                value={subprocess.price_ext || 0}
                                                                onChange={(e) =>
                                                                    handleUpdateSubprocess(
                                                                        process.id,
                                                                        subprocess.id,
                                                                        'price_ext',
                                                                        parseFloat(e.target.value)
                                                                    )
                                                                }
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Tiempo Estimado (min)</Label>
                                                            <Input
                                                                type="number"
                                                                value={subprocess.estimatedTime || 0}
                                                                onChange={(e) =>
                                                                    handleUpdateSubprocess(
                                                                        process.id,
                                                                        subprocess.id,
                                                                        'estimatedTime',
                                                                        parseInt(e.target.value)
                                                                    )
                                                                }
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            <Input
                                                placeholder="Nuevo subproceso"
                                                value={newSubprocessName}
                                                onChange={(e) => setNewSubprocessName(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddSubprocess(process.id);
                                                }}
                                            >
                                                Agregar
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Diálogo para crear nuevo proceso */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Crear Nuevo Proceso</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="process-name">Nombre del Proceso</Label>
                        <Input
                            id="process-name"
                            value={newProcessName}
                            onChange={(e) => setNewProcessName(e.target.value)}
                            placeholder="Ej: Producción, Empaque, etc."
                            className="mt-2"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleAddProcess}>
                            Crear Proceso
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};