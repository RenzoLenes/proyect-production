import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PackageCheck, Clock, Trash } from "lucide-react";

interface ScannedBlocksListProps {
  blocks: any[];
  onRemoveBlock: (id: string) => void;
  onFinalizeScan: () => void;
}

export default function ScannedBlocksList({
  blocks,
  onRemoveBlock,
  onFinalizeScan,
}: ScannedBlocksListProps) {
  return (
    <div className="space-y-4">
      {blocks.map((block) => (
        <Card key={block.id} className="p-4 hover:bg-accent cursor-pointer">
          <CardContent className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{block.reference}</h3>
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
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onRemoveBlock(block.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
      <Button onClick={onFinalizeScan} disabled={blocks.length === 0}>
        Finalizar Escaneo
      </Button>
    </div>
  );
}