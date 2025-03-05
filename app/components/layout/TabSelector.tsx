interface TabSelectorProps {
  activeTab: 'favorite' | 'protocols';
  onTabChange: (tab: 'favorite' | 'protocols') => void;
}

const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg mb-4">
      <button
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
          activeTab === 'favorite'
            ? 'bg-blue-600 text-white'
            : 'text-gray-400 hover:text-white hover:bg-gray-700'
        }`}
        onClick={() => onTabChange('favorite')}
      >
        Favorite
      </button>
      <button
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
          activeTab === 'protocols'
            ? 'bg-blue-600 text-white'
            : 'text-gray-400 hover:text-white hover:bg-gray-700'
        }`}
        onClick={() => onTabChange('protocols')}
      >
        Protocols
      </button>
    </div>
  );
};

export default TabSelector; 