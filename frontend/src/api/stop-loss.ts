import { ethers } from 'ethers';
import type { Eip1193Provider } from 'ethers';

interface StopLossRequest {
  market: string;
  threshold: number;
  size: number;
  walletAddress: string;
}

export async function registerStopLoss(data: StopLossRequest) {
  const provider = new ethers.BrowserProvider(window.ethereum as Eip1193Provider);
  const signer = await provider.getSigner();

  // Get contract address from environment variable
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  
  // Simple ABI for the stop loss registration function
  const abi = [
    "function registerStopLoss(string memory market, uint256 threshold, uint256 size) external"
  ];

  const contract = new ethers.Contract(contractAddress, abi, signer);

  try {
    // Convert threshold to wei (assuming price is in USD with 18 decimals)
    const thresholdWei = ethers.parseUnits(data.threshold.toString(), 18);
    const sizeWei = ethers.parseUnits(data.size.toString(), 18);

    // Call the contract function
    const tx = await contract.registerStopLoss(
      data.market,
      thresholdWei,
      sizeWei
    );

    // Wait for transaction to be mined
    const receipt = await tx.wait();

    // Also register with backend
    const backendResponse = await fetch('/api/stop-loss', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        transactionHash: receipt.hash,
      }),
    });

    if (!backendResponse.ok) {
      throw new Error('Failed to register with backend');
    }

    return receipt;
  } catch (error) {
    console.error('Error registering stop loss:', error);
    throw error;
  }
} 