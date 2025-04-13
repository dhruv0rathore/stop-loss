
import { Order, OrderSide, OrderType, OrderStatus } from '@/hooks/useOrderStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface CreateOrderParams {
  symbol: string;
  type: OrderType;
  side: OrderSide;
  price: number;
  quantity: number;
  clientOrderId?: string;
}

export interface CancelOrderParams {
  orderId: string;
}

export const orderService = {
  async getOrders(): Promise<Order[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  async createOrder(params: CreateOrderParams): Promise<Order> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to create order');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async cancelOrder(params: CancelOrderParams): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${params.orderId}/cancel`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error;
    }
  },

  async getOrderById(orderId: string): Promise<Order> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  }
};
