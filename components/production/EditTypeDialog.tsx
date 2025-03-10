import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Block, Operator, ProcessType, SubProcessStatus } from '@/types/block';
import { useProductionStore } from '@/lib/store/productionStore';
import { useBlockUtils } from '@/utils/useBlockUtils';

interface EditSubprocessType {
  blockId: string;
  subprocessId: string;
  currentType: ProcessType;
}

interface EditTypeDialogProps {
  editingSubprocess: EditSubprocessType | null;
  setEditingSubprocess: (value: EditSubprocessType | null) => void;
  operators: Operator[];
  selectedOperators: string[];
  onSelectedOperatorsChange: (operators: string[]) => void;
}

export const EditTypeDialog = ({
  editingSubprocess,
  setEditingSubprocess,
  operators,
  selectedOperators,
  onSelectedOperatorsChange
}: EditTypeDialogProps) => {
  const { blocks, setBlocks } = useProductionStore();
  const { groupOrderIntoShipping } = useBlockUtils();
  
  const [type, setType] = useState<ProcessType>(ProcessType.Interno);
  const [quantity, setQuantity] = useState<number>(1);

  const handleSubprocessTypeChange = (newType: ProcessType) => {
    setType(newType);
  };

  const applyTypeChange = () => {
    if (!editingSubprocess) return;
    
    const updatedBlocks = blocks.map(block => {
      if (block.id === editingSubprocess.blockId) {
        const updatedSubprocesses = block.subprocesses.map(sp => {
          if (sp.id === editingSubprocess.subprocessId) {
            const updatedSubprocess: SubProcessStatus = {
              ...sp,
              type,
              assignedOperator: selectedOperators[0] || undefined
            };

            // Crear orden si es externo
            if (type === ProcessType.Externo) {
              const newOrder = {
                id: crypto.randomUUID(),
                blockId: block.id,
                origin: 1, // ID de ubicación actual
                destination: 2, // ID de ubicación externa
                scheduledDate: new Date(),
                subprocesses: [{
                  id: sp.id,
                  name: sp.name,
                  type: ProcessType.Externo,
                  price_ext: 0, // Valor por defecto
                  price_int: 0
                }],
                status: 'Pendiente de recojo'
              };
              
              groupOrderIntoShipping(newOrder);
            }

            return updatedSubprocess;
          }
          return sp;
        });

        return { ...block, subprocesses: updatedSubprocesses };
      }
      return block;
    });

    setBlocks(updatedBlocks);
    setEditingSubprocess(null);
  };

  return (
    <Dialog open={!!editingSubprocess} onOpenChange={() => setEditingSubprocess(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurar subproceso</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Select
            value={type}
            onValueChange={(value: ProcessType) => handleSubprocessTypeChange(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ProcessType.Interno}>Interno</SelectItem>
              <SelectItem value={ProcessType.Externo}>
                Externo (Generará orden de envío)
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Asignar operario</h3>
            </div>
            
            <Select
              value={selectedOperators[0] || ""}
              onValueChange={(value) => onSelectedOperatorsChange([value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar operario" />
              </SelectTrigger>
              <SelectContent>
                {operators.map((operator) => (
                  <SelectItem key={operator.id} value={operator.id.toString()}>
                    {operator.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Cantidad"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <Button 
            className="w-full" 
            onClick={applyTypeChange}
            disabled={type === ProcessType.Externo && !selectedOperators.length}
          >
            Confirmar cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};