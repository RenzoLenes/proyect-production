
// components/Production/LogisticsDashboard.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, PackageCheck, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface DeliveryRequest {
  id: string;
  blocks: any[];
  status: 'pending' | 'scheduled' | 'in_transit' | 'delivered' | 'cancelled';
  pickupAddress: string;
  contact: string;
  scheduledDate: string;
  driver?: string;
  trackingNumber?: string;
}

interface LogisticsDashboardProps {
  deliveries: DeliveryRequest[];
  onStatusChange: (deliveryId: string, newStatus: string) => void;
}

export function LogisticsDashboard({ deliveries, onStatusChange }: LogisticsDashboardProps) {
  const statusColors = {
    pending: 'bg-yellow-500',
    scheduled: 'bg-blue-500',
    in_transit: 'bg-orange-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500'
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {deliveries.map((delivery) => (
          <Card key={delivery.id} className="p-4 hover:bg-accent/50 transition-colors">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  <span className="font-medium">Envío #{delivery.id}</span>
                </div>
                <Badge className={`${statusColors[delivery.status]} text-white`}>
                  {delivery.status.replace('_', ' ')}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <PackageCheck className="h-4 w-4" />
                  <span>{delivery.blocks.length} bloques</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{delivery.pickupAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{delivery.scheduledDate}</span>
                </div>
              </div>

              {delivery.status === 'pending' && (
                <div className="flex gap-2 mt-2">
                  <Button size="sm" onClick={() => onStatusChange(delivery.id, 'scheduled')}>
                    Programar Recogida
                  </Button>
                  <Button variant="destructive" size="sm">
                    Cancelar
                  </Button>
                </div>
              )}

              {delivery.status === 'scheduled' && (
                <div className="flex flex-col gap-2 mt-2">
                  <Button size="sm" onClick={() => onStatusChange(delivery.id, 'in_transit')}>
                    Marcar en Ruta
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    {delivery.driver && `Conductor: ${delivery.driver}`}
                  </div>
                </div>
              )}

              {delivery.status === 'in_transit' && (
                <Button size="sm" onClick={() => onStatusChange(delivery.id, 'delivered')}>
                  Marcar Entregado
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}