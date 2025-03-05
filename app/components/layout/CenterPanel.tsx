'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface CenterPanelProps {
  serviceUrl?: string;
}

interface IframeWalletInfo {
  address?: string;
  balance?: number;
  network?: string;
}

export interface ServiceInfo {
  name: string;
  description: string;
  features: string[];
  category: string;
  tvl?: string;
  chains: number;
  logoUrl?: string;
}

export const serviceInfoMap: Record<string, ServiceInfo> = {
  "jito.network": {
    "name": "Jito",
    "description": "Solana의 MEV 기반 스테이킹 서비스",
    "features": ["MEV 수익 공유", "유동성 스테이킹"],
    "category": "Liquid Staking",
    "tvl": "15.8M SOL",
    "chains": 1,
    "logoUrl": "https://icons.llamao.fi/icons/protocols/jito.png"
  },
  "jupiter.ag": {
    "name": "Jupiter",
    "description": "Solana의 최적화된 DEX 애그리게이터",
    "features": ["최적화된 스왑 경로", "수수료 절감"],
    "category": "Dexs",
    "tvl": "$8.3M",
    "chains": 1,
    "logoUrl": "https://icons.llamao.fi/icons/protocols/jupiter.png"
  },
  "app.kamino.finance": {
    "name": "Kamino",
    "description": "Solana에서 자동화된 이자 농사 및 대출 최적화 서비스",
    "features": ["자동화된 포지션 관리", "최적화된 수익"],
    "category": "Lending",
    "tvl": "$4.5M",
    "chains": 1,
    "logoUrl": "https://icons.llamao.fi/icons/protocols/kamino.png"
  },
  "app.marinade.finance/": {
    "name": "Marinade",
    "description": "유동성 스테이킹 프로토콜",
    "features": ["mSOL 발행", "스테이킹 최적화"],
    "category": "Liquid Staking",
    "tvl": "6.2M SOL",
    "chains": 1,
    "logoUrl": "https://icons.llamao.fi/icons/protocols/marinade?w=48&h=48"
  },
  "raydium.io": {
    "name": "Raydium AMM",
    "description": "Solana 네트워크의 주요 AMM 기반 탈중앙화 거래소",
    "features": ["유동성 공급", "트레이딩 최적화"],
    "category": "Dexs",
    "tvl": "$7.1M",
    "chains": 1,
    "logoUrl": "https://icons.llamao.fi/icons/protocols/raydium.png"
  },
  "sanctum.so": {
    "name": "Sanctum",
    "description": "Solana 네트워크에서의 예치 및 수익 창출 플랫폼",
    "features": ["최적화된 예치", "수익 자동화"],
    "category": "Yield",
    "tvl": "$3.9M",
    "chains": 1,
    "logoUrl": "https://icons.llamao.fi/icons/protocols/sanctum.png"
  },
  "binance.com": {
    "name": "Binance Staked SOL",
    "description": "Binance를 통한 SOL 스테이킹 서비스",
    "features": ["스테이킹 수익", "유동성 활용"],
    "category": "Liquid Staking",
    "tvl": "5.4M SOL",
    "chains": 1,
    "logoUrl": "https://icons.llamao.fi/icons/protocols/binance-staked-sol?w=48&h=48"
  },
  "app.drift.trade/SOL-PERP": {
    "name": "Drift",
    "description": "Solana의 탈중앙화 파생상품 거래소",
    "features": ["선물 거래", "고급 트레이딩 기능"],
    "category": "Dexs",
    "tvl": "$2.1M",
    "chains": 1,
    "logoUrl": "https://icons.llamao.fi/icons/protocols/drift?w=48&h=48"
  },
  "meteora.ag": {
    "name": "Meteora",
    "description": "Solana의 유동성 최적화 플랫폼",
    "features": ["자동화된 유동성 관리", "수익 최적화"],
    "category": "Dexs",
    "tvl": "$3.2M",
    "chains": 1,
    "logoUrl": "https://icons.llamao.fi/icons/protocols/meteora.png"
  },
  "orca.so": {
    "name": "Orca",
    "description": "Solana에서 사용자 친화적인 AMM DEX",
    "features": ["빠른 스왑", "간편한 유동성 공급"],
    "category": "Dexs",
    "tvl": "$6.8M",
    "chains": 2,
    "logoUrl": "https://icons.llamao.fi/icons/protocols/orca.png"
  },
  "save.sol": {
    "name": "Save",
    "description": "Solana 기반 예치 및 대출 플랫폼",
    "features": ["고정 이자율", "안전한 예치"],
    "category": "Lending",
    "tvl": "$1.7M",
    "chains": 2,
    "logoUrl": "https://icons.llamao.fi/icons/protocols/save.png"
  },
  "vault.finance": {
    "name": "The Vault",
    "description": "Solana 기반의 유동성 스테이킹 서비스",
    "features": ["스테이킹 보상", "유동성 활용"],
    "category": "Liquid Staking",
    "tvl": "$2.4M",
    "chains": 1,
    "logoUrl": "https://icons.llamao.fi/icons/protocols/the-vault?w=48&h=48"
  },
  "marginfi.com": {
    "name": "marginfi",
    "description": "Solana의 온체인 마진 대출 프로토콜",
    "features": ["마진 대출", "레버리지 활용"],
    "category": "Lending",
    "tvl": "$3.6M",
    "chains": 1,
    "logoUrl": "https://icons.llamao.fi/icons/protocols/marginfi.png"
  },
  "blazestake.com": {
    "name": "BlazeStake",
    "description": "Solana 네트워크에서 유동성 스테이킹 지원",
    "features": ["유동성 스테이킹", "스테이킹 최적화"],
    "category": "Liquid Staking",
    "tvl": "4.1M SOL",
    "chains": 1,
    "logoUrl": "https://icons.llamao.fi/icons/protocols/blazestake?w=48&h=48"
  },
  "jpool.io": {
    "name": "JPool",
    "description": "Solana 기반의 유동성 스테이킹 서비스",
    "features": ["자동 보상", "유동성 활용"],
    "category": "Liquid Staking",
    "tvl": "3.5M SOL",
    "chains": 1,
    "logoUrl": "https://icons.llamao.fi/icons/protocols/jpool.png"
  },
  "solayer.io": {
    "name": "Solayer",
    "description": "Solana 네트워크에서 유동성 최적화 솔루션 제공",
    "features": ["스테이킹 최적화", "유동성 제공"],
    "category": "Liquid Staking",
    "tvl": "$2.8M",
    "chains": 1,
    "logoUrl": "https://icons.llamao.fi/icons/protocols/solayer.png"
  },
  "app.fragmetric.xyz/restake/": {
    "name": "fragmetric",
    "description": "Solana Restaking",
    "features": ["스테이킹 최적화", "유동성 제공"],
    "category": "Liquid Staking",
    "tvl": "$2.8M",
    "chains": 1,
    "logoUrl": "https://icons.llamao.fi/icons/protocols/fragmetric?w=48&h=48"
  },
  "dune.com/discover/content/trending": {
    "name": "[Data] dune",
    "description": "Solana Restaking",
    "features": ["스테이킹 최적화", "유동성 제공"],
    "category": "Infra",
    "tvl": "$2.8M",
    "chains": 1,
    "logoUrl": "https://icons.llamao.fi/icons/protocols/fragmetric?w=48&h=48"
  }
};

const CenterPanel: React.FC<CenterPanelProps> = ({ serviceUrl }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeWalletInfo, setIframeWalletInfo] = useState<IframeWalletInfo>({});
  const [iframeError, setIframeError] = useState<boolean>(false);
  const wallet = useWallet();

  // 지갑 연결 상태 모니터링
  useEffect(() => {
    console.log('지갑 연결 상태 변경:', {
      connected: wallet.connected,
      publicKey: wallet.publicKey?.toString(),
      connecting: wallet.connecting,
      disconnecting: wallet.disconnecting
    });
  }, [wallet.connected, wallet.publicKey, wallet.connecting, wallet.disconnecting]);

  // iframe으로부터 정보 수신
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!serviceUrl) return;

      try {
        const iframeOrigin = new URL(serviceUrl).origin;
        if (event.origin !== iframeOrigin) return;

        if (event.data.type === 'WALLET_INFO') {
          console.log('Received wallet info from iframe:', event.data);
          setIframeWalletInfo(event.data.data);
        }
        else if (event.data.type === 'WALLET_STATUS_CHANGE') {
          console.log('iframe 내부 지갑 상태 변경:', event.data.status);
        }
      } catch (error) {
        console.error('Error handling iframe message:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [serviceUrl]);

  // iframe 로드 에러 핸들링
  const handleIframeError = () => {
    setIframeError(true);
  };

  // 새 창으로 열기
  const openInNewWindow = () => {
    if (serviceUrl) {
      window.open(serviceUrl, '_blank');
    }
  };

  // URL이 유효한지 확인
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // 현재 서비스 정보 가져오기
  const getCurrentServiceInfo = () => {
    if (!serviceUrl) return null;
    try {
      const url = new URL(serviceUrl);
      const domain = url.hostname;
      return serviceInfoMap[domain];
    } catch {
      return null;
    }
  };

  // 서비스 정보 설명 생성
  const getServiceDescription = () => {
    const serviceInfo = getCurrentServiceInfo();
    if (!serviceInfo) return "현재 연결된 서비스 정보가 없습니다.";

    return `현재 ${serviceInfo.name} 서비스에 연결되어 있습니다.\n\n` +
           `${serviceInfo.description}\n\n` +
           "주요 기능:\n" +
           serviceInfo.features.map(f => `• ${f}`).join("\n");
  };

  return (
    <div className="flex-1 bg-[#1a1b1e] h-screen flex flex-col">
      {/* 브라우저 주소창 */}
      {serviceUrl && isValidUrl(serviceUrl) && (
        <div className="flex items-center gap-2 p-2 bg-[#2a2b2e] border-b border-gray-800">
          <div className="flex items-center gap-1 bg-[#1a1b1e] rounded px-3 py-1.5 flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
            <span className="text-gray-300 text-sm flex-1">{serviceUrl}</span>
          </div>
          <button 
            onClick={openInNewWindow}
            className="text-gray-400 hover:text-white p-1.5 rounded hover:bg-[#1a1b1e] transition-colors"
            title="새 창에서 열기"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
          <button
            onClick={() => alert(getServiceDescription())}
            className="text-gray-400 hover:text-white p-1.5 rounded hover:bg-[#1a1b1e] transition-colors"
            title="서비스 정보"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      )}

      {/* iframe 정보 표시 */}
      {Object.keys(iframeWalletInfo).length > 0 && (
        <div className="absolute top-4 right-4 bg-gray-800 p-4 rounded-lg text-white z-10">
          <h3 className="font-bold mb-2">iframe 지갑 정보</h3>
          <pre className="text-sm">
            {JSON.stringify(iframeWalletInfo, null, 2)}
          </pre>
        </div>
      )}

      <div className="flex-1">
        {serviceUrl && isValidUrl(serviceUrl) ? (
          iframeError ? (
            <div className="flex flex-col items-center justify-center h-full text-white space-y-4">
              <div className="text-xl font-bold">이 서비스는 직접 연동이 제한되어 있습니다</div>
              <p className="text-gray-400 text-center max-w-md">
                보안 정책으로 인해 현재 창에서 직접 접근이 불가능합니다.<br/>
                아래 버튼을 클릭하여 새 창에서 서비스를 이용해주세요.
              </p>
              <button
                onClick={openInNewWindow}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                새 창에서 열기
              </button>
            </div>
          ) : (
            <div className="w-full h-full">
              <iframe
                ref={iframeRef}
                src={serviceUrl}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads allow-storage-access-by-user-activation"
                loading="lazy"
                onError={handleIframeError}
              />
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white space-y-6">
            <h1 className="text-3xl font-bold">Solana DeFi 서비스</h1>
            <p className="text-gray-400">좌측의 DeFi 서비스 목록에서 원하시는 서비스를 선택해주세요.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CenterPanel; 