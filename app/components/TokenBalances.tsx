'use client';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { ParsedAccountData, PublicKey } from '@solana/web3.js';

interface TokenBalance {
  mint: string;
  amount: number;
  decimals: number;
  symbol?: string;
  logo?: string;
  usdPrice?: number;
}

export function TokenBalances() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTokenBalances = async () => {
    if (!publicKey) {
      setTokens([]);
      return;
    }

    setLoading(true);
    try {
      // Jupiter API에서 토큰 정보와 가격 정보를 가져옵니다
      const [tokenList, priceData] = await Promise.all([
        fetch('https://token.jup.ag/all').then(res => res.json()),
        fetch('https://price.jup.ag/v4/price?ids=SOL,USDC').then(res => res.json())
      ]);

      // 지갑의 토큰 계정을 가져옵니다
      const { value: tokenAccounts } = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      });

      const tokenBalances = tokenAccounts
        .map((item) => {
          const parsedInfo = (item.account.data as ParsedAccountData).parsed.info;
          const tokenInfo = tokenList.find(
            (t: any) => t.address === parsedInfo.mint
          );
          
          // Jupiter API의 가격 정보를 사용합니다
          const price = priceData.data[tokenInfo?.symbol]?.price;
          
          return {
            mint: parsedInfo.mint,
            amount: parsedInfo.tokenAmount.uiAmount,
            decimals: parsedInfo.tokenAmount.decimals,
            symbol: tokenInfo?.symbol || '알 수 없음',
            logo: tokenInfo?.logoURI,
            usdPrice: price
          };
        })
        .filter((token: TokenBalance) => token.amount > 0);

      setTokens(tokenBalances);
    } catch (error) {
      console.error('토큰 정보를 가져오는데 실패했습니다:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTokenBalances();

    // 토큰 계정 변경을 감지하여 잔액을 업데이트합니다
    if (publicKey) {
      const subscriptionIds: number[] = [];
      
      // 토큰 프로그램 ID
      const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
      
      // 지갑 주소에 대한 웹소켓 구독
      const subId = connection.onProgramAccountChange(
        TOKEN_PROGRAM_ID,
        () => {
          fetchTokenBalances();
        },
        'confirmed',
        [{
          memcmp: {
            offset: 32,
            bytes: publicKey.toBase58()
          }
        }]
      );
      
      subscriptionIds.push(subId);

      return () => {
        subscriptionIds.forEach(id => {
          connection.removeAccountChangeListener(id);
        });
      };
    }
  }, [publicKey, connection]);

  if (!publicKey) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-gray-400 text-sm mb-4">기타 토큰</h3>
      {loading ? (
        <div className="text-white">토큰 정보 로딩 중...</div>
      ) : tokens.length > 0 ? (
        <div className="space-y-4">
          {tokens.map((token) => (
            <div key={token.mint} className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  {token.logo && (
                    <img src={token.logo} alt={token.symbol} className="w-5 h-5 rounded-full" />
                  )}
                  <p className="text-white">{token.symbol}</p>
                </div>
                <p className="text-gray-500 text-sm">
                  {token.amount.toLocaleString()} {token.symbol}
                </p>
              </div>
              {token.usdPrice && (
                <div className="text-right">
                  <p className="text-white">
                    ${(token.amount * token.usdPrice).toLocaleString(undefined, {maximumFractionDigits: 2})}
                  </p>
                  <p className="text-gray-500 text-sm">
                    ${token.usdPrice.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">다른 토큰이 없습니다</div>
      )}
    </div>
  );
} 