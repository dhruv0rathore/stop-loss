
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useCreateOrder } from '@/hooks/useOrderManagement';
import { usePrice } from '@/hooks/useMarketData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";

interface TradeFormProps {
  symbol: string;
  currentPrice: number;
}

export default function TradeForm({ symbol, currentPrice }: TradeFormProps) {
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [price, setPrice] = useState<string>(currentPrice.toString());
  const [size, setSize] = useState<string>('0');
  const [sliderValue, setSliderValue] = useState([0]);
  const [reduceOnly, setReduceOnly] = useState(false);
  const [takeProfitStopLoss, setTakeProfitStopLoss] = useState(false);
  
  const { toast } = useToast();
  const createOrder = useCreateOrder();
  const { data: latestPrice, isLoading: priceLoading } = usePrice(symbol);
  
  // Update price when latestPrice changes
  useEffect(() => {
    if (latestPrice && orderType === 'market') {
      setPrice(latestPrice.toString());
    }
  }, [latestPrice, orderType]);

  // Update price when currentPrice changes (from props)
  useEffect(() => {
    if (currentPrice && orderType === 'market') {
      setPrice(currentPrice.toString());
    }
  }, [currentPrice, orderType]);
  
  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    
    // Update size based on slider percentage (just for demo)
    const maxSize = 100;
    const newSize = (maxSize * value[0] / 100).toFixed(2);
    setSize(newSize);
  };
  
  const handleSubmitOrder = async () => {
    if (parseFloat(size) <= 0) {
      toast({
        title: "Invalid Order",
        description: "Order size must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    try {
      createOrder.mutate({
        symbol,
        type: orderType,
        side,
        price: parseFloat(price),
        quantity: parseFloat(size),
        clientOrderId: `manual-${Date.now()}`
      });
      
      // Reset form after successful submission
      if (orderType === 'limit') {
        setSize('0');
        setSliderValue([0]);
      }
    } catch (error) {
      // Error handling is done in the mutation
      console.error("Error submitting order:", error);
    }
  };
  
  // Display loading state if price is being fetched
  const loading = priceLoading || createOrder.isPending;
  
  return (
    <div className="trading-card w-full h-full">
      <Tabs defaultValue="spot" className="w-full">
        <div className="border-b border-trading-border-light">
          <TabsList className="w-full bg-transparent border-b border-trading-border-light grid grid-cols-3">
            <TabsTrigger 
              value="spot" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
              onClick={() => setOrderType('limit')}
            >
              Limit
            </TabsTrigger>
            <TabsTrigger 
              value="margin" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
              onClick={() => setOrderType('market')}
            >
              Market
            </TabsTrigger>
            <TabsTrigger 
              value="futures" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Pro
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="spot" className="p-4 space-y-4">
          <div className="flex">
            <Button
              variant="outline"
              onClick={() => setSide('buy')}
              className={`flex-1 ${
                side === 'buy' 
                  ? 'bg-trading-button-buy text-white' 
                  : 'bg-transparent text-trading-button-buy border-trading-border-light'
              }`}
            >
              Buy / Long
            </Button>
            <Button
              variant="outline"
              onClick={() => setSide('sell')}
              className={`flex-1 ${
                side === 'sell' 
                  ? 'bg-trading-button-sell text-white' 
                  : 'bg-transparent text-trading-button-sell border-trading-border-light'
              }`}
            >
              Sell / Short
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Available to Trade</span>
              <span>22.27</span>
            </div>
            
            <div className="flex justify-between text-xs">
              <span>Current Position</span>
              <span>0.00000 BTC</span>
            </div>
            
            <div className="mt-4 space-y-2">
              <Label htmlFor="size">Size</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="bg-trading-input-bg border-trading-border-light"
                />
                <div className="w-14 text-center">
                  <span className="text-xs">USD</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center my-4">
              <Slider
                value={sliderValue}
                max={100}
                step={1}
                onValueChange={handleSliderChange}
                className="flex-1"
              />
              <span className="ml-2 text-xs">{sliderValue[0]}%</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="reduceOnly" className="text-xs">Reduce Only</Label>
                <Switch
                  id="reduceOnly"
                  checked={reduceOnly}
                  onCheckedChange={setReduceOnly}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="tpsl" className="text-xs">Take Profit / Stop Loss</Label>
                <Switch
                  id="tpsl"
                  checked={takeProfitStopLoss}
                  onCheckedChange={setTakeProfitStopLoss}
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button
                onClick={handleSubmitOrder}
                disabled={loading}
                className={`w-full ${
                  side === 'buy' 
                    ? 'bg-trading-button-buy hover:bg-trading-button-buy/90' 
                    : 'bg-trading-button-sell hover:bg-trading-button-sell/90'
                }`}
              >
                {loading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
                {loading ? 'Placing Order...' : side === 'buy' ? 'Buy/Long' : 'Sell/Short'}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="margin" className="p-4 space-y-4">
          <div className="flex">
            <Button
              variant="outline"
              onClick={() => setSide('buy')}
              className={`flex-1 ${
                side === 'buy' 
                  ? 'bg-trading-button-buy text-white' 
                  : 'bg-transparent text-trading-button-buy border-trading-border-light'
              }`}
            >
              Buy / Long
            </Button>
            <Button
              variant="outline"
              onClick={() => setSide('sell')}
              className={`flex-1 ${
                side === 'sell' 
                  ? 'bg-trading-button-sell text-white' 
                  : 'bg-transparent text-trading-button-sell border-trading-border-light'
              }`}
            >
              Sell / Short
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Available to Trade</span>
              <span>22.27</span>
            </div>
            
            <div className="flex justify-between text-xs">
              <span>Current Position</span>
              <span>0.00000 BTC</span>
            </div>
            
            <div className="mt-4 space-y-2">
              <Label htmlFor="market-size">Size</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="market-size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="bg-trading-input-bg border-trading-border-light"
                />
                <div className="w-14 text-center">
                  <span className="text-xs">USD</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center my-4">
              <Slider
                value={sliderValue}
                max={100}
                step={1}
                onValueChange={handleSliderChange}
                className="flex-1"
              />
              <span className="ml-2 text-xs">{sliderValue[0]}%</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="market-reduceOnly" className="text-xs">Reduce Only</Label>
                <Switch
                  id="market-reduceOnly"
                  checked={reduceOnly}
                  onCheckedChange={setReduceOnly}
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button
                onClick={handleSubmitOrder}
                disabled={loading}
                className={`w-full ${
                  side === 'buy' 
                    ? 'bg-trading-button-buy hover:bg-trading-button-buy/90' 
                    : 'bg-trading-button-sell hover:bg-trading-button-sell/90'
                }`}
              >
                {loading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
                {loading ? 'Placing Order...' : side === 'buy' ? 'Buy at Market' : 'Sell at Market'}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="futures" className="p-4">
          <div className="text-sm text-center text-muted-foreground p-8">
            Advanced order types will be implemented in the next version
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
