import { useState } from 'react';

const functionCategories = {
  'Token Operations': [
    'Deploy SPL Token',
    'Transfer Assets',
    'Balance Check',
    'Stake SOL',
    'Compressed Airdrop'
  ],
  'NFT Operations': [
    'Create Collection',
    'Mint NFT',
    'List NFT',
    'Manage Metadata',
    'Configure Royalty'
  ],
  'DeFi Actions': [
    'Swap Tokens',
    'Create Pool',
    'Add Liquidity',
    'Place Order',
    'Manage Position'
  ],
  'Market Data': [
    'Price Feed',
    'Market Analysis',
    'Token Info',
    'Pool Tracking',
    'Trend Analysis'
  ]
};

interface FunctionsPanelProps {
  onFunctionSelect: (functionName: string) => void;
}

const FunctionsPanel: React.FC<FunctionsPanelProps> = ({ onFunctionSelect }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);

  const handleFunctionClick = (functionName: string) => {
    setSelectedFunction(functionName);
    onFunctionSelect(functionName);
  };

  return (
    <div className="space-y-2">
      {Object.entries(functionCategories).map(([category, functions]) => (
        <div key={category} className="bg-gray-800 rounded-lg overflow-hidden">
          <button
            className="w-full px-4 py-3 text-left text-white font-medium flex justify-between items-center hover:bg-gray-700"
            onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
          >
            <span>{category}</span>
            <span className="transform transition-transform duration-200">
              {expandedCategory === category ? '▼' : '▶'}
            </span>
          </button>
          {expandedCategory === category && (
            <div className="p-2">
              {functions.map((func) => (
                <button
                  key={func}
                  onClick={() => handleFunctionClick(func)}
                  className={`block w-full p-2 text-left rounded text-sm ${
                    selectedFunction === func
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="font-medium">{func}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FunctionsPanel; 