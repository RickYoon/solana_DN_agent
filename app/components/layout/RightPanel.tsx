'use client';

import React, { useEffect } from 'react';
import { useChat } from 'ai/react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { serviceInfoMap } from '@/app/constants/services';

interface RightPanelProps {
  onServiceSelect: (url: string | undefined) => void;
  onStartInvestment: () => void;
  setSelectedService: (service: string | null) => void;
}

interface StepPhrases {
  [key: number]: string[];
}

interface StepServices {
  [key: number]: string;
}

const RightPanel: React.FC<RightPanelProps> = ({ onServiceSelect, onStartInvestment, setSelectedService }) => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages
  } = useChat({
    api: "/api/chat",
    onResponse(response) {
      console.log('전체 response 객체:', response);
    },
    streamMode: "text",
    onError: (e) => {
      toast(e.message, {
        theme: "dark",
      });
    },
    onFinish: async (message) => {
      const lastAiMessage = message;

      // 각 단계별 확인 문구
      const stepPhrases: StepPhrases = {
        1: [
          '[💡 1단계 완료되면 말씀주세요.]',
          '[💡 1단계 완료되면 말씀해주세요.]',
          '[💡 1단계 완료되면 알려주세요.]',
          '[💡 1단계 완료되면 말씀하세요.]'
        ],
        2: [
          '[💡 2단계 완료되면 말씀주세요.]',
          '[💡 2단계 완료되면 말씀해주세요.]',
          '[💡 2단계 완료되면 알려주세요.]',
          '[💡 2단계 완료되면 말씀하세요.]'
        ],
        3: [
          '[💡 3단계 완료되면 말씀주세요.]',
          '[💡 3단계 완료되면 말씀해주세요.]',
          '[💡 3단계 완료되면 알려주세요.]',
          '[💡 3단계 완료되면 말씀하세요.]'
        ],
        4: [
          '[💡 4단계 완료되면 말씀주세요.]',
          '[💡 4단계 완료되면 말씀해주세요.]',
          '[💡 4단계 완료되면 알려주세요.]',
          '[💡 4단계 완료되면 말씀하세요.]'
        ]
      };

      // 각 단계별 서비스 매핑
      const stepServices: StepServices = {
        1: "raydium.io",
        2: "app.fragmetric.xyz/restake/",
        3: "app.rate-x.io/",
        4: "app.drift.trade/SOL-PERP"
      };

      // 현재 단계 확인
      let currentStep = 0;
      for (const [step, phrases] of Object.entries(stepPhrases)) {
        if (phrases.some((phrase: string) => lastAiMessage?.content.includes(phrase))) {
          currentStep = parseInt(step);
          break;
        }
      }

      // 사용자가 긍정적인 응답을 했는지 확인
      const isPositiveResponse = input && (input.includes('네') || input.includes('완료') || input.includes('시작'));

      if (currentStep > 0 && isPositiveResponse) {
        console.log(`${currentStep}단계 조건 충족! ${stepServices[currentStep]}로 이동합니다.`);
        
        const serviceName = stepServices[currentStep];
        const service = serviceInfoMap[serviceName];
        
        if (service) {
          onServiceSelect(`https://${service.url}`);
          setSelectedService(service.name);
        }
      }
    }
  });

  // 스크롤할 div에 대한 ref 생성
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // 스크롤을 맨 아래로 이동시키는 함수
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // messages가 변경될 때마다 스크롤 실행
  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 초기 메시지 설정
  React.useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: "0",
        role: "assistant",
        content: "DeFi 프로토콜 활용 도우미 입니다. 무엇을 도와드릴까요?"
      }]);
    }
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'START_CHAT') {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'user',
          content: event.data.message
        }]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="fixed h-screen w-full bg-[#343541] text-white flex flex-col border-l border-gray-800">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600'
                  : 'bg-gray-800'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {/* 스크롤 위치를 잡기 위한 빈 div 추가 */}
        <div ref={messagesEndRef} />
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-800 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="메시지를 입력하세요..."
            className="flex-1 bg-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-800"
          >
            전송
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RightPanel; 