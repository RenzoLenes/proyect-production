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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  QrCode,
  Filter,
  Truck,
  PackageCheck,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  Menu,
} from "lucide-react";
import SideBar from "@/components/sidebar";

// Mock data for demonstration
const mockShipments = [
  {
    id: "S001",
    reference: "REF-2024-001",
    status: "pending_pickup",
    quantity: 150,
    origin: "Estampados y Bordados S.A.",
    destination: "Planta Principal",
    pickupTime: "10:30",
    estimatedDelivery: "12:00",
    blocks: ["B001", "B002"],
  },
  {
    id: "S002",
    reference: "REF-2024-002",
    status: "in_transit",
    quantity: 200,
    origin: "Planta Principal",
    destination: "Bordados Express",
    pickupTime: "09:15",
    estimatedDelivery: "11:30",
    blocks: ["B003"],
  },
  {
    id: "S003",
    reference: "REF-2024-003",
    status: "delivered",
    quantity: 100,
    origin: "Bordados Express",
    destination: "Planta Principal",
    pickupTime: "08:00",
    estimatedDelivery: "09:30",
    deliveredAt: "09:25",
    blocks: ["B004", "B005"],
  },
];

const statusMap = {
  pending_pickup: {
    label: "Pendiente de Recogida",
    color: "secondary",
  },
  in_transit: {
    label: "En Tránsito",
    color: "default",
  },
  delivered: {
    label: "Entregado",
    color: "success",
  },
};

export default function TransportPage() {
  const [scanMode, setScanMode] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(false);
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
                    <h1 className="text-2xl font-bold">Movilidad y Transporte</h1>
                    <p className="text-sm text-muted-foreground">
                      Sistema de Gestión de Envíos
                    </p>
                  </div>

                </div>


                <div className="flex items-center gap-4">
                  <Button
                    variant={scanMode ? "default" : "outline"}
                    size="icon"
                    onClick={() => setScanMode(!scanMode)}
                  >
                    <QrCode className="h-5 w-5" />
                  </Button>
                  <Button
                    variant={showHistory ? "default" : "outline"}
                    size="icon"
                    onClick={() => setShowHistory(!showHistory)}
                  >
                    <Clock className="h-5 w-5" />
                  </Button>
                </div>
                
              </div>

              {/* Search bar */}
              <div className="mt-4 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por referencia o destino"
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
                  Escanea el código QR del bloque para actualizar su estado
                </p>
                <div className="flex justify-center gap-2">
                  <Button variant="outline" onClick={() => setScanMode(false)}>
                    Cancelar
                  </Button>
                  <Button>Confirmar Escaneo</Button>
                </div>
              </Card>
            ) : showHistory ? (
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Historial de Envíos</h2>
                    <Select defaultValue="today">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Hoy</SelectItem>
                        <SelectItem value="week">Esta Semana</SelectItem>
                        <SelectItem value="month">Este Mes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    {mockShipments
                      .filter((s) => s.status === "delivered")
                      .map((shipment) => (
                        <div
                          key={shipment.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{shipment.reference}</span>
                              <Badge variant="default">Entregado</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span>{shipment.origin}</span>
                              <ArrowRight className="h-4 w-4" />
                              <span>{shipment.destination}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              Entregado: {shipment.deliveredAt}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {shipment.blocks.length} bloques
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </Card>
            ) : (
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="pending">Pendientes</TabsTrigger>
                  <TabsTrigger value="in_transit">En Tránsito</TabsTrigger>
                </TabsList>

                <ScrollArea className="h-[calc(100vh-220px)]">
                  <div className="space-y-4">
                    {mockShipments
                      .filter((s) => s.status !== "delivered")
                      .map((shipment) => (
                        <Card
                          key={shipment.id}
                          className="p-4 hover:bg-accent cursor-pointer transition-colors"
                          onClick={() => setSelectedShipment(shipment)}
                        >
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{shipment.reference}</h3>
                                  <Badge
                                    variant={statusMap[shipment.status as keyof typeof statusMap].color as any}
                                  >
                                    {statusMap[shipment.status as keyof typeof statusMap].label}
                                  </Badge>
                                </div>
                              </div>
                              {shipment.status === "pending_pickup" && (
                                <Button size="sm">
                                  <Truck className="h-4 w-4 mr-2" />
                                  Iniciar Ruta
                                </Button>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  <span>Origen:</span>
                                  <span className="font-medium text-foreground">
                                    {shipment.origin}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  <span>Destino:</span>
                                  <span className="font-medium text-foreground">
                                    {shipment.destination}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right space-y-1">
                                <p className="text-sm">
                                  Recogida: {shipment.pickupTime}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Entrega est.: {shipment.estimatedDelivery}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <PackageCheck className="h-4 w-4" />
                              <span>
                                {shipment.blocks.length} bloques -{" "}
                                {shipment.quantity} unidades
                              </span>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                </ScrollArea>
              </Tabs>
            )}
          </div>

          {/* Shipment Details Dialog */}
          <Dialog
            open={!!selectedShipment}
            onOpenChange={() => setSelectedShipment(null)}
          >
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Detalles del Envío</DialogTitle>
              </DialogHeader>
              {selectedShipment && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{selectedShipment.reference}</h3>
                      <Badge
                        variant={statusMap[selectedShipment.status as keyof typeof statusMap].color as any}
                      >
                        {statusMap[selectedShipment.status as keyof typeof statusMap]
                          .label}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid gap-4 text-sm">
                    <div className="space-y-2">
                      <Label>Origen</Label>
                      <p className="font-medium">{selectedShipment.origin}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Destino</Label>
                      <p className="font-medium">{selectedShipment.destination}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Hora de Recogida</Label>
                        <p>{selectedShipment.pickupTime}</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Entrega Estimada</Label>
                        <p>{selectedShipment.estimatedDelivery}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Bloques Incluidos</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedShipment.blocks.map((block: string) => (
                        <div
                          key={block}
                          className="p-2 border rounded-md text-sm flex items-center justify-between"
                        >
                          <span>{block}</span>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedShipment.status === "in_transit" && (
                    <div className="space-y-2">
                      <Label>Notas de Entrega</Label>
                      <Input placeholder="Agregar notas o instrucciones especiales" />
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedShipment(null)}
                    >
                      Cerrar
                    </Button>
                    {selectedShipment.status === "in_transit" && (
                      <Button>Confirmar Entrega</Button>
                    )}
                    {selectedShipment.status === "pending_pickup" && (
                      <Button>Iniciar Ruta</Button>
                    )}
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