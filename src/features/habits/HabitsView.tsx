import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Calendar, Flame, Plus, Pause, RotateCcw, BarChart3, X } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  completed: boolean;
  type: 'checkbox' | 'counter' | 'timer';
  counterValue?: number;
  targetCount?: number;
  timerDuration?: number; // in seconds
  timerElapsed?: number;
  isTimerRunning?: boolean;
}

interface DayData {
  date: Date;
  taskCount: number;
  isToday: boolean;
  completedTasks: number;
}

const HabitView: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonthInView, setCurrentMonthInView] = useState<string>('');
  const [timerIntervals, setTimerIntervals] = useState<Map<string, NodeJS.Timeout>>(new Map());
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
  const [analyticsTab, setAnalyticsTab] = useState<'monthly' | 'overall'>('monthly');
  
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Go to Gym',
      subtitle: 'Stay Strong',
      icon: '🏋️',
      color: 'bg-green-500',
      completed: false,
      type: 'checkbox'
    },
    {
      id: '2',
      title: 'Meditate',
      subtitle: 'Focus time',
      icon: '🧘',
      color: 'bg-orange-500',
      completed: false,
      type: 'timer',
      timerDuration: 1800, // 30 minutes
      timerElapsed: 0,
      isTimerRunning: false
    },
    {
      id: '3',
      title: 'Reading',
      subtitle: 'Daily habit',
      icon: '📚',
      color: 'bg-purple-500',
      completed: false,
      type: 'checkbox'
    },
    {
      id: '4',
      title: 'Pray',
      subtitle: 'Spiritual time',
      icon: '🙏',
      color: 'bg-blue-500',
      completed: false,
      type: 'checkbox'
    },
    {
      id: '5',
      title: 'Walking',
      subtitle: 'Steps tracker',
      icon: '🚶',
      color: 'bg-red-500',
      completed: false,
      type: 'counter',
      counterValue: 3,
      targetCount: 10
    },
    {
      id: '6',
      title: 'Journal',
      subtitle: 'Write thoughts',
      icon: '📝',
      color: 'bg-yellow-500',
      completed: false,
      type: 'checkbox'
    }
  ]);

  // Generate calendar data for 2 years
  const generateCalendarData = (): DayData[] => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setFullYear(today.getFullYear() - 1);
    
    const endDate = new Date(today);
    endDate.setFullYear(today.getFullYear() + 1);
    
    const days: DayData[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const taskCount = Math.floor(Math.random() * 6) + 1;
      const completedTasks = Math.floor(Math.random() * taskCount);
      
      days.push({
        date: new Date(currentDate),
        taskCount,
        isToday: currentDate.toDateString() === today.toDateString(),
        completedTasks
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  // Generate analytics data for tasks
  const generateAnalyticsData = () => {
    const today = new Date();
    const analyticsData: { [key: string]: { monthly: number[][], overall: number[][] } } = {};
    
    tasks.forEach(task => {
      const monthlyData = [];
      const overallData = [];
      
      // Generate monthly data (current month - 7x5 grid for ~31 days)
      for (let week = 0; week < 5; week++) {
        const weekData = [];
        for (let day = 0; day < 7; day++) {
          const dayNumber = week * 7 + day + 1;
          if (dayNumber <= 31) {
            // Random completion for demo (you'd replace with real data)
            const isCompleted = Math.random() > 0.3;
            weekData.push(isCompleted ? 1 : 0);
          } else {
            weekData.push(-1); // Empty day
          }
        }
        monthlyData.push(weekData);
      }
      
      // Generate overall data (longer period - 15x7 grid for ~100 days)
      for (let week = 0; week < 15; week++) {
        const weekData = [];
        for (let day = 0; day < 7; day++) {
          const isCompleted = Math.random() > 0.25;
          weekData.push(isCompleted ? 1 : 0);
        }
        overallData.push(weekData);
      }
      
      analyticsData[task.id] = { monthly: monthlyData, overall: overallData };
    });
    
    return analyticsData;
  };

  const [analyticsData] = useState(generateAnalyticsData());
  const [calendarData] = useState<DayData[]>(generateCalendarData());

  useEffect(() => {
    // Scroll to today's date on mount
    if (scrollContainerRef.current) {
      const todayIndex = calendarData.findIndex(day => day.isToday);
      if (todayIndex !== -1) {
        const dayWidth = 80;
        const containerWidth = scrollContainerRef.current.offsetWidth;
        const scrollPosition = todayIndex * dayWidth - containerWidth / 2 + dayWidth / 2;
        scrollContainerRef.current.scrollLeft = Math.max(0, scrollPosition);
      }
    }
  }, [calendarData]);

  // Update current month in view based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollLeft = scrollContainerRef.current.scrollLeft;
        const dayWidth = 80;
        const visibleDayIndex = Math.floor(scrollLeft / dayWidth);
        
        if (calendarData[visibleDayIndex]) {
          const visibleDate = calendarData[visibleDayIndex].date;
          const monthYear = visibleDate.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          });
          setCurrentMonthInView(monthYear);
        }
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      // Set initial month
      handleScroll();
      
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [calendarData]);

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const incrementCounter = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId && task.type === 'counter') {
        const newValue = (task.counterValue || 0) + 1;
        const completed = newValue >= (task.targetCount || 0);
        return { 
          ...task, 
          counterValue: newValue, 
          completed,
          subtitle: completed ? 'Target reached!' : `${newValue}/${task.targetCount} completed`
        };
      }
      return task;
    }));
  };

  const toggleTimer = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId && task.type === 'timer') {
        const newRunningState = !task.isTimerRunning;
        
        if (newRunningState) {
          // Start timer
          const interval = setInterval(() => {
            setTasks(currentTasks => currentTasks.map(t => {
              if (t.id === taskId) {
                const newElapsed = (t.timerElapsed || 0) + 1;
                const completed = newElapsed >= (t.timerDuration || 0);
                return {
                  ...t,
                  timerElapsed: newElapsed,
                  completed,
                  isTimerRunning: !completed,
                  subtitle: completed ? 'Session complete!' : formatTime(newElapsed)
                };
              }
              return t;
            }));
          }, 1000);
          
          setTimerIntervals(prev => new Map(prev).set(taskId, interval));
        } else {
          // Stop timer
          const interval = timerIntervals.get(taskId);
          if (interval) {
            clearInterval(interval);
            setTimerIntervals(prev => {
              const newMap = new Map(prev);
              newMap.delete(taskId);
              return newMap;
            });
          }
        }
        
        return { ...task, isTimerRunning: newRunningState };
      }
      return task;
    }));
  };

  const resetTimer = (taskId: string) => {
    const interval = timerIntervals.get(taskId);
    if (interval) {
      clearInterval(interval);
      setTimerIntervals(prev => {
        const newMap = new Map(prev);
        newMap.delete(taskId);
        return newMap;
      });
    }
    
    setTasks(tasks.map(task => {
      if (task.id === taskId && task.type === 'timer') {
        return { 
          ...task, 
          timerElapsed: 0, 
          isTimerRunning: false,
          completed: false,
          subtitle: 'Focus time'
        };
      }
      return task;
    }));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderDots = (total: number, completed: number) => {
    return (
      <div className="flex gap-1 mt-2">
        {Array.from({ length: Math.min(total, 5) }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i < completed ? 'bg-green-400' : i < total ? 'bg-cyan-400' : 'bg-gray-600'
            }`}
          />
        ))}
        {total > 5 && (
          <span className="text-xs text-gray-400 ml-1">+{total - 5}</span>
        )}
      </div>
    );
  };

  const scrollCalendar = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'right' ? scrollAmount : -scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const getTasksForDate = (date: Date) => {
    // For demo purposes, show current tasks for selected date
    // In real app, this would filter tasks by date
    return tasks;
  };

  const selectedDateTasks = getTasksForDate(selectedDate);
  const activeTasks = selectedDateTasks.filter(task => !task.completed);
  const completedTasks = selectedDateTasks.filter(task => task.completed);

  const renderTaskButton = (task: Task) => {
    switch (task.type) {
      case 'checkbox':
        return (
          <button
            onClick={() => toggleTask(task.id)}
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
              task.completed 
                ? 'bg-green-500 border-green-500'
                : 'border-gray-600 hover:border-green-400'
            }`}
          >
            {task.completed && <span className="text-white font-bold text-xl">✓</span>}
          </button>
        );
      
      case 'counter':
        return (
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-lg font-bold text-white">
                {task.counterValue || 0}/{task.targetCount || 0}
              </div>
            </div>
            <button
              onClick={() => incrementCounter(task.id)}
              className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
              disabled={task.completed}
            >
              <Plus className="w-6 h-6 text-white" />
            </button>
          </div>
        );
      
      case 'timer':
        return (
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-lg font-bold text-white">
                {formatTime(task.timerElapsed || 0)}
              </div>
              <div className="text-sm text-gray-400">
                / {formatTime(task.timerDuration || 0)}
              </div>
            </div>
            <button
              onClick={() => toggleTimer(task.id)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                task.isTimerRunning 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
              disabled={task.completed}
            >
              {task.isTimerRunning ? 
                <Pause className="w-6 h-6 text-white" /> : 
                <Play className="w-6 h-6 text-white" />
              }
            </button>
            {(task.timerElapsed || 0) > 0 && (
              <button
                onClick={() => resetTimer(task.id)}
                className="w-10 h-10 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{currentMonthInView || 'July 2025'}</h1>
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
              onClick={() => setShowAnalytics(true)}
              className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center transition-colors"
            >
              <BarChart3 className="w-6 h-6 text-white" />
            </button>
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">👑</span>
            </div>
          </div>
        </div>

        {/* Scrollable Calendar */}
        <div className="mb-8 relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Calendar</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => scrollCalendar('left')}
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scrollCalendar('right')}
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {calendarData.map((day, index) => (
              <div
                key={index}
                onClick={() => selectDate(day.date)}
                className={`flex-shrink-0 w-16 h-20 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                  day.isToday
                    ? 'bg-orange-500 text-white shadow-lg'
                    : selectedDate.toDateString() === day.date.toDateString()
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="text-xs font-medium">
                  {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className="text-lg font-bold">{day.date.getDate()}</span>
                {renderDots(day.taskCount, day.completedTasks)}
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-8">
          {/* Active Tasks Column */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Active Tasks</h2>
              <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                {activeTasks.length} active
              </span>
            </div>
            <div className="space-y-4">
              {activeTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-gray-800 rounded-2xl p-6 flex items-center justify-between hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 ${task.color} rounded-2xl flex items-center justify-center`}
                    >
                      <span className="text-white text-2xl">{task.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{task.title}</h3>
                      <p className="text-gray-400">{task.subtitle}</p>
                    </div>
                  </div>
                  
                  {renderTaskButton(task)}
                </div>
              ))}
              
              <button className="w-full bg-gray-800 hover:bg-gray-700 rounded-2xl p-6 flex items-center justify-center gap-3 transition-colors border-2 border-dashed border-gray-600">
                <Plus className="w-6 h-6 text-gray-400" />
                <span className="text-gray-400 font-medium">Add new task</span>
              </button>
            </div>
          </div>

          {/* Completed Tasks Column */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Completed</h2>
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                {completedTasks.length} done
              </span>
            </div>
            <div className="space-y-4">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-gray-800 rounded-2xl p-6 flex items-center justify-between opacity-75 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 ${task.color} rounded-2xl flex items-center justify-center opacity-75`}
                    >
                      <span className="text-white text-2xl">{task.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg line-through">
                        {task.title}
                      </h3>
                      <p className="text-gray-400">{task.subtitle}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                  >
                    <span className="text-white font-bold text-xl">✓</span>
                  </button>
                </div>
              ))}
              
              {completedTasks.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🎉</span>
                  </div>
                  <p className="text-lg">No completed tasks yet</p>
                  <p className="text-sm">Complete tasks to see them here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Analytics Modal */}
        {showAnalytics && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Analytics</h2>
                <button
                  onClick={() => setShowAnalytics(false)}
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setAnalyticsTab('monthly')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    analyticsTab === 'monthly'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setAnalyticsTab('overall')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    analyticsTab === 'overall'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  Overall
                </button>
              </div>

              {/* Analytics Content */}
              {analyticsTab === 'monthly' ? (
                <div className="grid grid-cols-2 gap-6">
                  {tasks.map((task) => (
                    <div key={task.id} className="bg-gray-800 rounded-2xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 ${task.color} rounded-xl flex items-center justify-center`}>
                          <span className="text-white text-lg">{task.icon}</span>
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{task.title}</h3>
                          <p className="text-gray-400 text-sm">
                            {analyticsData[task.id]?.monthly.flat().filter(day => day === 1).length || 0} Days
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1">
                        {analyticsData[task.id]?.monthly.flat().map((day, index) => (
                          <div
                            key={index}
                            className={`w-4 h-4 rounded-sm ${
                              day === 1
                                ? task.color
                                : day === 0
                                ? 'bg-gray-700'
                                : 'bg-transparent'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  {tasks.map((task) => (
                    <div key={task.id} className="bg-gray-800 rounded-2xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 ${task.color} rounded-xl flex items-center justify-center`}>
                          <span className="text-white text-lg">{task.icon}</span>
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{task.title}</h3>
                          <p className="text-gray-400 text-sm">
                            {analyticsData[task.id]?.overall.flat().filter(day => day === 1).length || 0} Days
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1">
                        {analyticsData[task.id]?.overall.flat().map((day, index) => (
                          <div
                            key={index}
                            className={`w-4 h-4 rounded-sm ${
                              day === 1
                                ? task.color
                                : 'bg-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitView;
