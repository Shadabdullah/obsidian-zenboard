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

		// ✅ Ribbon Icon
		const ribbonIconEl = this.addRibbonIcon('check-circle', 'ZenTask: Task Manager', (evt: MouseEvent) => {
			new Notice('ZenTask is ready!');
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

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
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
