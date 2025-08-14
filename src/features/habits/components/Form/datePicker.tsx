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
				className="group w-full bg-primary border-default rounded-l px-4-1 py-4-2 hover:bg-hover transition-all duration-300 hover:scale-[1.02] hover:border-hover backdrop-blur-sm"
				style={{
					boxShadow: 'var(--shadow-s)',
				}}
			>
				<div className="flex items-center gap-4-3">
					<div
						className="relative rounded-m shadow-lg group-hover:scale-110 transition-all duration-300"
						style={{
							padding: 'var(--size-4-2)',
							background: 'var(--interactive-accent)',
						}}
					>
						<Calendar className="w-6 h-6 text-on-accent" />
						<div
							className="absolute inset-0 rounded-m opacity-0 group-hover:opacity-50 transition-all duration-300"
							style={{
								background: 'var(--interactive-accent-hover)',
							}}
						/>
					</div>
					<div className="flex-1 text-left">
						<div className="text-lg font-semibold text-default mb-1">
							Habit Duration
						</div>
						<div className="text-sm text-muted font-medium">
							{formatDate(startDate)} –{" "}
							{endDate ? formatDate(endDate) : "∞ Never"}
						</div>
					</div>
					<div
						className="w-2 h-2 rounded-full opacity-60 group-hover:opacity-100 transition-all duration-300"
						style={{
							background: 'var(--interactive-accent)',
						}}
					/>
				</div>
			</button>

			{/* Modal */}
			{isOpen && (
				<div
					className="fixed inset-0 z-50 flex justify-center items-center p-4 animate-in fade-in duration-300"
					style={{
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
						backdropFilter: 'blur(12px)',
					}}
					role="dialog"
					aria-modal="true"
					onClick={(e) => e.target === e.currentTarget && handleCancel()}
				>
					<div
						className="bg-primary rounded-l w-full max-w-md max-h-[70vh] overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-300 border-default flex flex-col"
						style={{
							boxShadow: 'var(--shadow-l)',
						}}
					>
						{/* Header */}
						<div className="flex items-center justify-between border-default bg-secondary flex-shrink-0" style={{ padding: 'var(--size-4-2)', borderBottomWidth: '1px' }}>
							<button
								onClick={handleCancel}
								className="text-muted font-medium hover:text-default transition-all duration-200 hover:bg-hover rounded-s text-sm"
								style={{
									padding: `${parseInt(String(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--size-4-1')) * 0.75))}px ${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--size-4-1'))}px`
								}}
							>
								Cancel
							</button>
							<h3 className="text-lg font-bold text-default">
								Select Dates
							</h3>
							<button
								onClick={handleSave}
								className="btn-accent font-medium rounded-s hover:shadow-xl hover:scale-105 transition-all duration-200 text-sm"
								style={{
									padding: `${parseInt(String(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--size-4-1')) * 0.75))}px ${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--size-4-1'))}px`
								}}
							>
								Done
							</button>
						</div>

						{/* Content */}
						<div className="overflow-y-auto flex-1" style={{ padding: 'var(--size-4-2)', gap: 'var(--size-4-4)' }}>
							<div className="space-y-6">
								{/* Start Date */}
								<div className="space-y-3 animate-in slide-in-from-left duration-300 delay-100">
									<label className="block text-sm font-semibold text-default">
										🚀 Start Date
									</label>
									<div className="relative group">
										<input
											type="date"
											value={formatDateInput(tempStartDate)}
											onChange={handleStartDateChange}
											min={getTodayString()}
											className="w-full text-base bg-secondary text-default border-default rounded-m font-medium focus:border-focus hover:border-hover transition-all duration-300 hover:shadow-lg focus:shadow-xl appearance-none"
											style={{
												padding: 'var(--size-4-2)',
												borderWidth: '2px',
												boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
											}}
										/>
										<Calendar className="absolute text-muted pointer-events-none group-hover:text-accent transition-colors duration-200 w-5 h-5" />
										<div
											className="absolute inset-0 rounded-m opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
											style={{
												background: 'var(--interactive-accent)',
												opacity: '0.05',
											}}
										/>
									</div>
								</div>

								{/* End Date */}
								<div className="space-y-4 animate-in slide-in-from-right duration-300 delay-200">
									<div className="flex items-center justify-between">
										<label className="text-sm font-semibold text-default">
											🎯 End Date
										</label>
										<button
											onClick={() => handleEndDateToggle(!hasEndDate)}
											className="relative inline-flex h-6 w-12 items-center rounded-full transition-all duration-300 focus:outline-none hover:scale-105"
											style={{
												backgroundColor: hasEndDate ? 'var(--interactive-accent)' : 'var(--background-modifier-border)',
												boxShadow: hasEndDate ? 'var(--shadow-s)' : 'none',
											}}
										>
											<span
												className="inline-block h-4 w-4 transform rounded-full shadow-lg transition-all duration-300"
												style={{
													backgroundColor: 'var(--background-primary)',
													transform: hasEndDate ? 'translateX(28px)' : 'translateX(4px)',
												}}
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
													className="w-full text-base bg-secondary text-default border-default rounded-m font-medium focus:border-focus hover:border-hover transition-all duration-300 hover:shadow-lg focus:shadow-xl appearance-none"
													style={{
														padding: 'var(--size-4-2)',
														borderWidth: '2px',
														boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
													}}
												/>
												<Calendar className="absolute text-muted pointer-events-none group-hover:text-accent transition-colors duration-200 w-5 h-5" />
												<div
													className="absolute inset-0 rounded-m opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
													style={{
														background: 'var(--interactive-accent)',
														opacity: '0.05',
													}}
												/>
											</div>
										) : (
											<div
												className="bg-secondary rounded-m text-center transition-all hover:bg-hover animate-in fade-in duration-300"
												style={{
													padding: 'var(--size-4-4)',
													border: '2px dashed var(--background-modifier-border)',
												}}
											>
												<div className="text-2xl mb-1">∞</div>
												<div className="text-lg font-bold text-default mb-1">
													Never
												</div>
												<div className="text-xs text-muted font-medium">
													This habit continues indefinitely
												</div>
											</div>
										)}
									</div>
								</div>

								{/* Preview */}
								<div
									className="bg-secondary rounded-m border-default animate-in slide-in-from-bottom duration-300 delay-300"
									style={{
										padding: 'var(--size-4-2)',
										boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
										background: `linear-gradient(135deg, 
                      var(--background-secondary) 0%, 
                      var(--background-modifier-hover) 100%)`,
									}}
								>
									<div className="flex items-center gap-2 mb-2">
										<div
											className="w-2 h-2 rounded-full animate-pulse"
											style={{
												background: 'var(--interactive-accent)',
											}}
										/>
										<div className="text-xs font-bold text-accent">
											Preview
										</div>
									</div>
									<div className="space-y-1 text-xs">
										<div className="flex items-center gap-2 text-default">
											<span className="font-semibold">From:</span>
											<span
												className="rounded-s font-medium"
												style={{
													padding: '4px 8px',
													backgroundColor: 'var(--background-primary)',
													opacity: '0.8',
												}}
											>
												{formatDate(tempStartDate)}
											</span>
										</div>
										<div className="flex items-center gap-2 text-default">
											<span className="font-semibold">Until:</span>
											<span
												className="rounded-s font-medium"
												style={{
													padding: '4px 8px',
													backgroundColor: 'var(--background-primary)',
													opacity: '0.8',
												}}
											>
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
				</div>
			)}
		</div>
	);
};

export default DatePicker;
