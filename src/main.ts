import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting
} from 'obsidian';

import { ZentaskDashboardView, VIEW_TYPE_ZENTASK } from './ZentaskView';

// ✅ Plugin Settings Interface
interface ZenTaskSettings {
	defaultProject: string;
}

const DEFAULT_SETTINGS: ZenTaskSettings = {
	defaultProject: 'inbox'
};

// ✅ Main Plugin Class
export default class ZenTaskPlugin extends Plugin {
	settings: ZenTaskSettings;

	async onload() {
		await this.loadSettings();

		// ✅ Register custom view
		this.registerView(
			VIEW_TYPE_ZENTASK,
			(leaf) => new ZentaskDashboardView(leaf)
		);

		// ✅ Ribbon Icon to open React pane
		const ribbonIconEl = this.addRibbonIcon('check-circle', 'ZenTask: Open Dashboard', async () => {
			await this.activateDashboardView();
		});
		ribbonIconEl.addClass('zentask-ribbon-icon');

		// ✅ Status Bar
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('ZenTask Active');

		// ✅ Simple Command
		this.addCommand({
			id: 'zentask-open-modal',
			name: 'ZenTask: Show Welcome Modal',
			callback: () => {
				new ZenTaskWelcomeModal(this.app).open();
			}
		});

		// ✅ Editor Command
		this.addCommand({
			id: 'zentask-insert-task',
			name: 'ZenTask: Insert Task Template',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const selected = editor.getSelection();
				const task = `- [ ] ${selected || 'New Task'}`;
				editor.replaceSelection(task);
			}
		});

		// ✅ Command with Condition
		this.addCommand({
			id: 'zentask-show-modal-if-md',
			name: 'ZenTask: Conditional Modal',
			checkCallback: (checking: boolean) => {
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					if (!checking) {
						new ZenTaskWelcomeModal(this.app).open();
					}
					return true;
				}
			}
		});

		// ✅ Settings Tab
		this.addSettingTab(new ZenTaskSettingTab(this.app, this));

		// ✅ DOM Event
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.debug('ZenTask click event', evt);
		});

		// ✅ Interval Example
		this.registerInterval(window.setInterval(() => {
			console.debug('ZenTask heartbeat...');
		}, 10 * 60 * 1000)); // 10 minutes
	}

	onunload() {
		console.log('ZenTask unloaded');
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
		type: VIEW_TYPE_ZENTASK,
		active: true,
	});
}


}

// ✅ Modal Class
class ZenTaskWelcomeModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText('Welcome to ZenTask! 🎯');
	}

	onClose() {
		this.contentEl.empty();
	}
}

// ✅ Settings UI
class ZenTaskSettingTab extends PluginSettingTab {
	plugin: ZenTaskPlugin;

	constructor(app: App, plugin: ZenTaskPlugin) {
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
