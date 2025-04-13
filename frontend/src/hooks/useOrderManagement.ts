
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderService, CreateOrderParams, CancelOrderParams } from '@/api/orderService';
import { useToast } from '@/hooks/use-toast';
import { Order } from '@/hooks/useOrderStore';

// Hook for fetching orders
export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getOrders,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

// Hook for creating an order
export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (params: CreateOrderParams) => orderService.createOrder(params),
    onSuccess: (data) => {
      // Invalidate and refetch orders query
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      // Show success toast
      toast({
        title: 'Order Created',
        description: `${data.side.toUpperCase()} order for ${data.quantity} ${data.symbol.split('-')[0]} placed`,
        variant: data.side === 'buy' ? 'default' : 'destructive',
      });
    },
    onError: (error) => {
      // Show error toast
      toast({
        title: 'Order Failed',
        description: error instanceof Error ? error.message : 'Failed to place order',
        variant: 'destructive',
      });
    },
  });
}

// Hook for canceling an order
export function useCancelOrder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (params: CancelOrderParams) => orderService.cancelOrder(params),
    onSuccess: () => {
      // Invalidate and refetch orders query
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      // Show success toast
      toast({
        title: 'Order Canceled',
        description: 'Order has been successfully canceled',
      });
    },
    onError: (error) => {
      // Show error toast
      toast({
        title: 'Cancel Failed',
        description: error instanceof Error ? error.message : 'Failed to cancel order',
        variant: 'destructive',
      });
    },
  });
}

// Hook for fetching a single order
export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrderById(orderId),
    enabled: !!orderId, // Only run if orderId is provided
  });
}

// Optional: Setup WebSocket for real-time order updates
export function useOrderWebSocket() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    // This is a placeholder for WebSocket implementation
    const ws = new WebSocket('ws://localhost:8000/ws/orders');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'orderUpdate') {
        // Update the specific order in the cache
        queryClient.setQueryData(['order', data.order.id], data.order);
        
        // Update the order in the orders list
        queryClient.setQueryData(['orders'], (oldData: Order[] | undefined) => {
          if (!oldData) return [data.order];
          
          return oldData.map(order => 
            order.id === data.order.id ? data.order : order
          );
        });
        
        // Show notification based on status change
        if (data.statusChange) {
          const message = `Order ${data.order.id.substring(0, 8)} status: ${data.order.status}`;
          
          toast({
            title: 'Order Updated',
            description: message,
            variant: data.order.status === 'filled' ? 'default' : 
                    data.order.status === 'rejected' ? 'destructive' : 'default',
          });
        }
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [queryClient, toast]);
}

import { useEffect } from 'react';
