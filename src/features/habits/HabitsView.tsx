import React, { useState } from "react";
import {
	Flame,
	Plus,
	BarChart3,
	ArrowLeft,
	Moon,
	Sun,
	Grid,
} from "lucide-react";
import { useAnalytics, useCalendar } from "@habits/hooks";
import {
	TaskCard,
	HabitInfoCard,
	Calendar,
	AnalyticsGrid,
	HabitForm,
	EmptyState,
} from "@habits/components";

import { getTodayDate } from "@habits/utils";

// Below here import one by one
import { useHabits, useDashboard } from "@habits/hooks";

const HabitView: React.FC = () => {

	const [currentView, setCurrentView] = useState<
		"habits" | "analytics" | "all-habits"
	>("habits");
	const [analyticsTab, setAnalyticsTab] = useState<"monthly" | "overall">(
		"monthly",
	);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { loading, completedHabits, pendingHabits, allHabits, allStats } =
		useHabits();
	const { analyticsData } = useAnalytics();

	const { dashboardData } = useDashboard();

	const {
		calendarData,
		selectedDate,
		scrollContainerRef,
		scrollCalendar,
		selectDate,
		scrollToToday,
		scrollToStart,
		scrollToEnd,
	} = useCalendar();

	if (loading) return <div>Loading...</div>;

	return (
		<div className="min-h-screen transition-all duration-500 ease-in-out bg-gray-50 dark:bg-gray-900">
			{/* Status Bar Spacer */}
			<div className="h-11"></div>

			<div className="max-w-6xl mx-auto px-4 pb-8">
				{/* Header */}
				<div className="mb-8">
					<div className="rounded-2xl border p-6 transition-all duration-500 ease-in-out bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm dark:shadow-gray-900/20">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								{(currentView === "analytics" ||
									currentView === "all-habits") && (
										<button
											onClick={() => setCurrentView("habits")}
											className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95"
										>
											<ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-300 transition-colors duration-300" />
										</button>
									)}
								<div>
									<div className="flex items-center gap-3 mb-1">
										<h1 className="text-2xl font-semibold tracking-tight transition-colors duration-500 ease-in-out text-gray-900 dark:text-white uppercase">
											ZenBoard
										</h1>
										{/* App Icon Badge */}
										<div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center transition-all duration-300 ease-in-out">
											<span className="text-white text-xs font-bold">Z</span>
										</div>
									</div>
									<p className="text-sm transition-colors duration-500 ease-in-out text-gray-500 dark:text-gray-400">
										{currentView === "analytics"
											? "Track your progress"
											: currentView === "all-habits"
												? "Manage all your habits"
												: `${selectedDate.toLocaleDateString("en-US", {
													weekday: "long",
													month: "long",
													day: "numeric",
													year: "numeric",
												})}`}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								{/* Theme Toggle */}
								<button
									className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ease-in-out bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95 shadow-sm dark:shadow-gray-900/20"
								>
									<div className="transition-all duration-300 ease-in-out">
									</div>
								</button>

								{/* Streak Indicator */}
								<div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl px-3 py-2 transition-all duration-300 ease-in-out shadow-sm">
									<div className="flex items-center gap-2">
										<Flame className="w-4 h-4 text-white transition-all duration-300" />
										<div className="text-white">
											<div className="text-xs font-medium opacity-90 transition-opacity duration-300">
												Streak
											</div>
											<div className="text-lg font-semibold leading-tight transition-all duration-300">
												{dashboardData?.maxStreak ?? "—"}
											</div>
										</div>
									</div>
								</div>

								{/* Analytics Toggle */}
								<button
									onClick={() =>
										setCurrentView(
											currentView === "analytics" ? "habits" : "analytics",
										)
									}
									className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ease-in-out shadow-sm active:scale-95 ${currentView === "analytics"
										? "bg-blue-500 text-white shadow-blue-500/25"
										: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 dark:shadow-gray-900/20"
										}`}
								>
									<BarChart3 className="w-5 h-5 transition-all duration-300" />
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Content */}
				{currentView === "habits" ? (
					<>
						{/* Calendar */}
						<div className="rounded-2xl border overflow-hidden mb-6 transition-all duration-500 ease-in-out bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm dark:shadow-gray-900/20">
							<Calendar
								calendarData={calendarData}
								selectedDate={selectedDate}
								onSelectDate={selectDate}
								onScroll={scrollCalendar}
								scrollToToday={scrollToToday}
								scrollToStart={scrollToStart}
								scrollToEnd={scrollToEnd}
								scrollRef={scrollContainerRef}
							/>
						</div>

						{/* Action Buttons */}
						<div className="flex justify-between items-center mb-6">
							<div className="flex gap-3">
								<button
									onClick={() => setIsModalOpen(true)}
									className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ease-in-out bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-sm hover:shadow-md active:scale-95"
								>
									<Plus className="w-4 h-4 transition-all duration-300" />
									Add New Habit
								</button>

								<button
									onClick={() => setCurrentView("all-habits")}
									className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ease-in-out bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md active:scale-95"
								>
									<Grid className="w-4 h-4 transition-all duration-300" />
									View All
								</button>
							</div>
						</div>

						{/* Habit Form Modal */}
						<HabitForm
							isOpen={isModalOpen}
							onClose={() => setIsModalOpen(false)}
						/>

						{/* Tasks Grid */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Active Tasks */}
							<div className="space-y-4">
								<div className="flex items-center justify-between px-1">
									<h2 className="text-lg font-semibold transition-colors duration-500 ease-in-out text-gray-900 dark:text-white">
										Active
									</h2>
									<div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-500 ease-in-out">
										{pendingHabits.length}
									</div>
								</div>

								<div className="rounded-2xl border p-4 space-y-3 transition-all duration-500 ease-in-out bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm dark:shadow-gray-900/20">
									{pendingHabits.length > 0 ? (
										pendingHabits.map((task) => {
											const progress =
												allStats?.[task.id]?.[getTodayDate()]?.v || 0;
											return (
												<TaskCard
													key={task.id}
													task={task}
													isCompleted={false}
													progress={progress}
												/>
											);
										})
									) : (
										<EmptyState type="active" />
									)}
								</div>
							</div>

							{/* Completed Tasks */}
							<div className="space-y-4">
								<div className="flex items-center justify-between px-1">
									<h2 className="text-lg font-semibold transition-colors duration-500 ease-in-out text-gray-900 dark:text-white">
										Completed
									</h2>
									<div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-500 ease-in-out">
										{completedHabits.length}
									</div>
								</div>

								<div className="rounded-2xl border p-4 min-h-[200px] transition-all duration-500 ease-in-out bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm dark:shadow-gray-900/20">
									{completedHabits.length > 0 ? (
										<div className="space-y-3">
											{completedHabits.map((task) => (
												<TaskCard
													key={task.id}
													task={task}
													isCompleted={true}
													progress={0}
												/>
											))}
										</div>
									) : (
										<EmptyState type="completed" />
									)}
								</div>
							</div>
						</div>
					</>
				) : currentView === "all-habits" ? (
					/* All Habits View */
					<div className="space-y-6">
						{/* Header */}
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-xl font-semibold transition-colors duration-500 ease-in-out text-gray-900 dark:text-white">
									All Habits
								</h2>
								<p className="text-sm mt-1 transition-colors duration-500 ease-in-out text-gray-500 dark:text-gray-400">
									Manage and view details of all your habits
								</p>
							</div>
							<div className="bg-purple-50 dark:bg-purple-900/20 text-blue-600 dark:text-blue-600 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-500 ease-in-out">
								{allHabits?.length || 0} habits
							</div>
						</div>

						{/* All Habits Grid */}
						<div className="rounded-2xl border p-6 transition-all duration-500 ease-in-out bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm dark:shadow-gray-900/20">
							{allHabits && allHabits.length > 0 ? (
								<div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
									{allHabits.map((habit) => (
										<HabitInfoCard key={habit.id} task={habit} />
									))}
								</div>
							) : (
								<EmptyState
									type="all"
									onActionClick={() => {
										setCurrentView("habits");
										setIsModalOpen(true);
									}}
								/>
							)}
						</div>
					</div>
				) : (
					/* Analytics View */
					<div className="space-y-6">
						{/* Tab Selector */}
						<div className="rounded-xl p-1 inline-flex transition-all duration-500 ease-in-out bg-gray-100 dark:bg-gray-800 shadow-sm dark:shadow-gray-900/20">
							<button
								onClick={() => setAnalyticsTab("monthly")}
								className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ease-in-out ${analyticsTab === "monthly"
									? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm transform scale-[1.02]"
									: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
									}`}
							>
								Monthly
							</button>
							<button
								onClick={() => setAnalyticsTab("overall")}
								className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ease-in-out ${analyticsTab === "overall"
									? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm transform scale-[1.02]"
									: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
									}`}
							>
								Overall
							</button>
						</div>

						{/* Analytics Content */}
						<div className="rounded-2xl border p-6 transition-all duration-500 ease-in-out bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm dark:shadow-gray-900/20">
							<AnalyticsGrid
								habits={allHabits}
								analyticsData={analyticsData}
								viewType={analyticsTab}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default HabitView;
