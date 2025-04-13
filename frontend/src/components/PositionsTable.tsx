import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useOrders, useCancelOrder } from '@/hooks/useOrderManagement';
import { Info, X, ArrowUpDown, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export default function PositionsTable() {
  const {
    data: orders,
    isLoading,
    isError
  } = useOrders();
  const cancelOrder = useCancelOrder();
  const [sortField, setSortField] = useState('value');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const {
    toast
  } = useToast();
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  const handleCloseOrder = (orderId: string) => {
    cancelOrder.mutate({
      orderId
    });
  };

  // Filter only open orders
  const openOrders = orders ? orders.filter(order => order.status === 'open') : [];
  if (isLoading) {
    return;
  }
  if (isError) {
    return <div className="trading-card w-full h-full flex flex-col">
        
        
      </div>;
  }
  return <div className="trading-card w-full h-full flex flex-col">
      <div className="p-2 border-b border-trading-border-light flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-medium">Positions</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-[200px] text-xs">
                  View and manage your current positions. Click 'Close All' to close all positions.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Filter className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" className="text-xs h-8 border-trading-border-light" onClick={() => {
          if (openOrders.length > 0) {
            openOrders.forEach(order => {
              handleCloseOrder(order.id);
            });
            toast({
              title: "All Positions Closed",
              description: "Closing all positions..."
            });
          } else {
            toast({
              title: "No Positions",
              description: "There are no positions to close"
            });
          }
        }} disabled={cancelOrder.isPending}>
            Close All
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto scrollbar-thin">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs" onClick={() => handleSort('symbol')}>
                <div className="flex items-center cursor-pointer">
                  Coin <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-xs" onClick={() => handleSort('quantity')}>
                <div className="flex items-center cursor-pointer">
                  Size <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-xs" onClick={() => handleSort('price')}>
                <div className="flex items-center cursor-pointer">
                  Entry Price <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-xs">
                <div className="flex items-center cursor-pointer">
                  Mark Price
                </div>
              </TableHead>
              <TableHead className="text-xs">
                <div className="flex items-center cursor-pointer">
                  PNL
                </div>
              </TableHead>
              <TableHead className="text-xs"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {openOrders.length === 0 ? <TableRow>
                <TableCell colSpan={6} className="text-center text-xs text-muted-foreground py-8">
                  No open positions yet
                </TableCell>
              </TableRow> : openOrders.map(order => {
            const pnl = 0; // Calculate PNL based on current price vs entry price
            return <TableRow key={order.id}>
                    <TableCell className="text-xs font-medium">{order.symbol}</TableCell>
                    <TableCell className="text-xs">{order.quantity}</TableCell>
                    <TableCell className="text-xs">${order.price.toFixed(2)}</TableCell>
                    <TableCell className="text-xs">$--</TableCell>
                    <TableCell className={`text-xs ${pnl >= 0 ? 'text-positive' : 'text-negative'}`}>
                      $-- (--)
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => handleCloseOrder(order.id)} disabled={cancelOrder.isPending}>
                        <X className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>;
          })}
          </TableBody>
        </Table>
      </div>
    </div>;
}