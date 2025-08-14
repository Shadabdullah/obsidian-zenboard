import DashboardView from "../features/dashboard/DashboardView";
import '../../styles.css'; // Tailwind styles or your global styles

const userSettings = {
	habitTracker: true,
	expenseManager: true,
};

export default function App() {
	return (
		<div id="zentask-container">
			<DashboardView enabledFeatures={userSettings} />
		</div>
	);
}
