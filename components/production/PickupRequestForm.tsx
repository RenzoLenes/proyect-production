// components/Production/PickupRequestForm.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PickupRequestFormProps {
  onConfirm: (request: {
    pickupAddress: string;
    contact: string;
    instructions: string;
  }) => void;
  onCancel: () => void;
}

export function PickupRequestForm({ onConfirm, onCancel }: PickupRequestFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onConfirm({
      pickupAddress: formData.get('address') as string,
      contact: formData.get('contact') as string,
      instructions: formData.get('instructions') as string
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Dirección de Recogida</Label>
        <Input name="address" required placeholder="Calle, Número, Ciudad" />
      </div>

      <div className="space-y-2">
        <Label>Contacto Responsable</Label>
        <Input
          name="contact"
          required
          placeholder="Nombre y teléfono"
        />
      </div>

      <div className="space-y-2">
        <Label>Instrucciones Especiales</Label>
        <Textarea
          name="instructions"
          placeholder="Ej: Horario específico, requerimientos especiales..."
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Confirmar Solicitud</Button>
      </div>
    </form>
  );
}