import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayData } from "@habits/types";

interface CalendarProps {
	calendarData: DayData[];
	selectedDate: Date;
	onSelectDate: (date: Date) => void;
	onScroll: (direction: "left" | "right") => void;
	scrollToToday: () => void;
	scrollToStart: () => void;
	scrollToEnd: () => void;
	scrollRef: React.RefObject<HTMLDivElement | null>;
}

const Calendar: React.FC<CalendarProps> = ({
	calendarData,
	selectedDate,
	onSelectDate,
	onScroll,
	scrollRef,
	scrollToStart,
	scrollToEnd,
	scrollToToday,
}) => {
	const calculateProgress = (total: number, completed: number) => {
		if (total === 0) return 0;
		return Math.round((completed / total) * 100);
	};

	return (
		<div className="relative px-4 py-3">
			{/* Header section */}
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
					Calendar
				</h2>

				{/* Navigation controls - iOS style */}
				<div className="flex items-center gap-2">
					<button
						onClick={scrollToStart}
						className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
					>
						Start
					</button>
					<button
						onClick={scrollToToday}
						className="text-sm px-3 py-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 font-medium"
					>
						Today
					</button>
					<button
						onClick={scrollToEnd}
						className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
					>
						End
					</button>
					<button
						onClick={() => onScroll("left")}
						className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
					>
						<ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
					</button>
					<button
						onClick={() => onScroll("right")}
						className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
					>
						<ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
					</button>
				</div>
			</div>

			{/* Calendar container */}
			<div className="relative">
				{/* Subtle fade edges */}
				<div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />
				<div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />

				<div
					ref={scrollRef as React.RefObject<HTMLDivElement>}
					className="flex gap-3 pb-4 px-2 scrollbar-hide relative"
					style={{
						overflowX: "auto",
						overflowY: "visible",
						position: "relative",
						scrollbarWidth: "none",
						msOverflowStyle: "none",
						WebkitOverflowScrolling: "touch",
					}}
				>
					{calendarData.map((day, index) => {
						const isSelected =
							selectedDate.toDateString() === day.date.toDateString();
						const isToday = day.isToday;
						const progress = calculateProgress(
							day.taskCount,
							day.completedTasks,
						);
						const isComplete = progress === 100;

						const dayName = day.date
							.toLocaleDateString("en-US", { weekday: "short" })
							.toUpperCase();

						// Check if day is in the future
						const isFuture = day.date > new Date();
						const isPast = day.date < new Date() && !isToday;

						// iOS-style minimal design with proper light/dark theme support
						const getCardStyles = () => {
							if (isComplete) {
								return "bg-blue-500 dark:bg-blue-600 border border-blue-400 dark:border-blue-500 shadow-lg";
							}
							if (isSelected) {
								return "bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 shadow-md";
							}
							if (isToday) {
								return "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md";
							}
							return "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm";
						};

						const getTextColor = () => {
							if (isComplete) {
								return "text-white";
							}
							if (isSelected) {
								return "text-blue-600 dark:text-blue-400";
							}
							if (isToday) {
								return "text-gray-900 dark:text-white";
							}
							if (isFuture) {
								return "text-gray-400 dark:text-gray-500";
							}
							return "text-gray-600 dark:text-gray-400";
						};

						const getDateColor = () => {
							if (isComplete) {
								return "text-white";
							}
							if (isSelected) {
								return "text-blue-600 dark:text-blue-400";
							}
							if (isToday) {
								return "text-gray-900 dark:text-white";
							}
							if (isFuture) {
								return "text-gray-400 dark:text-gray-500";
							}
							return "text-gray-900 dark:text-white";
						};

						return (
							<div key={index} className="relative flex-shrink-0">
								<div
									className={`
                    flex flex-col items-center gap-2 px-3 py-4 rounded-full
                    transition-all duration-200 ease-out
                    hover:scale-[1.02] hover:shadow-lg
                    ${getCardStyles()}
                  `}
								>
									{/* Day name */}
									<div
										className={`text-xs font-medium tracking-wide ${getTextColor()}`}
									>
										{dayName}
									</div>

									{/* Date with progress ring */}
									<button
										onClick={() => onSelectDate(day.date)}
										className={`
                      w-12 h-12 rounded-full relative
                      flex items-center justify-center
                      cursor-pointer transition-all duration-200 ease-out
                      active:scale-95 hover:scale-105
                      ${isComplete
												? "bg-white/20"
												: isSelected
													? "bg-white dark:bg-gray-800"
													: isToday
														? "bg-white dark:bg-gray-700"
														: "bg-gray-50 dark:bg-gray-800"
											}
                    `}
									>
										{/* Progress ring - minimal iOS style */}
										{!isFuture && progress > 0 && (
											<div className="absolute inset-0 rounded-full">
												<svg
													className="w-full h-full transform -rotate-90"
													viewBox="0 0 100 100"
												>
													{/* Background circle */}
													<circle
														cx="50"
														cy="50"
														r="46"
														fill="none"
														stroke="currentColor"
														strokeWidth="3"
														className="text-gray-200 dark:text-gray-700"
													/>
													{/* Progress circle */}
													<circle
														cx="50"
														cy="50"
														r="46"
														fill="none"
														stroke="currentColor"
														strokeWidth="3"
														strokeLinecap="round"
														strokeDasharray={`${progress * 2.89} 289`}
														className={
															isSelected
																? "text-blue-500 dark:text-blue-400"
																: "text-blue-500 dark:text-blue-400"
														}
														style={{
															transition: "stroke-dasharray 0.3s ease-out",
														}}
													/>
												</svg>
											</div>
										)}

										{/* Future days - just circle outline */}
										{isFuture && (
											<div className="absolute inset-0 rounded-full">
												<svg className="w-full h-full" viewBox="0 0 100 100">
													<circle
														cx="50"
														cy="50"
														r="46"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														className="text-gray-300 dark:text-gray-600"
													/>
												</svg>
											</div>
										)}

										{/* Complete days - filled circle */}
										{isComplete && (
											<div className="absolute inset-0 rounded-full">
												<svg className="w-full h-full" viewBox="0 0 100 100">
													<circle
														cx="50"
														cy="50"
														r="46"
														fill="none"
														stroke="currentColor"
														strokeWidth="3"
														className="text-white/30"
													/>
													<circle
														cx="50"
														cy="50"
														r="46"
														fill="none"
														stroke="currentColor"
														strokeWidth="3"
														className="text-white"
													/>
												</svg>
											</div>
										)}

										{/* Date number */}
										<span
											className={`
                        text-lg font-semibold z-10 transition-colors duration-200
                        ${getDateColor()}
                      `}
										>
											{day.date.getDate()}
										</span>

										{/* Completion indicator - blue dot */}
										{isComplete && (
											<div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-gray-900 shadow-sm flex items-center justify-center">
												<div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"></div>
											</div>
										)}

										{/* Progress percentage for incomplete days */}
										{!isComplete && !isFuture && progress > 0 && (
											<div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-gray-900 shadow-sm flex items-center justify-center border border-gray-200 dark:border-gray-700">
												<span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
													{progress}
												</span>
											</div>
										)}
									</button>

									{/* No progress text needed anymore since we show it in the circle */}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Simple scroll indicator */}
			<div className="flex justify-center mt-4">
				<div className="w-8 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
					<div className="w-1/3 h-full bg-gray-400 dark:bg-gray-500 rounded-full" />
				</div>
			</div>
		</div>
	);
};

export default Calendar;
