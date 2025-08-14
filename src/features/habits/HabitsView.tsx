import React, { useState } from "react";
import {
	Flame,
	Plus,
	BarChart3,
	ArrowLeft,
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

	if (loading) return <div className="text-default">Loading...</div>;

	return (
		<div className="min-h-screen transition-all duration-500 ease-in-out bg-primary">
			{/* Status Bar Spacer */}
			<div className="h-4"></div>

			<div className="max-w-6xl mx-auto px-4 pb-8">
				{/* Header */}
				<div className="mb-2">
					<div className="rounded-xl border-default px-6 py-2 transition-all duration-500 ease-in-out bg-secondary shadow-sm">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								{(currentView === "analytics" ||
									currentView === "all-habits") && (
										<button
											onClick={() => setCurrentView("habits")}
											className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ease-in-out bg-hover hover:bg-active-hover active:scale-95"
										>
											<ArrowLeft className="w-4 h-4 text-muted transition-colors duration-300" />
										</button>
									)}
								<div>
									<div className="flex items-center gap-3 mb-1">
										<h1 className="text-2xl font-semibold tracking-tight transition-colors duration-500 ease-in-out text-default uppercase">
											ZenBoard
										</h1>
										{/* App Icon Badge */}
										<div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center transition-all duration-300 ease-in-out">
											<span className="text-white text-xs font-bold">Z</span>
										</div>
									</div>
									<p className="text-sm transition-colors duration-500 ease-in-out text-muted">
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
										? "btn-accent"
										: "btn-base hover:bg-active-hover"
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
						<div className="rounded-xl border-default overflow-hidden mb-6 transition-all duration-500 ease-in-out bg-secondary shadow-sm px-6">
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
									className="inline-flex items-center gap-2 px-6 py-3  font-medium transition-all duration-300 ease-in-out btn-accent shadow-sm hover:shadow-md active:scale-95"
								>
									<Plus className="w-4 h-4 transition-all duration-300" />
									Add New Habit
								</button>

								<button
									onClick={() => setCurrentView("all-habits")}
									className="inline-flex items-center gap-2 px-6 py-3  font-medium transition-all duration-300 ease-in-out btn-base hover:bg-active-hover text-default shadow-sm hover:shadow-md active:scale-95"
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
									<h2 className="text-lg font-semibold transition-colors duration-500 ease-in-out text-default">
										Active
									</h2>
									<div className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-500 ease-in-out">
										{pendingHabits.length}
									</div>
								</div>

								<div className="rounded-xl border-default p-4 space-y-3 transition-all duration-500 ease-in-out bg-secondary shadow-sm">
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
									<h2 className="text-lg font-semibold transition-colors duration-500 ease-in-out text-default">
										Completed
									</h2>
									<div className="bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-500 ease-in-out">
										{completedHabits.length}
									</div>
								</div>

								<div className="rounded-xl border-default p-4 min-h-[200px] transition-all duration-500 ease-in-out bg-secondary shadow-sm">
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
								<h2 className="text-xl font-semibold transition-colors duration-500 ease-in-out text-default">
									All Habits
								</h2>
								<p className="text-sm mt-1 transition-colors duration-500 ease-in-out text-muted">
									Manage and view details of all your habits
								</p>
							</div>
							<div className="bg-purple-50 text-blue-600 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-500 ease-in-out">
								{allHabits?.length || 0} habits
							</div>
						</div>

						{/* All Habits Grid */}
						<div className="rounded-xl border-default p-6 transition-all duration-500 ease-in-out bg-secondary shadow-sm">
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
						<div className="rounded-m p-1 inline-flex transition-all duration-500 ease-in-out bg-secondary shadow-sm space-x-2">
							<button
								onClick={() => setAnalyticsTab("monthly")}
								className={`px-5 py-2.5 rounded-s font-medium text-sm transition-all duration-300 ease-in-out ${analyticsTab === "monthly"
									? "bg-secondary text-default shadow-sm transform scale-[1.02]"
									: "text-muted hover:text-default"
									}`}
							>
								Monthly
							</button>
							<button
								onClick={() => setAnalyticsTab("overall")}
								className={`px-5 py-2.5 rounded-s font-medium text-sm transition-all duration-300 ease-in-out ${analyticsTab === "overall"
									? "bg-secondary text-default shadow-sm transform scale-[1.02]"
									: "text-muted hover:text-default"
									}`}
							>
								Overall
							</button>
						</div>

						{/* Analytics Content */}
						<div className="rounded-xl border-default p-6 transition-all duration-500 ease-in-out bg-secondary shadow-sm">
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
