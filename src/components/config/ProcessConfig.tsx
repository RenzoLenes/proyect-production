import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ChevronDown, ChevronUp, Loader2, Save } from "lucide-react";
import { Prisma } from "@prisma/client";
import { useConfigStore } from "@/lib/store/configStore";

import { SuccessNotification } from "../shared/SuccessNotification";
import { Proceso } from "@/features/procesos/types/proceso.interface";
import { SubProceso } from "@/features/subprocesos/types/subproceso.interface";
import { getProcesosByTipoConfeccion } from "@/features/procesos/actions/crud-proceso";
import { getSubprocesosByProceso, updateSubproceso } from "@/features/subprocesos/actions/crud-subprocesos";


export const ProcessConfig = () => {
    const [procesos, setProcesos] = useState<Proceso[]>([]);
    const [subprocesosByProceso, setSubprocesosByProceso] = useState<Record<string, SubProceso[]>>({});
    const [expandedProcessId, setExpandedProcessId] = useState<string | null>(null);
    const { tipoConfeccion } = useConfigStore();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasChanges, setHasChanges] = useState<boolean>(false);
    const [successDetails, setSuccessDetails] = useState<{
        show: boolean;
        title?: string;
        message?: string;
    }>({ show: false });


    useEffect(() => {
        if (!tipoConfeccion) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const procesosData = await getProcesosByTipoConfeccion(tipoConfeccion);
                setProcesos(procesosData);

                // Fetch subprocesos for each proceso
                const subprocesosMap: Record<string, SubProceso[]> = {};
                for (const proceso of procesosData) {
                    const subprocesos = await getSubprocesosByProceso(tipoConfeccion, proceso.pro_codpro);
                    subprocesosMap[proceso.pro_codpro] = subprocesos;
                }
                setSubprocesosByProceso(subprocesosMap);
                setHasChanges(false);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [tipoConfeccion]);

    //FALTA ARREGLAR QUE EL COSTO NO ES CERO

    const handleUpdateSubproceso = (
        procesoId: string, 
        subprocesoId: string, 
        field: 'pro_cosint' | 'pro_cosext', 
        value: number
    ) => {
        const v = value;
        console.log("Value:", v);

        
        setSubprocesosByProceso(prev => {
            const updatedSubprocesos = prev[procesoId].map(sp =>
                sp.pro_codsup === subprocesoId
                    ? {
                        ...sp,
                        [field]: field === 'pro_cosint'
                            ? new Prisma.Decimal(value)
                            : value
                    }
                    : sp
            );

            return { ...prev, [procesoId]: updatedSubprocesos };
        });
        setHasChanges(true);
    };

    const toggleExpand = (procesoId: string) => {
        setExpandedProcessId(expandedProcessId === procesoId ? null : procesoId);
    };

    const handleSaveChanges = async () => {
        if (!tipoConfeccion) {
            alert("Por favor seleccione un tipo de confección");
            return;
        }

        setIsLoading(true);
        try {
            // Implementation for saving all changes to the database
            const updatePromises = Object.entries(subprocesosByProceso).flatMap(([procesoId, subprocesos]) =>
                subprocesos.map(subproceso =>
                    updateSubproceso(
                        {
                            pro_codtic: subproceso.pro_codtic,
                            pro_codpro: subproceso.pro_codpro,
                            pro_codsup: subproceso.pro_codsup,
                        },
                        {
                            pro_cosint: parseFloat(subproceso.pro_cosint.toString()),
                            pro_cosext: parseFloat(subproceso.pro_cosext.toString())
                        }
                    )
                )
            );

            await Promise.all(updatePromises);
            setHasChanges(false);
            setSuccessDetails({
                show: true,
                title: "¡Cambio exitoso!",
                message: "Los subprocesos se registraron correctamente en el sistema."
            });
        } catch (error) {
            console.error("Error saving changes:", error);
            alert("Error al guardar los cambios");
        } finally {
            setIsLoading(false);
        }
    };

    if (!tipoConfeccion) {
        return (
            <div className="text-center p-8">
                <p className="text-muted-foreground">Seleccione un tipo de confección para ver los procesos</p>
            </div>
        );
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin" /></div>;
    }

    if (procesos.length === 0) {
        return (
            <div className="text-center p-8">
                <p className="text-muted-foreground">No hay procesos disponibles para este tipo de confección</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <SuccessNotification
                show={successDetails.show}
                onClose={() => setSuccessDetails(prev => ({ ...prev, show: false }))}
                title={successDetails.title}
                message={successDetails.message}
                duration={2000}
            />
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Procesos y Subprocesos</h2>
                <Button
                    onClick={handleSaveChanges}
                    disabled={!hasChanges}
                >
                    <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                </Button>
            </div>

            <div className="grid gap-3">
                {procesos.map((proceso) => {
                    const subprocesos = subprocesosByProceso[proceso.pro_codpro] || [];

                    return (
                        <div
                            key={proceso.pro_codpro}
                            className="border rounded-lg"
                        >
                            <div
                                className="flex items-center justify-between p-4 cursor-pointer"
                                onClick={() => toggleExpand(proceso.pro_codpro)}
                            >
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-medium">{proceso.pro_nompro}</h3>
                                    <span className="text-sm text-muted-foreground">
                                        ({subprocesos.length} subprocesos)
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {expandedProcessId === proceso.pro_codpro ?
                                        <ChevronUp className="h-5 w-5" /> :
                                        <ChevronDown className="h-5 w-5" />
                                    }
                                </div>
                            </div>

                            {expandedProcessId === proceso.pro_codpro && (
                                <div className="p-4 pt-0 border-t">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Subprocesos</Label>
                                            <div className="space-y-4">
                                                {subprocesos.map((subproceso) => (
                                                    <div
                                                        key={subproceso.pro_codsup}
                                                        className="bg-accent p-4 rounded-lg space-y-3"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium">{subproceso.pro_nomsup}</span>
                                                            <div className="text-sm text-muted-foreground">
                                                                Código: {subproceso.pro_codsup}
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label>Costo Interno ($/unidad)</Label>
                                                                <Input
                                                                    type="number"
                                                                    value={subproceso.pro_cosint.toString()}
                                                                    onChange={(e) =>
                                                                        handleUpdateSubproceso(
                                                                            proceso.pro_codpro,
                                                                            subproceso.pro_codsup,
                                                                            'pro_cosint',
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
                                                                    value={subproceso.pro_cosext.toString()}
                                                                    onChange={(e) =>
                                                                        handleUpdateSubproceso(
                                                                            proceso.pro_codpro,
                                                                            subproceso.pro_codsup,
                                                                            'pro_cosext',
                                                                            parseFloat(e.target.value)
                                                                        )
                                                                    }
                                                                    onClick={(e) => e.stopPropagation()}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

