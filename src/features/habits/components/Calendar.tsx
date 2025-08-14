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
		<div className="relative px-4-1 py-4-2">
			{/* Header section */}
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-xl font-semibold text-default tracking-tight">
					Calendar
				</h2>

				{/* Navigation controls - iOS style */}
				<div className="flex items-center gap-2">
					<button
						onClick={scrollToStart}
						className="text-sm px-3 py-1.5 rounded-m bg-secondary text-muted hover:bg-hover transition-colors duration-200"
					>
						Start
					</button>
					<button
						onClick={scrollToToday}
						className="text-sm px-3 py-1.5 rounded-m bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 font-medium"
					>
						Today
					</button>
					<button
						onClick={scrollToEnd}
						className="text-sm px-3 py-1.5 rounded-m bg-secondary text-muted hover:bg-hover transition-colors duration-200"
					>
						End
					</button>
					<button
						onClick={() => onScroll("left")}
						className="p-1.5 rounded-m bg-secondary hover:bg-hover transition-colors duration-200"
					>
						<ChevronLeft className="w-4 h-4 text-muted" />
					</button>
					<button
						onClick={() => onScroll("right")}
						className="p-1.5 rounded-m bg-secondary hover:bg-hover transition-colors duration-200"
					>
						<ChevronRight className="w-4 h-4 text-muted" />
					</button>
				</div>
			</div>

			{/* Calendar container */}
			<div className="relative">
				{/* Subtle fade edges */}
				<div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-current to-transparent z-10 pointer-events-none text-primary"
					style={{ color: 'var(--background-primary)' }} />
				<div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-current to-transparent z-10 pointer-events-none text-primary"
					style={{ color: 'var(--background-primary)' }} />

				<div
					ref={scrollRef as React.RefObject<HTMLDivElement>}
					className="flex gap-4-3 pb-4 px-2 scrollbar-hide relative"
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

						// iOS-style minimal design with Obsidian theme support
						const getCardStyles = () => {
							if (isComplete) {
								return "bg-blue-500 border border-blue-400 shadow-lg";
							}
							if (isSelected) {
								return "bg-blue-50 border border-blue-200 shadow-md";
							}
							if (isToday) {
								return "bg-secondary border-default shadow-md";
							}
							return "bg-primary border-default shadow-sm";
						};

						const getTextColor = () => {
							if (isComplete) {
								return "text-white";
							}
							if (isSelected) {
								return "text-blue-600";
							}
							if (isToday) {
								return "text-default";
							}
							if (isFuture) {
								return "text-faint";
							}
							return "text-muted";
						};

						const getDateColor = () => {
							if (isComplete) {
								return "text-white";
							}
							if (isSelected) {
								return "text-blue-600";
							}
							if (isToday) {
								return "text-default";
							}
							if (isFuture) {
								return "text-faint";
							}
							return "text-default";
						};

						const getButtonBg = () => {
							if (isComplete) {
								return "bg-white/20";
							}
							if (isSelected) {
								return "bg-primary";
							}
							if (isToday) {
								return "bg-primary";
							}
							return "bg-secondary";
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
                      ${getButtonBg()}
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
														className="text-muted opacity-30"
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
														className="text-blue-500"
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
														className="text-faint opacity-50"
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
											<div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary shadow-sm flex items-center justify-center">
												<div className="w-2 h-2 rounded-full bg-blue-500"></div>
											</div>
										)}

										{/* Progress percentage for incomplete days */}
										{!isComplete && !isFuture && progress > 0 && (
											<div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary shadow-sm flex items-center justify-center border-default">
												<span className="text-[10px] font-semibold text-blue-600">
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
				<div className="w-8 h-1 bg-secondary rounded-full overflow-hidden">
					<div className="w-1/3 h-full bg-muted rounded-full"
						style={{ backgroundColor: 'var(--text-muted)' }} />
				</div>
			</div>
		</div>
	);
};

export default Calendar;
