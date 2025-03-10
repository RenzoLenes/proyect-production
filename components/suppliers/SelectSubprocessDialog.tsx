import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { SubProcessStatus } from "@/types/block";
import { useState } from "react";

interface SelectSubprocessDialogProps {
    open: boolean;
    onClose: () => void;
    subprocesses: SubProcessStatus[];
    onSelect: (selectedSubprocessIds: string[]) => void;
}

export const SelectSubprocessDialog: React.FC<SelectSubprocessDialogProps> = ({ open, onClose, subprocesses, onSelect }) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Selecciona subprocesos externos</DialogTitle>
                </DialogHeader>
                <div>
                    {subprocesses.map(subprocess => (
                        <div key={subprocess.id}>
                            <Checkbox
                                checked={selectedIds.includes(subprocess.id)}
                                onCheckedChange={() => handleSelect(subprocess.id)}
                            >
                                {subprocess.name}
                            </Checkbox>
                        </div>
                    ))}
                </div>
                <Button onClick={() => {
                    onSelect(selectedIds);
                    onClose();
                }}>Confirmar</Button>
            </DialogContent>
        </Dialog>
    );
};