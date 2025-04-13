import { WebSocketProvider } from './contexts/WebSocketContext';
import { WalletConnect } from './components/WalletConnect';
import { PriceChart } from './components/PriceChart';
import { StopLossForm } from './components/StopLossForm';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Toaster } from './components/ui/toaster';
import { Card } from './components/ui/card';

export function App() {
  const [walletAddress, setWalletAddress] = useState<string>('');

  return (
    <WebSocketProvider>
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-3 flex justify-end">
          <WalletConnect onConnect={setWalletAddress} />
        </div>

        <main className="container mx-auto px-4 py-6">
          <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
            <div className="space-y-6">
              <Card className="p-4">
                <Tabs defaultValue="ETH" className="w-full">
                  <div className="flex justify-between items-center mb-4">
                    <TabsList className="bg-secondary">
                      <TabsTrigger value="ETH">ETH-USD</TabsTrigger>
                    </TabsList>
                    <div className="text-sm text-muted-foreground">
                      24h Volume: $1,719,445,969
                    </div>
                  </div>
                  <TabsContent value="ETH">
                    <PriceChart market="ETH" />
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-4">
                <Tabs defaultValue="ETH" className="w-full">
                  <TabsList className="w-full bg-secondary mb-4">
                    <TabsTrigger value="ETH" className="w-full">ETH Stop Loss</TabsTrigger>
                  </TabsList>
                  <TabsContent value="ETH">
                    <StopLossForm walletAddress={walletAddress} />
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>
        </main>
      </div>
      <Toaster />
    </WebSocketProvider>
  );
}
