"use client";
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Personal } from "@/interfaces/personal.interface";
import { getSubprocesosByProceso, SubProcesoResponse } from "@/actions/subprocesos/crud-subprocesos";
import { Block } from '@/types/block';
import { Loader2 } from 'lucide-react';
import { Howl } from 'howler';
import { SubProceso } from '@/interfaces/subproceso.interface';
import { getPersonalByTipo } from '@/actions/personal/crud-personal';
import { format, set } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '../ui/input';
import { createNewMovimientoC, CreateNewMovimientoCData } from '@/actions/procesoc/crud-movprocesoc';
import { CreateMovimientoDData, createNewMovimientoD } from '@/actions/procesod/crud-movprocesod';
import { createUnifiedMovement, UnifiedMovementParams } from '@/actions/procesos/crud-completo-movimiento';
import { useSound as useImportedSound } from 'use-sound';
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { SuccessNotification } from '../SuccessNotification';

interface MoveProcessDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bloque: Block;
    siguienteProceso: { codigo: string; nombre: string };
    onConfirm: (data: {
        fecha: Date;
        operarioGeneral: string | null;
        asignaciones: Record<string, { operario: string; fecha: Date }>;
        tipoAsignacion: 'subproceso' | 'proceso' | 'ninguno';
    }) => void;
    onSuccess?: () => void; // Nueva prop para actualizar datos

}



export const MoveProcessDialog = ({
    open,
    onOpenChange,
    bloque,
    siguienteProceso,
    onConfirm,
    onSuccess
}: MoveProcessDialogProps) => {
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        // Formatear la fecha actual sin ajustar el offset
        const now = new Date();
        return now.toISOString().slice(0, 16); // Eliminamos el ajuste de offset aquí
    });
    const [tipoAsignacion, setTipoAsignacion] = useState<'subproceso' | 'proceso' | 'ninguno'>('proceso');
    const [operarioGeneral, setOperarioGeneral] = useState<string>('');
    const [asignaciones, setAsignaciones] = useState<Record<string, { operario: string; fechaStr: Date }>>({});
    const [subprocesos, setSubprocesos] = useState<SubProceso[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [operators, setOperators] = useState<Personal[]>([]);
    const [successDetails, setSuccessDetails] = useState<{
        show: boolean;
        title?: string;
        message?: string;
    }>({ show: false });



    const getLocalDate = (localDate: Date): Date => {
        const offset = localDate.getTimezoneOffset() * 60000; // Ejemplo: 300 minutos * 60000 = +5h en ms

        const utcDate = new Date(localDate.getTime() - offset);

        return utcDate;
    }

    const [playSuccess] = useImportedSound(
        '/sounds/mixkit-achievement-bell-600.wav',
        {
            volume: 0.7,
            interrupt: true // Permite interrumpir si se vuelve a activar
        }
    );



    useEffect(() => {
        const fetchOperators = async () => {
            try {
                const fetchedOperators = await getPersonalByTipo();
                setOperators(fetchedOperators);
            } catch (error) {
                console.error("Error fetching operators:", error);
                setOperators([]);
            }
        };

        fetchOperators();
    }, []);

    useEffect(() => {
        const fetchSubprocesos = async () => {
            if (!open || !siguienteProceso) return;

            try {
                setLoading(true);
                const fetchedSubprocesos = await getSubprocesosByProceso(bloque.pro_codtic, siguienteProceso.codigo);
                setSubprocesos(fetchedSubprocesos);

                const initialAsignaciones: Record<string, { operario: string; fechaStr: Date }> = {};
                fetchedSubprocesos.forEach(sp => {
                    initialAsignaciones[sp.pro_codsup] = {
                        operario: '',
                        fechaStr: getLocalDate(new Date())
                    };
                });
                setAsignaciones(initialAsignaciones);
            } catch (error) {
                console.error("Error al cargar subprocesos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubprocesos();
    }, [open, bloque, siguienteProceso]);

    // Resetear estados cuando se cierra el diálogo (similar al primer código)
    useEffect(() => {
        if (open) {
            setTipoAsignacion('proceso');
            setOperarioGeneral('');
            setAsignaciones({});
            // Resetear a fecha actual cuando se cierra
            const now = new Date();
            const localISOTime = getLocalDate(now).toISOString().slice(0, 19); // Convertir a UTC

            console.log(localISOTime)

            setSelectedDate(localISOTime); // Formato YYYY-MM-DDTHH:mm
        }
    }, [open]);

    const handleOperarioChange = (subprocesoId: string, value: string) => {
        setAsignaciones(prev => ({
            ...prev,
            [subprocesoId]: {
                operario: value,
                fechaStr: prev[subprocesoId]?.fechaStr || new Date()
            }
        }));
    };

    const handleFechaChange = (subprocesoId: string, newFechaStr: Date) => {
        setAsignaciones(prev => ({
            ...prev,
            [subprocesoId]: {
                operario: prev[subprocesoId]?.operario || '',
                fechaStr: new Date(newFechaStr)
            }
        }));
    };

    const handleSubmit = async () => {
        if (tipoAsignacion === 'proceso' && !operarioGeneral) {
            alert('Por favor seleccione un operario para el proceso');
            return;
        }

        if (tipoAsignacion === 'subproceso') {
            const faltanAsignaciones = subprocesos.some(sp => !asignaciones[sp.pro_codsup]?.operario);
            if (faltanAsignaciones) {
                alert('Por favor asigne operarios a todos los subprocesos');
                return;
            }
        }

        try {
            setLoading(true);
            const fechaUtc = new Date(selectedDate);

            // Preparar parámetros para la función unificada
            const params: UnifiedMovementParams = {
                pro_codtic: bloque.pro_codtic,
                pro_codfol: bloque.pro_codfol,
                pro_numser: bloque.pro_numser,
                pro_numdoc: bloque.pro_numdoc,
                pro_itemov: bloque.pro_itemov,
                pro_codpro: bloque.codigoProceso,
                siguienteProceso: siguienteProceso.codigo,
                fechaMovimiento: getLocalDate(fechaUtc),
                operarioGeneral: tipoAsignacion === 'proceso' ? operarioGeneral :
                    tipoAsignacion === 'ninguno' ? '00' : undefined,
                asignacionesSubprocesos: tipoAsignacion === 'proceso'
                    ? Object.fromEntries(
                        Object.entries(asignaciones).map(([key, value]) => [
                            key,
                            {
                                operario: operarioGeneral,
                                fecha: getLocalDate(new Date(selectedDate))
                            }
                        ])
                    ) : tipoAsignacion === 'subproceso'
                        ? Object.fromEntries(
                            Object.entries(asignaciones).map(([key, value]) => [
                                key,
                                {
                                    operario: value.operario,
                                    fecha: value.fechaStr
                                }
                            ])
                        ) : tipoAsignacion === 'ninguno'
                            ? Object.fromEntries(
                                Object.entries(asignaciones).map(([key, value]) => [
                                    key,
                                    {
                                        operario: '00',
                                        fecha: getLocalDate(new Date(selectedDate))
                                    }
                                ])
                            )
                            : undefined
            };

            // Ejecutar la función unificada
            await createUnifiedMovement(params);

            // Notificar éxito
            onConfirm({
                fecha: fechaUtc,
                operarioGeneral: tipoAsignacion === 'proceso' ? operarioGeneral :
                    tipoAsignacion === 'ninguno' ? '00' : null,
                asignaciones: tipoAsignacion === 'proceso'
                    ? Object.fromEntries(
                        Object.entries(asignaciones).map(([key, value]) => [
                            key,
                            {
                                operario: operarioGeneral,
                                fecha: getLocalDate(new Date(selectedDate))
                            }
                        ])
                    ) : tipoAsignacion === 'subproceso'
                        ? Object.fromEntries(
                            Object.entries(asignaciones).map(([key, value]) => [
                                key,
                                {
                                    operario: value.operario,
                                    fecha: getLocalDate(value.fechaStr)
                                }
                            ])
                        )
                        : tipoAsignacion === 'ninguno'
                            ? Object.fromEntries(
                                Object.entries(asignaciones).map(([key, value]) => [
                                    key,
                                    {
                                        operario: '00',
                                        fecha: getLocalDate(new Date(selectedDate))
                                    }
                                ])
                            )

                            : {},
                tipoAsignacion
            });

            setSuccessDetails({
                show: true,
                title: "¡Movimiento exitoso!",
                message: "Los movimientos se registraron correctamente en el sistema."
            });

            setTimeout(() => {
                onOpenChange(false);
                if (onSuccess) onSuccess();
            }, 2000);

        } catch (error) {
            console.error("Error al confirmar movimiento:", error);
            alert(`Error: ${error instanceof Error ? error.message : "Error desconocido"}`);
        } finally {
            setLoading(false);
        }
    };
    const operatorsArray = Array.isArray(operators) ? operators : [];

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                            <span>Mover a proceso: </span>
                            <Badge variant="outline" className="text-primary font-bold text-base">
                                {siguienteProceso.nombre}
                            </Badge>
                        </DialogTitle>
                    </DialogHeader>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="text-lg text-muted-foreground">Cargando subprocesos...</span>
                        </div>
                    ) : (
                        <div className="space-y-6 py-2">
                            {subprocesos.length === 0 ? (
                                <Card className="border-dashed">
                                    <CardHeader>
                                        <CardTitle className="text-center text-lg">
                                            No hay subprocesos definidos
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-center text-muted-foreground">
                                        El proceso <strong>{siguienteProceso.nombre}</strong> no tiene subprocesos configurados.
                                    </CardContent>
                                </Card>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="font-medium">Fecha de movimiento</Label>
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <Input
                                                    type="datetime-local"
                                                    value={selectedDate}
                                                    onChange={(e) => setSelectedDate(e.target.value)}
                                                    className="w-full"
                                                />

                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="font-medium block mb-2">Tipo de asignación</Label>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="asignacion-subproceso"
                                                        checked={tipoAsignacion === 'subproceso'}
                                                        onCheckedChange={() => setTipoAsignacion('subproceso')}
                                                        className="h-5 w-5"
                                                    />
                                                    <Label htmlFor="asignacion-subproceso" className="cursor-pointer text-sm">
                                                        Por subproceso
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="asignacion-proceso"
                                                        checked={tipoAsignacion === 'proceso'}
                                                        onCheckedChange={() => setTipoAsignacion('proceso')}
                                                        className="h-5 w-5"
                                                    />
                                                    <Label htmlFor="asignacion-proceso" className="cursor-pointer text-sm">
                                                        Por proceso
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="asignacion-ninguno"
                                                        checked={tipoAsignacion === 'ninguno'}
                                                        onCheckedChange={() => setTipoAsignacion('ninguno')}
                                                        className="h-5 w-5"
                                                    />
                                                    <Label htmlFor="asignacion-ninguno" className="cursor-pointer text-sm">
                                                        Ninguno (00)
                                                    </Label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {tipoAsignacion === 'proceso' && (
                                        <Card>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg">Operario general</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Select value={operarioGeneral} onValueChange={setOperarioGeneral}>
                                                    <SelectTrigger className="w-full max-w-md">
                                                        <SelectValue placeholder="Seleccione un operario..." />
                                                    </SelectTrigger>
                                                    <SelectContent className="max-h-60 overflow-y-auto">
                                                        {operatorsArray.length > 0 ? (
                                                            operatorsArray.map(op => (
                                                                <SelectItem
                                                                    key={op.pro_codper}
                                                                    value={op.pro_codper}
                                                                    className="flex items-center gap-2"
                                                                >
                                                                    <span className="font-medium">{op.pro_nomper}</span>
                                                                    <span className="text-muted-foreground text-sm">({op.pro_codper})</span>
                                                                </SelectItem>
                                                            ))
                                                        ) : (
                                                            <SelectItem value="no-operators" disabled>
                                                                No hay operarios disponibles
                                                            </SelectItem>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {operarioGeneral && (
                                                    <div className="mt-2 text-sm text-muted-foreground">
                                                        Operario seleccionado: {operatorsArray.find(op => op.pro_codper === operarioGeneral)?.pro_nomper}
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    )}

                                    {tipoAsignacion === 'subproceso' && (
                                        <div className="mt-2">
                                            <h3 className="font-medium text-lg mb-3">Asignación por subproceso</h3>

                                            {/* Mobile view */}
                                            <div className="md:hidden space-y-4">
                                                {subprocesos.map(subproceso => {
                                                    const selectedOperator = operatorsArray.find(op =>
                                                        op.pro_codper === asignaciones[subproceso.pro_codsup]?.operario
                                                    );

                                                    return (
                                                        <Card key={subproceso.pro_codsup} className="hover:shadow-sm transition-shadow">
                                                            <CardHeader className="pb-3">
                                                                <CardTitle className="text-base">
                                                                    {subproceso.pro_nomsup}
                                                                </CardTitle>
                                                            </CardHeader>
                                                            <CardContent className="space-y-4">
                                                                <div className="space-y-2">
                                                                    <Label>Operario</Label>
                                                                    <Select
                                                                        value={asignaciones[subproceso.pro_codsup]?.operario || ''}
                                                                        onValueChange={(value) => handleOperarioChange(subproceso.pro_codsup, value)}
                                                                    >
                                                                        <SelectTrigger className="w-full">
                                                                            <SelectValue placeholder="Seleccione..." />
                                                                        </SelectTrigger>
                                                                        <SelectContent className="max-h-60 overflow-y-auto">
                                                                            {operatorsArray.length > 0 ? (
                                                                                operatorsArray.map(op => (
                                                                                    <SelectItem key={op.pro_codper} value={op.pro_codper}>
                                                                                        {op.pro_nomper} ({op.pro_codper})
                                                                                    </SelectItem>
                                                                                ))
                                                                            ) : (
                                                                                <SelectItem value="no-operators" disabled>
                                                                                    No hay operarios disponibles
                                                                                </SelectItem>
                                                                            )}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {selectedOperator && (
                                                                        <div className="text-sm text-muted-foreground">
                                                                            Seleccionado: {selectedOperator.pro_nomper}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <Label>Fecha</Label>
                                                                    <div className="flex flex-col sm:flex-row gap-2">
                                                                        <Input
                                                                            type="datetime-local"
                                                                            value={asignaciones[subproceso.pro_codsup]?.fechaStr.toISOString().slice(0, 19) || selectedDate}
                                                                            onChange={(e) => handleFechaChange(subproceso.pro_codsup, new Date(e.target.value))}
                                                                            className="w-full"
                                                                        />

                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    );
                                                })}
                                            </div>

                                            {/* Desktop table view */}
                                            <div className="hidden md:block">
                                                <div className="rounded-lg border overflow-hidden">
                                                    <Table className="min-w-full">
                                                        <TableHeader className="bg-muted/50">
                                                            <TableRow>
                                                                <TableHead className="w-[35%] font-semibold">Subproceso</TableHead>
                                                                <TableHead className="w-[35%] font-semibold">Operario</TableHead>
                                                                <TableHead className="w-[30%] font-semibold">Fecha</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {subprocesos.map(subproceso => {
                                                                const selectedOperator = operatorsArray.find(op =>
                                                                    op.pro_codper === asignaciones[subproceso.pro_codsup]?.operario
                                                                );

                                                                return (
                                                                    <TableRow key={subproceso.pro_codsup} className="hover:bg-muted/25">
                                                                        <TableCell className="font-medium">
                                                                            {subproceso.pro_nomsup}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Select
                                                                                value={asignaciones[subproceso.pro_codsup]?.operario || ''}
                                                                                onValueChange={(value) => handleOperarioChange(subproceso.pro_codsup, value)}
                                                                            >
                                                                                <SelectTrigger className="w-full">
                                                                                    {selectedOperator ? (
                                                                                        <span className="truncate">
                                                                                            {selectedOperator.pro_nomper} ({selectedOperator.pro_codper})
                                                                                        </span>
                                                                                    ) : (
                                                                                        <span className="text-muted-foreground">Seleccione...</span>
                                                                                    )}
                                                                                </SelectTrigger>
                                                                                <SelectContent className="max-h-60 overflow-y-auto">
                                                                                    {operatorsArray.length > 0 ? (
                                                                                        operatorsArray.map(op => (
                                                                                            <SelectItem key={op.pro_codper} value={op.pro_codper}>
                                                                                                {op.pro_nomper} ({op.pro_codper})
                                                                                            </SelectItem>
                                                                                        ))
                                                                                    ) : (
                                                                                        <SelectItem value="no-operators" disabled>
                                                                                            No hay operarios disponibles
                                                                                        </SelectItem>
                                                                                    )}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <div className="flex gap-2">
                                                                                <Input
                                                                                    type="datetime-local"
                                                                                    value={asignaciones[subproceso.pro_codsup]?.fechaStr.toISOString().slice(0, 19) || selectedDate}
                                                                                    onChange={(e) => handleFechaChange(subproceso.pro_codsup, getLocalDate(new Date(e.target.value)))}
                                                                                    className="flex-1 min-w-0"
                                                                                />
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                );
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="w-full sm:w-auto"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading || (subprocesos.length === 0) || (tipoAsignacion === 'proceso' && operatorsArray.length === 0)}
                            className="w-full sm:w-auto"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Procesando...
                                </>
                            ) : (
                                'Confirmar movimiento'
                            )}
                        </Button>
                    </DialogFooter>





                </DialogContent>
            </Dialog>
            {/* Mensaje de éxito */}
            <SuccessNotification
                show={successDetails.show}
                onClose={() => setSuccessDetails(prev => ({ ...prev, show: false }))}
                title={successDetails.title}
                message={successDetails.message}
                duration={2000}
            />
        </>

    );
};

