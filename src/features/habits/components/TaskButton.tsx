import { StoredHabit } from "../types/habitTypes";
import React from "react";
import { Play, Plus, Pause, RotateCcw, CheckCircle } from "lucide-react";
import { HabitStore } from "@habits/store";

interface TaskButtonProps {
  task: StoredHabit;
  progress: number;
}

const TaskButton: React.FC<TaskButtonProps> = ({ task, progress }) => {
  const { taskDone, incrementHabit, resetTimer, toggleTimer } = HabitStore();

  // === Task-based (boolean) ===
  if (task.trackingType === "task") {
    return (
      <button
        onClick={() => taskDone(task.id)}
        className={`
          w-14 h-14 rounded-full flex items-center justify-center
          transition-all duration-200 ease-out active:scale-95
          border-2 bg-white shadow-sm hover:shadow-md
        `}
        style={{
          backgroundColor: task.color,
          borderColor: task.color,
        }}
      >
        <CheckCircle size={22} className="text-white" fill="white" />
      </button>
    );
  }

  // === Amount-based (counter) ===
  if (task.trackingType === "amount") {
    const progresz = Math.min(
      ((progress || 0) / (task.targetCount || 1)) * 100,
      100,
    );
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progresz / 100) * circumference;

    return (
      <div className="relative w-14 h-14">
        <svg className="w-14 h-14" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="3"
            fill="none"
          />
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke={task.color}
            strokeWidth="3"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        <button
          onClick={() => incrementHabit(task.id)}
          className={`
            absolute inset-0 w-14 h-14 rounded-full flex flex-col items-center justify-center
            transition-all duration-200 ease-out active:scale-95 hover:shadow-md
          `}
          style={{ backgroundColor: `${task.color}15` }}
        >
          <span
            className="text-base font-extrabold leading-tight"
            style={{ color: task.color }}
          >
            {task.counterValue || 0}
          </span>
          <Plus size={12} style={{ color: task.color }} strokeWidth={3} />
        </button>
      </div>
    );
  }

  // === Time-based (timer) ===
  if (task.trackingType === "time") {
    const progresz = Math.min(
      ((progress || 0) / (task.timeValue || 1)) * 100,
      100,
    );
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progresz / 100) * circumference;

    return (
      <div className="relative w-14 h-14">
        <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke="#f3f4f6"
            strokeWidth="3"
            fill="none"
          />
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke={task.color}
            strokeWidth="3"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        <button
          onClick={() => toggleTimer(task.id)}
          className={`
            absolute inset-0 w-14 h-14 rounded-full flex items-center justify-center
            transition-all duration-200 ease-out active:scale-95 hover:shadow-md
          `}
          style={{
            backgroundColor: task.isTimerRunning
              ? `${task.color}25`
              : `${task.color}15`,
          }}
        >
          {task.isTimerRunning ? (
            <Pause size={14} style={{ color: task.color }} strokeWidth={2.5} />
          ) : (
            <Play
              size={14}
              style={{ color: task.color }}
              strokeWidth={2.5}
              fill={task.color}
            />
          )}
        </button>

        {(task.timerElapsed || 0) > 0 && !task.isTimerRunning && (
          <button
            onClick={() => resetTimer(task.id)}
            className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full flex items-center justify-center
              bg-gray-100 hover:bg-gray-200 active:bg-gray-300 shadow-sm transition-all duration-200 ease-out active:scale-90"
          >
            <RotateCcw size={20} className="text-gray-600" strokeWidth={2} />
          </button>
        )}
      </div>
    );
  }

  return null;
};

export default TaskButton;
