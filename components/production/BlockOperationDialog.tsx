import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Block, ProcessType } from "@/types/block";
import { useState } from "react";

interface BlockOperationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    block: Block[] | null | Block;
    operators: { id: number; name: string }[];
    numberOfOperators: number;
    onNumberOfOperatorsChange: (value: number) => void;
    selectedOperators: string[];
    onSelectedOperatorsChange: (operators: string[]) => void;
    onSubprocessComplete: (blockId: string, subprocessId: string) => void;
    subprocessType: ProcessType.Interno | ProcessType.Externo;
}

export const BlockOperationDialog = ({
    open,
    onOpenChange,
    title,
    block,
    operators,
    numberOfOperators,
    onNumberOfOperatorsChange,
    selectedOperators,
    onSelectedOperatorsChange,
    onSubprocessComplete,
    subprocessType
}: BlockOperationDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>

                {Array.isArray(block) && block.length > 1 ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Bloques en Lote</DialogTitle>
                        </DialogHeader>

                        <div>
                            <p>Funcionalidad no disponible</p>
                        </div>
                    </>
                ) : block ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>{title}</DialogTitle>
                        </DialogHeader>
                        <BlockDetails
                            block={Array.isArray(block) ? block[0] : block}
                            operators={operators}
                            numberOfOperators={numberOfOperators}
                            onNumberOfOperatorsChange={onNumberOfOperatorsChange}
                            selectedOperators={selectedOperators}
                            onSelectedOperatorsChange={onSelectedOperatorsChange}
                            onSubprocessComplete={onSubprocessComplete}
                            onOpenChange={onOpenChange} 
                            subprocessType={subprocessType}
                            />
                            
                    </>
                ) : (
                    <div>Bloque no encontrado</div>
                )}
            </DialogContent>
        </Dialog>
    );
};

const BlockDetails = ({
    block,
    operators,
    numberOfOperators,
    onNumberOfOperatorsChange,
    selectedOperators,
    onSelectedOperatorsChange,
    onSubprocessComplete,
    onOpenChange, // 🔸 añadida prop para cerrar dialog
    subprocessType,
}: {
    block: Block;
    operators: { id: number; name: string }[];
    numberOfOperators: number;
    onNumberOfOperatorsChange: (value: number) => void;
    selectedOperators: string[];
    onSelectedOperatorsChange: (operators: string[]) => void;
    onSubprocessComplete: (blockId: string, subprocessId: string) => void;
    onOpenChange: (open: boolean) => void; //🔸 añadida prop
    subprocessType: ProcessType.Interno | ProcessType.Externo;
}) => {
    const [selectedSubprocess, setSelectedSubprocess] = useState<string>("");

    const handleCompleteSubprocess = () => {
        if (selectedSubprocess) {
            onSubprocessComplete(block.id, selectedSubprocess);
            setSelectedSubprocess("");
            onOpenChange(false); //🔸 cerramos el dialog

        } else {
            alert("Por favor selecciona un subproceso antes de guardar.");
        }
    };

    return (
        <div className="p-4 rounded-lg space-y-4">
            {/* Información del bloque */}
            <div className="flex justify-between">
                <span className="font-medium">Referencia:</span>
                <span>{block.reference}</span>
            </div>
            <span className="flex flex-row-reverse">{block.quantity} unidades</span>

            {/* Número de operarios */}
            <Input
                type="number"
                placeholder="Número de operarios"
                value={numberOfOperators}
                onChange={(e) => onNumberOfOperatorsChange(Number(e.target.value))}
                min={1}
                className="mb-4"
            />

            {/* Selección dinámica de operadores */}
            {Array.from({ length: numberOfOperators }, (_, index) => (
                <div key={index} className="flex gap-4 mb-4">
                    <Select
                        value={selectedOperators[index] || ""}
                        onValueChange={(value) => {
                            const newSelectedOperators = [...selectedOperators];
                            newSelectedOperators[index] = value;
                            onSelectedOperatorsChange(newSelectedOperators);
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={`Operario ${index + 1}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {operators.map((op) => (
                                <SelectItem key={op.id} value={op.id.toString()}>
                                    {op.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input placeholder={`Cantidad ${index + 1}`} className="w-32" />
                </div>
            ))}

            {/* Selección de subproceso y botón de guardado */}
            <div className="flex flex-col gap-2">
                <Select
                    value={selectedSubprocess}
                    onValueChange={(value) => setSelectedSubprocess(value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona un subproceso" />
                    </SelectTrigger>
                    <SelectContent>
                        {
                        block.subprocesses
                            .filter((sp) => sp.type === subprocessType && !sp.completed)
                            .map((sp) => (
                                <SelectItem key={sp.id} value={sp.id}>
                                    {sp.name}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
                <Button className="mt-2" onClick={handleCompleteSubprocess}>
                    Guardar Subproceso
                </Button>
            </div>
        </div>
    );
};