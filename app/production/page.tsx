"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, QrCode, Filter, CheckCircle2, Menu } from "lucide-react";
import SideBar from "@/components/sidebar";
import { Block } from "@/types/block";
import { processes } from "@/types/process";

// Mock data for demonstration
export const mockBlocks: Block[] = [
  {
    id: "B001",
    reference: "CG-2024-0001",
    processId: "P001", // Corte
    subprocesses: [
      { id: "S001", name: "Doblado", completed: true, type: "Interno" },
      { id: "S002", name: "Tizado", completed: true, type: "Interno" },
      { id: "S003", name: "Cortado", completed: true, type: "Interno" },
      { id: "S004", name: "Etiquetado", completed: false, type: "Interno" },
    ],
    quantity: 50,
    priority: "high",
    startDate: new Date("2024-03-20"),
    status: "En proceso",
  },
  {
    id: "B002",
    reference: "CG-2024-0002",
    processId: "P001", // Corte
    subprocesses: [
      { id: "S001", name: "Doblado", completed: true, type: "Interno" },
      { id: "S002", name: "Tizado", completed: true, type: "Interno" },
      { id: "S003", name: "Cortado", completed: false, type: "Interno" },
      { id: "S004", name: "Etiquetado", completed: false, type: "Interno" },
    ],
    quantity: 50,
    priority: "high",
    startDate: new Date("2024-03-20"),
    status: "En proceso",
  },
  {
    id: "B003",
    reference: "LC-2024-0003",
    processId: "P002", // Pre-Costura
    subprocesses: [
      { id: "S005", name: "Pinza", completed: true, type: "Interno" },
      { id: "S006", name: "Bolsillo", completed: true, type: "Interno" },
      { id: "S007", name: "Bordado", completed: true, type: "Interno" },
      { id: "S008", name: "Sesgado", completed: false, type: "Interno" },
      { id: "S009", name: "Materiales", completed: false, type: "Interno" },
    ],
    quantity: 65,
    priority: "medium",
    startDate: new Date("2024-03-19"),
    status: "En proceso",
  },
  {
    id: "B006",
    reference: "LC-2024-0010",
    processId: "P002", // Pre-Costura
    subprocesses: [
      { id: "S005", name: "Pinza", completed: true, type: "Interno" },
      { id: "S006", name: "Bolsillo", completed: true, type: "Interno" },
      { id: "S007", name: "Bordado", completed: true, type: "Interno" },
      { id: "S008", name: "Sesgado", completed: true, type: "Interno" },
      { id: "S009", name: "Materiales", completed: false, type: "Interno" },
    ],
    quantity: 65,
    priority: "high",
    startDate: new Date("2024-03-19"),
    status: "En proceso",
  },
  {
    id: "B004",
    reference: "LC-2024-0004",
    processId: "P004", // Costura
    subprocesses: [
      { id: "S0012", name: "Cerrado", completed: true, type: "Interno" },
      { id: "S013", name: "Sesgado Trasero", completed: true, type: "Interno" },
      { id: "S014", name: "Presillado", completed: false, type: "Interno" },
      { id: "S015", name: "Entallado", completed: false, type: "Interno" },
    ],
    quantity: 65,
    priority: "medium",
    startDate: new Date("2024-03-19"),
    status: "En proceso",
  },
  {
    id: "B005",
    reference: "LC-2024-0005",
    processId: "P004", // Costura
    subprocesses: [
      { id: "S0012", name: "Cerrado", completed: true, type: "Interno" },
      { id: "S013", name: "Sesgado Trasero", completed: true, type: "Interno" },
      { id: "S014", name: "Presillado", completed: false, type: "Interno" },
      { id: "S015", name: "Entallado", completed: false, type: "Interno" },
    ],
    quantity: 65,
    priority: "medium",
    startDate: new Date("2024-03-19"),
    status: "En proceso",
  },
  {
    id: "B011",
    reference: "LC-2024-0005",
    processId: "P006", // Acabado
    subprocesses: [
      { id: "S0017", name: "Ojal", completed: true, type: "Interno" },
      { id: "S018", name: "Basta", completed: true, type: "Interno" },
      { id: "S019", name: "Atraque Delantero", completed: true, type: "Interno" },
      { id: "S020", name: "Atraque Trasero", completed: false, type: "Interno" },
      { id: "S0021", name: "Atraque Presilla", completed: false, type: "Interno" },
      { id: "S022", name: "Planchado Costura", completed: false, type: "Interno" },
      { id: "S023", name: "Planchado Entero", completed: false, type: "Interno" },
      { id: "S024", name: "Deshilachado", completed: false, type: "Interno" },
      { id: "S025", name: "Botón", completed: false, type: "Interno" },
      { id: "S026", name: "Entallado", completed: false, type: "Interno" },
    ],
    quantity: 65,
    priority: "high",
    startDate: new Date("2024-03-19"),
    status: "En proceso",
  },
  {
    id: "B012",
    reference: "LC-2024-0005",
    processId: "P006", // Acabado
    subprocesses: [
      { id: "S0017", name: "Ojal", completed: true, type: "Interno" },
      { id: "S018", name: "Basta", completed: true, type: "Interno" },
      { id: "S019", name: "Atraque Delantero", completed: true, type: "Interno" },
      { id: "S020", name: "Atraque Trasero", completed: false, type: "Interno" },
      { id: "S0021", name: "Atraque Presilla", completed: false, type: "Interno" },
      { id: "S022", name: "Planchado Costura", completed: false, type: "Interno" },
      { id: "S023", name: "Planchado Entero", completed: false, type: "Interno" },
      { id: "S024", name: "Deshilachado", completed: false, type: "Interno" },
      { id: "S025", name: "Botón", completed: true, type: "Interno" },
      { id: "S026", name: "Entallado", completed: false, type: "Interno" },
    ],
    quantity: 65,
    priority: "medium",
    startDate: new Date("2024-03-19"),
    status: "En proceso",
  },
];


const operators = [
  { id: 1, name: "Juan Pérez" },
  { id: 2, name: "María García" },
  { id: 3, name: "Carlos López" },
];

const tabs = [
  { value: 'all', label: 'Todos' },
  { value: 'Corte', label: 'Corte' },
  { value: 'Pre-Costura', label: 'Pre-Costura' },
  { value: 'Armado', label: 'Armado' },
  { value: 'Costura', label: 'Costura' },
  { value: 'Pretinado', label: 'Pretinado' },
  { value: 'Acabado', label: 'Acabado' },
];

export default function ProductionPage() {
  const [blocks, setBlocks] = useState<Block[]>(mockBlocks);
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [selectedSubprocess, setSelectedSubprocess] = useState<string>("");
  const [selectedOperator, setSelectedOperator] = useState<string>("");
  const [scanMode, setScanMode] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const toggleSidebar = () => setIsMobileOpen(!isMobileOpen);
  const [scannedBlock, setScannedBlock] = useState<Block | null>(null);
  const [showScanDialog, setShowScanDialog] = useState(false);
  const [shippingOrders, setShippingOrders] = useState<any[]>([]);
  const [editingSubprocess, setEditingSubprocess] = useState<{
    blockId: string;
    subprocessId: string;
    currentType: "Interno" | "Externo";
  } | null>(null);
  const [confirmExternalDialog, setConfirmExternalDialog] = useState(false);
  const [pendingTypeChange, setPendingTypeChange] = useState<{
    newType: "Interno" | "Externo";
    subprocessInfo: {
      blockId: string;
      subprocessId: string;
      currentType: "Interno" | "Externo";
    };
  } | null>(null);

  const selectedBlocksData = blocks.filter(block =>
    selectedBlocks.includes(block.id)
  );

  // Obtener procesos únicos de los bloques seleccionados
  const uniqueProcessIds = Array.from(new Set(selectedBlocksData.map(block => block.processId)));

  const mainProcess = processes.find(p => p.id === uniqueProcessIds[0]);

  // Obtener subprocesos pendientes
  const pendingSubprocesses = mainProcess?.subprocesses.filter(sp =>
    selectedBlocksData.some(block =>
      block.subprocesses.some(bsp =>
        bsp.id === sp.id && !bsp.completed
      )
    )
  ) || [];

  const handleBatchConfirm = () => {
    if (!selectedSubprocess || !selectedOperator) return;

    const updatedBlocks = blocks.map(block => {
      if (selectedBlocks.includes(block.id)) {
        const updatedSubprocesses = block.subprocesses.map(sp => {
          if (sp.id === selectedSubprocess) {
            console.log("se actualizo el subprceso", sp);
            console.log("subproceso select", selectedSubprocess);
            return { ...sp, completed: true };
          }
          return sp;
        });

        const allCompleted = updatedSubprocesses.every(sp => sp.completed);

        // Corregir el tipo de status
        const newStatus: Block['status'] = allCompleted ? "Completado" : "En proceso";

        return {
          ...block,
          subprocesses: updatedSubprocesses,
          status: newStatus
        };
      }
      return block;
    });

    setBlocks(updatedBlocks as Block[]);
    setSelectedSubprocess("");
    setSelectedOperator("");
    setSelectedBlocks([]);
  };


  const getProgressPercentage = (subprocesses: any[]) => {
    const completed = subprocesses.filter((sp) => sp.completed).length;
    return (completed / subprocesses.length) * 100;
  };

  // Función para simular escaneo
  const simulateScan = () => {
    const randomIndex = Math.floor(Math.random() * blocks.length);
    const foundBlock = blocks[randomIndex];
    setScannedBlock(foundBlock);
    setShowScanDialog(true);
  };

  // Nuevo componente para el diálogo de escaneo
  const ScanDialog = () => (
    <Dialog open={showScanDialog} onOpenChange={setShowScanDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bloque escaneado</DialogTitle>
        </DialogHeader>
        {scannedBlock ? (
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Referencia:</span>
              <span>{scannedBlock.reference}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {scannedBlock.subprocesses
              .filter(sp => sp.type === "Interno")
              .map(sp => (
                <Badge
                  key={sp.id}
                  variant={sp.completed ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleSubprocessComplete(scannedBlock.id, sp.id)}
                >
                  {sp.name} ({sp.type})
                </Badge>
              ))}
              
            </div>
            <Button
              className="w-full"
              onClick={() => setShowScanDialog(false)}
            >
              Cerrar
            </Button>
          </div>
        ) : (
          <div>Bloque no encontrado</div>
        )}
      </DialogContent>
    </Dialog>
  );

  // Función para manejar completado de subprocesos
  const handleSubprocessComplete = (blockId: string, subprocessId: string) => {
    const updatedBlocks = blocks.map(block => {
      if (block.id === blockId) {
        const updatedSubprocesses = block.subprocesses.map(sp =>
          sp.id === subprocessId ? { ...sp, completed: !sp.completed } : sp
        );

        const allCompleted = updatedSubprocesses.every(sp => sp.completed);
        const hasExternal = updatedSubprocesses.some(sp => sp.type === 'Externo');

        if (hasExternal) {
          const newOrder = {
            blockId,
            date: new Date(),
            subprocesses: updatedSubprocesses.filter(sp => sp.type === 'Externo')
          };
          setShippingOrders(prev => [...prev, newOrder]);
        }

        const updatedBlock = {
          ...block,
          subprocesses: updatedSubprocesses,
          status: allCompleted ? "Completado" : "En proceso"
        };

        // Si el bloque escaneado es este, actualizarlo también
        if (scannedBlock?.id === blockId) {
          setScannedBlock(updatedBlock as Block);
        }

        return updatedBlock;
      }
      return block;
    });

    setBlocks(updatedBlocks as Block[]);
  };


  const moveToNextProcess = (blockId: string) => {
    const updatedBlocks = blocks.map(block => {
      if (block.id === blockId) {
        const currentProcessIndex = processes.findIndex(p => p.id === block.processId);
        const nextProcess = processes[currentProcessIndex + 1];

        if (nextProcess) {
          return {
            ...block,
            processId: nextProcess.id,
            subprocesses: nextProcess.subprocesses.map(sp => ({
              ...sp,
              completed: false,
              type: "Interno" // Resetear a interno por defecto
            })),
            status: "Pendiente"
          };
        }
      }
      return block;
    });

    setBlocks(updatedBlocks as Block[]);
  };

  const applyTypeChange = (newType: "Interno" | "Externo") => {
    if (!pendingTypeChange) return;

    const { blockId, subprocessId } = pendingTypeChange.subprocessInfo;

    const updatedBlocks = blocks.map(block => {
      if (block.id === blockId) {
        const updatedSubprocesses = block.subprocesses.map(sp =>
          sp.id === subprocessId ? { ...sp, type: newType } : sp
        );

        // Generar orden de envío solo si cambia a Externo
        if (newType === "Externo") {
          const subprocess = updatedSubprocesses.find(sp => sp.id === subprocessId);
          if (subprocess) {
            const newOrder = {
              blockId,
              subprocessId,
              date: new Date(),
              status: "pendiente",
              proceso: subprocess.name
            };
            setShippingOrders(prev => [...prev, newOrder]);
          }
        }

        return { ...block, subprocesses: updatedSubprocesses };
      }
      return block;
    });

    setBlocks(updatedBlocks);
    setPendingTypeChange(null);
    setConfirmExternalDialog(false);
    setEditingSubprocess(null);
  };

  const handleSubprocessTypeChange = (newType: "Interno" | "Externo") => {
    if (!editingSubprocess) return;

    if (newType === "Externo") {
      setPendingTypeChange({
        newType,
        subprocessInfo: editingSubprocess
      });
      setConfirmExternalDialog(true);
    } else {
      applyTypeChange(newType);
    }
  };

  const handleReceiveExternalOrder = (orderIndex: number) => {
    setShippingOrders(prev =>
      prev.map((order, index) =>
        index === orderIndex ? { ...order, status: "completado" } : order
      )
    );
  };

  const ConfirmationDialog = () => (
    <Dialog open={confirmExternalDialog} onOpenChange={setConfirmExternalDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar cambio a proceso externo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>¿Estás seguro de marcar este subproceso como externo?</p>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setConfirmExternalDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => applyTypeChange("Externo")}
            >
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const EditTypeDialog = () => (
    <Dialog open={!!editingSubprocess} onOpenChange={() => setEditingSubprocess(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambiar tipo de subproceso</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select
            value={editingSubprocess?.currentType || ""}
            onValueChange={(value: "Interno" | "Externo") => handleSubprocessTypeChange(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Interno">Interno</SelectItem>
              <SelectItem value="Externo">Externo (Generará orden de envío)</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="w-full"
            onClick={() => setEditingSubprocess(null)}
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );


  return (
    <>
      <SideBar isMobileOpen={isMobileOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 p-8 lg:ml-64">
        {/* Fixed top bar */}
        <div className="bg-background border-b z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-accent">
                  <Menu className="h-6 w-6" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold">Producción</h1>
                  <p className="text-sm text-muted-foreground">
                    Producción en la planta
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {/* Botón de escaneo actualizado */}
                <Button
                  variant={scanMode ? "default" : "outline"}
                  size="icon"
                  onClick={simulateScan}  // Cambiamos aquí
                >
                  <QrCode className="h-5 w-5" />
                </Button>

                {/* Agrega el diálogo de escaneo */}
                <ScanDialog />
                <Button variant="outline" size="icon">
                  <Filter className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Search bar */}
            <div className="mt-4 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por referencia o ID"
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </div>



        {/* Main content */}
        <div className="container mx-auto px-4 pt-8">
          {scanMode ? (
            <Card className="p-6 text-center space-y-4">
              <div className="aspect-square max-w-sm mx-auto border-2 border-dashed rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Cámara activada para escaneo</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Escanea el código QR del bloque de producción
              </p>
            </Card>
          ) : (
            <Tabs defaultValue="all" className="space-y-8">
              <TabsList className="flex w-full overflow-x-auto">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                  <ScrollArea className="h-[calc(100vh-220px)]">
                    <div className="space-y-4">
                      {blocks // Cambiar mockBlocks por blocks
                        .filter((block) =>
                          tab.value === 'all' ? true : processes.find(p => p.id === block.processId)?.name === tab.value
                        )
                        .map((block) => (
                          <Card key={block.id} className="p-4">
                            <div className="flex items-start gap-4">
                              <Checkbox
                                checked={selectedBlocks.includes(block.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedBlocks([...selectedBlocks, block.id]);
                                  } else {
                                    setSelectedBlocks(
                                      selectedBlocks.filter((id) => id !== block.id)
                                    );
                                  }
                                }}
                              />

                              <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-medium">{block.reference}</h3>
                                      <Badge
                                        variant={block.priority === "high"
                                          ? "destructive"
                                          : "secondary"}
                                      >
                                        {block.priority}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {processes.find(p => p.id === block.processId)?.name} - {block.quantity} unidades
                                    </p>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span>Progreso</span>
                                    <span>
                                      {getProgressPercentage(block.subprocesses).toFixed(0)}%
                                    </span>
                                  </div>
                                  <Progress
                                    value={getProgressPercentage(block.subprocesses)}
                                  />
                                </div>


                                <div className="flex justify-between pr-4">
                                  <div className="flex flex-wrap gap-2">
                                    {block.subprocesses.map((subprocess) => (
                                      <Badge
                                        key={subprocess.id}
                                        variant={subprocess.completed ? "default" : "outline"}
                                        className={`cursor-pointer ${!subprocess.completed ? "hover:bg-accent" : ""}`}
                                        onClick={() => {
                                          if (!subprocess.completed && block.status !== "Completado") {
                                            setEditingSubprocess({
                                              blockId: block.id,
                                              subprocessId: subprocess.id,
                                              currentType: subprocess.type
                                            });
                                          }
                                        }}
                                      >
                                        <div className="flex items-center gap-2">
                                          <span>{subprocess.name}</span>
                                          <span className="text-xs opacity-75">
                                            ({subprocess.type})
                                          </span>
                                        </div>

                                      </Badge>
                                    ))}
                                  </div>

                                  {block.status === "Completado" && (
                                    <Button
                                      onClick={() => moveToNextProcess(block.id)}
                                      disabled={block.status !== "Completado"}
                                      title="Pasar al siguiente proceso"
                                    >
                                      <p>Siguiente Proceso</p>
                                    </Button>
                                  )}
                                </div>

                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>

        <div className="container mx-auto px-4 pt-8">
          <h3 className="text-lg font-semibold mb-4">Órdenes de Envío Externo</h3>
          <div className="grid gap-4">
            {shippingOrders.map((order, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Bloque: {order.blockId}</p>
                    <p className="text-sm">Proceso: {order.proceso}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={order.status === "pendiente" ? "destructive" : "default"}>
                      {order.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleReceiveExternalOrder(index)}
                    >
                      Marcar como recibido
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>


        {/* Fixed bottom bar for batch operations */}
        {selectedBlocks.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
            <div className="container mx-auto flex items-center justify-between px-8">
              <span className="text-sm">
                {selectedBlocks.length} bloques seleccionados
              </span>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Registrar Lote</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar Operación en Lote</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Operario</Label>
                      <Select
                        value={selectedOperator}
                        onValueChange={setSelectedOperator}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar operario" />
                        </SelectTrigger>
                        <SelectContent>
                          {operators.map((op) => (
                            <SelectItem key={op.id} value={op.id.toString()}>
                              {op.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Operación realizada</Label>
                      <Select
                        value={selectedSubprocess}
                        onValueChange={setSelectedSubprocess}
                        disabled={!mainProcess}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={
                            mainProcess
                              ? "Seleccionar subproceso"
                              : "Bloques de diferentes procesos"
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {pendingSubprocesses.map(subprocess => (
                            <SelectItem
                              key={subprocess.id}
                              value={subprocess.id}
                            >
                              {subprocess.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleBatchConfirm}
                      disabled={!selectedSubprocess || !selectedOperator}
                    >
                      Confirmar Lote
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </div>
      <EditTypeDialog />
      <ConfirmationDialog />
    </>
  );
}