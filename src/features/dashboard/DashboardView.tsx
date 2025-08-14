import React, { useState, useEffect } from "react";
import {
	CheckCircle,
	Wallet,
	Settings
} from "lucide-react";
import ExpensesView from "../expenses/ExpensesView";
import HabitsView from "../habits/HabitsView";

type EnabledFeatures = {
	habitTracker: boolean;
	expenseManager: boolean;
};

type Props = {
	enabledFeatures: EnabledFeatures;
};

export default function DashboardView({ enabledFeatures }: Props) {
	const [currentTime, setCurrentTime] = useState(new Date());
	const [activeTab, setActiveTab] = useState("");

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		// Set first available tab as active
		if (enabledFeatures.habitTracker) setActiveTab("habits");
		else if (enabledFeatures.expenseManager) setActiveTab("expenses");
	}, [enabledFeatures]);

	const tabs = [
		{
			id: "habits",
			label: "Habit Tracker",
			enabled: enabledFeatures.habitTracker,
			icon: CheckCircle,
		},
		{
			id: "expenses",
			label: "Expense Manager",
			enabled: enabledFeatures.expenseManager,
			icon: Wallet,
		},
	];

	const renderTabContent = () => {
		switch (activeTab) {
			case "habits":
				return <HabitsView />;
			case "expenses":
				return <ExpensesView />;
			default:
				return <div className="text-center py-8 text-muted">No content available.</div>;
		}
	};

	return (
		<div className="min-h-screen bg-primary">
			{/* Header */}
			<header className="shadow-sm bg-primary px-6 py-4 border-b border-hover">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<div className="flex items-center space-x-8">
						<h1 className="text-2xl font-bold text-default tracking-tight">
							Zenboard
						</h1>
					</div>
					{/* <div className="flex items-center space-x-3"> */}
					{/* 	<button className="flex items-center px-4 py-2 text-sm font-medium text-muted hover:text-default hover:bg-hover transition-colors duration-200"> */}
					{/* 		<Settings className="w-4 h-4 mr-2" /> */}
					{/* 		Settings */}
					{/* 	</button> */}
					{/* </div> */}
				</div>
			</header>

			{/* Tab Navigation */}
			<nav className="bg-primary px-6 py-3 border-b border-hover">
				<div className="max-w-7xl mx-auto">
					<div className="flex space-x-2">
						{tabs
							.filter((tab) => tab.enabled)
							.map((tab) => {
								const IconComponent = tab.icon;
								return (
									<button
										key={tab.id}
										onClick={() => setActiveTab(tab.id)}
										className={`px-6 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 rounded-m ${activeTab === tab.id
											? 'bg-blue-100 text-blue-700 shadow-sm'
											: 'text-muted hover:text-default hover:bg-hover'
											}`}
									>
										<IconComponent className="w-4 h-4" />
										{tab.label}
									</button>
								);
							})}
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-6 py-4">
				<div className="rounded-l shadow-sm bg-primary border-default p-4">
					{renderTabContent()}
				</div>
			</main>
		</div>
	);
}
