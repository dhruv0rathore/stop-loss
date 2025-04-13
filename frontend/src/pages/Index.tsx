
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { usePrice } from '@/hooks/useMarketData';
import { useOrderWebSocket } from '@/hooks/useOrderManagement';
import TradingNav from '@/components/TradingNav';
import CoinSelector from '@/components/CoinSelector';
import PriceChart from '@/components/PriceChart';
import TradeForm from '@/components/TradeForm';
import TradesTable from '@/components/TradesTable';
import PositionsTable from '@/components/PositionsTable';

const Index = () => {
  const [selectedCoin, setSelectedCoin] = useState('BTC-USD');
  const {
    data: currentPrice,
    isLoading,
    isError
  } = usePrice(selectedCoin);

  // Initialize WebSockets for real-time updates
  useOrderWebSocket();
  
  const priceDisplay = isLoading ? "Loading..." : isError ? "Error" : currentPrice?.toLocaleString() || "N/A";
  
  return <div className="min-h-screen flex flex-col bg-trading-bg-dark text-foreground">
      <TradingNav />
      
      <main className="flex-1 container mx-auto px-2 py-4 max-w-full">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.3
      }} className="mb-4 flex items-center justify-between">
          <CoinSelector selectedCoin={selectedCoin} onSelectCoin={setSelectedCoin} />
        </motion.div>
        
        <div className="grid grid-cols-12 gap-2 h-[calc(100vh-12rem)]">
          {/* Main Chart - expanded to fill the space left by OrderBook */}
          <motion.div initial={{
          opacity: 0,
          scale: 0.98
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.4,
          delay: 0.1
        }} className="col-span-9 row-span-2">
            <PriceChart symbol={selectedCoin} />
          </motion.div>
          
          {/* Trade Form - moved to the right */}
          <motion.div initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.3,
          delay: 0.3
        }} className="col-span-3 row-span-2 h-full">
            <TradeForm symbol={selectedCoin} currentPrice={currentPrice || 100448} />
          </motion.div>
          
          {/* Positions */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.3,
          delay: 0.4
        }} className="col-span-8 h-[250px]">
            <PositionsTable />
          </motion.div>
          
          {/* Trades */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.3,
          delay: 0.5
        }} className="col-span-4 h-[250px]">
            <TradesTable symbol={selectedCoin} />
          </motion.div>
        </div>
      </main>
    </div>;
};

export default Index;
