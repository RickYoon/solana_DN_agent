'use client';

// import { useWallet } from '@solana/wallet-adapter-react';
// import { WalletButton } from '../WalletButton';
import { useEffect, useState } from 'react';
import { serviceInfoMap, ServiceInfo } from './CenterPanel';
import { FavoriteService, getFavorites, addFavorite, removeFavorite, isFavorite } from '@/utils/favorites';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import TabSelector from './TabSelector';

interface LeftPanelProps {
  onServiceSelect: (url: string | undefined) => void;
  onToggleAIChat: () => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ onServiceSelect, onToggleAIChat }) => {
  const [activeTab, setActiveTab] = useState<'favorite' | 'protocols'>('protocols');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<FavoriteService[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const categories = Object.entries(serviceInfoMap).reduce((acc, [domain, info]) => {
    const category = info.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ domain, info });
    return acc;
  }, {} as Record<string, { domain: string; info: ServiceInfo }[]>);

  const filteredCategories = Object.entries(categories).reduce((acc, [category, services]) => {
    const filteredServices = services.filter(({ info }) => 
      info.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      info.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredServices.length > 0) {
      acc[category] = filteredServices;
    }
    return acc;
  }, {} as Record<string, { domain: string; info: ServiceInfo }[]>);

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const handleServiceClick = (url: string, name: string) => {
    setSelectedService(name);
    onServiceSelect(url);
  };

  const toggleFavorite = (domain: string, name: string, category: string) => {
    if (isFavorite(domain)) {
      removeFavorite(domain);
    } else {
      addFavorite({ domain, name, category });
    }
    setFavorites(getFavorites());
  };

  const renderProtocolItem = (domain: string, info: ServiceInfo, isFavoriteItem: boolean = false) => (
    <button
      key={domain}
      onClick={() => handleServiceClick(`https://${domain}`, info.name)}
      className={`block w-full p-3 text-left rounded-lg text-sm ${
        selectedService === info.name 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-300 hover:bg-gray-700'
      }`}
    >
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {info.logoUrl ? (
              <Image
                src={info.logoUrl}
                alt={`${info.name} logo`}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">{info.name.charAt(0)}</span>
              </div>
            )}
            <span className="font-medium">{info.name}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(domain, info.name, info.category);
            }}
            className="p-1 hover:bg-gray-600 rounded"
          >
            {isFavorite(domain) ? (
              <StarIconSolid className="h-4 w-4 text-yellow-400" />
            ) : (
              <StarIcon className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
        {isFavoriteItem ? (
          <>
            <div className="text-xs text-gray-400 line-clamp-2">{info.description}</div>
            <div className="flex items-center space-x-2 mt-2">
              <span className="px-2 py-1 bg-gray-700 text-xs rounded-full text-blue-400">
                {info.category}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="text-xs text-blue-400">{info.category}</div>
            <div className="text-xs text-gray-400 line-clamp-2">{info.description}</div>
          </>
        )}
      </div>
    </button>
  );

  return (
    <div className="w-1/6 bg-gray-900 p-6 min-h-screen overflow-y-auto">
      {/* 로고와 AI 버튼 */}
      <div className="mb-8 flex items-center justify-between">
        <Image
          src="/images/linkrypto-logo.svg"
          alt="Linkrypto"
          width={150}
          height={40}
          className="w-auto"
        />
        <button
          onClick={onToggleAIChat}
          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">AI</span>
        </button>
      </div>

      {/* 탭 선택기 */}
      <div className="mb-6">
        <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {activeTab === 'favorite' ? (
        /* 즐겨찾기 목록 */
        <div className="space-y-3">
          {favorites.length === 0 ? (
            <div className="text-gray-400 text-center py-4">
              즐겨찾기한 프로토콜이 없습니다
            </div>
          ) : (
            favorites.map((favorite) => {
              const serviceInfo = serviceInfoMap[favorite.domain];
              return serviceInfo ? renderProtocolItem(favorite.domain, serviceInfo, true) : null;
            })
          )}
        </div>
      ) : (
        <>
          {/* 검색 입력창 */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="프로토콜 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* 프로토콜 목록 */}
          <div className="space-y-4">
            {Object.entries(filteredCategories).map(([category, services]) => (
              <div key={category} className="bg-gray-800 rounded-lg overflow-hidden">
                <button
                  className="w-full px-4 py-3 text-left text-white font-medium flex justify-between items-center hover:bg-gray-700"
                  onClick={() => toggleCategory(category)}
                >
                  <span>{category}</span>
                  <span className="transform transition-transform duration-200">
                    {expandedCategory === category ? '▼' : '▶'}
                  </span>
                </button>
                {expandedCategory === category && (
                  <div className="p-2 space-y-2">
                    {services.map(({ domain, info }) => renderProtocolItem(domain, info))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LeftPanel; 