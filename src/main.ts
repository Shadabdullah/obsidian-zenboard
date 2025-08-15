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

		// Ribbon icon to open React pane
		const ribbonIconEl = this.addRibbonIcon(
			'target',
			'Zenboard: open dashboard',
			async () => {
				await this.activateDashboardView();
			}
		);
		ribbonIconEl.addClass('zenboard-ribbon-icon');

		// Add command to open dashboard
		this.addCommand({
			id: 'open-dashboard',
			name: 'Open zenboard',
			callback: async () => {
				await this.activateDashboardView();
			}
		});
	}

	async activateDashboardView() {
		const leaf = this.app.workspace.getLeaf(false);
		if (!leaf) return; // No console output, just fail silently for users
		await leaf.setViewState({
			type: VIEW_TYPE_ZENBOARD,
			active: true,
		});
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_ZENBOARD);
	}
}
