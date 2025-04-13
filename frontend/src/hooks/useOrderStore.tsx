
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OrderType = 'market' | 'limit' | 'stop' | 'stopLimit';
export type OrderSide = 'buy' | 'sell';
export type OrderStatus = 'open' | 'filled' | 'canceled' | 'rejected';

export interface Order {
  id: string;
  timestamp: number;
  symbol: string;
  type: OrderType;
  side: OrderSide;
  price: number;
  quantity: number;
  filled: number;
  status: OrderStatus;
  clientOrderId?: string;
}

interface OrderState {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'timestamp'>) => string;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  cancelOrder: (id: string) => void;
  getOrders: (filters?: Partial<Order>) => Order[];
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      
      addOrder: (orderData) => {
        const id = `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const order: Order = {
          id,
          timestamp: Date.now(),
          ...orderData
        };
        
        set((state) => ({
          orders: [order, ...state.orders]
        }));
        
        return id;
      },
      
      updateOrder: (id, updates) => {
        set((state) => ({
          orders: state.orders.map((order) => 
            order.id === id ? { ...order, ...updates } : order
          )
        }));
      },
      
      cancelOrder: (id) => {
        set((state) => ({
          orders: state.orders.map((order) => 
            order.id === id ? { ...order, status: 'canceled' } : order
          )
        }));
      },
      
      getOrders: (filters) => {
        const { orders } = get();
        
        if (!filters) return orders;
        
        return orders.filter(order => {
          for (const [key, value] of Object.entries(filters)) {
            if (order[key as keyof Order] !== value) {
              return false;
            }
          }
          return true;
        });
      }
    }),
    {
      name: 'orders-storage'
    }
  )
);
