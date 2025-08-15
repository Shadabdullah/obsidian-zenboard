import React, { useState, useRef } from "react";
import { Calendar } from "lucide-react";

interface DatePickerProps {
	startDate?: Date;
	endDate?: Date | null;
	onStartDateChange: (date: Date) => void;
	onEndDateChange: (date: Date | null) => void;
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

	const startDateInputRef = useRef<HTMLInputElement>(null);
	const endDateInputRef = useRef<HTMLInputElement>(null);

	// Date formatting utilities
	const formatDisplayDate = (date: Date) =>
		new Intl.DateTimeFormat("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
			year: "numeric",
		}).format(date);

	const formatInputDate = (date: Date) => date.toISOString().split("T")[0];
	const getTodayString = () => formatInputDate(new Date());

	// Date handlers
	const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newDate = new Date(e.target.value);
		setTempStartDate(newDate);
		if (tempEndDate && tempEndDate < newDate) {
			setTempEndDate(null);
		}
	};

	const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTempEndDate(new Date(e.target.value));
	};

	const toggleEndDate = (enabled: boolean) => {
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
		return formatInputDate(minDate);
	};

	const triggerDatePicker = (ref: React.RefObject<HTMLInputElement>) => {
		(ref.current as HTMLInputElement & { showPicker: () => void }).showPicker();
	};

	return (
		<div className="space-y-4">
			{/* Trigger Button */}
			<button
				onClick={() => setIsOpen(true)}
				className="group w-full bg-secondary border-default rounded-m px-4 py-3 hover:bg-hover hover:border-hover transition-all duration-200 flex items-center justify-between"
				aria-label="Open date picker"
			>
				<div className="flex items-center gap-3">
					<Calendar className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
					<div className="text-left">
						<div className="text-sm font-medium text-default">
							{formatDisplayDate(startDate)} – {endDate ? formatDisplayDate(endDate) : "∞ Never"}
						</div>
					</div>
				</div>
				<div className="w-1.5 h-1.5 bg-accent rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
			</button>

			{/* Modal */}
			{isOpen && (
				<div
					className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex justify-center items-center p-4 animate-in fade-in duration-300"
					onClick={(e) => e.target === e.currentTarget && handleCancel()}
				>
					<div className="bg-primary rounded-l shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-300 border-default flex flex-col">
						{/* Modal Header */}
						<div className="flex items-center justify-between p-4 border-b border-default bg-secondary">
							<button
								onClick={handleCancel}
								className="px-3 py-2 text-muted font-medium hover:text-accent transition-all duration-200 hover:bg-hover rounded-s text-sm"
							>
								Cancel
							</button>
							<h3 className="text-lg font-bold text-default">Select Duration</h3>
							<button
								onClick={handleSave}
								className="px-4 py-2 btn-accent font-medium rounded-s hover:btn-accent-hover transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
							>
								Done
							</button>
						</div>

						{/* Modal Content */}
						<div className="p-4 space-y-5 overflow-y-auto">
							{/* Start Date Picker */}
							<div className="space-y-2 animate-in slide-in-from-left duration-300 delay-100">
								<label className="block text-sm font-medium text-default">
									🚀 Start Date
								</label>
								<div className="relative group">
									<input
										type="date"
										ref={startDateInputRef}
										value={formatInputDate(tempStartDate)}
										onChange={handleStartDateChange}
										min={getTodayString()}
										className="w-full text-base border-default rounded-m bg-secondary text-default focus:border-focus focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 hover:border-hover hover:shadow-md focus:shadow-lg appearance-none font-medium [&::-webkit-calendar-picker-indicator]:opacity-0"
									/>
									<button
										type="button"
										className="absolute right-3 top-1/2 -translate-y-1/2 shadow-none focus:outline-non bg-transparent"
										onClick={() => triggerDatePicker(startDateInputRef)}
									>
										<Calendar className="w-5 h-5" />
									</button>
								</div>
							</div>

							{/* End Date Picker */}
							<div className="space-y-3 animate-in slide-in-from-right duration-300 delay-200">
								<div className="flex items-center justify-between">
									<label className="text-sm font-medium text-default">
										🎯 End Date
									</label>
									<button
										onClick={() => toggleEndDate(!hasEndDate)}
										className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${hasEndDate ? "bg-accent" : "bg-hover"}`}
									>
										<span
											className={`inline-block h-4 w-4 transform rounded-full bg-primary shadow-sm transition-all ${hasEndDate ? "translate-x-3" : "translate-x-0"
												}`}
										/>
									</button>
								</div>

								{hasEndDate ? (
									<div className="relative group animate-in slide-in-from-bottom duration-300">
										<input
											type="date"
											ref={endDateInputRef}
											value={tempEndDate ? formatInputDate(tempEndDate) : ""}
											onChange={handleEndDateChange}
											min={getMinEndDate()}
											className="w-full text-base border-default rounded-m bg-secondary text-default focus:border-focus focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 hover:border-hover hover:shadow-md focus:shadow-lg appearance-none font-medium [&::-webkit-calendar-picker-indicator]:opacity-0"
										/>
										<button
											type="button"
											className="absolute right-3 top-1/2 -translate-y-1/2 shadow-none focus:outline-non bg-transparent"
											onClick={() => triggerDatePicker(endDateInputRef)}
										>
											<Calendar className="w-5 h-5 " />
										</button>
									</div>
								) : (
									<div className="p-4 bg-secondary rounded-m border-2 border-dashed border-hover text-center transition-all hover:border-focus animate-in fade-in duration-300">
										<div className="text-xl mb-1 text-muted">∞</div>
										<div className="text-base font-semibold text-default mb-1">
											Never
										</div>
										<div className="text-xs text-faint">
											This habit continues indefinitely
										</div>
									</div>
								)}
							</div>

							{/* Preview Section */}
							<div className="bg-active-hover rounded-m p-3 border-default shadow-inner animate-in slide-in-from-bottom duration-300 delay-300">
								<div className="flex items-center gap-2 mb-2">
									<div className="w-1.5 h-1.5 btn-accent rounded-full animate-pulse" />
									<div className="text-xs font-bold text-accent">Preview</div>
								</div>
								<div className="space-y-1 text-xs">
									<div className="flex items-center gap-2 text-default">
										<span className="font-medium">From:</span>
										<span className="px-2 py-1 bg-hover rounded-s font-medium">
											{formatDisplayDate(tempStartDate)}
										</span>
									</div>
									<div className="flex items-center gap-2 text-default">
										<span className="font-medium">Until:</span>
										<span className="px-2 py-1 bg-hover rounded-s font-medium">
											{hasEndDate && tempEndDate
												? formatDisplayDate(tempEndDate)
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
