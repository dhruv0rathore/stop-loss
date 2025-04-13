
interface PriceData {
  price: number;
  time: string;
}

interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

interface OrderBook {
  asks: OrderBookEntry[];
  bids: OrderBookEntry[];
  spread: {
    value: number;
    percentage: number;
  };
}

interface Trade {
  id: string;
  price: number;
  size: number;
  total: number;
  time: string;
  side: 'buy' | 'sell';
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const marketService = {
  async getPrice(symbol: string): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/market/${symbol}/price`);
      if (!response.ok) {
        throw new Error('Failed to fetch price');
      }
      const data = await response.json();
      return data.price;
    } catch (error) {
      console.error('Error fetching price:', error);
      throw error;
    }
  },

  async getPriceHistory(symbol: string, timeframe: string): Promise<PriceData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/market/${symbol}/history?timeframe=${timeframe}`);
      if (!response.ok) {
        throw new Error('Failed to fetch price history');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching price history:', error);
      throw error;
    }
  },

  async getOrderBook(symbol: string): Promise<OrderBook> {
    try {
      const response = await fetch(`${API_BASE_URL}/market/${symbol}/orderbook`);
      if (!response.ok) {
        throw new Error('Failed to fetch order book');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching order book:', error);
      throw error;
    }
  },

  async getTrades(symbol: string): Promise<Trade[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/market/${symbol}/trades`);
      if (!response.ok) {
        throw new Error('Failed to fetch trades');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching trades:', error);
      throw error;
    }
  }
};

export type { PriceData, OrderBookEntry, OrderBook, Trade };
