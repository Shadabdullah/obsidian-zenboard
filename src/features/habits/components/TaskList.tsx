import React from "react";
import { Plus } from "lucide-react";
import { StoredHabit } from "@habits/types";
import { TaskCard } from "@habits/components";

interface TaskListProps {
	title: string;
	tasks: StoredHabit[];
	badgeText: string;
	badgeColor: string;
	isCompleted?: boolean;
	showAddButton?: boolean;
	emptyStateIcon?: string;
	emptyStateTitle?: string;
	emptyStateDescription?: string;
}

const TaskList: React.FC<TaskListProps> = ({
	title,
	tasks,
	badgeText,
	badgeColor,
	isCompleted = false,
	showAddButton = false,
	emptyStateIcon = "🎉",
	emptyStateTitle = "No completed tasks yet",
	emptyStateDescription = "Complete tasks to see them here",
}) => {
	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-semibold">{title}</h2>
				<span className={`${badgeColor} px-3 py-1 rounded-full text-sm`}>
					{badgeText}
				</span>
			</div>

			<div className="space-y-4">
				{tasks.map((task) => (
					<TaskCard key={task.id} task={task} isCompleted={isCompleted} progress={5} />
				))}

				{showAddButton && (
					<button className="w-full hover:bg-gray-700 rounded-2xl p-6 flex items-center justify-center gap-3 transition-colors border-2 border-dashed border-gray-600">
						<Plus className="w-6 h-6 text-gray-400" />
						<span className="text-gray-400 font-medium">Add new task</span>
					</button>
				)}

				{tasks.length === 0 && !showAddButton && (
					<div className="text-center py-12 text-gray-500">
						<div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
							<span className="text-4xl">{emptyStateIcon}</span>
						</div>
						<p className="text-lg">{emptyStateTitle}</p>
						<p className="text-sm">{emptyStateDescription}</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default TaskList;
