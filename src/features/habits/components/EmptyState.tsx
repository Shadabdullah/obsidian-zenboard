import { CheckCircle, Circle, BarChart, Grid, Plus } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

type EmptyStateProps = {
	type: "active" | "completed" | "all" | "stats";
	onActionClick?: () => void;
};

const EmptyState = ({ type, onActionClick }: EmptyStateProps) => {
	const config = {
		active: {
			icon: <Circle className="w-12 h-12 text-blue-400" />,
			title: "No habits for today. See you tomorrow!",
			description: "Add habits to start tracking your progress.",
			color: "blue",
		},
		completed: {
			icon: <CheckCircle className="w-12 h-12 text-green-500" />,
			title: "Nothing completed yet",
			description: "Complete tasks to see them here",
			color: "green",
		},
		all: {
			icon: <Grid className="w-12 h-12 text-blue-400" />,
			title: "No habits yet",
			description: "Start building your routine by adding your first habit",
			color: "blue",
		},
		stats: {
			icon: <BarChart className="w-12 h-12 text-blue-400" />,
			title: "No Stats Available",
			description: "Add habits and make some progress to see here",
			color: "blue",
		},
	};

	const current = config[type];

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="flex flex-col items-center justify-center py-16 px-8 text-center"
		>
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
				className="bg-secondary rounded-full p-6 mb-6"
			>
				{current.icon}
			</motion.div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.4 }}
			>
				<h3 className="text-default text-xl font-semibold mb-2">
					{current.title}
				</h3>

				<p className="text-muted text-base mb-6 max-w-sm">
					{current.description}
				</p>

				{type === "all" && (
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={onActionClick}
						className={clsx(
							"btn-accent",
							"px-4-1 py-4-2",
							"rounded-m",
							"inline-flex items-center gap-2",
							"font-medium transition-all duration-200",
							"focus:outline-none focus:ring-2 focus:ring-offset-2"
						)}
					>
						<Plus className="w-4 h-4" />
						Add First Habit
					</motion.button>
				)}
			</motion.div>
		</motion.div>
	);
};

export default EmptyState;
