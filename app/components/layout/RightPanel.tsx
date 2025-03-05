'use client';

import React from 'react';
import { useChat } from 'ai/react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface RightPanelProps {
  onServiceSelect: (url: string | undefined) => void;
}

const JITO_URL = "https://jito.network/";

const RightPanel: React.FC<RightPanelProps> = ({ onServiceSelect }) => {
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
			const sourcesHeader = response.headers.get("x-sources");
			const sources = sourcesHeader
				? JSON.parse(Buffer.from(sourcesHeader, "base64").toString("utf8"))
				: [];
			const messageIndexHeader = response.headers.get("x-message-index");
			// if (sources.length && messageIndexHeader !== null) {
			// 	setSourcesForMessages({
			// 		...sourcesForMessages,
			// 		[messageIndexHeader]: sources,
			// 	});
			// }
		},
		streamMode: "text",
		onError: (e) => {
			toast(e.message, {
				theme: "dark",
			});
		},
		onFinish: async (message) => {
			// Jito 웹사이트 로드
			if (message.content.toLowerCase().includes('jito') || 
				input.toLowerCase().includes('jito') ||
				message.content.includes('웹 사이트') ||
				message.content.includes('사이트 이동')) {
				onServiceSelect(JITO_URL);
				setMessages(prev => [...prev, {
					id: Date.now().toString(),
					content: "✅ Jito 웹사이트를 로드했습니다.",
					role: "assistant"
				}]);
			}
		}
	});

  // 초기 메시지 설정
  React.useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: "0",
        role: "assistant",
        content: "Jito 웹사이트를 보시려면 'jito' 또는 'Jito'를 포함한 메시지를 입력해주세요."
      }]);
    }
  }, []);


  return (
    <div className="h-screen w-full bg-[#343541] text-white flex flex-col border-l border-gray-800">
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