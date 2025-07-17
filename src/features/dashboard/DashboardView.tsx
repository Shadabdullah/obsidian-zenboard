
import React, { useState, useEffect } from "react";
import { Coffee, Settings, Calendar, Clock } from "lucide-react";
import {
  Calendar,
  CheckCircle,
  Target,
  DollarSign,
  Settings,
  Coffee,
} from "lucide-react";

import TodosView from "../todos/TodosView";
import ExpensesView from "../expenses/ExpensesView";
import HabitsView from "../habits/HabitsView";
import CalendarView from "../calendar/CalendarView";

type EnabledFeatures = {
  habitTracker: boolean;
  todoPlanner: boolean;
  calendarPlanner: boolean;
  expenseManager: boolean;
};

type Props = {
  enabledFeatures: EnabledFeatures;
};

export default function DashboardView({ enabledFeatures }: Props) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Set first available tab as active
    if (enabledFeatures.habitTracker) setActiveTab("habits");
    else if (enabledFeatures.expenseManager) setActiveTab("expenses");
    else if (enabledFeatures.todoPlanner) setActiveTab("todos");
    else if (enabledFeatures.calendarPlanner) setActiveTab("calendar");
  }, [enabledFeatures]);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  const tabs = [
    {
      id: "todos",
      label: "📋 ToDos",
      enabled: enabledFeatures.todoPlanner,
      icon: CheckCircle,
    },

    {
      id: "calendar",
      label: "📅 Calendar",
      enabled: enabledFeatures.calendarPlanner,
      icon: Calendar,
    },

    {
      id: "habits",
      label: "🧘 Habit Tracker",
      enabled: enabledFeatures.habitTracker,
      icon: Target,
    },
    {
      id: "expenses",
      label: "💰 Expense Manager",
      enabled: enabledFeatures.expenseManager,
      icon: DollarSign,
    },
  ];

const renderTabContent = () => {
  switch (activeTab) {
    case "habits":
      return <HabitsView />;
    case "expenses":
      return <ExpensesView />;
    case "todos":
      return <TodosView />;
    case "calendar":
      return <CalendarView />;
    default:
      return <div className="text-center py-8">No content available.</div>;
  }
};

return (
  <div className="min-h-screen ">
    {/* Header */}
    <header className="shadow-sm   px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Momentum
          </h1>
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <span className="flex items-center bg-blue-50 px-3 py-1.5 rounded-full">
              <Calendar className="w-4 h-4 mr-2 text-blue-600" />
              {formatDate(currentTime)}
            </span>
            <span className="flex items-center bg-green-50 px-3 py-1.5 rounded-full font-medium">
              <Clock className="w-4 h-4 mr-2 text-green-600" />
              {formatTime(currentTime)}
            </span>
          </div>
        </div>
 <div className="flex items-center space-x-3">
          <a
            href="https://ko-fi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-5 py-2.5 text-sm font-bold  hover:-translate-y-0.5 no-underline"
          >
            <span className="mr-2 text-red-200 animate-pulse">❤️</span>
            <Coffee className="w-4 h-4 mr-2 text-orange-100" />
            SUPPORT ON KO-FI
          </a>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
        </div>
      </div>
    </header>

    {/* Tab Navigation */}
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex space-x-1">
          {tabs
            .filter((tab) => tab.enabled)
            .map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
        </div>
      </div>
    </nav>

    {/* Main Content */}
    <main className=" mx-auto px-6 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {renderTabContent()}
      </div>
    </main>
  </div>
);
}
