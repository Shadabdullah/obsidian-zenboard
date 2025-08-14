import DashboardView from "../features/dashboard/DashboardView";

const userSettings = {
	habitTracker: true,
	expenseManager: true,
};

export default function App() {
	return (
		<div id="zenboard-container">
			<DashboardView enabledFeatures={userSettings} />
		</div>
	);
}


