/**
 * Copyright (c) 2024 Linkrypto. All rights reserved.
 * This file is part of Linkrypto's proprietary software.
 * Unauthorized use, copying, modification, or distribution is prohibited.
 */

'use client';

import React from 'react';

export default function Home() {
	const protocols = [
		{
			name: 'Raydium',
			description: 'Solana DEX & Liquidity Provider',
			icon: '💱',
			url: 'https://raydium.io'
		},
		{
			name: 'Drift',
			description: 'Perpetual DEX Protocol',
			icon: '📈',
			url: 'https://app.drift.trade'
		},
		{
			name: 'Rate-X',
			description: 'Yield Trading Platform',
			icon: '💹',
			url: 'https://app.rate-x.io'
		},
		{
			name: 'Fragmetric',
			description: 'Solana Restaking Protocol',
			icon: '🔄',
			url: 'https://app.fragmetric.xyz'
		}
	];

	return (
		<main className="flex min-h-screen">
			<div className="flex-1 flex items-center justify-center bg-[#1E1F2E] p-8">
				<div className="max-w-4xl w-full space-y-12">
					{/* 헤더 섹션 */}
					<div className="text-center space-y-4">
						<h1 className="text-4xl font-bold text-white">
							Solana DeFi Navigator
						</h1>
						<p className="text-xl text-gray-400">
							AI-powered companion for seamless DeFi investments across multiple protocols
						</p>
					</div>

					{/* 프로토콜 그리드 */}
					<div className="grid grid-cols-2 gap-6">
						{protocols.map((protocol) => (
							<button
								key={protocol.name}
								className="flex items-center p-6 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-all group"
								onClick={() => window.open(protocol.url, '_blank')}
							>
								<div className="w-12 h-12 flex items-center justify-center mr-4 text-3xl">
									{protocol.icon}
								</div>
								<div className="text-left">
									<h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
										{protocol.name}
									</h3>
									<p className="text-gray-400">
										{protocol.description}
									</p>
								</div>
							</button>
						))}
					</div>

					{/* 시작하기 버튼 */}
					<div className="text-center">
						<button
							onClick={() => {
								const message = "안녕하세요! 솔라나 디파이 투자를 시작하고 싶습니다.";
								// 채팅 메시지 상태 업데이트 및 AI 응답 트리거
								window.postMessage({ type: 'START_CHAT', message }, '*');
							}}
							className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
						>
							Start Investment Journey with AI
						</button>
					</div>

					{/* 특징 섹션 */}
					<div className="grid grid-cols-3 gap-6 text-center">
						<div className="p-6 bg-gray-800/30 rounded-xl">
							<div className="text-3xl mb-4">📊</div>
							<h3 className="text-lg font-semibold text-white mb-2">Real-time Yields</h3>
							<p className="text-gray-400">Live APR/APY tracking across protocols</p>
						</div>
						<div className="p-6 bg-gray-800/30 rounded-xl">
							<div className="text-3xl mb-4">🔄</div>
							<h3 className="text-lg font-semibold text-white mb-2">Smart Routing</h3>
							<p className="text-gray-400">Optimized investment paths for better returns</p>
						</div>
						<div className="p-6 bg-gray-800/30 rounded-xl">
							<div className="text-3xl mb-4">🤖</div>
							<h3 className="text-lg font-semibold text-white mb-2">Guided Process</h3>
							<p className="text-gray-400">Step-by-step assistance for safe investments</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
