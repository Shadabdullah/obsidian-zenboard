import { Plugin } from 'obsidian';
import { initStorage } from '@features/habits/utils';
import { ZenboardDashboardView, VIEW_TYPE_ZENBOARD } from './views/ZenboardView';

export default class ZenboardPlugin extends Plugin {
	async onload() {
		// Initialize storage
		await initStorage(this);

		// Register dashboard view
		this.registerView(
			VIEW_TYPE_ZENBOARD,
			(leaf) => new ZenboardDashboardView(leaf)
		);
		// ✅ Ribbon Icon to open React pane
		const ribbonIconEl = this.addRibbonIcon('target', 'Zenboard: Open Dashboard', async () => {
			await this.activateDashboardView();
		});
		ribbonIconEl.addClass('zenboard-ribbon-icon');

		// Add command to open dashboard
		this.addCommand({
			id: 'zenboard-open-dashboard',
			name: 'Open Zenboard Dashboard',
			callback: async () => {
				await this.activateDashboardView();
			}
		});
	}

	async activateDashboardView() {
		const leaf = this.app.workspace.getLeaf(false);
		if (!leaf) {
			console.warn("Zenboard: No workspace leaf found to open dashboard.");
			return;
		}
		await leaf.setViewState({
			type: VIEW_TYPE_ZENBOARD,
			active: true,
		});
	}

	onunload() {
	}
}
