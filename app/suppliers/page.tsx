"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  QrCode,
  Filter,
  Menu,
} from "lucide-react";
import SideBar from "@/components/sidebar";
import { mockBlocks } from "@/data/mockBlocks";
import { processes } from "@/types/process";
import { useProductionStore } from "@/lib/store/productionStore";
import { Block, BlockStatus, ProcessType } from "@/types/block";
import { BlockOperationDialog } from "@/components/production/BlockOperationDialog";
import { BlockStatusLabels } from "@/types/block";
// Mock data for demonstration
import { operators } from "@/data/operators";
import { BlockCard } from "@/components/production/BlockCard";
import { useBlockUtils } from "@/utils/useBlockUtils"
import { EditTypeDialog } from "@/components/production/EditTypeDialog";


export default function SuppliersPage() {
  const { completeSubprocess, moveToNextProcess } = useBlockUtils();

  const tabs = [
    { value: "all", label: "Todos" },
    { value: BlockStatus.stored, label: "Almacenados" },
    { value: BlockStatus.pending, label: "Pendientes" },
    { value: BlockStatus.in_progress, label: "En Proceso" },
    { value: BlockStatus.completed, label: "Completados" },
  ];


  const {
    blocks,
    shippingOrders,
    orders,
    setBlocks,
    addBlock,
    updateBlock,
    addShippingOrder,
    updateShippingOrder,
  } = useProductionStore();




  const [scanMode, setScanMode] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const toggleSidebar = () => setIsMobileOpen(!isMobileOpen);
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [selectedSubprocess, setSelectedSubprocess] = useState<string>("");
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [numberOfOperators, setNumberOfOperators] = useState<number>(1);
  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
  const [scannedBlock, setScannedBlock] = useState<Block | null>(null);
  const [showScanDialog, setShowScanDialog] = useState(false);


  const [editingSubprocess, setEditingSubprocess] = useState<{
    blockId: string;
    subprocessId: string;
    currentType: ProcessType.Interno | ProcessType.Externo;
  } | null>(null);


  // Obtener datos de los bloques seleccionados
  const selectedBlocksData = blocks.filter(block =>
    selectedBlocks.includes(block.id)
  );


  // Obtener procesos únicos de los bloques seleccionados
  const uniqueProcessIds = Array.from(new Set(selectedBlocksData.map(block => block.processId)));

  const handleMoveToNextProcess = (blockId: string) => {
    moveToNextProcess(blockId); // Mover al siguiente proceso
  };

  // Función para manejar completado de subprocesos
  // Función para manejar completado de subprocesos
  const handleSubprocessComplete = (blockId: string, subprocessId: string) => {
    completeSubprocess(blockId, subprocessId); // Llama a la función del utilitario
    setSelectedBlocks([]);
  };


  const simulateScan = () => {
    let foundBlock: Block | null = null;

    while (!foundBlock) {
      const randomIndex = Math.floor(Math.random() * blocks.length);
      const block = blocks[randomIndex];

      // Verificar si el bloque tiene al menos un subproceso de tipo 'Externo'
      if (block.subprocesses.some(sp => sp.type === ProcessType.Externo)) {
        foundBlock = block; // Asignar el bloque encontrado
      }
    }

    // Una vez que tenemos un bloque válido, actualizar el estado
    setScannedBlock(foundBlock);
    setShowScanDialog(true);
  };



  return (
    <>
      <SideBar isMobileOpen={isMobileOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 p-8 lg:ml-64">
        <div className="min-h-screen bg-background pb-20">
          {/* Fixed top bar */}
          <div className="bg-background border-b z-10">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">
                  <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-accent">
                    <Menu className="h-6 w-6" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold">Portal de Externos</h1>
                    <p className="text-sm text-muted-foreground">
                      Personal Externo
                    </p>
                  </div>
                </div>


                <div className="flex gap-2">
                  <Button
                    variant={scanMode ? "default" : "outline"}
                    size="icon"
                    onClick={simulateScan}  // Cambiamos aquí
                  >
                    <QrCode className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Filter className="h-5 w-5" />
                  </Button>


                  {/* Agrega el diálogo de escaneo */}
                  <Dialog open={showScanDialog} onOpenChange={setShowScanDialog}>
                    <DialogContent>
                      <BlockOperationDialog
                        open={showScanDialog}
                        onOpenChange={setShowScanDialog}
                        title="Bloque Escaneado"
                        block={scannedBlock}
                        operators={operators}
                        numberOfOperators={numberOfOperators}
                        onNumberOfOperatorsChange={setNumberOfOperators}
                        selectedOperators={selectedOperators}
                        onSelectedOperatorsChange={setSelectedOperators}
                        onSubprocessComplete={handleSubprocessComplete}
                        subprocessType={ProcessType.Externo}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Search bar */}
              <div className="mt-4 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por referencia o descripción"
                    className="pl-9" />
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="container mx-auto px-4 pt-8">

            <Tabs defaultValue="all" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
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
                      {blocks
                        .filter((block) => block.subprocesses.some(sp => sp.type === ProcessType.Externo))
                        .filter((block) =>
                          tab.value === 'all' ? true : block.status === tab.value
                        )
                        .filter((block) => {
                          // Verificar si el bloque está en un envío no entregado
                          const isInPendingShipping = shippingOrders.some(so =>
                            so.status !== 'Entregado' &&
                            orders.some(o =>
                              so.orderIds.includes(o.id) &&
                              o.blockId === block.id
                            )
                          );
                          return !isInPendingShipping;
                        })
                        .map((block) => (
                          <BlockCard
                            key={block.id}
                            block={block}
                            selectedBlocks={selectedBlocks}
                            setSelectedBlocks={setSelectedBlocks}
                            setEditingSubprocess={setEditingSubprocess}
                            moveToNextProcess={handleMoveToNextProcess}
                            processes={processes} // Asegúrate de tener las definiciones de procesos a mano
                          />
                        ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>

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
                    <Button
                      onClick={(e) => {
                        e.preventDefault(); // Evita que el diálogo se abra automáticamente
                        if (uniqueProcessIds.length === 1) {
                          // Si todos los bloques son del mismo proceso, abre el diálogo principal
                          setShowBlockDialog(true);

                        } else {
                          // Si no, muestra el modal de advertencia
                          setShowWarningDialog(true);
                        }
                      }}
                    >
                      Registrar Operación
                    </Button>
                  </DialogTrigger>


                </Dialog>

                <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
                  <DialogContent>
                    <BlockOperationDialog
                      open={showBlockDialog}
                      onOpenChange={setShowBlockDialog}
                      title="Registrar Operación"
                      block={selectedBlocksData}
                      operators={operators}
                      numberOfOperators={numberOfOperators}
                      onNumberOfOperatorsChange={setNumberOfOperators}
                      selectedOperators={selectedOperators}
                      onSelectedOperatorsChange={setSelectedOperators}
                      onSubprocessComplete={handleSubprocessComplete}
                      subprocessType={ProcessType.Externo}
                    />
                  </DialogContent>
                </Dialog>
                {/* Modal de advertencia */}
                <Dialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Advertencia</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p>Los bloques seleccionados no pertenecen al mismo proceso.</p>
                      <Button
                        className="w-full"
                        onClick={() => setShowWarningDialog(false)}
                      >
                        Cerrar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}