
// ========================== pages/AnalyticsPage.tsx ==========================
import React from 'react';
import { Flame, BarChart3 } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Analytics</h1>
      </div>
      <div className="space-y-4">
        <div className="bg-gray-800 rounded-2xl p-4">
          <h2 className="text-xl font-semibold text-white mb-2">Streak</h2>
          <div className="flex items-center gap-2">
            <Flame className="text-orange-500 w-6 h-6" />
            <span className="text-white text-xl font-bold">7 days</span>
          </div>
        </div>
        {/* You can add more analytics like charts, summaries, trends here */}
      </div>
    </div>
  );
};
