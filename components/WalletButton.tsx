'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useEffect, useState } from 'react';

export function WalletButton() {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // 지갑이 연결되면 잔액을 가져옵니다
    if (publicKey) {
      fetch(`https://api.devnet.solana.com`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [publicKey.toString()],
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.result?.value) {
            setBalance(json.result.value / LAMPORTS_PER_SOL);
          }
        })
        .catch(console.error);
    } else {
      setBalance(null);
    }
  }, [publicKey]);

  return (
    <div className="flex items-center gap-4">
      {mounted && (
        <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700" />
      )}
      {balance !== null && (
        <div className="text-sm">
          잔액: {balance.toLocaleString()} SOL
        </div>
      )}
    </div>
  );
} 