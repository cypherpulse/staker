import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { getDefaultConfig } from 'connectkit';

// WalletConnect Project ID - replace with your own for production
const WALLETCONNECT_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string;

export const config = createConfig(
  getDefaultConfig({
    chains: [baseSepolia],
    transports: {
      [baseSepolia.id]: http('https://sepolia.base.org'),
    },
    walletConnectProjectId: WALLETCONNECT_PROJECT_ID,
    appName: 'BaseStaker Dashboard',
    appDescription: 'Stake ETH and earn rewards on Base Sepolia',
    appUrl: typeof window !== 'undefined' ? window.location.origin : 'https://basestaker.app',
    appIcon: 'https://basestaker.app/logo.png',
  })
);

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
