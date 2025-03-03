'use client';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { AccountInfo, ParsedAccountData } from '@solana/web3.js';

interface TokenBalance {
  mint: string;
  amount: number;
  decimals: number;
  symbol?: string;
  logo?: string;
}

export function TokenBalances() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!publicKey) {
      setTokens([]);
      return;
    }

    setLoading(true);
    // Jupiter API를 사용하여 토큰 정보를 가져옵니다
    fetch(`https://token.jup.ag/all`)
      .then((res) => res.json())
      .then((tokenList) => {
        // 지갑의 토큰 잔액을 가져옵니다
        connection.getParsedTokenAccountsByOwner(publicKey, {
          programId: new (require('@solana/web3.js')).PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        })
          .then(({ value }) => {
            const tokenBalances = value.map((item) => {
              const parsedInfo = (item.account.data as ParsedAccountData).parsed.info;
              const tokenInfo = tokenList.find(
                (t: any) => t.address === parsedInfo.mint
              );
              return {
                mint: parsedInfo.mint,
                amount: parsedInfo.tokenAmount.uiAmount,
                decimals: parsedInfo.tokenAmount.decimals,
                symbol: tokenInfo?.symbol || '알 수 없음',
                logo: tokenInfo?.logoURI,
              };
            }).filter((token: TokenBalance) => token.amount > 0);
            
            setTokens(tokenBalances);
            setLoading(false);
          })
          .catch((error) => {
            console.error('토큰 정보를 가져오는데 실패했습니다:', error);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error('토큰 정보를 가져오는데 실패했습니다:', error);
        setLoading(false);
      });
  }, [publicKey, connection]);

  if (!publicKey) return null;

  return (
    <div className="w-full max-w-md p-4 bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">토큰 잔액</h2>
      {loading ? (
        <div className="text-center">로딩 중...</div>
      ) : tokens.length > 0 ? (
        <div className="space-y-2">
          {tokens.map((token) => (
            <div key={token.mint} className="flex items-center gap-2 p-2 bg-gray-700 rounded">
              {token.logo && (
                <img src={token.logo} alt={token.symbol} className="w-6 h-6 rounded-full" />
              )}
              <span className="flex-1">{token.symbol}</span>
              <span className="font-mono">{token.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400">보유한 토큰이 없습니다</div>
      )}
    </div>
  );
} 