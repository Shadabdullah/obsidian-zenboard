import { CheckCircle, Circle, BarChart, Grid, Plus } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

type EmptyStateProps = {
  type: "active" | "completed" | "all" | "stats";
  onActionClick?: () => void; // ← optional button handler
};

const EmptyState = ({ type, onActionClick }: EmptyStateProps) => {
  const config = {
    active: {
      icon: <Circle className="w-6 h-6 text-blue-500" />,
      title: "No habits for today. See you tomorrow!",
      description: "Add habits to start tracking your progress.",
      color: "blue",
    },
    completed: {
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      title: "Nothing completed yet",
      description: "Complete tasks to see them here",
      color: "green",
    },
    all: {
      icon: <Grid className="w-6 h-6 text-blue-500" />,
      title: "No habits yet",
      description: "Start building your routine by adding your first habit",
      color: "blue",
    },
    stats: {
      icon: <BarChart className="w-6 h-6 text-blue-500" />,
      title: "No Stats Available",
      description: "Add habits and make some progress to see here",
      color: "blue",
    },
  };

  const current = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={clsx(
          "w-16 h-16 rounded-full flex items-center justify-center mb-4",
          {
            "bg-blue-100 dark:bg-blue-900/20": current.color === "blue",
            "bg-green-100 dark:bg-green-900/20": current.color === "green",
          },
        )}
      >
        {current.icon}
      </motion.div>

      <h3 className="text-lg font-medium mb-1 text-gray-900 dark:text-white">
        {current.title}
      </h3>

      <p className="text-sm text-center mb-6 text-gray-500 dark:text-gray-400 max-w-xs">
        {current.description}
      </p>

      {type === "all" && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onActionClick}
          className={clsx(
            "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white",
            {
              "bg-blue-500 dark:bg-blue-600": current.color === "blue",
              "bg-green-500 dark:bg-green-600": current.color === "green",
            },
          )}
        >
          <Plus className="w-4 h-4" />
          Add First Habit
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;
