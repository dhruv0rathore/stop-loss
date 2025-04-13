
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CoinSelectorProps {
  selectedCoin: string;
  onSelectCoin: (coin: string) => void;
}

export default function CoinSelector({ selectedCoin, onSelectCoin }: CoinSelectorProps) {
  const popularCoins = [
    { symbol: 'BTC-USD', name: 'Bitcoin' },
    { symbol: 'ETH-USD', name: 'Ethereum' },
    { symbol: 'SOL-USD', name: 'Solana' },
    { symbol: 'ARB-USD', name: 'Arbitrum' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 text-lg font-bold px-2 py-1"
        >
          <div className="flex items-center">
            <div className="h-6 w-6 rounded-full bg-orange-500 mr-2"></div>
            {selectedCoin} <ChevronDown className="h-4 w-4 ml-1" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        {popularCoins.map((coin) => (
          <DropdownMenuItem 
            key={coin.symbol}
            onClick={() => onSelectCoin(coin.symbol)}
            className="flex items-center gap-2"
          >
            <div className="h-5 w-5 rounded-full bg-orange-500"></div>
            <span>{coin.symbol}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
