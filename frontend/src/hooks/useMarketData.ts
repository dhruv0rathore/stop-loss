
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { marketService, OrderBook, PriceData, Trade } from '@/api/marketService';
import { useEffect } from 'react';

// Hook for getting current price
export function usePrice(symbol: string) {
  return useQuery({
    queryKey: ['price', symbol],
    queryFn: () => marketService.getPrice(symbol),
    refetchInterval: 3000, // Refetch every 3 seconds
  });
}

// Hook for getting price history
export function usePriceHistory(symbol: string, timeframe: string) {
  return useQuery({
    queryKey: ['priceHistory', symbol, timeframe],
    queryFn: () => marketService.getPriceHistory(symbol, timeframe),
    refetchInterval: 60000, // Refetch every minute
  });
}

// Hook for getting order book
export function useOrderBook(symbol: string) {
  return useQuery({
    queryKey: ['orderBook', symbol],
    queryFn: () => marketService.getOrderBook(symbol),
    refetchInterval: 5000, // Refetch every 5 seconds
  });
}

// Hook for getting recent trades
export function useTrades(symbol: string) {
  return useQuery({
    queryKey: ['trades', symbol],
    queryFn: () => marketService.getTrades(symbol),
    refetchInterval: 3000, // Refetch every 3 seconds
  });
}

// Optional: Setup WebSocket for real-time updates if your backend supports it
export function useMarketWebSocket(symbol: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    // This is a placeholder for WebSocket implementation
    // You would replace this with actual WebSocket connection code
    const ws = new WebSocket(`ws://localhost:8000/ws/market/${symbol}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Update cache based on the type of update
      if (data.type === 'price') {
        queryClient.setQueryData(['price', symbol], data.price);
      } else if (data.type === 'orderBook') {
        queryClient.setQueryData(['orderBook', symbol], data.orderBook);
      } else if (data.type === 'trade') {
        // Prepend new trade to existing trades
        queryClient.setQueryData(['trades', symbol], (oldData: Trade[] | undefined) => {
          if (!oldData) return [data.trade];
          return [data.trade, ...oldData.slice(0, 49)];
        });
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [symbol, queryClient]);
}
