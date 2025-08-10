import React from 'react';

interface AnalyticsTabsProps {
  activeTab: 'monthly' | 'overall';
  onTabChange: (tab: 'monthly' | 'overall') => void;
}

const AnalyticsTabs: React.FC<AnalyticsTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-2 mb-8">
      <button
        onClick={() => onTabChange('monthly')}
        className={`px-6 py-3 rounded-xl font-medium transition-colors ${
          activeTab === 'monthly'
            ? 'bg-green-500 text-white'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
      >
        Monthly View
      </button>
      <button
        onClick={() => onTabChange('overall')}
        className={`px-6 py-3 rounded-xl font-medium transition-colors ${
          activeTab === 'overall'
            ? 'bg-green-500 text-white'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
      >
        Overall Progress
      </button>
    </div>
  );
};

export default AnalyticsTabs;
