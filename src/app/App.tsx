import React, { useState, useEffect } from "react";
import { Clock, Calendar, Flag, Tag, CheckCircle2, Circle, Plus, Search, Filter } from "lucide-react";
import '../../styles.css'; // Instead of styles.css


interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  frequency: string;
  category: string;
  priority: string;
  completed: boolean;
}

const tasksData = {
  "tasks": [
    {
      "id": "1",
      "title": "Business meeting",
      "description": "Call about project edits",
      "date": "2025-07-17",
      "time": "10:00",
      "frequency": "once",
      "category": "work",
      "priority": "high",
      "completed": false
    },
    {
      "id": "2",
      "title": "Review quarterly reports",
      "description": "Analyze Q2 performance metrics and prepare summary",
      "date": "2025-07-17",
      "time": "14:30",
      "frequency": "once",
      "category": "work",
      "priority": "medium",
      "completed": false
    },
    {
      "id": "3",
      "title": "Team standup",
      "description": "Daily development team sync",
      "date": "2025-07-18",
      "time": "09:00",
      "frequency": "daily",
      "category": "work",
      "priority": "high",
      "completed": false
    },
    {
      "id": "4",
      "title": "Grocery shopping",
      "description": "Buy ingredients for weekend dinner party",
      "date": "2025-07-18",
      "time": "16:00",
      "frequency": "weekly",
      "category": "personal",
      "priority": "low",
      "completed": false
    },
    {
      "id": "5",
      "title": "Doctor appointment",
      "description": "Annual health checkup",
      "date": "2025-07-19",
      "time": "11:00",
      "frequency": "once",
      "category": "health",
      "priority": "high",
      "completed": false
    },
    {
      "id": "6",
      "title": "Project proposal presentation",
      "description": "Present new mobile app concept to stakeholders",
      "date": "2025-07-20",
      "time": "15:00",
      "frequency": "once",
      "category": "work",
      "priority": "high",
      "completed": false
    },
    {
      "id": "7",
      "title": "Workout session",
      "description": "Upper body strength training",
      "date": "2025-07-20",
      "time": "07:00",
      "frequency": "daily",
      "category": "fitness",
      "priority": "medium",
      "completed": false
    },
    {
      "id": "8",
      "title": "Client follow-up",
      "description": "Send project updates to key clients",
      "date": "2025-07-15",
      "time": "10:00",
      "frequency": "once",
      "category": "work",
      "priority": "high",
      "completed": false
    },
    {
      "id": "9",
      "title": "Code review",
      "description": "Review pull requests from team members",
      "date": "2025-07-17",
      "time": "13:00",
      "frequency": "once",
      "category": "work",
      "priority": "medium",
      "completed": true
    },
    {
      "id": "10",
      "title": "Monthly budget review",
      "description": "Analyze expenses and update financial plan",
      "date": "2025-07-25",
      "time": "19:00",
      "frequency": "monthly",
      "category": "finance",
      "priority": "medium",
      "completed": false
    }
  ]
};


export default function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState("today");

  useEffect(() => {
    setTasks(tasksData.tasks);
  }, []);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const filterTasks = (tab: string) => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    switch (tab) {
      case 'today': return tasks.filter(t => t.date === today && !t.completed);
      case 'tomorrow': return tasks.filter(t => t.date === tomorrow);
      case 'upcoming': return tasks.filter(t => t.date > tomorrow);
      case 'due': return tasks.filter(t => t.date < today && !t.completed);
      default: return tasks;
    }
  };

  const getCompletedTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => task.date === today && task.completed);
  };

  const getTabCount = (tab: string) => filterTasks(tab).length;

  const filteredTasks = filterTasks(activeTab);
  const completedTasks = getCompletedTasks();

  const TaskCard = ({ task, showCheckbox = false }: { task: Task; showCheckbox?: boolean }) => (
    <div className="group relative border-2 rounded-xl p-4 transition-all duration-300 hover:border-opacity-80 min-w-0 theme-border theme-bg">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold mb-1 group-hover:opacity-80 transition-opacity duration-300 truncate theme-text">
            {task.title}
          </h3>
          <p className="text-sm opacity-70 line-clamp-2 theme-text-faint">{task.description}</p>
        </div>
        {showCheckbox && (
          <button
            onClick={() => toggleTask(task.id)}
            className="flex-shrink-0 hover:scale-110 transition-transform duration-200 mt-1"
          >
            <Circle className="w-5 h-5 opacity-60 hover:opacity-100" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-xs theme-text">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 opacity-60" />
            <span className="font-medium">{task.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 opacity-60" />
            <span className="font-medium">{task.time}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="px-2 py-1 border rounded-md text-xs font-medium uppercase tracking-wide theme-border theme-text">
            {task.priority}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 text-xs">
        <span className="px-2 py-1 border rounded-md font-medium capitalize theme-border theme-text">
          {task.category}
        </span>
        <span className="opacity-60 font-medium capitalize theme-text-faint">
          {task.frequency}
        </span>
      </div>
    </div>
  );

  const CompletedTaskCard = ({ task }: { task: Task }) => (
    <div className="border-2 rounded-xl p-4 opacity-60 theme-border theme-bg">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold line-through mb-1 truncate theme-text" />
          <p className="text-sm line-through opacity-70 line-clamp-2 theme-text-faint">
            {task.description}
          </p>
          <div className="flex items-center justify-between mt-2 text-xs theme-text">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span className="font-medium">{task.time}</span>
            </div>
            <span className="px-2 py-1 border rounded-md text-xs font-medium uppercase tracking-wide theme-border">
              DONE
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div id="zentask-container" className="min-h-screen theme-bg theme-text">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-black mb-2 theme-text">ZenTask</h1>
              <p className="text-xl opacity-70 theme-text-faint">
                Transform your productivity with elegant task management
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 opacity-60" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="pl-10 pr-4 py-3 border rounded-xl transition-all duration-300 w-64 theme-border theme-bg theme-text"
                />
              </div>
              <button className="border px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-300 hover:opacity-80 theme-border theme-bg theme-text">
                <Plus className="w-5 h-5" />
                <span>Add Task</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex space-x-2 border rounded-2xl p-3 theme-border">
            {[
              { id: "today", label: "Today" },
              { id: "tomorrow", label: "Tomorrow" },
              { id: "upcoming", label: "Upcoming" },
              { id: "due", label: "Overdue" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center px-8 py-4 font-bold transition-all duration-300 theme-text ${
                  activeTab === tab.id
                    ? "theme-border-accent scale-105"
                    : "hover:opacity-80"
                }`}
              >
                {tab.label}
                <span className="ml-3 text-xs px-3 py-1 rounded-full font-bold theme-border theme-text">
                  {getTabCount(tab.id)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={`grid gap-8 ${activeTab === "today" ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"}`}>
          <div className={`${activeTab === "today" ? "lg:col-span-2" : ""}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} showCheckbox={activeTab === "today"} />
              ))}
            </div>

            {filteredTasks.length === 0 && (
              <div className="text-center py-16 border rounded-2xl theme-border theme-bg">
                <div className="w-32 h-32 border rounded-full flex items-center justify-center mx-auto mb-6 theme-border">
                  <CheckCircle2 className="w-16 h-16 opacity-60" />
                </div>
                <h3 className="text-2xl font-bold mb-3 theme-text">All Clear!</h3>
                <p className="text-lg opacity-70 theme-text-faint">
                  {activeTab === "today" && "You've conquered today's tasks! 🎉"}
                  {activeTab === "tomorrow" && "Tomorrow's schedule is wide open."}
                  {activeTab === "upcoming" && "No upcoming tasks to worry about."}
                  {activeTab === "due" && "Fantastic! No overdue tasks."}
                </p>
              </div>
            )}
          </div>

          {activeTab === "today" && (
            <div className="lg:col-span-1">
              <div className="border rounded-2xl p-6 theme-border theme-bg">
                <h2 className="text-2xl font-bold mb-6 flex items-center theme-text">
                  <CheckCircle2 className="w-8 h-8 mr-3" />
                  Completed ({completedTasks.length})
                </h2>
                <div className="space-y-4">
                  {completedTasks.map(task => (
                    <CompletedTaskCard key={task.id} task={task} />
                  ))}
                  {completedTasks.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 border rounded-full flex items-center justify-center mx-auto mb-4 theme-border">
                        <Circle className="w-8 h-8 opacity-60" />
                      </div>
                      <p className="opacity-70 theme-text-faint">No completed tasks yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
