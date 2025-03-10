// hooks/useBlockUtils.ts
import { useProductionStore } from "@/lib/store/productionStore";
import { Block, Order, ProcessType, ShippingOrder, BlockStatus, ShippingOrdeStatus, SubProcessStatus } from "@/types/block";
import { processes, SubProcess } from '../types/process';
import { v4 as uuidv4 } from 'uuid';
import { isSameDay } from 'date-fns';

export const useBlockUtils = () => {
    const {
        blocks,
        setBlocks,
        orders,
        shippingOrders,
        addOrder,
        updateBlock,
        addShippingOrder,
        updateShippingOrder
    } = useProductionStore();

    // Helper para obtener el tipo de proceso
    const getProcessType = (processId: string): ProcessType => {
        const process = processes.find(p => p.id === processId);
        return process?.subprocesses.some(sp => sp.type === ProcessType.Externo)
            ? ProcessType.Externo
            : ProcessType.Interno;
    };

    // Actualizar estado de un subproceso
    const updateSubprocessStatus = (
        block: Block,
        subprocessId: string,
        newStatus: BlockStatus
    ): Block => {
        return {
            ...block,
            subprocesses: block.subprocesses.map(sp =>
                sp.id === subprocessId ? {
                    ...sp,
                    status: newStatus,
                    completed: newStatus === BlockStatus.completed // Actualiza completed basado en el status
                } : sp
            )
        };
    };

    // Lógica cuando se completa un subproceso
    // hooks/useBlockUtils.ts
    const completeSubprocess = (blockId: string, subprocessId: string) => {
        const updatedBlocks = blocks.map(block => {
            if (block.id === blockId) {
                let updatedBlock = updateSubprocessStatus(block, subprocessId, BlockStatus.completed);

                const currentProcessType = getProcessType(block.processId);
                let allCompleted = false;

                // Lógica para procesos internos
                if (currentProcessType === ProcessType.Interno) {
                    console.log('Proceso interno');
                    
                    allCompleted = updatedBlock.subprocesses.every(sp => sp.completed);

                    console.log('Todos completados', allCompleted);

                    return {
                        ...updatedBlock,
                        status: allCompleted ? 'Completado' : 'En proceso'
                    };
                }

                // Lógica para procesos externos
                if (currentProcessType === ProcessType.Externo) {
                    console.log('Proceso externo');
                    const externalSubprocesses = updatedBlock.subprocesses
                        .filter(sp => sp.type === ProcessType.Externo);

                    allCompleted = externalSubprocesses.every(sp => sp.completed);

                    if (allCompleted) {
                        return {
                            ...updatedBlock,
                            status: 'Completado',
                            subprocesses: updatedBlock.subprocesses.map(sp => ({
                                ...sp,
                                status: ShippingOrdeStatus.Pendiente,
                            }))
                        };
                    }
                }

                return {
                    ...updatedBlock,
                    status: 'En proceso'
                };
            }
            return block;
        });
        
        setBlocks(updatedBlocks as Block[]);
    };

    // Agrupa órdenes en envíos por fecha y destino
    const groupOrderIntoShipping = (newOrder: Order) => {
        const existingShipping = shippingOrders.find(so =>
            isSameDay(so.departureDate || new Date(), newOrder.scheduledDate) &&
            so.status === 'Pendiente de recojo'
        );

        const shippingUpdate = existingShipping
            ? {
                ...existingShipping,
                orderIds: [...existingShipping.orderIds, newOrder.id]
            }
            : {
                id: uuidv4(),
                orderIds: [newOrder.id],
                transportProvider: '',
                departureDate: newOrder.scheduledDate,
                origin: newOrder.origin,
                destination: newOrder.destination,
                status: ShippingOrdeStatus.Pendiente
            };

        existingShipping
            ? updateShippingOrder(existingShipping.id, shippingUpdate)
            : addShippingOrder(shippingUpdate);
    };

    // Actualiza estado de envío y bloques relacionados
    const updateShippingStatus = (shippingId: string, status: ShippingOrder['status']) => {
        const shipping = shippingOrders.find(so => so.id === shippingId);
        if (!shipping) return;

        const updatedShipping = {
            ...shipping,
            status,
            ...(status === 'En tránsito' && { departureDate: new Date() }),
            ...(status === 'Entregado' && { arrivalDate: new Date() })
        };

        updateShippingOrder(shippingId, updatedShipping);

        if (status === 'Entregado') {
            const relatedBlocks = blocks.filter(block =>
                shipping.orderIds.some(orderId =>
                    orders.some(o =>
                        o.id === orderId &&
                        o.blockId === block.id
                    )
                )
            );

            const updatedBlocks = relatedBlocks.map(block => ({
                ...block,
                status: BlockStatus.pending,
                subprocesses: block.subprocesses.map(sp => ({
                    ...sp,
                    status: BlockStatus.pending,
                    completed: false
                }))
            }));

            updatedBlocks.forEach(block => updateBlock(block.id, block));
        }
    };

    // Mover al siguiente proceso con lógica de envío
    const moveToNextProcess = (blockId: string) => {
        const updatedBlocks = blocks.map(block => {
            if (block.id === blockId && block.status === 'Completado') {
                const currentProcessIndex = processes.findIndex(p => p.id === block.processId);
                const nextProcess = processes[currentProcessIndex + 1];
                const currentProcess= processes[currentProcessIndex];
                if (!nextProcess) return block;


                if(currentProcess.subprocesses.every(sp => sp.type === ProcessType.Interno)){
                
                    if(nextProcess.subprocesses.every(sp => sp.type === ProcessType.Interno)){
                        return {
                            ...block,
                            processId: nextProcess.id,
                            status: 'En proceso',
                            subprocesses: nextProcess.subprocesses.map(sp => ({
                                id: sp.id,
                                name: sp.name,
                                completed: false,
                                type: sp.type,
                                status: BlockStatus.pending,
                                assignedOperator: undefined
                            }))
                        };
                    }else if(nextProcess.subprocesses.some(sp => sp.type === ProcessType.Externo)){
                        const newOrder: Order = {
                            id: uuidv4(),
                            blockId,
                            origin: 1,
                            destination: 2,
                            scheduledDate: new Date(),
                            subprocesses: currentProcess.subprocesses,
                            status: 'Pendiente de recojo'
                        };
                        addOrder(newOrder);
                        groupOrderIntoShipping(newOrder);
                    }

                }else if(currentProcess.subprocesses.some(sp => sp.type === ProcessType.Externo)){
                    if(nextProcess.subprocesses.every(sp => sp.type === ProcessType.Interno)){
                        const newOrder: Order = {
                            id: uuidv4(),
                            blockId,
                            origin: 2,
                            destination: 1,
                            scheduledDate: new Date(),
                            subprocesses: currentProcess.subprocesses,
                            status: 'Pendiente de recojo'
                        };
                        addOrder(newOrder);
                        console.log("si estoy aqui", newOrder);
                        groupOrderIntoShipping(newOrder);
                    }else if(nextProcess.subprocesses.some(sp => sp.type === ProcessType.Externo)){
                        const newOrder: Order = {
                            id: uuidv4(),
                            blockId,
                            origin: 2,
                            destination: 3,
                            scheduledDate: new Date(),
                            subprocesses: currentProcess.subprocesses,
                            status: 'Pendiente de recojo'
                        };
                        addOrder(newOrder);
                        groupOrderIntoShipping(newOrder);
                    }
                }

                const newSubprocesses: SubProcessStatus[] = nextProcess.subprocesses.map(sp => ({
                    id: sp.id,
                    name: sp.name,
                    completed: false,
                    type: sp.type,
                    status: BlockStatus.pending,
                    assignedOperator: undefined
                }));

                console.log("ordenes",orders);
                console.log("shipping-order",shippingOrders)
                // Crear envío si el siguiente proceso es externo
                return {
                    ...block,
                    processId: nextProcess.id,
                    subprocesses: newSubprocesses,
                    status: 'Pendiente',
                };

            }
            return block;
        });
        setBlocks(updatedBlocks as Block[]);
    };

    return {
        completeSubprocess,
        moveToNextProcess,
        updateShippingStatus,
        groupOrderIntoShipping
    };
};