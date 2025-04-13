import { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { ethers } from 'ethers';
import { useToast } from './ui/use-toast';
import type { Eip1193Provider } from 'ethers';

interface WalletConnectProps {
  onConnect: (address: string) => void;
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  const [address, setAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to connect your wallet",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsConnecting(true);
      const provider = new ethers.BrowserProvider(window.ethereum as Eip1193Provider);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAddress(accounts[0]);
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
      });
      onConnect(accounts[0]);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  }, [toast, onConnect]);

  return (
    <Button 
      onClick={connectWallet} 
      disabled={isConnecting}
      variant={address ? "outline" : "default"}
    >
      {isConnecting ? (
        "Connecting..."
      ) : address ? (
        `${address.slice(0, 6)}...${address.slice(-4)}`
      ) : (
        "Connect Wallet"
      )}
    </Button>
  );
} 