"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge, badgeVariants } from "@/components/ui/badge";
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
import { Block, ShippingOrder, ShippingOrdeStatus } from "@/types/block";
import { useProductionStore } from "@/lib/store/productionStore";
import { useBlockUtils } from "@/utils/useBlockUtils";
import { processes } from "@/types/process";

// Mock data for demonstration


const tabs = [
  { value: "all", label: "Todos" },
  { value: ShippingOrdeStatus.Pendiente, label: "Pendientes" },
  { value: ShippingOrdeStatus.Transito, label: "En Tránsito" },
  { value: ShippingOrdeStatus.Entregado, label: "Entregado" }

];

export default function TransportPage() {
  const [scanMode, setScanMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const toggleSidebar = () => setIsMobileOpen(!isMobileOpen);


  const {
    shippingOrders,
    orders,
    blocks,
    updateShippingOrder
  } = useProductionStore();

  const { moveToNextProcess, groupOrderIntoShipping, updateShippingStatus } = useBlockUtils();

  const [selectedShipment, setSelectedShipment] = useState<ShippingOrder | null>(null);

  const handleProcessTransition = (blockId: string) => {
    moveToNextProcess(blockId);
    setSelectedShipment(null);
  };

  const getLocationName = (locationId: number) => {
    const locations = [
      { id: 1, name: "Planta Principal" },
      { id: 2, name: "Taller Externo" },
      { id: 3, name: "Almacén Secundario" }
    ];
    return locations.find(l => l.id === locationId)?.name || "Ubicación desconocida";
  };

  const getShipmentBlocks = (orderIds: string[]) => {
    return orders
      .filter(order => orderIds.includes(order.id))
      .map(order => blocks.find(block => block.id === order.blockId))
      .filter(Boolean) as Block[];
  };

  return (
    <>
      <SideBar isMobileOpen={isMobileOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 p-8 lg:ml-64">
        <div className="min-h-screen bg-background pb-20">
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

          <div className="container mx-auto px-4 pt-8">
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
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
                      {shippingOrders
                        .filter((shipment) => tab.value === "all" || shipment.status === tab.value)
                        .map((shipment) => {
                          const relatedBlocks = getShipmentBlocks(shipment.orderIds);

                          return (
                            <Card
                              key={shipment.id}
                              className="p-4 hover:bg-accent cursor-pointer transition-colors"
                              onClick={() => setSelectedShipment(shipment)}
                            >
                              <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-medium">Envío #{shipment.id}</h3>
                                      <Badge variant={
                                        shipment.status === ShippingOrdeStatus.Pendiente ? 'secondary' :
                                          shipment.status === ShippingOrdeStatus.Transito ? 'default' :
                                            'outline'
                                      }>
                                        {shipment.status}
                                      </Badge>
                                    </div>
                                  </div>
                                  {shipment.status === ShippingOrdeStatus.Pendiente && (
                                    <Button size="sm" onClick={() => updateShippingStatus(shipment.id, ShippingOrdeStatus.Transito)}>
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
                                        {getLocationName(1)}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <MapPin className="h-4 w-4" />
                                      <span>Destino:</span>
                                      <span className="font-medium text-foreground">
                                        {getLocationName(2)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right space-y-1">
                                    <p className="text-sm">
                                      Programado: {shipment.departureDate?.toLocaleDateString()} - {shipment.departureDate?.getHours()}:{shipment.departureDate?.getMinutes()}
                                    </p>
                                    {shipment.arrivalDate && (
                                      <p className="text-sm text-muted-foreground">
                                        Entregado: {shipment.arrivalDate.toLocaleDateString()} - {shipment.arrivalDate.getHours()}:{shipment.arrivalDate.getMinutes()}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <PackageCheck className="h-4 w-4" />
                                  <span>
                                    {relatedBlocks.length} bloques -{" "}
                                    {relatedBlocks.reduce((acc, block) => acc + block.quantity, 0)} unidades
                                  </span>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Shipment Details Dialog */}
          <Dialog open={!!selectedShipment} onOpenChange={() => setSelectedShipment(null)}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Detalles del Envío</DialogTitle>
              </DialogHeader>
              {selectedShipment && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Envío #{selectedShipment.id}</h3>
                      <Badge variant={
                        selectedShipment.status === ShippingOrdeStatus.Pendiente ? 'secondary' :
                          selectedShipment.status === ShippingOrdeStatus.Transito ? 'default' :
                            'outline'
                      }>
                        {selectedShipment.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid gap-4 text-sm">
                    <div className="space-y-2">
                      <Label>Origen</Label>
                      <p className="font-medium">{getLocationName(1)}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Destino</Label>
                      <p className="font-medium">{getLocationName(2)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Fecha de Envío</Label>
                        <p>{selectedShipment.departureDate?.toLocaleDateString()}</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Transportista</Label>
                        <p>{selectedShipment.transportProvider || 'Por asignar'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Bloques Incluidos</Label>
                    <div className="grid gap-2">
                      {getShipmentBlocks(selectedShipment.orderIds).map((block) => (
                        <div
                          key={block.id}
                          className="p-2 border rounded-md text-sm flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium">{block.reference}</p>
                            <p className="text-muted-foreground">
                              Proceso: {processes.find(p => p.id === block.processId)?.name}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleProcessTransition(block.id)}
                            disabled={block.status !== 'Completado'}
                          >
                            Siguiente Proceso
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedShipment(null)}
                    >
                      Cerrar
                    </Button>
                    {selectedShipment.status === ShippingOrdeStatus.Transito && (
                      <Button onClick={() => updateShippingStatus(selectedShipment.id, ShippingOrdeStatus.Entregado)}>
                        Confirmar Entrega
                      </Button>
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