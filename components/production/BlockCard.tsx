import { Block, ProcessType, SubProcessStatus } from "@/types/block"
import { processes } from '../../types/process';
import { Card } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";


interface BlockCardProps {
    block: Block;
    selectedBlocks: string[];
    setSelectedBlocks: (selectedIds: string[]) => void;
    setEditingSubprocess: (editingData: { blockId: string; subprocessId: string; currentType: ProcessType.Interno | ProcessType.Externo; }) => void;
    moveToNextProcess: (blockId: string) => void;
    processes: { id: string; name: string; }[];
}



export const BlockCard = ({
    block,
    selectedBlocks,
    setSelectedBlocks,
    setEditingSubprocess,
    moveToNextProcess,
    processes,
}: BlockCardProps) => {
    const getProgressPercentage = (subprocesses: SubProcessStatus[]) => {
        const completed = subprocesses.filter(sp => sp.completed).length;
        return (completed / subprocesses.length) * 100;
    };

    const isFinalProcess = (block: Block, processes: { id: string; name: string; }[]) => {
        const lastProcess = processes[processes.length - 1];
        return block.processId === lastProcess.id;
    };


    return (
        <Card key={block.id} className="p-4">
            <div className="flex items-start gap-4">
                <Checkbox
                    checked={selectedBlocks.includes(block.id)}
                    onCheckedChange={(checked) => {
                        if (checked) {
                            setSelectedBlocks([...selectedBlocks, block.id]);
                        } else {
                            setSelectedBlocks(
                                selectedBlocks.filter((id) => id !== block.id)
                            );
                        }
                    }}
                />
                <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-medium">{block.reference}</h3>
                                <Badge
                                    variant={block.priority === "high" ? "destructive" : "secondary"}>
                                    {block.priority}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {processes.find(p => p.id === block.processId)?.name} - {block.quantity} unidades
                            </p>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span>Progreso</span>
                            <span>
                                {getProgressPercentage(block.subprocesses).toFixed(0)}%
                            </span>
                        </div>
                        <Progress
                            value={getProgressPercentage(block.subprocesses)}
                        />
                    </div>

                    <div className="flex justify-between pr-4">
                        <div className="flex flex-wrap gap-2">
                            {block.subprocesses.map((subprocess) => (
                                <Badge
                                    key={subprocess.id}
                                    variant={subprocess.completed ? "default" : "outline"}
                                    className={`cursor-pointer ${!subprocess.completed ? "hover:bg-accent" : ""}`}
                                    onClick={() => {
                                        if (!subprocess.completed && block.status !== "Completado") {
                                            setEditingSubprocess({
                                                blockId: block.id,
                                                subprocessId: subprocess.id,
                                                currentType: subprocess.type,
                                            });
                                        }
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <span>{subprocess.name}</span>
                                        <span className="text-xs opacity-75">
                                            ({subprocess.type})
                                        </span>
                                    </div>
                                </Badge>
                            ))}
                        </div>
                        {block.status === "Completado" && !isFinalProcess(block, processes) && (
                            <>
                                {block.subprocesses.every(sp => sp.type === ProcessType.Interno) && (
                                    <Button
                                        onClick={() => {
                                            moveToNextProcess(block.id);
                                            setSelectedBlocks([]);
                                        }}
                                        disabled={block.status !== "Completado"}
                                        title="Siguiente proceso (Interno)"
                                    >
                                        <p>Siguiente Proceso Interno</p>
                                    </Button>
                                )}
                                {block.subprocesses.some(sp => sp.type === ProcessType.Externo) && (
                                    <Button
                                        onClick={() => {
                                            moveToNextProcess(block.id);
                                            setSelectedBlocks([]);
                                        }}
                                        disabled={block.status !== "Completado"}
                                        title="Siguiente proceso (Externo)"
                                    >
                                        <p>Siguiente Proceso Externo</p>
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};