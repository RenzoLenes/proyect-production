"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Loader2 } from "lucide-react";
import { Block } from "@/types/block";
import { Personal } from "@/interfaces/personal.interface";
import { getSubprocesosPorBloque, SubProcesoResponse } from '@/actions/subprocesos/crud-subprocesos';
import { updateMovimientoDByParams } from '@/actions/procesod/crud-movprocesod';
import { Input } from '../ui/input';

interface BlockOperationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    blocks: Block[];
    operators: Personal[];
    setSelectedBlocks: (blocks: Block[]) => void;
    fetchData: () => Promise<void>;
}

export function BlockOperationDialog({
    open,
    onOpenChange,
    title,
    blocks,
    operators,
    setSelectedBlocks,
    fetchData,
}: BlockOperationDialogProps) {
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [subprocesos, setSubprocesos] = useState<SubProcesoResponse[]>([]);
    const [pendingSubprocesos, setPendingSubprocesos] = useState<SubProcesoResponse[]>([]);
    const [selectedSubproceso, setSelectedSubproceso] = useState<string>("");
    const [selectedOperator, setSelectedOperator] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        // Formatear la fecha actual sin ajustar el offset
        const now = new Date();
        return now.toISOString().slice(0, 16); // Eliminamos el ajuste de offset aquí
    });

    // Cargar subprocesos cuando cambian los bloques seleccionados
    useEffect(() => {
        const fetchSubprocesos = async () => {
            if (blocks.length === 0) return;

            try {
                setLoading(true);
                const firstBlock = blocks[0];
                const fetchedSubprocesos = await getSubprocesosPorBloque(
                    firstBlock,
                    firstBlock.codigoProceso
                );

                setSubprocesos(fetchedSubprocesos);

                const pending = fetchedSubprocesos.filter(sp => sp.pro_supter !== 'S');
                setPendingSubprocesos(pending);

                if (pending.length > 0) {
                    setSelectedSubproceso(pending[0].pro_codsup);
                }
            } catch (error) {
                console.error("Error al cargar subprocesos:", error);
            } finally {
                setLoading(false);
            }
        };

        if (open) {
            fetchSubprocesos();
        }
    }, [blocks, open]);

    // Reiniciar el estado cuando el diálogo se cierra

    const getLocalDate = (localDate: Date):Date => {
        const offset = localDate.getTimezoneOffset() * 60000; // Ejemplo: 300 minutos * 60000 = +5h en ms

        const utcDate = new Date(localDate.getTime() - offset);

        return utcDate;
    }


    useEffect(() => {
        if (open) {
            console.log("se abrio el modal");
            setSelectedSubproceso("");
            setSelectedOperator("");
            setSubmitting(false);
            // Resetear la fecha al valor actual cuando se cierra
            const now = new Date();
            const localISOTime = getLocalDate(now).toISOString().slice(0, 16); // Convertir a UTC
            setSelectedDate(localISOTime);
        }
    }, [open]);

    const handleComplete = async () => {
        if (!selectedSubproceso || !selectedOperator) return;

        try {
            setSubmitting(true);

            
            // 1. Convertir el string (local) a objeto Date
            const localDate = new Date(selectedDate);

            // 2. Obtener el offset de Lima (UTC-5) en milisegundos
            const utcDate = getLocalDate(localDate); // Convertir a UTC
    
            // 4. Verificar en consola (para debug)
            console.log("Hora local (Lima):", localDate.toLocaleString("es-PE", { timeZone: "America/Lima" }));
            console.log("Hora UTC (BD):", utcDate.toISOString());

            // Procesar cada bloque seleccionado
            const updatePromises = blocks.map(async (block) => {
                const params = {
                    pro_codtic: block.pro_codtic,
                    pro_codfol: block.pro_codfol,
                    pro_numser: block.pro_numser,
                    pro_numdoc: block.pro_numdoc,
                    pro_itemov: block.pro_itemov,
                    pro_codpro: block.codigoProceso,
                    pro_codsup: selectedSubproceso
                };

                const data = {
                    pro_codper: selectedOperator,
                    pro_fecter: utcDate, // Guardamos en UTC
                    pro_supter: 'S'
                };

                return await updateMovimientoDByParams(params, data);
            });

            await Promise.all(updatePromises);

            setSelectedBlocks([]);
            onOpenChange(false);
            await fetchData();

        } catch (error) {
            console.error("Error al completar la operación:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const getSubprocesoName = () => {
        const subproceso = subprocesos.find(sp => sp.pro_codsup === selectedSubproceso);
        return subproceso?.pro_nomsup || "Subproceso";
    };

    const getOperatorName = () => {
        const operator = operators.find(op => op.pro_codper === selectedOperator);
        return operator ? `${operator.pro_nomper}` : "Operario";
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        <span>Cargando subprocesos...</span>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 py-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                    {blocks.length} {blocks.length === 1 ? "bloque" : "bloques"} seleccionados
                                </span>
                            </div>

                            <Separator />

                            {pendingSubprocesos.length === 0 ? (
                                <div className="text-center py-4 text-muted-foreground">
                                    <p>No hay subprocesos pendientes para los bloques seleccionados.</p>
                                </div>
                            ) : (
                                <>
                                    <div className='space-y-2'>
                                        <Label htmlFor="date">Fecha Terminado</Label>
                                        <Input
                                            type="datetime-local"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subproceso">Subproceso a completar</Label>
                                        <Select
                                            value={selectedSubproceso}
                                            onValueChange={setSelectedSubproceso}
                                            disabled={pendingSubprocesos.length === 0}
                                        >
                                            <SelectTrigger id="subproceso">
                                                <SelectValue placeholder="Seleccionar subproceso" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {pendingSubprocesos.map((sp) => (
                                                    <SelectItem key={sp.pro_codsup} value={sp.pro_codsup}>
                                                        {sp.pro_nomsup}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="operator">Operario asignado</Label>
                                        <Select
                                            value={selectedOperator}
                                            onValueChange={setSelectedOperator}
                                            disabled={operators.length === 0}
                                        >
                                            <SelectTrigger id="operator">
                                                <SelectValue placeholder="Seleccionar operario" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <ScrollArea className="h-56">
                                                    {operators.map((op) => (
                                                        <SelectItem key={op.pro_codper} value={op.pro_codper}>
                                                            {`${op.pro_codper} ${op.pro_nomper}`}
                                                        </SelectItem>
                                                    ))}
                                                </ScrollArea>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {selectedSubproceso && selectedOperator && (
                                        <div className="rounded-md bg-muted p-3 text-sm">
                                            <p>
                                                Se registrará el subproceso <strong>{getSubprocesoName()}</strong> como
                                                completado por <strong>{getOperatorName()}</strong> para{" "}
                                                {blocks.length === 1 ? "el bloque" : "los bloques"} seleccionados.
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={submitting}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleComplete}
                                disabled={!selectedSubproceso || !selectedOperator || submitting || pendingSubprocesos.length === 0}
                                className="min-w-24"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Registrando...
                                    </>
                                ) : (
                                    <>
                                        <Check className="mr-2 h-4 w-4" />
                                        Completar
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}