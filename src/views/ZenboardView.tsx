import { ItemView, WorkspaceLeaf } from "obsidian";
import * as ReactDOM from "react-dom/client";
import App from "../app/App";

export const VIEW_TYPE_ZENBOARD = "zenboard-view";

export class ZenboardDashboardView extends ItemView {
	private root: ReactDOM.Root;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType(): string {
		return VIEW_TYPE_ZENBOARD;
	}

	getDisplayText(): string {
		return "📋 Zenboard";
	}

	getIcon(): string {
		return "layout-dashboard";
	}

	async onOpen() {

		const container = this.containerEl.children[1];
		if (!container) {
			console.error("❌ React container not found!");
			return;
		}
		this.root = ReactDOM.createRoot(container);
		this.root.render(<App />);
	}

	async onClose() {
		if (this.root) {
			this.root.unmount();
		}
	}
}
