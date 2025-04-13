import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { useOrderBook } from '@/hooks/useMarketData';
interface OrderBookProps {
  symbol: string;
}
export default function OrderBook({
  symbol
}: OrderBookProps) {
  const {
    data: orderBook,
    isLoading,
    isError
  } = useOrderBook(symbol);
  const {
    toast
  } = useToast();
  const handleEntryClick = (price: number) => {
    toast({
      title: `Price Selected`,
      description: `Added price $${price.toFixed(2)} to order form`
    });
  };
  if (isLoading) {
    return <div className="trading-card w-full h-full flex flex-col">
        <div className="p-2 border-b border-trading-border-light">
          <h3 className="text-sm font-medium">Order Book</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          
        </div>
      </div>;
  }
  if (isError || !orderBook) {
    return <div className="trading-card w-full h-full flex flex-col">
        
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-negative">Failed to load order book</p>
        </div>
      </div>;
  }
  return <div className="trading-card w-full h-full flex flex-col">
      <div className="p-2 border-b border-trading-border-light flex justify-between items-center">
        <h3 className="text-sm font-medium">Order Book</h3>
        <div className="flex gap-2">
          <button className="text-xs text-muted-foreground hover:text-foreground">
            Cross
          </button>
          <button className="text-xs text-muted-foreground hover:text-foreground">
            10x
          </button>
          <button className="text-xs text-muted-foreground hover:text-foreground">
            One-Way
          </button>
        </div>
      </div>
      
      <div className="text-xs grid grid-cols-3 py-1 px-2 border-b border-trading-border-light">
        <div className="text-left">Price (USD)</div>
        <div className="text-right">Size (USD)</div>
        <div className="text-right">Total (USD)</div>
      </div>
      
      <div className="flex-1 overflow-auto scrollbar-thin">
        {/* Asks (Sell orders) */}
        <div className="text-xs">
          {orderBook.asks.map((entry, index) => <div key={`ask-${index}`} className="grid grid-cols-3 py-0.5 px-2 hover:bg-secondary/50 cursor-pointer relative" onClick={() => handleEntryClick(entry.price)}>
              <div className="text-left text-negative">{entry.price.toFixed(2)}</div>
              <div className="text-right">{entry.size.toLocaleString()}</div>
              <div className="text-right">{entry.total.toLocaleString()}</div>
              <div className="absolute right-0 top-0 h-full bg-negative/20" style={{
            width: `${Math.min(100, entry.total / orderBook.asks[orderBook.asks.length - 1].total * 100)}%`
          }}></div>
            </div>)}
        </div>
        
        {/* Spread */}
        <div className="text-xs grid grid-cols-3 py-2 px-2 border-y border-trading-border-light bg-black/20">
          <div className="text-left">Spread</div>
          <div className="text-right">{orderBook.spread.value.toFixed(2)}</div>
          <div className="text-right">{orderBook.spread.percentage.toFixed(4)}%</div>
        </div>
        
        {/* Bids (Buy orders) */}
        <div className="text-xs">
          {orderBook.bids.map((entry, index) => <div key={`bid-${index}`} className="grid grid-cols-3 py-0.5 px-2 hover:bg-secondary/50 cursor-pointer relative" onClick={() => handleEntryClick(entry.price)}>
              <div className="text-left text-positive">{entry.price.toFixed(2)}</div>
              <div className="text-right">{entry.size.toLocaleString()}</div>
              <div className="text-right">{entry.total.toLocaleString()}</div>
              <div className="absolute right-0 top-0 h-full bg-positive/20" style={{
            width: `${Math.min(100, entry.total / orderBook.bids[orderBook.bids.length - 1].total * 100)}%`
          }}></div>
            </div>)}
        </div>
      </div>
    </div>;
}