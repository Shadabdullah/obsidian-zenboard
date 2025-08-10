import React from "react";
import { AnalyticsData, ProcessedHabitData, StoredHabit } from "@habits/types";
import HabitIcon from "./Form/iconsmap";
import { Calendar } from "lucide-react";
import { EmptyState } from "@habits/components";
interface AnalyticsGridProps {
	habits: StoredHabit[];
	analyticsData: AnalyticsData | null;
	viewType: "monthly" | "overall";
}

const AnalyticsGrid: React.FC<AnalyticsGridProps> = ({
	habits,
	analyticsData,
	viewType,
}) => {
	const getProgressRing = (percentage: number, habit: StoredHabit) => {
		const circumference = 2 * Math.PI * 16;
		const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

		return (
			<div className="relative w-12 h-12">
				<svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
					<path
						className="text-gray-200 dark:text-gray-700"
						stroke="currentColor"
						strokeWidth="3"
						fill="transparent"
						d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
					/>
					<path
						className="transition-all duration-500"
						stroke="currentColor"
						strokeWidth="3"
						strokeLinecap="round"
						fill="transparent"
						strokeDasharray={strokeDasharray}
						style={{ stroke: habit.color }} // ✅ apply color here
						d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
					/>
				</svg>
				<div className="absolute inset-0 flex items-center justify-center">
					<span className="text-xs font-bold" style={{ color: habit.color }}>
						{percentage}%
					</span>
				</div>
			</div>
		);
	};

	const getMonthName = (monthIndex: number) => {
		const months = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		return months[monthIndex] || "Unknown";
	};

	const renderMonthlyHeatmap = (processedData: ProcessedHabitData) => {
		const {
			habit,
			dataPeriod,
			completedDays,
			totalDays,
			percentage,
			currentStreak,
			longestStreak,
		} = processedData;


		// Get the monthly data from dataPeriod
		const monthlyData =
			"monthlyData" in dataPeriod ? dataPeriod.monthlyData : [];


		console.log(monthlyData)

		const currentDate = new Date();
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth();
		const monthName = getMonthName(month);

		// Get days in current month
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const firstDayOfMonth = new Date(year, month, 1).getDay();

		// Create calendar grid for the month
		const calendarDays = [];

		// Add empty cells for days before month starts
		for (let i = 0; i < firstDayOfMonth; i++) {
			calendarDays.push(null);
		}

		// Add actual days of the month using the 2D array structure
		let dayCounter = 0;
		for (let week = 0; week < monthlyData.length; week++) {
			for (let day = 0; day < monthlyData[week].length; day++) {
				if (monthlyData[week][day] !== -1) {
					calendarDays.push(monthlyData[week][day]);
					dayCounter++;
					if (dayCounter >= daysInMonth) break;
				}
			}
			if (dayCounter >= daysInMonth) break;
		}

		// Fill remaining days if needed
		while (calendarDays.length < firstDayOfMonth + daysInMonth) {
			calendarDays.push(0);
		}

		return (
			<>
				{/* Header section */}
				<div className="relative flex items-center gap-4 mb-5">
					<div
						className=" w-14 h-14 ${habit.color} rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300
              group-hover:scale-110 group-hover:shadow-xl"
						style={{ backgroundColor: habit.color }}
					>
						<span className="text-white text-xl font-medium">
							<HabitIcon name={habit.icon ?? "Smile"} />
						</span>
					</div>

					<div className="flex-1 min-w-0">
						<h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 leading-tight truncate">
							{habit.name}
						</h3>

						<div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 font-medium  uppercase mt-2">
							<span className="inline-flex items-center gap-1">
								<Calendar
									className="w-3.5 h-3.5 text-blue-500"
									style={{ color: habit.color }}
								/>
							</span>
							<span className="text-gray-500 dark:text-gray-400">
								{monthName} {year} - {completedDays} of {totalDays}{" "}
								{totalDays === 1 ? "day" : "days"}
							</span>
						</div>
					</div>

					<div className="flex-shrink-0">
						{getProgressRing(percentage, habit)}
					</div>
				</div>

				{/* Monthly calendar heatmap */}
				<div className="relative mb-5">
					<div className="bg-gray-50/40 dark:bg-gray-800/40 rounded-xl p-4 border border-gray-200/40 dark:border-gray-700/40">
						{/* Day labels */}
						<div className="grid grid-cols-7 gap-1 mb-2">
							{["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
								<div
									key={index}
									className="text-xs text-gray-500 dark:text-gray-400 font-medium text-center py-1"
								>
									{day}
								</div>
							))}
						</div>

						{/* Calendar grid */}
						<div className="grid grid-cols-7 gap-1">
							{calendarDays.map((day, index) => {
								const dayNumber =
									day !== null && index >= firstDayOfMonth
										? index - firstDayOfMonth + 1
										: null;

								return (
									<div
										key={index}
										className={`
                      w-8 h-8 rounded-md transition-all duration-200
                      flex items-center justify-center text-xs font-medium
                      hover:scale-110 hover:shadow-sm cursor-pointer
                    ${day === 1
												? "text-white shadow-sm"
												: day === 0
													? " text-black   dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
													: day === -1
														? "bg-gray-100/30 dark:bg-gray-800/30 border border-dashed border-gray-300 dark:border-gray-600"
														: day === -2
															? " border border-dashed dark:text-white text-black"
															: day === -3
																? " bg-gray-100/30 dark:bg-gray-800/30 border border-dashed border-gray-300 dark:border-gray-600 dark:text-white"
																: " "
											}
                    `}
										style={{
											backgroundColor: day === 1 ? habit.color : undefined,
											borderColor: day === -2 ? habit.color : undefined,
										}}
										title={`Day ${index + 1}: ${day === 1
											? "Completed"
											: day === 0
												? "Not completed"
												: day === -1
													? "Future date"
													: day === -2
														? "Not scheduled"
														: "No data"
											}`}
									>
										{dayNumber && <span className="text-xs">{dayNumber}</span>}
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{/* Stats footer */}
				<div className="flex justify-between">
					{/* Enhanced Streak Section */}
					<div className="group/streak relative">
						<div
							className="flex items-center gap-2.5 px-3 py-2 rounded-md transition-all duration-300 hover:scale-105 cursor-pointer"
							style={{
								backgroundColor: `${habit.color}15`,
								border: `1px solid ${habit.color}30`,
							}}
						>
							<div className="flex items-center gap-1.5">
								<div
									className="w-2.5 h-2.5 rounded-full animate-pulse shadow-sm"
									style={{ backgroundColor: habit.color }}
								></div>
								<div className="flex items-baseline gap-0.5">
									<span
										className="text-sm font-bold"
										style={{ color: habit.color }}
									>
										{currentStreak}
									</span>
									<span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
										days
									</span>
								</div>
							</div>
							<div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
							<span className="text-[10px] text-gray-600 dark:text-gray-300 font-semibold uppercase tracking-wider">
								Current
							</span>
						</div>

						{/* Tooltip */}
						<div className="absolute right-0 top-full mt-1 opacity-0 group-hover/streak:opacity-100 transition-opacity duration-200 pointer-events-none">
							<div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
								Active streak
							</div>
						</div>
					</div>

					{/* Max Streak */}
					<div className="group/max relative">
						<div className="flex items-center gap-2.5 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 px-3 py-2 rounded-md border border-amber-200/60 dark:border-amber-700/40 transition-all duration-300 hover:scale-105 cursor-pointer hover:shadow-md">
							<div className="flex items-center gap-1.5">
								<div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 shadow-sm">
									<div className="w-full h-full rounded-full bg-gradient-to-r from-amber-300 to-yellow-400 animate-pulse"></div>
								</div>
								<div className="flex items-baseline gap-0.5">
									<span className="text-sm font-bold text-amber-700 dark:text-amber-300">
										{longestStreak}
									</span>
									<span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
										days
									</span>
								</div>
							</div>
							<div className="w-px h-4 bg-amber-300 dark:bg-amber-600"></div>
							<span className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold uppercase tracking-wider">
								Best
							</span>
						</div>

						{/* Tooltip */}
						<div className="absolute right-0 top-full mt-1 opacity-0 group-hover/max:opacity-100 transition-opacity duration-200 pointer-events-none">
							<div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
								Personal record
							</div>
						</div>
					</div>
				</div>
			</>
		);
	};

	const renderYearlyHeatmap = (processedData: ProcessedHabitData) => {
		const {
			habit,
			dataPeriod,
			completedDays,
			totalDays,
			percentage,
			currentStreak,
			longestStreak,
		} = processedData;

		// Get the overall data from dataPeriod
		const overallData =
			"overallData" in dataPeriod ? dataPeriod.overallData : [];

		const currentDate = new Date();
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth();
		const monthName = getMonthName(month);


		console.log(dataPeriod)

		return (
			<>
				<>
					{/* Header section - Improved layout for better name visibility */}
					<div className="relative mb-4">
						{/* Top row - Habit name with icon */}
						<div className="flex items-start gap-3 mb-3">
							{/* Habit Icon */}
							<div
								className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl flex-shrink-0"
								style={{ backgroundColor: habit.color }}
							>
								<span className="text-white text-lg font-medium">
									<HabitIcon name={habit.icon ?? "Smile"} />
								</span>
							</div>

							{/* Habit Name - Now has more space */}
							<div className="flex-1 min-w-0 pt-1">
								<h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 leading-tight break-words uppercase">
									{habit.name}
								</h3>
								{/* Optional: Add a subtitle or description if needed */}
								{/* <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Daily habit</p> */}
							</div>

							{/* Progress Ring - Moved to top right */}
							<div className="flex-shrink-0 relative group/progress cursor-pointer">
								<div className="relative w-12 h-12 transition-transform duration-300 group-hover/progress:scale-110">
									<svg
										className="w-12 h-12 transform -rotate-90"
										viewBox="0 0 36 36"
									>
										{/* Background circle */}
										<path
											className="text-gray-200 dark:text-gray-700"
											stroke="currentColor"
											strokeWidth="3"
											fill="transparent"
											d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
										/>
										{/* Progress circle */}
										<path
											className="transition-all duration-700 ease-out drop-shadow-sm"
											stroke="currentColor"
											strokeWidth="3"
											strokeLinecap="round"
											fill="transparent"
											style={{
												stroke: habit.color,
												filter: `drop-shadow(0 0 4px ${habit.color}40)`,
											}}
											strokeDasharray={`${(percentage / 100) * (2 * Math.PI * 16)} ${2 * Math.PI * 16}`}
											d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
										/>
									</svg>
									<div className="absolute inset-0 flex items-center justify-center">
										<span
											className="text-xs font-bold transition-all duration-300 group-hover/progress:scale-110"
											style={{ color: habit.color }}
										>
											{percentage}%
										</span>
									</div>
								</div>

								{/* Progress ring glow effect */}
								<div
									className="absolute inset-0 rounded-full opacity-0 group-hover/progress:opacity-20 transition-opacity duration-300 blur-lg"
									style={{ backgroundColor: habit.color }}
								></div>
							</div>
						</div>

						{/* Bottom row - Streak information */}
						<div className="flex justify-between items-center ">
							{/* Year and completion stats */}
							<div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 font-medium uppercase">
								<span className="inline-flex items-center gap-1">
									<Calendar
										className="w-3.5 h-3.5 text-blue-500"
										style={{ color: habit.color }}
									/>
									<span className="text-gray-800 dark:text-gray-200 font-semibold">
										{}
									</span>
								</span>
								<span className="text-gray-500 dark:text-gray-400">
									{monthName} {year} - {completedDays} of {totalDays}{" "}
									{totalDays === 1 ? "day" : "days"}
								</span>
							</div>

							{/* Enhanced Streak Section */}
							<div className="flex gap-1.5 ">
								{/* Current Streak */}
								<div className="group/streak relative">
									<div
										className="flex items-center gap-2.5 px-3 py-2 rounded-md transition-all duration-300 hover:scale-105 cursor-pointer"
										style={{
											backgroundColor: `${habit.color}15`,
											border: `1px solid ${habit.color}30`,
										}}
									>
										<div className="flex items-center gap-1.5">
											<div
												className="w-2.5 h-2.5 rounded-full animate-pulse shadow-sm"
												style={{ backgroundColor: habit.color }}
											></div>
											<div className="flex items-baseline gap-0.5">
												<span
													className="text-sm font-bold"
													style={{ color: habit.color }}
												>
													{currentStreak}
												</span>
												<span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
													days
												</span>
											</div>
										</div>
										<div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
										<span className="text-[10px] text-gray-600 dark:text-gray-300 font-semibold uppercase tracking-wider">
											Current
										</span>
									</div>

									{/* Tooltip */}
									<div className="absolute left-0 top-full mt-1 opacity-0 group-hover/streak:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
										<div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
											Active streak
										</div>
									</div>
								</div>

								{/* Max Streak */}
								<div className="group/max relative">
									<div className="flex items-center gap-2.5 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 px-3 py-2 rounded-md border border-amber-200/60 dark:border-amber-700/40 transition-all duration-300 hover:scale-105 cursor-pointer hover:shadow-md">
										<div className="flex items-center gap-1.5">
											<div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 shadow-sm">
												<div className="w-full h-full rounded-full bg-gradient-to-r from-amber-300 to-yellow-400 animate-pulse"></div>
											</div>
											<div className="flex items-baseline gap-0.5">
												<span className="text-sm font-bold text-amber-700 dark:text-amber-300">
													{longestStreak}
												</span>
												<span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
													days
												</span>
											</div>
										</div>
										<div className="w-px h-4 bg-amber-300 dark:bg-amber-600"></div>
										<span className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold uppercase tracking-wider">
											Best
										</span>
									</div>

									{/* Tooltip */}
									<div className="absolute left-0 top-full mt-1 opacity-0 group-hover/max:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
										<div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
											Personal record
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Compact yearly heatmap - single continuous grid */}
					<div className="relative mb-4">
						<div className="bg-gray-50/40 dark:bg-gray-800/40 rounded-xl p-3 border border-gray-200/40 dark:border-gray-700/40">
							{/* Main grid - using flexbox to create compact rows */}
							<div className="flex flex-wrap gap-0.5 justify-center">
								{overallData.map((day, dayIndex) => (
									<div
										key={dayIndex}
										className={`
    w-5 h-5 rounded-sm transition-all duration-200
    hover:scale-110 hover:shadow-sm cursor-pointer
    ${day === 1
												? "text-white shadow-sm "
												: day === 0
													? "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
													: day === -1
														? "bg-gray-100/30 dark:bg-gray-800/30 border border-dashed border-gray-300 dark:border-gray-600"
														: day === -2
															? " border border-dashed"
															: "bg-gray-100/50 border border-gray-200 dark:border-gray-700"
											}
  `}
										style={{
											backgroundColor: day === 1 ? habit.color : undefined,
											borderColor: day === -2 ? habit.color : undefined,
										}}
										title={`Day ${dayIndex + 1}: ${day === 1
											? "Completed"
											: day === 0
												? "Not completed"
												: day === -1
													? "Future date"
													: day === -2
														? "Not scheduled"
														: "No data"
											}`}
									/>
								))}
							</div>

							{/* Legend */}
							<div className="flex justify-center items-center text-xs text-gray-500 dark:text-gray-400 font-medium mt-4 gap-4 lg:gap-6 px-4 py-2 uppercase flex-wrap">
								<div className="flex items-center gap-2">
									<div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
									<span>Incomplete</span>
								</div>

								<div className="flex items-center gap-2">
									<div
										className="w-4 h-4 rounded-sm"
										style={{ backgroundColor: habit.color }}
									></div>
									<span>Completed</span>
								</div>

								<div className="flex items-center gap-2">
									<div
										className="w-4 h-4 rounded-sm bg-gray-100/30 dark:bg-gray-800/30 border border-dashed"
										style={{ borderColor: habit.color }}
									></div>
									<span>Skipped</span>
								</div>

								<div className="flex items-center gap-2">
									<div className="w-4 h-4 rounded-sm bg-gray-100/30 dark:bg-gray-800/30 border border-dashed border-gray-300 dark:border-gray-600"></div>
									<span>Skipped</span>
								</div>

								{/* <div className="flex items-center gap-2"> */}
								{/*   <div className="w-4 h-4 rounded-sm bg-gray-100/30 dark:bg-gray-800/30 border border-dashed border-gray-300 dark:border-gray-600"></div> */}
								{/*   <span>Upcoming</span> */}
								{/* </div> */}
							</div>
						</div>
					</div>

					<div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
						<div
							className="h-full rounded-full transition-all duration-700"
							style={{
								backgroundColor: habit.color,
								width: `${percentage}%`,
							}}
						/>
					</div>
				</>
			</>
		);
	};

	const hasHabitsWithData = Array.isArray(habits) && habits.some((habit) => {
		if (!habit || typeof habit.id === "undefined") return false;

		const processedData = analyticsData?.[habit.id]?.[viewType] ?? [];

		// Explicitly check for presence, not just truthiness
		return processedData !== undefined && processedData !== null;
	});

	// If no habits or no valid data, show placeholder
	if (!Array.isArray(habits) || habits.length === 0 || !hasHabitsWithData) {
		return <EmptyState type="stats" />;
	}

	return (
		<div
			className={`grid gap-5 ${viewType === "monthly"
				? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
				: "grid-cols-1 md:grid-cols-2"
				}`}
		>
			{habits?.map((habit) => {
				const processedData = analyticsData?.[habit.id]?.[viewType] ?? [];
				if (!processedData) return null;

				return (
					<div
						key={habit.id}
						className={`
              relative overflow-hidden
              bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl
              border border-gray-200/60 dark:border-gray-800/60
              rounded-2xl p-6
              shadow-sm hover:shadow-lg dark:shadow-gray-900/20
              transition-all duration-300 ease-out
              hover:scale-[1.02] hover:-translate-y-1
              group
            `}
						style={{
							boxShadow:
								"0 4px 20px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)",
						}}
					>
						{/* Subtle gradient overlay */}
						<div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-gray-50/40 dark:from-gray-800/40 dark:via-transparent dark:to-gray-900/40 pointer-events-none" />

						{viewType === "monthly"
							? renderMonthlyHeatmap(processedData)
							: renderYearlyHeatmap(processedData)}

						{/* iOS-style card indicator */}
						<div className="absolute top-3 right-3 w-1 h-6 bg-gradient-to-b from-gray-200 dark:from-gray-600 to-transparent rounded-full opacity-30" />
					</div>
				);
			})}
		</div>
	);
};

export default AnalyticsGrid;
