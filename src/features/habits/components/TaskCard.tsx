import React from "react";
import { StoredHabit } from "@habits/types";
import { TaskButton } from "@habits/components";
import HabitIcon from "./Form/iconsmap";
import { formatTime } from "@habits/utils";

interface TaskCardProps {
  task: StoredHabit;
  isCompleted: boolean;
  progress: number;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isCompleted, progress }) => {
  // Helper function to get progress info
  const getProgressInfo = () => {
    if (task.trackingType === "amount") {
      return (
        <>
          <span className="text-gray-700 dark:text-gray-300">
            {progress}
            {/* //{task.counterValue || 0} */}
          </span>
          <span className="mx-1 text-gray-400 dark:text-gray-500">/</span>
          <span className="text-gray-700 dark:text-gray-300">
            {task.targetCount || 0}
          </span>
        </>
      );
    }
    if (task.trackingType === "time") {
      return (
        <>
          <span className="text-gray-700 dark:text-gray-300">
            {formatTime(progress || 0)}
          </span>
          <span className="mx-1 text-gray-400 dark:text-gray-500">—</span>
          <span className="text-gray-700 dark:text-gray-300">
            {formatTime(task.timeValue || 0)}
          </span>
        </>
      );
    }
    return null;
  };

  // Check if habit is time-based and has 5 seconds or less remaining
  const shouldBlink = () => {
    if (task.trackingType !== "time" || isCompleted) return false;
    const remaining = (task.timeValue || 0) - (progress || 0);
    return remaining <= 5 && remaining > 0;
  };

  return (
    <div
      className={`
        relative overflow-hidden
        bg-white dark:bg-gray-800
        rounded-2xl
        transition-all duration-300 ease-out
        active:scale-[0.98]
        shadow-sm
        border border-gray-100 dark:border-gray-700
        ${shouldBlink() ? 'animate-pulse' : ''}
      `}
      style={{
        ...(shouldBlink() && {
          animation: 'blink 1s infinite',
        })
      }}
    >
      {/* Custom CSS for blinking animation */}
      <style jsx>{`
        @keyframes blink {
          0%, 50% {
            opacity: 1;
            box-shadow: 0 0 0 0 ${task.color}40;
          }
          25% {
            opacity: 0.7;
            box-shadow: 0 0 20px 5px ${task.color}60;
          }
          75% {
            opacity: 0.9;
            box-shadow: 0 0 10px 2px ${task.color}50;
          }
        }
      `}</style>

      {/* Subtle top highlight - iOS characteristic */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/30 to-transparent" />

      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Icon with iOS-style design */}
            <div
              className={`
                relative w-12 h-12 rounded-xl flex items-center justify-center
                transition-all duration-200
                ${shouldBlink() ? 'animate-bounce' : ''}
              `}
              style={{
                backgroundColor: task.color,
                boxShadow: `0 2px 12px ${task.color}25`,
              }}
            >
              <span className="text-lg">
                <HabitIcon name={task.icon ? task.icon : "Smile"} />
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3
                  className={`
                  font-semibold text-base leading-tight truncate
                  transition-all duration-200
                  text-gray-900 dark:text-white
                  ${shouldBlink() ? 'text-red-600 dark:text-red-400' : ''}
                `}
                >
                  {task.name}
                </h3>

                {/* Progress indicator 
                {!task.isCompleted && getProgress() && (
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                    {getProgress()}
                  </span>
                )}
                */}
              </div>

              {/* Days indicator */}
              <div className="flex items-center gap-1 mt-1 uppercase">
                {task.selectedDays.map((day, index) => (
                  <span
                    key={index}
                    className={`
                      text-xs px-1.5 py-0.5 rounded-md font-medium
                      text-gray-500 dark:text-gray-400 
                      bg-gray-100 dark:bg-gray-700
                    `}
                  >
                    {day}
                  </span>
                ))}
              </div>

              {/* Progress bar for amount and time tracking */}
              {(task.trackingType === "amount" ||
                task.trackingType === "time") && (
                <div className="mt-2">
                  <div className="h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`
                        h-full transition-all duration-300 rounded-full
                        ${shouldBlink() ? 'animate-pulse' : ''}
                      `}
                      style={{
                        //width: `${Math.min(getProgressPercentage(), 100)}%`,
                        backgroundColor: shouldBlink() ? '#ef4444' : task.color,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 ml-3">
            {/* Progress info for amount and time types */}
            {!isCompleted && getProgressInfo() && (
              <div
                className={`
                  text-sm px-2 py-0.5 rounded-lg inline-block transition-colors duration-200
                  tabular-nums font-semibold tracking-wide
                  ${shouldBlink() 
                    ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 animate-pulse' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }
                `}
              >
                {getProgressInfo()}
              </div>
            )}
            {!isCompleted && (
              <TaskButton key={task.id} task={task} progress={progress} />
            )}
          </div>
        </div>
      </div>

      {/* Bottom separator - iOS style */}
      <div className="absolute bottom-0 left-4 right-4 h-px bg-gray-100 dark:bg-gray-700" />
    </div>
  );
};

export default TaskCard;
