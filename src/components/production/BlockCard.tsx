"use client";
import { useState, useEffect } from 'react';
import { Card } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { MovimientoProcesoResultado } from '@/features/procesoc/types/movproceso.interface';
import { getPersonalByTipo } from '@/features/personal/actions/crud-personal';
import { Loader2 } from 'lucide-react';
import { MoveProcessDialog } from './MoveProcessDialog';
import { Personal } from '@/features/personal/types/personal.interface';
import { useConfigStore } from '@/lib/store/configStore';
import { getProcesosByTipoConfeccion } from '@/features/procesos/actions/crud-proceso';
import { getSubprocesosPorBloque, SubProcesoResponse } from '@/features/subprocesos/actions/crud-subprocesos';
import { Block } from '@/features/subprocesos/types/block.interface';

interface BlockCardProps {
    bloque: Block;
    isSelected: boolean;
    onSelect: () => void;
    onEditSubproceso?: (blockId: string, subprocesoId: string) => void;
    onMoveToNextProcess?: (data: {
        blockId: string;
        nextProcess: string;
        fecha: Date;
        operarioGeneral: string | null;
        asignaciones: Record<string, { operario: string; fecha: Date }>;
        tipoAsignacion: 'subproceso' | 'proceso' | 'ninguno';
    }) => Promise<void>;
    fetchBloques: () => Promise<void>;
}

interface SubprocesoBadgeProps {
    subproceso: SubProcesoResponse;
    bloque: { id: string };
    onEditSubproceso?: (blockId: string, subprocesoId: string) => void;
}

export const BlockCard = ({
    bloque,
    isSelected,
    onSelect,
    onEditSubproceso,
    onMoveToNextProcess,
    fetchBloques,
}: BlockCardProps) => {
    const [subprocesosData, setSubprocesosData] = useState<SubProcesoResponse[]>([]);
    const [procesos, setProcesos] = useState<{ pro_codpro: string; pro_nompro: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [moveDialogOpen, setMoveDialogOpen] = useState(false);
    const { tipoConfeccion } = useConfigStore();

    const movimientoRef = bloque.movimientos[0];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [procesosData, subprocesosData] = await Promise.all([
                    getProcesosByTipoConfeccion(tipoConfeccion),
                    getSubprocesosPorBloque(bloque, bloque.codigoProceso),
                ]);
                setProcesos(procesosData);
                setSubprocesosData(subprocesosData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [bloque, bloque.codigoProceso]);

    const getSubprocesoStatus = (subprocesoId: string): boolean => {
        const subproceso = subprocesosData.find(sp => sp.pro_codsup === subprocesoId);
        return subproceso?.pro_supter === 'S';
    };

    const getProgressPercentage = (): number => {
        if (loading || subprocesosData.length === 0) return 0;
        const completados = subprocesosData.filter(sp => sp.pro_supter === 'S').length;
        return (completados / subprocesosData.length) * 100;
    };

    const todosSubprocesosCompletados = (): boolean => {
        return subprocesosData.length > 0 &&
            subprocesosData.every(sp => sp.pro_supter === 'S');
    };

    const isFinalProcess = (): boolean => {
        return procesos.length > 0 &&
            bloque.codigoProceso === procesos[procesos.length - 1].pro_codpro;
    };

    const getPriorityVariant = (): "destructive" | "secondary" | "outline" => {
        switch (movimientoRef.prioridad?.toUpperCase()) {
            case 'S': return 'destructive';
            case 'N': return 'secondary';
            default: return 'outline';
        }
    };

    const getNextProcess = (procesosList: { pro_codpro: string; pro_nompro: string }[]) => {
        if (!procesosList.length) return null;

        const currentIndex = procesosList.findIndex(p => p.pro_codpro === bloque.codigoProceso);
        if (currentIndex === -1 || currentIndex === procesosList.length - 1) return null;

        return {
            codigo: procesosList[currentIndex + 1].pro_codpro,
            nombre: procesosList[currentIndex + 1].pro_nompro
        };
    };

    const handleMoveToNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setMoveDialogOpen(true);
    };

    const handleConfirmMove = async (data: {
        fecha: Date;
        operarioGeneral: string | null;
        asignaciones: Record<string, { operario: string; fecha: Date }>;
        tipoAsignacion: 'subproceso' | 'proceso' | 'ninguno';
    }) => {
        const nextProcess = getNextProcess(procesos);
        if (onMoveToNextProcess && nextProcess) {
            try {
                await onMoveToNextProcess({
                    blockId: bloque.id,
                    nextProcess: nextProcess.codigo,
                    ...data
                });
                setMoveDialogOpen(false);
            } catch (error) {
                console.error("Error al mover proceso:", error);
            }
        }
    };

    // Fix: Use the function with parameters
    const siguienteProcesoInfo = getNextProcess(procesos);
    const puedeMoverse = !isFinalProcess() && todosSubprocesosCompletados() && siguienteProcesoInfo;

    const totalQuantity = bloque.movimientos[0]?.cantidad || 0;

    if (loading) return <LoadingBlock />;

    return (
        <>
            <Card
                className={`p-4 mb-4 cursor-pointer transition-all duration-200 ${isSelected ? 'border-primary border-2' : 'hover:border-accent'
                    }`}
                onClick={onSelect}
            >
                <div className="flex items-start gap-4">
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={onSelect}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-medium">Bloque: {bloque.id}</h3>
                                    <Badge variant={getPriorityVariant()}>
                                        {movimientoRef.prioridad || 'Normal'}
                                    </Badge>
                                </div>
                                <div className="flex gap-4 text-sm text-muted-foreground">
                                    <span>Proceso: {bloque.procesoActual}</span>
                                    <span>Total: {totalQuantity} unidades</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span>Progreso</span>
                                <span>{getProgressPercentage().toFixed(0)}%</span>
                            </div>
                            <Progress value={getProgressPercentage()} />
                        </div>

                        <div className="flex justify-between pr-4">
                            <div className="flex flex-wrap gap-2">
                                {subprocesosData.map((subproceso) => {
                                    const estaCompletado = getSubprocesoStatus(subproceso.pro_codsup);
                                    return (
                                        <SubprocesoBadge
                                            key={subproceso.pro_codsup}
                                            subproceso={subproceso}
                                            bloque={{ id: bloque.id }}
                                            onEditSubproceso={onEditSubproceso}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground mt-2">
                            <div>Color: {movimientoRef.color}</div>
                            <div>Tipo Corte: {movimientoRef.tipo_corte}</div>
                            <div>Calidad: {movimientoRef.calidad}</div>
                            <div>Diseño: {movimientoRef.diseno}</div>
                        </div>

                        {puedeMoverse && (
                            <div className="flex justify-end pt-4">
                                <Button
                                    onClick={handleMoveToNext}
                                    className="bg-primary hover:bg-primary/90"
                                >
                                    Mover a siguiente proceso
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {siguienteProcesoInfo && moveDialogOpen && (
                <MoveProcessDialog
                    open={moveDialogOpen}
                    onOpenChange={setMoveDialogOpen}
                    bloque={bloque}
                    siguienteProceso={siguienteProcesoInfo}
                    onConfirm={handleConfirmMove}
                    onSuccess={() => {
                        // Aquí llamas a tu función para actualizar los datos
                        fetchBloques(); // o fetchMovimientos();
                    }}
                />
            )}
        </>
    );
};

const SubprocesoBadge = ({ subproceso, bloque, onEditSubproceso }: SubprocesoBadgeProps) => {
    const estaCompletado = subproceso.pro_supter === 'S';

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!estaCompletado && onEditSubproceso) {
            onEditSubproceso(bloque.id, subproceso.pro_codsup);
        } else if (estaCompletado && onEditSubproceso) {
            console.log(`Subproceso ${subproceso.pro_codsup} ya está completado. quiere editar el bloque ${bloque.id}`);
        }
    };

    return (
        <Badge
            variant={estaCompletado ? "default" : "outline"}
            className={`cursor-pointer ${!estaCompletado ? "hover:bg-accent" : ""}`}
            onClick={handleClick}
        >
            <div className="flex items-center gap-2">
                <span>{subproceso.pro_nomsup}</span>
                {estaCompletado && subproceso.pro_fecter && (
                    <><span className="text-xs opacity-75">
                        {new Date(subproceso.pro_fecter).toLocaleDateString('es-ES', {
                            year: '2-digit',
                            month: '2-digit',
                            day: '2-digit',
                        })}
                    </span>
                        <span>
                            {subproceso.pro_codper}
                        </span></>
                )}
            </div>
        </Badge>
    );
};

const LoadingBlock = () => (
    <Card className="p-4 mb-4 flex items-center justify-center gap-2 h-20">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Cargando bloque...</span>
    </Card>
);