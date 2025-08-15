import type ZenBoardPlugin from "@src/main";

let cache: Record<string, any> = {};
let isLoaded = false;
let pluginInstance: ZenBoardPlugin | null = null;

/**
 * Must be called in onload() before using get/set
 */
export const initStorage = async (plugin: ZenBoardPlugin) => {
	if (isLoaded) {
		console.warn("Zenboard storage already initialized — skipping.");
		return;
	}

	try {
		cache = (await plugin.loadData()) ?? {};
		isLoaded = true;
		pluginInstance = plugin;
	} catch (err) {
		console.error("Failed to initialize Zenboard storage:", err);
		cache = {}; // fallback to empty cache
		isLoaded = true; // prevent endless init loop
		pluginInstance = plugin;
	}
};

export const getFromStorage = async <T>(key: string): Promise<T | null> => {
	if (!isLoaded) {
		throw new Error("Storage not initialized. Call initStorage() in onload() first.");
	}
	return cache[key] ?? null;
};

export const setToStorage = async <T>(key: string, value: T): Promise<void> => {
	if (!isLoaded) {
		throw new Error("Storage not initialized. Call initStorage() in onload() first.");
	}

	cache[key] = value;

	if (!pluginInstance) {
		console.warn("No plugin instance found — data change not persisted.");
		return;
	}

	try {
		await pluginInstance.saveData(cache);
	} catch (err) {
		console.error("Failed to save Zenboard storage:", err);
	}
};
