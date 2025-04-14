// stores/useProductionStore.ts
import { create } from "zustand";
import { Block, Order, ShippingOrder } from "@/lib/types/block";

interface ProductionStore {
  blocks: Block[];
  orders: Order[];
  shippingOrders: ShippingOrder[];
  setShippingOrders: (orders: ShippingOrder[]) => void;
  setBlocks: (blocks: Block[]) => void;
  addBlock: (block: Block) => void;
  updateBlock: (id: string, updatedBlock: Partial<Block>) => void;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updatedOrder: Partial<Order>) => void;
  addShippingOrder: (order: ShippingOrder) => void;
  updateShippingOrder: (id: string, updatedOrder: Partial<ShippingOrder>) => void;
  removeShippingOrder: (id: string) => void;
}

export const useProductionStore = create<ProductionStore>((set) => ({
  blocks: [],
  orders: [],
  shippingOrders: [],
  
  // Bloques
  setBlocks: (blocks) => set({ blocks }),
  addBlock: (block) => set((state) => ({ blocks: [...state.blocks, block] })),
  updateBlock: (id, updatedBlock) =>
    set((state) => ({
      blocks: state.blocks.map((block) =>
        block.id === id ? { ...block, ...updatedBlock } : block
      ),
    })),

  // Órdenes
  setOrders: (orders) => set({ orders }),
  addOrder: (order) => 
    set((state) => ({ orders: [...state.orders, order] })),
  updateOrder: (id, updatedOrder) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id ? { ...order, ...updatedOrder } : order
      ),
    })),

  // Órdenes de envío
  setShippingOrders: (orders) => set({ shippingOrders: orders }),

  addShippingOrder: (order) =>
    set((state) => ({ 
      shippingOrders: [...state.shippingOrders, order] 
    })),
  updateShippingOrder: (id, updatedOrder) =>
    set((state) => ({
      shippingOrders: state.shippingOrders.map((order) =>
        order.id === id ? { ...order, ...updatedOrder } : order
      ),
    })),
  removeShippingOrder: (id) =>
    set((state) => ({
      shippingOrders: state.shippingOrders.filter((order) => order.id !== id),
    })),
}));