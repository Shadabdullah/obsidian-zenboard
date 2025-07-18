
import React from 'react';
import { Play, Pause, Plus, RotateCcw } from 'lucide-react';
import { Task } from '../types/types';
import { formatTime } from '../utils/helpers';

interface TaskButtonProps {
  task: Task;
  onToggle: (id: string) => void;
  onIncrement?: (id: string) => void;
  onTimerToggle?: (id: string) => void;
  onResetTimer?: (id: string) => void;
}

export const TaskButton: React.FC<TaskButtonProps> = ({ task, onToggle, onIncrement, onTimerToggle, onResetTimer }) => {
  if (task.type === 'checkbox') {
    return (
      <button
        onClick={() => onToggle(task.id)}
        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
          task.completed ? 'bg-green-500 border-green-500' : 'border-gray-600 hover:border-green-400'
        }`}
      >
        {task.completed && <span className="text-white font-bold text-xl">✓</span>}
      </button>
    );
  }

  if (task.type === 'counter') {
    return (
      <div className="flex items-center gap-2">
        <div className="text-right">
          <div className="text-lg font-bold text-white">
            {task.counterValue || 0}/{task.targetCount || 0}
          </div>
        </div>
        <button
          onClick={() => onIncrement && onIncrement(task.id)}
          className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
          disabled={task.completed}
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>
    );
  }

  if (task.type === 'timer') {
    return (
      <div className="flex items-center gap-2">
        <div className="text-right">
          <div className="text-lg font-bold text-white">{formatTime(task.timerElapsed || 0)}</div>
          <div className="text-sm text-gray-400">/ {formatTime(task.timerDuration || 0)}</div>
        </div>
        <button
          onClick={() => onTimerToggle && onTimerToggle(task.id)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            task.isTimerRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
          disabled={task.completed}
        >
          {task.isTimerRunning ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
        </button>
        {(task.timerElapsed || 0) > 0 && (
          <button
            onClick={() => onResetTimer && onResetTimer(task.id)}
            className="w-10 h-10 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-white" />
          </button>
        )}
      </div>
    );
  }

  return null;
};
