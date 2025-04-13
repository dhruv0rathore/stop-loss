import { ExternalProvider } from '@ethersproject/providers';

declare global {
  interface Window {
    ethereum?: ExternalProvider;
  }

  interface ImportMetaEnv {
    VITE_CONTRACT_ADDRESS: string;
    // Add other environment variables here
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {}; 