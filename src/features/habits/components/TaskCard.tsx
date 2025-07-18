
import React from 'react';
import { Task } from '../types/types';
import { TaskButton } from './TaskButton';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onIncrement?: (id: string) => void;
  onTimerToggle?: (id: string) => void;
  onResetTimer?: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onIncrement, onTimerToggle, onResetTimer }) => {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`w-16 h-16 ${task.color} rounded-2xl flex items-center justify-center`}>
          <span className="text-white text-2xl">{task.icon}</span>
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">{task.title}</h3>
          <p className="text-gray-400">{task.subtitle}</p>
        </div>
      </div>
      <TaskButton
        task={task}
        onToggle={onToggle}
        onIncrement={onIncrement}
        onTimerToggle={onTimerToggle}
        onResetTimer={onResetTimer}
      />
    </div>
  );
};
