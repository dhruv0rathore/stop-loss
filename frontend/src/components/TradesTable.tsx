
import React, { useState } from 'react';
import { useTrades } from '@/hooks/useMarketData';
import { ArrowUpDown, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TradesTableProps {
  symbol: string;
}

export default function TradesTable({ symbol }: TradesTableProps) {
  const { data: trades, isLoading, isError } = useTrades(symbol);
  const [sortField, setSortField] = useState('time');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const sortedTrades = trades 
    ? [...trades].sort((a: any, b: any) => {
        if (sortDirection === 'asc') {
          return a[sortField] > b[sortField] ? 1 : -1;
        } else {
          return a[sortField] < b[sortField] ? 1 : -1;
        }
      })
    : [];
  
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  
  if (isLoading) {
    return (
      <div className="trading-card w-full h-full flex flex-col">
        <div className="p-2 border-b border-trading-border-light">
          <h3 className="text-sm font-medium">Trades</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading trades...</p>
        </div>
      </div>
    );
  }
  
  if (isError || !trades) {
    return (
      <div className="trading-card w-full h-full flex flex-col">
        <div className="p-2 border-b border-trading-border-light">
          <h3 className="text-sm font-medium">Trades</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-negative">Failed to load trades</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="trading-card w-full h-full flex flex-col">
      <div className="p-2 border-b border-trading-border-light flex justify-between items-center">
        <h3 className="text-sm font-medium">Trades</h3>
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto scrollbar-thin">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs" onClick={() => handleSort('price')}>
                <div className="flex items-center cursor-pointer">
                  Price <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-xs text-right" onClick={() => handleSort('size')}>
                <div className="flex items-center justify-end cursor-pointer">
                  Size <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-xs text-right" onClick={() => handleSort('time')}>
                <div className="flex items-center justify-end cursor-pointer">
                  Time <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTrades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-xs text-muted-foreground py-8">
                  No trades yet
                </TableCell>
              </TableRow>
            ) : (
              sortedTrades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell className={`text-xs font-medium ${trade.side === 'buy' ? 'text-positive' : 'text-negative'}`}>
                    {trade.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-xs text-right">
                    {trade.size.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-xs text-right">
                    {formatTime(trade.time)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
