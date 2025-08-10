import type ZenTaskPlugin from "@src/main";

let cache: Record<string, any> = {};
let isLoaded = false;

/**
 * Must be called in onload() before using get/set
 */
export const initStorage = async (plugin: ZenTaskPlugin) => {
	cache = (await plugin.loadData()) ?? {};
	isLoaded = true;
	pluginInstance = plugin;
};

let pluginInstance: ZenTaskPlugin | null = null;

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
	if (pluginInstance) {
		await pluginInstance.saveData(cache);
	}
};
