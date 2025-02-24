import { Button } from "@/components/ui/button";
import { Card } from "../ui/card";

interface ScanCameraProps {
  onScan: () => void;
  scanStatus: "success" | "error" | null;
  selectedProcess: string;
}

export default function ScanCamera({ onScan, scanStatus, selectedProcess }: ScanCameraProps) {
  return (
    <Card className="p-6 text-center space-y-4">
      <div className="aspect-square max-w-sm mx-auto border-2 border-dashed rounded-lg flex items-center justify-center">
        {scanStatus === "success" && (
          <p className="text-green-500">¡Bloque escaneado correctamente!</p>
        )}
        {scanStatus === "error" && (
          <p className="text-red-500">Error: Bloque no encontrado o no pertenece a este proceso.</p>
        )}
        {!scanStatus && (
          <p className="text-muted-foreground">
            {selectedProcess
              ? `Escanea un bloque para el proceso: ${selectedProcess}`
              : "Selecciona un proceso para comenzar"}
          </p>
        )}
      </div>
      <Button onClick={onScan} disabled={!selectedProcess}>
        Escanear Bloque
      </Button>
    </Card>
  );
}