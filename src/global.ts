import { Database } from "bun:sqlite";
import { Router } from "@/router/router";
import { Config, hashConfig } from "@/types/config";

const CONFIG_KEY = "config";

const db = new Database("kv.db", { create: true });
db.run(
	"CREATE TABLE IF NOT EXISTS kv_store (key TEXT PRIMARY KEY, value TEXT NOT NULL)",
);
db.run("PRAGMA journal_mode = WAL;");

let llmRouter: Router | null = null;

export async function getConfig(): Promise<Config | null> {
	const row = db
		.query("SELECT value FROM kv_store WHERE key = ?")
		.get(CONFIG_KEY) as { value: string } | null;
	if (!row) {
		console.warn("No config found");
		return null;
	}
	const config = JSON.parse(row.value) as Config;
	const hash = await hashConfig(config);
	console.info(`Getting config with hash ${hash}`);
	return config;
}

export async function setConfig(config: Config): Promise<void> {
	console.info(`Setting config with hash ${await hashConfig(config)}`);
	db.run("INSERT OR REPLACE INTO kv_store (key, value) VALUES (?, ?)", [
		CONFIG_KEY,
		JSON.stringify(config),
	]);
	// Re-generate router with new config
	llmRouter = await generateRouter();
}

async function generateRouter(): Promise<Router> {
	const config = await getConfig();
	if (!config) {
		throw new Error("No config found, please post one at /config first");
	}
	console.info(
		`Generating router with config hash ${await hashConfig(config)}`,
	);
	return new Router(config);
}

export async function getRouter(): Promise<Router> {
	if (!llmRouter) {
		llmRouter = await generateRouter();
	}
	return llmRouter;
}
