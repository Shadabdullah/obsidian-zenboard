
import React from 'react';
import { Task } from '../types/types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onIncrement?: (id: string) => void;
  onTimerToggle?: (id: string) => void;
  onResetTimer?: (id: string) => void;
  title: string;
  badgeColor: string;
  badgeText: string;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggle,
  onIncrement,
  onTimerToggle,
  onResetTimer,
  title,
  badgeColor,
  badgeText,
}) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <span className={`px-3 py-1 rounded-full text-sm ${badgeColor}`}>{badgeText}</span>
    </div>
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onIncrement={onIncrement}
          onTimerToggle={onTimerToggle}
          onResetTimer={onResetTimer}
        />
      ))}
    </div>
  </div>
);
