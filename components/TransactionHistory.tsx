'use client';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { ParsedTransactionWithMeta } from '@solana/web3.js';

interface Transaction {
  signature: string;
  slot: number;
  timestamp: number;
  type: string;
  amount?: number;
  status: 'success' | 'error';
}

export function TransactionHistory() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!publicKey) {
      setTransactions([]);
      return;
    }

    setLoading(true);
    connection.getSignaturesForAddress(publicKey, { limit: 10 })
      .then(async (signatures) => {
        const txPromises = signatures.map(async (item) => {
          const tx = await connection.getParsedTransaction(item.signature, {
            maxSupportedTransactionVersion: 0,
          });

          if (!tx) return null;

          let type = '알 수 없음';
          let amount;

          if (tx.meta?.logMessages) {
            if (tx.meta.logMessages.some((msg) => msg.includes('Transfer'))) {
              type = 'SOL 전송';
              amount = tx.meta.postBalances[0] - tx.meta.preBalances[0];
            }
          }

          return {
            signature: item.signature,
            slot: item.slot,
            timestamp: item.blockTime || 0,
            type,
            amount: amount ? Math.abs(amount) / 1e9 : undefined,
            status: tx.meta?.err ? 'error' : 'success',
          };
        });

        const txs = (await Promise.all(txPromises)).filter((tx): tx is Transaction => tx !== null);
        setTransactions(txs);
        setLoading(false);
      })
      .catch((error) => {
        console.error('트랜잭션 정보를 가져오는데 실패했습니다:', error);
        setLoading(false);
      });
  }, [publicKey, connection]);

  if (!publicKey) return null;

  return (
    <div className="w-full max-w-md p-4 bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">최근 트랜잭션</h2>
      {loading ? (
        <div className="text-center">로딩 중...</div>
      ) : transactions.length > 0 ? (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div key={tx.signature} className="p-2 bg-gray-700 rounded">
              <div className="flex items-center justify-between">
                <span className="text-sm">{tx.type}</span>
                <span className={tx.status === 'success' ? 'text-green-400' : 'text-red-400'}>
                  {tx.status === 'success' ? '성공' : '실패'}
                </span>
              </div>
              {tx.amount && (
                <div className="text-sm text-gray-400">
                  {tx.amount.toLocaleString()} SOL
                </div>
              )}
              <div className="text-xs text-gray-500 mt-1">
                {new Date(tx.timestamp * 1000).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400">트랜잭션 내역이 없습니다</div>
      )}
    </div>
  );
} 