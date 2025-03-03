'use client';

import { WalletButton } from "@/components/WalletButton";
import { TokenBalances } from "@/components/TokenBalances";
import { TransactionHistory } from "@/components/TransactionHistory";
import { ChatWindow } from "@/components/ChatWindow";
import { useState } from "react";

export default function Home() {
	const [selectedStrategy, setSelectedStrategy] = useState<string | null>("델타뉴트럴 파밍");

	const InfoCard = (
		<div className="w-full max-w-3xl mx-auto space-y-6">
			<h1 className="text-4xl font-bold text-center mb-8">
			🤖 Solana DeFi Strategy Agent
			</h1>
			
			<button
				onClick={() => setSelectedStrategy("델타뉴트럴 파밍")}
				className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold p-6 rounded-xl transition-all duration-200 flex flex-col items-center space-y-4 border border-blue-400"
			>
				<div className="text-2xl">💎 델타뉴트럴 파밍</div>
				<div className="text-sm opacity-90 max-w-md text-center">
					스테이킹 + 리스테이킹 + LP 수익과 숏 포지션을 결합한 
					안정적인 수익 창출 전략
				</div>
				<div className="text-xs mt-2 text-blue-200">예상 수익률: 연 20~30%</div>
			</button>
			
			<button
				disabled
				className="w-full bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed opacity-70 text-white font-semibold p-6 rounded-xl transition-all duration-200 flex flex-col items-center space-y-4 border border-gray-500 relative"
			>
				<div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">
					Coming Soon
				</div>
				<div className="text-2xl">🌟 솔라나 스테이킹 옵티마이저</div>
				<div className="text-sm opacity-90 max-w-md text-center">
					스테이킹, 리스테이킹, LP 예치를 활용하여 최적의 투자를 지원하는 에이전트
				</div>
				<div className="text-xs mt-2 text-gray-300">준비중</div>
			</button>
		</div>
	);

	const StrategyStartMessage = `안녕하세요! 델타뉴트럴 파밍 전략 에이전트입니다. 🤖

이 전략은 Solana 생태계의 다양한 수익 기회를 활용하여 안정적인 수익을 창출하는 것을 목표로 합니다.

사용하는 프로토콜:
• Staking: Jito, Jupiter
• Restaking: Fragmetric, Solayer
• Yield Trading: Rate-X
• Derivatives: Drift Protocol

투자를 시작하시려면 "투자 시작"이라고 입력해주세요. 전략에 대해 궁금한 점이 있으시다면 언제든 질문해주세요!`;

	return (
		<main className="flex-1 flex flex-row">
			{/* 왼쪽: 채팅 영역 */}
			<div className="flex-1 p-4">
				{selectedStrategy ? (
					<ChatWindow
						endpoint="api/chat"
						emoji="🤖"
						titleText={`${selectedStrategy} 에이전트`}
						placeholder="'투자 시작'이라고 입력하시거나 궁금한 점을 물어보세요..."
						emptyStateComponent={
							<div className="p-4 rounded bg-[#25252d] whitespace-pre-line">
								{StrategyStartMessage}
							</div>
						}
					/>
				) : (
					InfoCard
				)}
			</div>

			{/* 오른쪽: 지갑 정보 */}
			<div className="w-96 bg-gray-900 p-4 flex flex-col gap-4">
				<WalletButton />
				<TokenBalances />
				<TransactionHistory />
			</div>
		</main>
	);
}
