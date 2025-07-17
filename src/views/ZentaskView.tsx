import { ItemView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import * as ReactDOM from "react-dom/client"; // ← ✅ use the modern API
import App from "../app/App";

export const VIEW_TYPE_ZENTASK = "zentask-view";

export class ZentaskDashboardView extends ItemView {
	private root: ReactDOM.Root;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType(): string {
		return VIEW_TYPE_ZENTASK;
	}

	getDisplayText(): string {
		return "📋 ZenTask Dashboard";
	}

	getIcon(): string {
		return "layout-dashboard"; // Optional
	}




async onOpen() {
	console.log("🧠 ZentaskDashboardView.onOpen triggered");

	const container = this.containerEl.children[1];
	if (!container) {
		console.error("❌ React container not found!");
		return;
	}

	console.log("✅ Mounting React app to:", container);
	this.root = ReactDOM.createRoot(container);
	this.root.render(<App />);
}

	async onClose() {
		if (this.root) {
			this.root.unmount(); // ← ✅ unmount properly
		}
	}
}
