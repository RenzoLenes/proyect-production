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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  QrCode,
  Filter,
  Truck,
  PackageCheck,
  AlertCircle,
  Clock,
  Menu,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SideBar from "@/components/sidebar";

// Mock data for demonstration
const mockBlocks = [
  {
    id: "B001",
    reference: "CG-2024-0001",
    status: "pending",
    quantity: 50,
    deadline: "2024-04-01",
    process: "Estampado",
    receivedDate: null,
  },
  {
    id: "B002",
    reference: "LC-2024-0002",
    status: "in_progress",
    quantity: 65,
    deadline: "2024-04-05",
    process: "Bordado",
    receivedDate: "2024-03-20",
  },
  {
    id: "B003",
    reference: "FT-2024-003",
    status: "ready_pickup",
    quantity: 45,
    deadline: "2024-04-03",
    process: "Estampado",
    receivedDate: "2024-03-18",
  },
];

const statusMap = {
  pending: {
    label: "Pendiente",
    color: "secondary",
  },
  in_progress: {
    label: "En Proceso",
    color: "default",
  },
  ready_pickup: {
    label: "Listo para Recoger",
    color: "success",
  },
  completed: {
    label: "Completado",
    color: "primary",
  },
};

export default function SuppliersPage() {
  const [scanMode, setScanMode] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<any>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const toggleSidebar = () => setIsMobileOpen(!isMobileOpen);


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
                    onClick={() => setScanMode(!scanMode)}
                  >
                    <QrCode className="h-5 w-5" />
                  </Button>
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
                    placeholder="Buscar por referencia o descripción"
                    className="pl-9" />
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
                  Escanea el código QR del bloque para confirmar recepción
                </p>
              </Card>
            ) : (
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="pending">Pendientes</TabsTrigger>
                  <TabsTrigger value="in_progress">En Proceso</TabsTrigger>
                  <TabsTrigger value="ready">Listos</TabsTrigger>
                </TabsList>

                <ScrollArea className="h-[calc(100vh-220px)]">
                  <div className="space-y-4">
                    {mockBlocks.map((block) => (
                      <Card
                        key={block.id}
                        className="p-4 hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => setSelectedBlock(block)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{block.reference}</h3>
                              <Badge
                                variant={statusMap[block.status as keyof typeof statusMap]
                                  .color as any}
                              >
                                {statusMap[block.status as keyof typeof statusMap]
                                  .label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <PackageCheck className="h-4 w-4" />
                                {block.quantity} unidades
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Entrega: {block.deadline}
                              </span>
                            </div>
                          </div>
                          {block.status === "ready_pickup" && (
                            <Button size="sm" className="shrink-0">
                              <Truck className="h-4 w-4 mr-2" />
                              Solicitar Recogida
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </Tabs>
            )}
          </div>

          {/* Block Details Dialog */}
          <Dialog open={!!selectedBlock} onOpenChange={() => setSelectedBlock(null)}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Detalles del Bloque</DialogTitle>
              </DialogHeader>
              {selectedBlock && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{selectedBlock.reference}</h3>
                      <Badge
                        variant={statusMap[selectedBlock.status as keyof typeof statusMap]
                          .color as any}
                      >
                        {statusMap[selectedBlock.status as keyof typeof statusMap]
                          .label}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label>Cantidad</Label>
                      <p className="mt-1">{selectedBlock.quantity} unidades</p>
                    </div>
                    <div>
                      <Label>Proceso</Label>
                      <p className="mt-1">{selectedBlock.process}</p>
                    </div>
                    <div>
                      <Label>Fecha de Entrega</Label>
                      <p className="mt-1">{selectedBlock.deadline}</p>
                    </div>
                    <div>
                      <Label>Fecha de Recepción</Label>
                      <p className="mt-1">
                        {selectedBlock.receivedDate || "Pendiente"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Cambiar Estado</Label>
                    <Select defaultValue={selectedBlock.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="in_progress">En Proceso</SelectItem>
                        <SelectItem value="ready_pickup">
                          Listo para Recoger
                        </SelectItem>
                        <SelectItem value="completed">Completado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedBlock.status === "ready_pickup" && (
                    <div className="space-y-2">
                      <Label>Notas para Transporte</Label>
                      <Input placeholder="Instrucciones especiales para la recogida" />
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setSelectedBlock(null)}>
                      Cerrar
                    </Button>
                    <Button>Guardar Cambios</Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}