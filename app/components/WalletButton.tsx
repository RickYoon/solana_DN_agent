'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import dynamic from 'next/dynamic';

// WalletMultiButton을 dynamic import로 변경
const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export function WalletButton() {
  const { connected } = useWallet();

  return (
    <div className="wallet-button">
      <WalletMultiButtonDynamic className="wallet-adapter-button" />
      <style jsx global>{`
        .wallet-adapter-button {
          background-color: #512da8;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.2s;
        }
        .wallet-adapter-button:hover {
          background-color: #673ab7;
        }
        .wallet-adapter-button:not([disabled]):hover {
          background-color: #673ab7;
        }
      `}</style>
    </div>
  );
} 