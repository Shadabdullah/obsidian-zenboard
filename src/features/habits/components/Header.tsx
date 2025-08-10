import React from 'react';
import { Calendar, Flame, BarChart3, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  currentView: 'habits' | 'analytics';
  currentMonthInView: string;
  selectedDate: Date;
  onViewChange: (view: 'habits' | 'analytics') => void;
}

const Header: React.FC<HeaderProps> = ({
  currentView,
  currentMonthInView,
  selectedDate,
  onViewChange
}) => {
  return (
    <div className="relative">
      {/* iOS-style header background with blur effect */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 rounded-t-2xl" />
      
      <div className="relative px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center gap-4">
            {/* Back button - iOS style */}
            {currentView === 'analytics' && (
              <button
                onClick={() => onViewChange('habits')}
                className={`
                  w-10 h-10 rounded-full bg-gray-100/80 hover:bg-gray-200/80
                  flex items-center justify-center transition-all duration-200 ease-out
                  active:scale-95 hover:shadow-sm
                  backdrop-blur-sm
                `}
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}
            
            {/* App icons - iOS style with shadows */}
            <div className="flex items-center gap-3">
              <div 
                className={`
                  w-11 h-11 bg-gradient-to-br from-orange-400 to-orange-600 
                  rounded-xl flex items-center justify-center
                  shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30
                  transition-all duration-200 hover:scale-105 active:scale-95
                `}
              >
                <Calendar className="w-5 h-5 text-white" />
              </div>
              
              <div 
                className={`
                  w-11 h-11 bg-gradient-to-br from-red-400 via-orange-500 to-yellow-500
                  rounded-xl flex items-center justify-center
                  shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30
                  transition-all duration-200 hover:scale-105 active:scale-95
                `}
              >
                <Flame className="w-5 h-5 text-white" />
              </div>
            </div>
            
            {/* Title section with iOS typography */}
            <div className="ml-2">
              <h1 className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">
                {currentView === 'analytics' ? 'Analytics' : currentMonthInView || 'July 2025'}
              </h1>
              <p className="text-sm text-gray-600 font-medium leading-tight mt-0.5">
                {currentView === 'analytics' ? 'Track your progress' : 
                  `${selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}`
                }
              </p>
            </div>
          </div>
          
          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Streak card - iOS style */}
            <div 
              className={`
                bg-white/90 backdrop-blur-sm border border-gray-200/60
                rounded-2xl px-4 py-3 shadow-sm hover:shadow-md
                transition-all duration-200 hover:scale-[1.02]
              `}
            >
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">
                Streak
              </span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-5 h-5 bg-gradient-to-br from-red-400 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                  <Flame className="w-3 h-3 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 leading-none">7</span>
              </div>
            </div>
            
            {/* Analytics toggle button */}
            <button
              onClick={() => onViewChange(currentView === 'analytics' ? 'habits' : 'analytics')}
              className={`
                w-12 h-12 rounded-2xl flex items-center justify-center
                transition-all duration-200 ease-out active:scale-95
                ${currentView === 'analytics' 
                  ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30' 
                  : 'bg-white/90 backdrop-blur-sm border border-gray-200/60 hover:bg-gray-50/90 shadow-sm hover:shadow-md'
                }
              `}
            >
              <BarChart3 className={`w-5 h-5 ${
                currentView === 'analytics' ? 'text-white' : 'text-gray-700'
              }`} />
            </button>
            
            {/* Profile avatar */}
            <div 
              className={`
                w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500
                rounded-full flex items-center justify-center
                shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30
                transition-all duration-200 hover:scale-105 active:scale-95
                border-2 border-white/50
              `}
            >
              <span className="text-white text-lg">👑</span>
            </div>
          </div>
        </div>
        
        {/* iOS-style navigation indicator */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-300 rounded-full opacity-30" />
      </div>
    </div>
  );
};

export default Header;
