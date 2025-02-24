import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Label } from "@/components/ui/label";
  
  interface BlockDetailsDialogProps {
    block: any;
    onClose: () => void;
  }
  
  export default function BlockDetailsDialog({ block, onClose }: BlockDetailsDialogProps) {
    return (
      <Dialog open={!!block} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Bloque</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Referencia:</Label>
              <p>{block.reference}</p>
            </div>
            <div>
              <Label>Cantidad:</Label>
              <p>{block.quantity} unidades</p>
            </div>
            <div>
              <Label>Proceso:</Label>
              <p>{block.process}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }