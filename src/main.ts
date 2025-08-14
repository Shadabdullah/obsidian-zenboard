import { initStorage } from '@features/habits/utils';
import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Plugin,
	PluginSettingTab,
	Setting
} from 'obsidian';

import { ZenboardDashboardView, VIEW_TYPE_ZENBOARD } from './views/ZenboardView';

// ✅ Plugin Settings Interface
interface ZenboardSettings {
	defaultProject: string;
}

const DEFAULT_SETTINGS: ZenboardSettings = {
	defaultProject: 'inbox'
};

// ✅ Main Plugin Class
export default class ZenboardPlugin extends Plugin {
	settings: ZenboardSettings;

	async onload() {
		await this.loadSettings();

		// Storage
		await initStorage(this);

		// ✅ Register custom view
		this.registerView(
			VIEW_TYPE_ZENBOARD,
			(leaf) => new ZenboardDashboardView(leaf)
		);

		// ✅ Ribbon Icon to open React pane
		const ribbonIconEl = this.addRibbonIcon('check-circle', 'Zenboard: Open Dashboard', async () => {
			await this.activateDashboardView();
		});
		ribbonIconEl.addClass('zenboard-ribbon-icon');

		// ✅ Status Bar
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Zenboard Active');

		// ✅ Simple Command
		this.addCommand({
			id: 'zenboard-open-modal',
			name: 'Zenboard: Show Welcome Modal',
			callback: () => {
				new ZenboardWelcomeModal(this.app).open();
			}
		});

		// ✅ Editor Command
		this.addCommand({
			id: 'zenboard-insert-task',
			name: 'Zenboard: Insert Task Template',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const selected = editor.getSelection();
				const task = `- [ ] ${selected || 'New Task'}`;
				editor.replaceSelection(task);
			}
		});

		// ✅ Command with Condition
		this.addCommand({
			id: 'zenboard-show-modal-if-md',
			name: 'Zenboard: Conditional Modal',
			checkCallback: (checking: boolean) => {
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					if (!checking) {
						new ZenboardWelcomeModal(this.app).open();
					}
					return true;
				}
			}
		});

		// ✅ Settings Tab
		this.addSettingTab(new ZenboardSettingTab(this.app, this));

		// ✅ DOM Event
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.debug('Zenboard click event', evt);
		});

		// ✅ Interval Example
		this.registerInterval(window.setInterval(() => {
			console.debug('Zenboard heartbeat...');
		}, 10 * 60 * 1000)); // 10 minutes
	}

	onunload() {
		console.log('Zenboard unloaded');
	}

	// ✅ Load & Save Plugin Settings
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	// ✅ Activate React View Panel
	async activateDashboardView() {
		console.log("🧠 activateDashboardView triggered");

		const leaf = this.app.workspace.getLeaf(false); // main workspace
		console.log("✅ Main workspace leaf found. Setting view state...");

		await leaf.setViewState({
			type: VIEW_TYPE_ZENBOARD,
			active: true,
		});
	}
}

// ✅ Modal Class
class ZenboardWelcomeModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText('Welcome to Zenboard! 🎯');
	}

	onClose() {
		this.contentEl.empty();
	}
}

// ✅ Settings UI
class ZenboardSettingTab extends PluginSettingTab {
	plugin: ZenboardPlugin;

	constructor(app: App, plugin: ZenboardPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName('Default Project')
			.setDesc('Tasks will be added to this project by default.')
			.addText(text => text
				.setPlaceholder('inbox')
				.setValue(this.plugin.settings.defaultProject)
				.onChange(async (value) => {
					this.plugin.settings.defaultProject = value;
					await this.plugin.saveSettings();
				}));
	}
}
