import React, { createContext, useContext, useEffect, useState } from 'react';

interface PriceData {
  market: string;
  price: number;
  timestamp: number;
}

interface WebSocketContextType {
  prices: Record<string, PriceData>;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
  prices: {},
  isConnected: false,
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('wss://api.hyperliquid-testnet.xyz/ws');

    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket Connected');
      
      // Subscribe to ETH and BTC feeds
      const markets = ['ETH', 'BTC'];
      markets.forEach(market => {
        ws.send(JSON.stringify({
          method: 'subscribe',
          subscription: {
            type: 'l2Book',
            coin: market
          }
        }));
      });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.channel === 'l2Book' && data.data) {
          const levels = data.data.levels;
          const bid = parseFloat(levels[0][0].px);
          const ask = parseFloat(levels[1][0].px);
          const price = (bid + ask) / 2;
          
          setPrices(prev => ({
            ...prev,
            [data.data.coin]: {
              market: data.data.coin,
              price,
              timestamp: Date.now()
            }
          }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket Disconnected');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ prices, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
}; 