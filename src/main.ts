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
			'Zenboard: Open dashboard',
			async () => {
				await this.activateDashboardView();
			}
		);
		ribbonIconEl.addClass('zenboard-ribbon-icon');

		// Add command to open dashboard
		this.addCommand({
			id: 'open-dashboard',
			name: 'Open Zenboard',
			callback: async () => {
				await this.activateDashboardView();
			}
		});
	}

	async activateDashboardView() {
		// Check if view already exists
		const existingLeaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_ZENBOARD);

		if (existingLeaves.length > 0) {
			// If view exists, just activate it
			this.app.workspace.revealLeaf(existingLeaves[0]);
			return;
		}

		// Create new leaf if none exists
		const leaf = this.app.workspace.getLeaf(false);
		if (!leaf) {
			return;
		}

		try {
			await leaf.setViewState({
				type: VIEW_TYPE_ZENBOARD,
				active: true,
			});
		} catch (error) {
			console.error('Failed to activate Zenboard view:', error);
		}
	}

	onunload() {
		// Clean up all instances of the view
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_ZENBOARD);
	}
}
