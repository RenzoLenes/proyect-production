import { useProcessStore } from "@/lib/store/processStore";
import { ProcessType } from "@/types/block";
import { Process, SubProcess } from "@/types/process";
import { useState } from "react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export const ProcessConfig = () => {
    const { processes, updateProcess, toggleProcess, addSubprocess, removeSubprocess } = useProcessStore();
    const [newSubprocessName, setNewSubprocessName] = useState("");

    // Mantener la lógica de manejo de procesos aquí
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Procesos y Subprocesos</h2>
                <Button>Nuevo Proceso</Button>
            </div>

            <div className="grid gap-6">
                {processes.map((process) => (
                    <div
                        key={process.id}
                        className="space-y-4 border rounded-lg p-4"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">{process.name}</h3>
                            <Switch
                                checked={process.enabled}
                                onCheckedChange={() => toggleProcess(process.id)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Costo Interno ($/unidad)</Label>
                                <Input
                                    type="number"
                                    value={process.subprocesses[0]?.price_int || 0}
                                    onChange={(e) =>
                                        handleUpdateSubprocess(
                                            process.id,
                                            process.subprocesses[0].id,
                                            'price_int',
                                            parseFloat(e.target.value)
                                        )
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Costo Externo ($/unidad)</Label>
                                <Input
                                    type="number"
                                    value={process.subprocesses[0]?.price_ext || 0}
                                    onChange={(e) =>
                                        handleUpdateSubprocess(
                                            process.id,
                                            process.subprocesses[0].id,
                                            'price_ext',
                                            parseFloat(e.target.value)
                                        )
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Tiempo Estimado (min)</Label>
                                <Input
                                    type="number"
                                    value={process.subprocesses[0]?.estimatedTime || 0}
                                    onChange={(e) =>
                                        handleUpdateProcess(
                                            process.id,
                                            'estimatedTime',
                                            parseInt(e.target.value)
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Subprocesos</Label>
                            <div className="flex flex-wrap gap-2">
                                {process.subprocesses.map((subprocess) => (
                                    <div
                                        key={subprocess.id}
                                        className="flex items-center gap-2 bg-accent p-2 rounded-lg"
                                    >
                                        <span>{subprocess.name}</span>
                                        <Select
                                            value={subprocess.type}
                                            onValueChange={(value) =>
                                                handleUpdateSubprocess(
                                                    process.id,
                                                    subprocess.id,
                                                    'type',
                                                    value
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
                                            className="h-4 w-4 p-0"
                                            onClick={() => removeSubprocess(process.id, subprocess.id)}
                                        >
                                            ×
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2 mt-2">
                                <Input
                                    placeholder="Nuevo subproceso"
                                    value={newSubprocessName}
                                    onChange={(e) => setNewSubprocessName(e.target.value)}
                                />
                                <Button onClick={() => handleAddSubprocess(process.id)}>
                                    Agregar
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};