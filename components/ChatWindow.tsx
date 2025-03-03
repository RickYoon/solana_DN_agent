"use client";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Message } from "ai";
import { useChat } from "ai/react";
import { useRef, useState, ReactElement, useEffect } from "react";
import type { FormEvent } from "react";
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction, clusterApiUrl } from '@solana/web3.js';

import { ChatMessageBubble } from "@/components/ChatMessageBubble";
import { calculateTotalAnnualYield } from "@/utils/calculations";

export function ChatWindow(props: {
	endpoint: string;
	emptyStateComponent: ReactElement;
	placeholder?: string;
	titleText?: string;
	emoji?: string;
}) {
	const messageContainerRef = useRef<HTMLDivElement | null>(null);
	const { publicKey, signTransaction, connected } = useWallet();

	const {
		endpoint,
		emptyStateComponent,
		placeholder,
		titleText = "An LLM",
		emoji,
	} = props;

	const [sourcesForMessages, setSourcesForMessages] = useState<Record<string, any>>({});

	const formatCurrency = (amount: number): string => {
		return new Intl.NumberFormat('ko-KR', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(amount);
	};

	const formatYieldMessage = (amount: number): string => {
		const {
			totalYield,
			dailyYield,
			components: {
				stakingYield,
				restakingBonus,
				rateXYield,
				shortYield
			}
		} = calculateTotalAnnualYield(amount);

		return `🔹 롱 포지션 상세
				기본 스테이킹 이율: 12.5% (${formatCurrency(stakingYield)})
				리스테이킹 보너스: Fragmetric F point x4 (${formatCurrency(restakingBonus)})
				Rate-X LP 수익: 연 8.6% + 4x Rate point (${formatCurrency(rateXYield)})

				🔹 숏 포지션
				펀딩피 수익: 연 8.6% (${formatCurrency(shortYield)})

				📈 예상 수익률 계산
				예상 총 수익률: 연 32.7%
				일 수익: ${formatCurrency(dailyYield)}
				연 수익: ${formatCurrency(totalYield)}

				💡 투자 실행을 시작할까요?`;
					};

					const handleInvestmentExecution = async () => {
						if (!connected) {
							setMessages(prev => [...prev, {
								id: (prev.length + 1).toString(),
								content: "투자를 시작하기 전에 지갑을 연결해주세요. 우측 상단의 'Select Wallet' 버튼을 클릭하여 지갑을 연결할 수 있습니다.",
								role: "assistant"
							} as Message]);
							return;
						}
				
						if (!publicKey) {
							setMessages(prev => [...prev, {
								id: (prev.length + 1).toString(),
								content: "지갑이 정상적으로 연결되지 않았습니다. 지갑을 다시 연결해주세요.",
								role: "assistant"
							} as Message]);
							return;
						}
				
						try {
							setMessages(prev => [...prev, {
								id: (prev.length + 1).toString(),
								content: "지갑이 연결되었습니다. 서명을 요청합니다...",
								role: "assistant"
							} as Message]);
				
							// Solana devnet에 연결
							const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
							
							// 빈 트랜잭션 생성
							const transaction = new Transaction();
							
							// 최근 블록해시 가져오기
							const { blockhash } = await connection.getLatestBlockhash();
							transaction.recentBlockhash = blockhash;
							transaction.feePayer = publicKey;

							if (!signTransaction) {
								throw new Error("서명 기능을 사용할 수 없습니다.");
							}
				
							await signTransaction(transaction);
							
							setMessages(prev => [...prev, {
								id: (prev.length + 1).toString(),
								content: "✅ 서명이 성공적으로 완료되었습니다. 실제 투자는 아직 진행되지 않았습니다.",
								role: "assistant"
							} as Message]);
				
						} catch (error) {
							console.error("Signature error:", error);
							setMessages(prev => [...prev, {
								id: (prev.length + 1).toString(),
								content: `❌ 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다"}. 다시 시도해주세요.`,
								role: "assistant"
							} as Message]);
						}
					};

	const {
		messages,
		input,
		setInput,
		handleInputChange,
		handleSubmit,
		isLoading: chatEndpointIsLoading,
		setMessages,
	} = useChat({
		api: endpoint,
		onResponse(response) {
			const sourcesHeader = response.headers.get("x-sources");
			const sources = sourcesHeader
				? JSON.parse(Buffer.from(sourcesHeader, "base64").toString("utf8"))
				: [];
			const messageIndexHeader = response.headers.get("x-message-index");
			if (sources.length && messageIndexHeader !== null) {
				setSourcesForMessages({
					...sourcesForMessages,
					[messageIndexHeader]: sources,
				});
			}
		},
		streamMode: "text",
		onError: (e) => {
			toast(e.message, {
				theme: "dark",
			});
		},
		onFinish: async (message) => {
			// 투자 실행 메시지 처리
			if (message.content.includes("투자 실행을 시작할까요?")) {
				await handleInvestmentExecution();
			}

			// 기존의 투자 금액 계산 로직
			const amountMatch = message.content.match(/(\d+)\s*USDC로 투자/);
			if (amountMatch) {
				const amount = parseInt(amountMatch[1]);
				setMessages(prev => [...prev, {
					id: (prev.length + 1).toString(),
					content: formatYieldMessage(amount),
					role: "assistant"
				} as Message]);
			}
		}
	});

	// 스크롤을 맨 아래로 이동시키는 함수
	const scrollToBottom = () => {
		if (messageContainerRef.current) {
			messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
		}
	};

	// 새 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// 시작 화면 컴포넌트
	const StartScreen = () => (
		<div className="flex flex-col items-center w-full max-w-3xl mx-auto p-8 text-white">
			<div className="text-center space-y-6 mb-12">
				<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
					Fistack : Stack Finance for Best Yield
				</h1>
				<p className="text-xl text-gray-300">👨‍💼 투자 전략 도우미</p>
			</div>
			
			<div className="w-full space-y-6">
				<div className="text-center">
					<h2 className="text-2xl font-semibold mb-8 text-gray-200">📊 투자 전략을 선택하세요</h2>
				</div>

				<button
					onClick={() => {
						setMessages([
							{
								id: "0",
								content: `이 전략은 Solana 생태계의 다양한 수익 기회를 활용하여 안정적인 수익을 창출하는 것을 목표로 합니다.

사용하는 프로토콜:
• Staking: Jito, Jupiter
• Restaking: Fragmetric, Solayer
• Yield Trading: Rate-X
• Derivatives: Drift Protocol

투자를 시작하시려면 "투자 시작"이라고 입력해주세요.`,
								role: "assistant"
							} as Message
						]);
					}}
					className="w-full bg-[#40414f] hover:bg-[#4a4b55] text-white p-6 rounded-xl transition-all duration-200 flex flex-col items-center space-y-4 border border-gray-600"
				>
					<div className="text-2xl">💎 델타뉴트럴 파밍</div>
					<div className="text-sm text-gray-300 max-w-md text-center">
						스테이킹 + 리스테이킹 + LP 수익과 숏 포지션을 결합한 
						안정적인 수익 창출 전략
					</div>
					<div className="text-xs text-blue-400 mt-2">
						예상 수익률: 연 20~30%
					</div>
				</button>
				
				<button
					disabled
					className="w-full bg-[#2d2d3a] text-gray-400 p-6 rounded-xl transition-all duration-200 flex flex-col items-center space-y-4 border border-gray-700 relative cursor-not-allowed"
				>
					<div className="absolute top-2 right-2 bg-yellow-500/80 text-black text-xs px-2 py-1 rounded-full">
						Coming Soon
					</div>
					<div className="text-2xl">🌟 솔라나 스테이킹 옵티마이저</div>
					<div className="text-sm text-gray-500 max-w-md text-center">
						스테이킹, 리스테이킹, LP 예치를 최적의 비율로 분배하여
						최대 수익을 달성하는 전략
					</div>
					<div className="text-xs text-gray-600">준비중</div>
				</button>
			</div>

			<div className="text-center text-sm text-gray-500 mt-12">
				* 연결된 디파이 : fragmetric, jito, drfit
			</div>
		</div>
	);

	return (
		<div className="flex flex-col h-full bg-[#343541] border-0">
			<div 
				ref={messageContainerRef}
				className={`flex-1 overflow-y-auto scroll-smooth ${messages.length > 0 ? 'pb-36' : ''}`}
				style={{ maxHeight: 'calc(100vh - 80px)' }}
			>
				{messages.length === 0 ? (
					<StartScreen />
				) : (
					<div className="flex flex-col w-full">
						{messages.map((message, index) => (
							<ChatMessageBubble
								key={message.id}
								message={message}
								aiEmoji={emoji}
								sources={sourcesForMessages[index.toString()] ?? []}
							/>
						))}
						{chatEndpointIsLoading && (
							<div className="px-4 py-2">
								<div className="animate-pulse flex space-x-2">
									<div className="h-2 w-2 bg-gray-500 rounded-full"></div>
									<div className="h-2 w-2 bg-gray-500 rounded-full"></div>
									<div className="h-2 w-2 bg-gray-500 rounded-full"></div>
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			<div className="border-t border-gray-700/50 bg-[#343541] fixed bottom-0 left-0 right-0 z-10">
				<div className="max-w-3xl mx-auto p-4">
					<form onSubmit={async (e) => {
						e.preventDefault();
						if (messageContainerRef.current) {
							messageContainerRef.current.classList.add("grow");
						}
						if (!messages.length) {
							await new Promise((resolve) => setTimeout(resolve, 300));
						}
						if (chatEndpointIsLoading) {
							return;
						}
						// 메시지 전송 시 스크롤을 맨 아래로 이동
						setTimeout(() => {
							messageContainerRef.current?.scrollTo({
								top: messageContainerRef.current.scrollHeight,
								behavior: 'smooth'
							});
						}, 100);
						handleSubmit(e);
					}} className="flex items-end gap-3 relative">
						<input
							className="w-full resize-none bg-[#40414F] rounded-lg border border-gray-700/50 focus:border-gray-500 focus:ring-0 text-white text-sm p-3 pr-12 shadow-lg"
							value={input}
							placeholder="메시지를 입력하세요"
							onChange={handleInputChange}
						/>
						<button
							type="submit"
							className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-200 transition-colors disabled:hover:text-gray-400"
							disabled={chatEndpointIsLoading}
						>
							{chatEndpointIsLoading ? (
								<div role="status" className="flex justify-center">
									<svg
										className="w-4 h-4 animate-spin"
										viewBox="0 0 100 101"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" opacity="0.3"/>
										<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
									</svg>
								</div>
							) : (
								<div className="w-4 h-4">
									<svg
										stroke="currentColor"
										fill="none"
										strokeWidth="2"
										viewBox="0 0 24 24"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="w-full h-full"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path d="M22 2L11 13"></path>
										<path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
									</svg>
								</div>
							)}
						</button>
					</form>
				</div>
			</div>

			<ToastContainer />
		</div>
	);
}
