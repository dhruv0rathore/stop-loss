import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useBalance(walletAddress?: string) {
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!window.ethereum) {
      setBalance(0);
      setIsLoading(false);
      return;
    }

    async function fetchBalance() {
      if (!walletAddress) {
        setBalance(0);
        return;
      }

      try {
        setIsLoading(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const address = ethers.getAddress(walletAddress);
        const balanceWei = await provider.getBalance(address);
        const balanceEth = parseFloat(ethers.formatEther(balanceWei));
        
        // Get ETH price in USD
        const response = await fetch('/api/price/ETH');
        if (!response.ok) {
          throw new Error('Failed to fetch ETH price');
        }
        const { price } = await response.json();
        
        // Calculate USD value
        const balanceUSD = balanceEth * price;
        setBalance(balanceUSD);
        setError(null);
      } catch (err) {
        console.error('Error fetching balance:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchBalance();
    
    // Set up polling every 30 seconds
    const intervalId = setInterval(fetchBalance, 30000);

    // Listen for account changes
    const handleAccountsChanged = () => {
      fetchBalance();
    };
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      clearInterval(intervalId);
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [walletAddress]);

  return { balance, isLoading, error };
} 