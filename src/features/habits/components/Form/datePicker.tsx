import React, { useState } from "react";
import { Calendar } from "lucide-react";

interface DatePickerProps {
	startDate?: Date;
	endDate?: Date | null;
	onStartDateChange: (date: Date) => void;
	onEndDateChange: (date: Date | null) => void;
	onClose?: () => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
	startDate = new Date(),
	endDate = null,
	onStartDateChange,
	onEndDateChange,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [tempStartDate, setTempStartDate] = useState(startDate);
	const [tempEndDate, setTempEndDate] = useState<Date | null>(endDate);
	const [hasEndDate, setHasEndDate] = useState(endDate !== null);

	const formatDate = (date: Date) =>
		new Intl.DateTimeFormat("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
			year: "numeric",
		}).format(date);

	const formatDateInput = (date: Date) => date.toISOString().split("T")[0];

	const getTodayString = () => new Date().toISOString().split("T")[0];

	const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newDate = new Date(e.target.value);
		setTempStartDate(newDate);
		if (tempEndDate && tempEndDate < newDate) {
			setTempEndDate(null);
			setHasEndDate(false);
		}
	};

	const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newDate = new Date(e.target.value);
		setTempEndDate(newDate);
	};

	const handleEndDateToggle = (enabled: boolean) => {
		setHasEndDate(enabled);
		if (!enabled) {
			setTempEndDate(null);
		} else if (!tempEndDate) {
			const tomorrow = new Date(tempStartDate);
			tomorrow.setDate(tomorrow.getDate() + 1);
			setTempEndDate(tomorrow);
		}
	};

	const handleSave = () => {
		onStartDateChange(tempStartDate);
		onEndDateChange(hasEndDate ? tempEndDate : null);
		setIsOpen(false);
	};

	const handleCancel = () => {
		setTempStartDate(startDate);
		setTempEndDate(endDate);
		setHasEndDate(endDate !== null);
		setIsOpen(false);
	};

	const getMinEndDate = () => {
		const minDate = new Date(tempStartDate);
		minDate.setDate(minDate.getDate() + 1);
		return formatDateInput(minDate);
	};

	return (
		<div className="w-full max-w-md mx-auto">
			{/* Trigger Button */}
			<button
				onClick={() => setIsOpen(true)}
				className="group w-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-6  hover:shadow-md transition-all duration-300 hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-600 backdrop-blur-sm"
			>
				<div className="flex items-center gap-4">
					<div className="relative p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-110">
						<Calendar className="w-6 h-6 text-white" />
						<div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl opacity-0 group-hover:opacity-50 transition-all duration-300"></div>
					</div>
					<div className="flex-1 text-left">
						<div className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-1">
							Habit Duration
						</div>
						<div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
							{formatDate(startDate)} –{" "}
							{endDate ? formatDate(endDate) : "∞ Never"}
						</div>
					</div>
					<div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full opacity-60 group-hover:opacity-100 transition-all duration-300"></div>
				</div>
			</button>

			{/* Modal */}
			{isOpen && (
				<div
					className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex justify-center items-center p-4 animate-in fade-in duration-300"
					role="dialog"
					aria-modal="true"
					onClick={(e) => e.target === e.currentTarget && handleCancel()}
				>
					<div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md max-h-[70vh] overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-300 border border-gray-200/50 dark:border-gray-700/50 flex flex-col">
						{/* Header */}
						<div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 flex-shrink-0">
							<button
								onClick={handleCancel}
								className="px-3 py-1.5 text-gray-600 dark:text-gray-400 font-medium hover:text-gray-800 dark:hover:text-gray-200 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-sm"
							>
								Cancel
							</button>
							<h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
								Select Dates
							</h3>
							<button
								onClick={handleSave}
								className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-sm"
							>
								Done
							</button>
						</div>

						{/* Content */}
						<div className="p-4 space-y-6 overflow-y-auto flex-1">
							{/* Start Date */}
							<div className="space-y-3 animate-in slide-in-from-left duration-300 delay-100">
								<label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
									🚀 Start Date
								</label>
								<div className="relative group">
									<input
										type="date"
										value={formatDateInput(tempStartDate)}
										onChange={handleStartDateChange}
										min={getTodayString()}
										className="w-full p-4 text-base border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg focus:shadow-xl appearance-none font-medium"
									/>
									<Calendar className="absolute text-gray-400 pointer-events-none group-hover:text-blue-500 transition-colors duration-200 w-5 h-5" />
									<div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"></div>
								</div>
							</div>

							{/* End Date */}
							<div className="space-y-4 animate-in slide-in-from-right duration-300 delay-200">
								<div className="flex items-center justify-between">
									<label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
										🎯 End Date
									</label>
									<button
										onClick={() => handleEndDateToggle(!hasEndDate)}
										className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 ${hasEndDate
												? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg focus:ring-blue-500/20"
												: "bg-gray-200 dark:bg-gray-700 focus:ring-gray-500/20"
											} hover:scale-105`}
									>
										<span
											className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-all duration-300 ${hasEndDate
													? "translate-x-7 shadow-blue-500/25"
													: "translate-x-1"
												}`}
										/>
									</button>
								</div>

								<div className="relative overflow-hidden">
									{hasEndDate ? (
										<div className="relative group animate-in slide-in-from-bottom duration-300">
											<input
												type="date"
												value={tempEndDate ? formatDateInput(tempEndDate) : ""}
												onChange={handleEndDateChange}
												min={getMinEndDate()}
												className="w-full p-4 text-base border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-lg focus:shadow-xl appearance-none font-medium"
											/>
											<Calendar className="absolute  text-gray-400 pointer-events-none group-hover:text-blue-500 transition-colors duration-200 w-5 h-5" />
											<div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"></div>
										</div>
									) : (
										<div className="p-6 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-center transition-all hover:border-gray-400 dark:hover:border-gray-500 animate-in fade-in duration-300">
											<div className="text-2xl mb-1">∞</div>
											<div className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">
												Never
											</div>
											<div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
												This habit continues indefinitely
											</div>
										</div>
									)}
								</div>
							</div>

							{/* Preview */}
							<div className="bg-gradient-to-br from-blue-50 via-blue-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50 shadow-inner animate-in slide-in-from-bottom duration-300 delay-300">
								<div className="flex items-center gap-2 mb-2">
									<div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"></div>
									<div className="text-xs font-bold text-blue-900 dark:text-blue-300">
										Preview
									</div>
								</div>
								<div className="space-y-1 text-xs">
									<div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
										<span className="font-semibold">From:</span>
										<span className="px-2 py-1 bg-white/50 dark:bg-gray-800/50 rounded-md font-medium">
											{formatDate(tempStartDate)}
										</span>
									</div>
									<div className="flex items-center gap-2 text-blue-800 dark:text-purple-200">
										<span className="font-semibold">Until:</span>
										<span className="px-2 py-1 bg-white/50 dark:bg-gray-800/50 rounded-md font-medium">
											{hasEndDate && tempEndDate
												? formatDate(tempEndDate)
												: "∞ Never"}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default DatePicker;
