
import React, { useState, useEffect } from "react";
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
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-bold">ZenTask</h1>
            <div className="flex items-center space-x-4 text-sm">
              <span className="flex items-center">📅 {formatDate(currentTime)}</span>
              <span>{formatTime(currentTime)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://ko-fi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center transition-colors"
            >
              <Coffee className="w-4 h-4 mr-1" />
              Support on Ko-fi
            </a>

            <button className="flex items-center transition-colors">
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="border-b px-6">
        <div className="flex space-x-1">
          {tabs
            .filter((tab) => tab.enabled)
            .map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? "border-black"
                    : "border-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">{renderTabContent()}</main>
    </div>
  );
}
