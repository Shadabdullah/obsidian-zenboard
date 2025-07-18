
// components/Header.tsx
import { Calendar, Flame, BarChart3 } from 'lucide-react';

interface Props {
  selectedDate: Date;
  currentMonthInView: string;
  onAnalyticsClick: () => void;
}

export const Header: React.FC<Props> = ({ selectedDate, currentMonthInView, onAnalyticsClick }) => (
  <div className="flex items-center justify-between mb-8">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
        <Calendar className="w-6 h-6 text-white" />
      </div>
      <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
        <Flame className="w-6 h-6 text-white" />
      </div>
      <div>
        <h1 className="text-3xl font-bold">{currentMonthInView}</h1>
        <p className="text-gray-400">
          Selected: {selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="bg-gray-800 rounded-xl px-4 py-2">
        <span className="text-sm text-gray-400">Streak</span>
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-xl font-bold">7</span>
        </div>
      </div>
      <button
        onClick={onAnalyticsClick}
        className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center transition-colors"
      >
        <BarChart3 className="w-6 h-6 text-white" />
      </button>
      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
        <span className="text-white text-xl">👑</span>
      </div>
    </div>
  </div>
);
