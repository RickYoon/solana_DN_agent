interface ServiceInfo {
  name: string;
  description: string;
  features: string[];
  category: string;
  tvl: string;
  chains: number;
  logoUrl: string;
  url: string;
}

export const serviceInfoMap: Record<string, ServiceInfo> = {
  "jito.network": {
    name: "Jito",
    description: "Solana의 MEV 기반 스테이킹 서비스",
    features: ["MEV 수익 공유", "유동성 스테이킹"],
    category: "Liquid Staking",
    tvl: "15.8M SOL",
    chains: 1,
    logoUrl: "https://icons.llamao.fi/icons/protocols/jito.png",
    url: "jito.network"
  },
  "jupiter.ag": {
    name: "Jupiter",
    description: "Solana의 최적화된 DEX 애그리게이터",
    features: ["최적화된 스왑 경로", "수수료 절감"],
    category: "Dexs",
    tvl: "$8.3M",
    chains: 1,
    logoUrl: "https://icons.llamao.fi/icons/protocols/jupiter.png",
    url: "jupiter.ag"
  },
  "app.kamino.finance": {
    name: "Kamino",
    description: "Solana에서 자동화된 이자 농사 및 대출 최적화 서비스",
    features: ["자동화된 포지션 관리", "최적화된 수익"],
    category: "Lending",
    tvl: "$4.5M",
    chains: 1,
    logoUrl: "https://icons.llamao.fi/icons/protocols/kamino.png",
    url: "app.kamino.finance"
  },
  "app.marinade.finance/": {
    name: "Marinade",
    description: "유동성 스테이킹 프로토콜",
    features: ["mSOL 발행", "스테이킹 최적화"],
    category: "Liquid Staking",
    tvl: "6.2M SOL",
    chains: 1,
    logoUrl: "https://icons.llamao.fi/icons/protocols/marinade?w=48&h=48",
    url: "app.marinade.finance/"
  },
  "raydium.io": {
    name: "Raydium AMM",
    description: "Solana 네트워크의 주요 AMM 기반 탈중앙화 거래소",
    features: ["유동성 공급", "트레이딩 최적화"],
    category: "Dexs",
    tvl: "$7.1M",
    chains: 1,
    logoUrl: "https://icons.llamao.fi/icons/protocols/raydium?w=48&h=48",
    url: "raydium.io"
  },
  "sanctum.so": {
    name: "Sanctum",
    description: "Solana 네트워크에서의 예치 및 수익 창출 플랫폼",
    features: ["최적화된 예치", "수익 자동화"],
    category: "Yield",
    tvl: "$3.9M",
    chains: 1,
    logoUrl: "https://icons.llamao.fi/icons/protocols/sanctum.png",
    url: "sanctum.so"
  },
  "binance.com": {
    name: "Binance Staked SOL",
    description: "Binance를 통한 SOL 스테이킹 서비스",
    features: ["스테이킹 수익", "유동성 활용"],
    category: "Liquid Staking",
    tvl: "5.4M SOL",
    chains: 1,
    logoUrl: "https://icons.llamao.fi/icons/protocols/binance-staked-sol?w=48&h=48",
    url: "binance.com"
  },
  "app.drift.trade/SOL-PERP": {
    name: "Drift",
    description: "Solana의 탈중앙화 파생상품 거래소",
    features: ["선물 거래", "고급 트레이딩 기능"],
    category: "Dexs",
    tvl: "$2.1M",
    chains: 1,
    logoUrl: "https://icons.llamao.fi/icons/protocols/drift?w=48&h=48",
    url: "app.drift.trade/SOL-PERP"
  },
  "meteora.ag": {
    name: "Meteora",
    description: "Solana의 유동성 최적화 플랫폼",
    features: ["자동화된 유동성 관리", "수익 최적화"],
    category: "Dexs",
    tvl: "$3.2M",
    chains: 1,
    logoUrl: "https://icons.llamao.fi/icons/protocols/meteora.png",
    url: "meteora.ag"
  },
  "orca.so": {
    name: "Orca",
    description: "Solana에서 사용자 친화적인 AMM DEX",
    features: ["빠른 스왑", "간편한 유동성 공급"],
    category: "Dexs",
    tvl: "$6.8M",
    chains: 2,
    logoUrl: "https://icons.llamao.fi/icons/protocols/orca.png",
    url: "orca.so"
  },
  "save.sol": {
    name: "Save",
    description: "Solana 기반 예치 및 대출 플랫폼",
    features: ["고정 이자율", "안전한 예치"],
    category: "Lending",
    tvl: "$1.7M",
    chains: 2,
    logoUrl: "https://icons.llamao.fi/icons/protocols/save.png",
    url: "save.sol"
  },
  "vault.finance": {
    name: "The Vault",
    description: "Solana 기반의 유동성 스테이킹 서비스",
    features: ["스테이킹 보상", "유동성 활용"],
    category: "Liquid Staking",
    tvl: "$2.4M",
    chains: 1,
    logoUrl: "https://icons.llamao.fi/icons/protocols/the-vault?w=48&h=48",
    url: "vault.finance"
  },
  "marginfi.com": {
    name: "marginfi",
    description: "Solana의 온체인 마진 대출 프로토콜",
    features: ["마진 대출", "레버리지 활용"],
    category: "Lending",
    tvl: "$3.6M",
    chains: 1,
    logoUrl: "https://icons.llamao.fi/icons/protocols/marginfi.png",
    url: "marginfi.com"
  },
  "blazestake.com": {
    name: "BlazeStake",
    description: "Solana 네트워크에서 유동성 스테이킹 지원",
    features: ["유동성 스테이킹", "스테이킹 최적화"],
    category: "Liquid Staking",
    tvl: "4.1M SOL",
    chains: 1,
    logoUrl: "https://icons.llamao.fi/icons/protocols/blazestake?w=48&h=48",
    url: "blazestake.com"
  },
  "jpool.io": {
    name: "JPool",
    description: "Solana 기반의 유동성 스테이킹 서비스",
    features: ["자동 보상", "유동성 활용"],
    category: "Liquid Staking",
    tvl: "3.5M SOL",
    chains: 1,
    logoUrl: "https://icons.llamao.fi/icons/protocols/jpool.png",
    url: "jpool.io"
  },
  "app.solayer.org": {
    name: "Solayer",
    description: "Solana Restaking Platform",
    features: ["스테이킹 최적화", "유동성 제공"],
    category: "Liquid Staking",
    tvl: "$2.8M",
    chains: 1,
    logoUrl: "https://icons.llamao.fi/icons/protocols/solayer?w=48&h=48",
    url: "app.solayer.org"
  },
  "app.fragmetric.xyz/restake/": {
    name: "fragmetric",
    description: "Solana Restaking",
    features: ["스테이킹 최적화", "유동성 제공"],
    category: "Liquid Staking",
    tvl: "$2.8M",
    chains: 1,
    logoUrl: "https://icons.llamao.fi/icons/protocols/fragmetric?w=48&h=48",
    url: "app.fragmetric.xyz/restake/"
  },
  "dune.com/discover/content/trending": {
    name: "[Data] dune",
    description: "Solana Restaking",
    features: ["스테이킹 최적화", "유동성 제공"],
    category: "Infra",
    tvl: "$2.8M",
    chains: 1,
    logoUrl: "https://icons.llamao.fi/icons/protocols/fragmetric?w=48&h=48",
    url: "dune.com/discover/content/trending"
  },
  "app.rate-x.io/": {
    name: "Rate-X",
    description: "Solana Restaking",
    features: ["스테이킹 최적화", "유동성 제공"],
    category: "YieldTrading",
    tvl: "$2.8M",
    chains: 1,
    logoUrl: "https://icons.llamao.fi/icons/protocols/ratex?w=48&h=48",
    url: "app.rate-x.io/"
  }
};

export function getServiceByName(name: string): ServiceInfo | undefined {
  return serviceInfoMap[name] || Object.values(serviceInfoMap).find(service => service.name === name);
}

export function getServiceByUrl(url: string): ServiceInfo | undefined {
  return serviceInfoMap[url] || Object.values(serviceInfoMap).find(service => service.url === url);
} 