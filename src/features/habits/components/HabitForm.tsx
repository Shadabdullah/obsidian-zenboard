import { HabitData } from "@habits/types";
import { formatLocalDate } from "@habits/utils";
import React, { useState } from "react";
import {
	X,
	Clock,
	CheckCircle,
	BarChart3,
	Bell,
	ChevronDown,
	Plus,
	Minus,
	Droplets,
} from "lucide-react";

import { HabitStore } from "@habits/store";
import habitIcons from "./Form/icons";
import DatePicker from "./Form/datePicker";
import Modal from "./Form/Modal";

// ================================================================================================
// INTERFACES
// ================================================================================================

interface HabitFormModalProps {
	isOpen: boolean;
	onClose: () => void;
}

// ================================================================================================
// MAIN COMPONENT
// ================================================================================================

const HabitForm: React.FC<HabitFormModalProps> = ({ isOpen, onClose }) => {
	// ==============================================================================================
	// STATE INITIALIZATION
	// ==============================================================================================

	const [modal, setModal] = useState({
		title: "",
		description: "",
		isOpen: false,
	});

	// Habit form data
	const [habitName, setHabitName] = useState("");
	const [trackingType, setTrackingType] = useState<"task" | "amount" | "time">(
		"time",
	);
	const [timeValue, setTimeValue] = useState(15);
	const [targetCount, setTargetCount] = useState(1);
	const [selectedDays, setSelectedDays] = useState<string[]>([
		"MO",
		"TU",
		"WE",
		"TH",
		"FR",
		"SA",
		"SU",
	]);
	const [repeatability, setRepeatability] = useState("weekdays");
	const [repeatInterval, setRepeatInterval] = useState(1);
	const [selectedColor, setSelectedColor] = useState("#3B82F6");
	const [selectedIcon, setSelectedIcon] = useState("Droplets");

	// UI state
	const [isRepeatDropdownOpen, setIsRepeatDropdownOpen] = useState(false);
	const [showColorPicker, setShowColorPicker] = useState(false);
	const [showIconPicker, setShowIconPicker] = useState(false);
	const [customColor, setCustomColor] = useState("#3B82F6");

	// ==============================================================================================
	// CONSTANTS
	// ==============================================================================================

	const days = [
		{ key: "MO", label: "Mon", full: "Monday" },
		{ key: "TU", label: "Tue", full: "Tuesday" },
		{ key: "WE", label: "Wed", full: "Wednesday" },
		{ key: "TH", label: "Thu", full: "Thursday" },
		{ key: "FR", label: "Fri", full: "Friday" },
		{ key: "SA", label: "Sat", full: "Saturday" },
		{ key: "SU", label: "Sun", full: "Sunday" },
	];

	const defaultColors = [
		"#3B82F6",
		"#10B981",
		"#F59E0B",
		"#EF4444",
		"#8B5CF6",
		"#EC4899",
		"#06B6D4",
		"#84CC16",
		"#F97316",
		"#6366F1",
		"#14B8A6",
		"#F43F5E",
	];

	const repeatOptions = [
		{ value: "weekdays", label: "Selected week days" },
		{ value: "daily", label: "Every day" },
		{ value: "every_few_days", label: "Every few days" },
		{ value: "weekly", label: "Weekly" },
		{ value: "monthly", label: "Monthly" },
	];

	const trackingTypes = [
		{ type: "task" as const, icon: CheckCircle, label: "Task" },
		{ type: "amount" as const, icon: BarChart3, label: "Amount" },
		{ type: "time" as const, icon: Clock, label: "Time" },
	];

	// ==============================================================================================
	// EVENT HANDLERS
	// ==============================================================================================
	// === Helpers =====================================================================================

	// === Component State =============================================================================
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState<Date | null>(null);

	// === Event Handlers ==============================================================================

	// ==============================================================================================
	// DATE FUCNTIONS ENDS HERE
	// ==============================================================================================

	const toggleDay = (day: string) => {
		setSelectedDays((prev) =>
			prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
		);
	};

	const handleRepeatabilityChange = (value: string) => {
		setRepeatability(value);
		setIsRepeatDropdownOpen(false);

		// Set default days based on selection
		if (value === "weekdays") {
			setSelectedDays(["MO", "TU", "WE", "TH", "FR"]);
		} else if (value === "daily") {
			setSelectedDays(["MO", "TU", "WE", "TH", "FR", "SA", "SU"]);
		} else if (value === "weekly") {
			setSelectedDays([
				new Date().toLocaleDateString("en", { weekday: "short" }).charAt(0),
			]);
		} else if (value === "every_few_days") {
			setSelectedDays([]); // ✅ clear selected days
		} else if (value === "monthly") {
			setSelectedDays([]); // ✅ clear selected days
			setRepeatInterval(1); // ✅ reset interval to 1
		}
	};

	const handleColorSelect = (color: string) => {
		setSelectedColor(color);
		setShowColorPicker(false);
	};

	const handleCustomColorSelect = () => {
		setSelectedColor(customColor);
		setShowColorPicker(false);
	};

	const handleIconSelect = (iconName: string) => {
		setSelectedIcon(iconName);
		setShowIconPicker(false);
	};

	const getSelectedIcon = () => {
		const iconData = habitIcons.find((h) => h.name === selectedIcon);
		return iconData ? iconData.icon : Droplets;
	};

	const handleIncrement = (
		setValue: (value: number) => void,
		currentValue: number,
	) => {
		setValue(Math.max(1, currentValue + 1));
	};

	const handleDecrement = (
		setValue: (value: number) => void,
		currentValue: number,
	) => {
		setValue(Math.max(1, currentValue - 1));
	};

	const handleInputChange = (
		setValue: (value: number) => void,
		value: string,
	) => {
		const parsed = parseInt(value);
		if (value === "") {
			setValue(1);
		} else if (!isNaN(parsed) && parsed >= 1) {
			setValue(parsed);
		}
	};

	// ==============================================================================================
	// UTILITY FUNCTIONS
	// ==============================================================================================
	//

	const resetForm = () => {
		setHabitName("");
		setTrackingType("time");
		setTimeValue(15);
		setTargetCount(1);
		setSelectedDays(["MO", "TU", "WE", "TH", "FR", "SA", "SU"]);
		setRepeatability("weekdays");
		setRepeatInterval(1);
		setSelectedColor("#3B82F6");
		setSelectedIcon("Droplets");
		setStartDate(new Date());
		setEndDate(null);
		setShowColorPicker(false);
		setShowIconPicker(false);
		setIsRepeatDropdownOpen(false);
	};

	const handleSave = async () => {
		if (!habitName.trim()) return;

		const formatedDate = formatLocalDate(startDate, endDate);
		const formattedStartDate = "2025-7-1"
		const formattedEndDate: string = formatedDate.formattedEnd;

		const habitData: HabitData =
			trackingType === "time"
				? {
					trackingType: "time",
					name: habitName,
					timeValue: timeValue * 60,
					timerElapsed: 0,
					isTimerRunning: false,
					selectedDays,
					repeatability,
					repeatInterval,
					startDate: formattedStartDate,
					endDate: formattedEndDate || "Never",
					color: selectedColor,
					icon: selectedIcon,
				}
				: trackingType === "amount"
					? {
						trackingType: "amount",
						name: habitName,
						targetCount,
						counterValue: 0,
						selectedDays,
						repeatability,
						repeatInterval,
						startDate: formattedStartDate,
						endDate: formattedEndDate || "Never",
						color: selectedColor,
						icon: selectedIcon,
					}
					: {
						trackingType: "task",
						name: habitName,
						selectedDays,
						repeatability,
						repeatInterval,
						startDate: formattedStartDate,
						endDate: formattedEndDate || "Never",
						color: selectedColor,
						icon: selectedIcon,
					};

		try {
			const { addHabit } = HabitStore.getState();
			await addHabit(habitData);
			resetForm();
			onClose();
		} catch (error) {
			setModal({
				title: "Error",
				description: "Something went wrong while saving the habit.",
				isOpen: true,
			});
			console.error("Error saving habit:", error);
		}
	};

	// ==============================================================================================
	// RENDER CONDITIONS
	// ==============================================================================================

	if (!isOpen) return null;

	// ==============================================================================================
	// MAIN RENDER
	// ==============================================================================================

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Backdrop Overlay */}
			<div
				className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-300"
				onClick={onClose}
			/>

			{/* Main Modal Container */}
			<div className="relative w-full max-w-4xl bg-primary rounded-3xl shadow-2xl transform transition-all duration-300 scale-100 opacity-100 max-h-[90vh] overflow-y-auto">
				{/* ======================================================================================== */}
				{/* MODAL HEADER */}
				{/* ======================================================================================== */}

				<div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-primary border-b border-hover rounded-t-3xl">
					<h1 className="text-default text-xl font-semibold">
						New Habit
					</h1>
					<button
						onClick={onClose}
						className="text-muted hover:text-default transition-colors duration-200 p-2 hover:bg-hover rounded-m"
					>
						<X size={24} />
					</button>
				</div>

				{/* ======================================================================================== */}
				{/* MODAL CONTENT */}
				{/* ======================================================================================== */}

				<div className="p-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* ==================================================================================== */}
						{/* LEFT COLUMN */}
						{/* ==================================================================================== */}

						<div className="space-y-6">
							{/* Habit Name Input */}
							<div className="space-y-2">
								<label className="text-muted text-sm font-medium">
									Name
								</label>
								<input
									type="text"
									value={habitName}
									onChange={(e) => setHabitName(e.target.value)}
									className="w-full bg-secondary border-default rounded-xl px-4 py-3 text-default placeholder-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
									placeholder="Enter habit name"
								/>
							</div>

							{/* Tracking Type Selection */}
							<div className="space-y-4">
								<label className="text-muted text-sm font-medium">
									Track
								</label>

								<div className="grid grid-cols-3 gap-2">
									{trackingTypes.map(({ type, icon: Icon, label }) => (
										<button
											key={type}
											onClick={() => setTrackingType(type)}
											className={`flex flex-col items-center justify-center py-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${trackingType === type
												? "bg-blue-500 text-white shadow-lg"
												: "bg-secondary text-muted hover:bg-hover"
												}`}
										>
											<Icon size={24} className="mb-2" />
											<span className="text-sm font-medium">{label}</span>
										</button>
									))}
								</div>

								{/* Time Value Input */}
								{trackingType === "time" && (
									<div className="relative flex items-center justify-between p-4 bg-secondary border-default rounded-xl">
										<button
											onClick={() => handleDecrement(setTimeValue, timeValue)}
											className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/80 hover:bg-primary hover:shadow-md transition-all duration-200 active:scale-95 border-hover"
										>
											<Minus size={18} className="text-muted" />
										</button>

										<div className="flex items-center justify-center space-x-3">
											<Clock
												size={24}
												className="text-muted"
											/>
											<div className="flex items-center space-x-2">
												<input
													type="number"
													value={timeValue}
													onChange={(e) =>
														handleInputChange(setTimeValue, e.target.value)
													}
													className="bg-transparent text-default text-center text-2xl font-bold focus:outline-none w-16 border-b-2 border-transparent focus:border-blue-400 transition-all duration-300"
													placeholder="15"
													min="1"
												/>
												<span className="text-muted text-lg font-medium">
													min
												</span>
											</div>
										</div>

										<button
											onClick={() => handleIncrement(setTimeValue, timeValue)}
											className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/80 hover:bg-primary hover:shadow-md transition-all duration-200 active:scale-95 border-hover"
										>
											<Plus size={18} className="text-muted" />
										</button>
									</div>
								)}

								{/* Amount Value Input */}
								{trackingType === "amount" && (
									<div className="relative flex items-center justify-between p-4 bg-secondary border-default rounded-xl">
										<button
											onClick={() =>
												handleDecrement(setTargetCount, targetCount)
											}
											className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/80 hover:bg-primary hover:shadow-md transition-all duration-200 active:scale-95 border-hover"
										>
											<Minus size={18} className="text-muted" />
										</button>

										<div className="flex items-center justify-center space-x-3">
											<BarChart3
												size={24}
												className="text-muted"
											/>
											<div className="flex items-center space-x-2">
												<input
													type="number"
													value={targetCount}
													onChange={(e) =>
														handleInputChange(setTargetCount, e.target.value)
													}
													className="bg-transparent text-default text-center text-2xl font-bold focus:outline-none w-16 border-b-2 border-transparent focus:border-green-400 transition-all duration-300"
													placeholder="1"
													min="1"
												/>
												<span className="text-muted text-lg font-medium">
													times
												</span>
											</div>
										</div>

										<button
											onClick={() =>
												handleIncrement(setTargetCount, targetCount)
											}
											className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/80 hover:bg-primary hover:shadow-md transition-all duration-200 active:scale-95 border-hover"
										>
											<Plus size={18} className="text-muted" />
										</button>
									</div>
								)}
							</div>

							{/* Color & Icon Selection */}
							<div className="space-y-4">
								<label className="text-muted text-sm font-medium">
									Color & Icon
								</label>

								{/* Icon Selection */}
								<div>
									<div className="flex items-center space-x-2 mb-4">
										{habitIcons.slice(0, 7).map(({ name, icon: Icon }) => (
											<button
												key={name}
												onClick={() => setSelectedIcon(name)}
												className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 ${selectedIcon === name
													? "ring-2 ring-default ring-offset-2 ring-offset-primary"
													: "bg-secondary hover:bg-hover"
													}`}
											>
												<Icon
													size={18}
													className={
														selectedIcon === name
															? "text-default"
															: "text-muted"
													}
												/>
											</button>
										))}
										<button
											onClick={() => setShowIconPicker(true)}
											className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary text-muted hover:scale-110 transition-all duration-200"
										>
											<Plus size={18} />
										</button>
									</div>
								</div>

								{/* Color Selection */}
								<div className="flex items-center space-x-3">
									<div
										className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform duration-200 hover:scale-110"
										style={{ backgroundColor: selectedColor }}
									>
										{React.createElement(getSelectedIcon(), { size: 20 })}
									</div>
									<div className="flex items-center space-x-2">
										{defaultColors.slice(0, 6).map((color) => (
											<button
												key={color}
												onClick={() => setSelectedColor(color)}
												className={`w-8 h-8 rounded-m transition-all duration-200 hover:scale-110 ${selectedColor === color
													? "ring-2 ring-default ring-offset-2 ring-offset-primary"
													: ""
													}`}
												style={{ backgroundColor: color }}
											/>
										))}
										<button
											onClick={() => setShowColorPicker(true)}
											className="w-8 h-8 rounded-m border-2 border-dashed border-hover flex items-center justify-center text-muted hover:scale-110 transition-all duration-200"
										>
											<Plus size={16} />
										</button>
									</div>
								</div>
							</div>
						</div>

						{/* ==================================================================================== */}
						{/* RIGHT COLUMN */}
						{/* ==================================================================================== */}

						<div className="space-y-2">
							{/* Repeatability Settings */}
							<div className="space-y-4">
								<label className="text-muted text-sm font-medium">
									Repeatability
								</label>

								<div className="relative">
									<button
										onClick={() =>
											setIsRepeatDropdownOpen(!isRepeatDropdownOpen)
										}
										className="w-full flex items-center justify-between bg-secondary border-default rounded-xl px-4 py-3 text-default transition-all duration-200 hover:bg-opacity-80"
									>
										<span>
											{
												repeatOptions.find((opt) => opt.value === repeatability)
													?.label
											}
										</span>
										<ChevronDown
											className={`w-5 h-5 transition-transform duration-200 ${isRepeatDropdownOpen ? "rotate-180" : ""
												}`}
										/>
									</button>

									{isRepeatDropdownOpen && (
										<div className="absolute top-full left-0 right-0 mt-2 bg-primary border-default rounded-xl shadow-lg z-20 overflow-hidden">
											{repeatOptions.map((option) => (
												<button
													key={option.value}
													onClick={() =>
														handleRepeatabilityChange(option.value)
													}
													className="w-full text-left px-4 py-3 text-default hover:bg-blue-500 hover:text-white transition-colors duration-150"
												>
													{option.label}
												</button>
											))}
										</div>
									)}
								</div>

								{/* Every Few Days Interval */}
								{repeatability === "every_few_days" && (
									<div className="flex items-center justify-center py-3 bg-secondary border-default rounded-xl">
										<span className="text-default mr-2">
											Every
										</span>
										<input
											type="number"
											value={repeatInterval}
											onChange={(e) =>
												setRepeatInterval(parseInt(e.target.value) || 1)
											}
											className="bg-transparent text-default text-center text-lg font-medium focus:outline-none w-16"
											min="1"
											max="30"
										/>
										<span className="text-default ml-2">
											days
										</span>
									</div>
								)}

								{/* Days Selection */}
								{(repeatability === "weekdays" ||
									repeatability === "weekly") && (
										<div className="flex flex-wrap gap-2 justify-center">
											{days.map(({ key, label }) => (
												<button
													key={key}
													onClick={() =>
														repeatability === "weekdays"
															? toggleDay(key)
															: setSelectedDays([key])
													}
													className={`px-3 py-2 rounded-m text-sm font-medium transition-all duration-300 transform hover:scale-105 ${selectedDays.includes(key)
														? "bg-blue-500 text-white shadow-lg"
														: "bg-secondary text-muted hover:bg-hover"
														}`}
												>
													{label}
												</button>
											))}
										</div>
									)}
							</div>

							{/* Reminders Section */}
							<div className="space-y-2">
								<label className="text-muted text-sm font-medium">
									Reminders
								</label>
								<button className="w-full flex items-center justify-center bg-secondary rounded-xl px-4 py-3 text-muted hover:bg-hover transition-all duration-200">
									<Bell size={20} className="mr-2" />
									This feature is coming soon
								</button>
							</div>

							{/* Date Pickers */}
							<div className="space-y-4">
								<DatePicker
									startDate={startDate}
									endDate={endDate}
									onStartDateChange={setStartDate}
									onEndDateChange={setEndDate}
								/>
							</div>

							{/* Selected Date Range Display */}
						</div>
					</div>

					{/* ======================================================================================== */}
					{/* ACTION BUTTONS */}
					{/* ======================================================================================== */}

					<div className="mt-8 flex justify-end space-x-4">
						<button
							onClick={onClose}
							className="px-6 py-3 bg-secondary text-muted hover:bg-hover font-medium rounded-xl transition-all duration-300 transform hover:scale-105"
						>
							Cancel
						</button>
						<button
							onClick={handleSave}
							disabled={!habitName.trim()}
							className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:bg-blue-600 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Save
						</button>
					</div>
				</div>
			</div>

			{/* ============================================================================================== */}
			{/* COLOR PICKER MODAL */}
			{/* ============================================================================================== */}

			{showColorPicker && (
				<div className="fixed inset-0 z-60 flex items-center justify-center p-4">
					<div
						className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
						onClick={() => setShowColorPicker(false)}
					/>
					<div className="relative bg-primary rounded-2xl shadow-2xl p-6 max-w-sm w-full">
						<h3 className="text-default text-lg font-semibold mb-4">
							Choose Color
						</h3>
						<div className="grid grid-cols-4 gap-3 mb-4">
							{defaultColors.map((color) => (
								<button
									key={color}
									onClick={() => handleColorSelect(color)}
									className={`w-12 h-12 rounded-xl transition-transform duration-200 hover:scale-110 ${selectedColor === color
										? "ring-2 ring-default ring-offset-2 ring-offset-primary"
										: ""
										}`}
									style={{ backgroundColor: color }}
								/>
							))}
						</div>
						<div className="space-y-3">
							<label className="text-muted text-sm font-medium">
								Custom Color
							</label>
							<div className="flex space-x-3">
								<input
									type="color"
									value={customColor}
									onChange={(e) => setCustomColor(e.target.value)}
									className="w-12 h-10 rounded-m border-none cursor-pointer"
								/>
								<button
									onClick={handleCustomColorSelect}
									className="px-4 py-2 bg-blue-500 text-white rounded-m hover:bg-blue-600 transition-colors"
								>
									Select
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* ============================================================================================== */}
			{/* ICON PICKER MODAL */}
			{/* ============================================================================================== */}

			{showIconPicker && (
				<div className="fixed inset-0 z-60 flex items-center justify-center p-4">
					<div
						className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
						onClick={() => setShowIconPicker(false)}
					/>
					<div className="relative bg-primary rounded-2xl shadow-2xl p-6 max-w-lg w-full max-h-96 overflow-y-auto">
						<h3 className="text-default text-lg font-semibold mb-4">
							Choose Icon
						</h3>
						<div className="grid grid-cols-6 gap-3">
							{habitIcons.map(({ name, icon: Icon }) => (
								<button
									key={name}
									onClick={() => handleIconSelect(name)}
									className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 ${selectedIcon === name
										? "ring-2 ring-default ring-offset-2 ring-offset-primary bg-blue-500"
										: "bg-secondary hover:bg-hover"
										}`}
								>
									<Icon
										size={20}
										className={
											selectedIcon === name
												? "text-white"
												: "text-muted"
										}
									/>
								</button>
							))}
						</div>
					</div>
				</div>
			)}

			{/* ============================================================================================== */}
			{/* ERROR MODAL */}
			{/* ============================================================================================== */}

			{modal.isOpen && (
				<Modal
					title={modal.title}
					description={modal.description}
					onClose={() => setModal((prev) => ({ ...prev, isOpen: false }))}
				/>
			)}
		</div>
	);
};

// ================================================================================================
// EXPORT
// ================================================================================================

export default HabitForm;
