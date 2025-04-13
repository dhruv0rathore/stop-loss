import { useState } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useToast } from './ui/use-toast';
import { useBalance } from '../hooks/useBalance';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';

interface StopLossFormProps {
  walletAddress?: string;
}

export function StopLossForm({ walletAddress }: StopLossFormProps) {
  const [size, setSize] = useState<string>('');
  const [sliderValue, setSliderValue] = useState<number[]>([0]);
  const [isTakeProfit, setIsTakeProfit] = useState(false);
  const [tpPrice, setTpPrice] = useState<string>('');
  const [slPrice, setSlPrice] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { prices } = useWebSocket();
  const { toast } = useToast();
  const { balance, isLoading: isBalanceLoading } = useBalance(walletAddress);
  
  const currentPrice = prices['ETH']?.price || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!size) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/stop-loss', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          market: 'ETH',
          size: parseFloat(size),
          walletAddress,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register stop loss');
      }

      toast({
        title: "Stop Loss Registered",
        description: `Set for ETH at $${size}`,
      });

      // Reset form
      setSize('');
    } catch (error) {
      console.error('Error setting stop loss:', error);
      toast({
        title: "Error",
        description: "Failed to register stop loss. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    if (balance) {
      const newSize = (balance * (value[0] / 100)).toFixed(2);
      setSize(newSize);
    }
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = e.target.value;
    setSize(newSize);
    if (balance && parseFloat(newSize) > 0) {
      const percentage = Math.min((parseFloat(newSize) / balance) * 100, 100);
      setSliderValue([percentage]);
    } else {
      setSliderValue([0]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set ETH Stop Loss</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="size" className="text-sm text-muted-foreground">Size</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="size"
                  type="number"
                  step="0.01"
                  value={size}
                  onChange={handleSizeChange}
                  placeholder="0.00"
                  className="font-mono bg-secondary/50"
                />
                <div className="text-sm text-muted-foreground w-16 text-right">
                  {sliderValue[0].toFixed(0)}%
                </div>
              </div>
              <Slider
                value={sliderValue}
                onValueChange={handleSliderChange}
                max={100}
                step={1}
                className="my-4"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <Label htmlFor="orderType" className="text-sm">Take Profit / Stop Loss</Label>
              <Switch
                id="orderType"
                checked={isTakeProfit}
                onCheckedChange={setIsTakeProfit}
              />
            </div>

            {isTakeProfit ? (
              <div className="space-y-2">
                <Label htmlFor="tpPrice" className="text-sm text-muted-foreground">TP Price</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="tpPrice"
                    type="number"
                    step="0.01"
                    value={tpPrice}
                    onChange={(e) => setTpPrice(e.target.value)}
                    placeholder="0.00"
                    className="font-mono bg-secondary/50"
                  />
                  <div className="text-sm text-emerald-500 w-20 text-right">
                    {tpPrice && currentPrice ? 
                      `${((parseFloat(tpPrice) - currentPrice) / currentPrice * 100).toFixed(2)}%` 
                      : '0.00%'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="slPrice" className="text-sm text-muted-foreground">SL Price</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="slPrice"
                    type="number"
                    step="0.01"
                    value={slPrice}
                    onChange={(e) => setSlPrice(e.target.value)}
                    placeholder="0.00"
                    className="font-mono bg-secondary/50"
                  />
                  <div className="text-sm text-red-500 w-20 text-right">
                    {slPrice && currentPrice ? 
                      `${((currentPrice - parseFloat(slPrice)) / currentPrice * 100).toFixed(2)}%` 
                      : '0.00%'}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                disabled={isSubmitting || !walletAddress}
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </Button>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
              <div>Available</div>
              <div>
                {!walletAddress ? (
                  "Connect Wallet"
                ) : isBalanceLoading ? (
                  "Loading..."
                ) : (
                  `$${balance.toFixed(2)}`
                )}
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 