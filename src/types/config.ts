import { blake3 } from "hash-wasm";

export const DEFAULT_COMPLETION_PATH = "/v1/chat/completions";
export const DEFAULT_RESPONSES_PATH = "/v1/responses";
export const PROVIDER_SEPARATOR = "@@";

export type Model = string;
export type Identifier = string;

export interface ProviderModel {
	identifier: Identifier;
	models: Model[];
	extra_fields?: Record<string, unknown>;
}

export interface Rule {
	model: Model;
	providers: ProviderModel[];
}

export interface Provider {
	name: string;
	identifier: Identifier;
	endpoint: string;
	path: string;
	responses_path?: string;
	api_key: string;
	models: Model[];
}

export interface Config {
	rules: Rule[];
	providers: Provider[];
}

export function buildConfig(yamlContent: string): Config {
	try {
		const config = Bun.YAML.parse(yamlContent) as Config;

		// Validate required fields
		if (!config.rules || !Array.isArray(config.rules)) {
			throw new Error("Rules must be defined");
		}

		if (!config.providers || !Array.isArray(config.providers)) {
			throw new Error("Providers must be defined");
		}

		// Validate each rule
		config.rules.forEach((rule, index) => {
			if (!rule.model) {
				throw new Error(`Rule ${index} must have a model name defined`);
			}
			if (!rule.providers || !Array.isArray(rule.providers)) {
				throw new Error(
					`Rule ${index} must have at least one provider defined`,
				);
			}
			for (const pm of rule.providers) {
				if (
					pm.extra_fields !== undefined &&
					(typeof pm.extra_fields !== "object" ||
						pm.extra_fields === null ||
						Array.isArray(pm.extra_fields))
				) {
					throw new Error(
						`Rule ${index} provider ${pm.identifier} has invalid extra_fields: must be a plain object`,
					);
				}
			}
		});

		// Validate each provider
		config.providers.forEach((provider, index) => {
			if (!provider.identifier) {
				throw new Error(`Provider ${index} must have an identifier`);
			}
			if (!provider.endpoint) {
				throw new Error(`Provider ${index} must have an endpoint`);
			}
			if (!provider.models || !Array.isArray(provider.models)) {
				throw new Error(
					`Provider ${index} must have at least one model defined`,
				);
			}
			if (!provider.path) {
				provider.path = DEFAULT_COMPLETION_PATH;
			}
			if (!provider.responses_path) {
				provider.responses_path = DEFAULT_RESPONSES_PATH;
			}
			// Normalize the endpoint and path
			if (provider.endpoint.endsWith("/")) {
				provider.endpoint = provider.endpoint.slice(0, -1);
			}
			if (!provider.path.startsWith("/")) {
				provider.path = `/${provider.path}`;
			}
			if (!provider.responses_path.startsWith("/")) {
				provider.responses_path = `/${provider.responses_path}`;
			}
		});

		return config;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(`Failed to parse config: ${error.message}`);
		}
		throw new Error("Failed to parse config: Unknown error");
	}
}

export async function hashConfig(config: Config): Promise<string> {
	return await blake3(JSON.stringify(config));
}

export function yamlScalar(value: string): string {
	if (
		value === "" ||
		value.includes("\n") ||
		value.includes(": ") ||
		value.includes("#") ||
		/^[{["']/.test(value)
	) {
		return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`;
	}
	if (
		/^[\d.eE+-]/.test(value) ||
		/^(true|false|null|yes|no|on|off)$/i.test(value) ||
		value.includes(",")
	) {
		return `"${value}"`;
	}
	return value;
}

export function isScalar(v: unknown): boolean {
	return v === null || v === undefined || typeof v !== "object";
}

export function yamlFormat(value: unknown, indent = 0): string {
	const pad = "  ".repeat(indent);

	if (value === null || value === undefined) return `${pad}null\n`;
	if (typeof value === "boolean") return `${pad}${value}\n`;
	if (typeof value === "number") return `${pad}${value}\n`;
	if (typeof value === "string") return `${pad}${yamlScalar(value)}\n`;

	if (Array.isArray(value)) {
		if (value.length === 0) return `${pad}[]\n`;
		let out = "";
		for (const item of value) {
			if (typeof item === "object" && item !== null && !Array.isArray(item)) {
				const entries = Object.entries(item);
				if (entries.length > 0) {
					const [fk, fv] = entries[0];
					if (isScalar(fv)) {
						out += `${pad}- ${fk}: ${yamlFormat(fv, 0).trim()}\n`;
					} else {
						out += `${pad}- ${fk}:\n${yamlFormat(fv, indent + 2)}`;
					}
					for (let i = 1; i < entries.length; i++) {
						const [k, v] = entries[i];
						if (isScalar(v)) {
							out += `${pad}  ${k}: ${yamlFormat(v, 0).trim()}\n`;
						} else {
							out += `${pad}  ${k}:\n${yamlFormat(v, indent + 2)}`;
						}
					}
					continue;
				}
			}
			out += `${pad}- ${yamlFormat(item, 0).trim()}\n`;
		}
		return out;
	}

	if (typeof value === "object") {
		const entries = Object.entries(value as Record<string, unknown>);
		if (entries.length === 0) return `${pad}{}\n`;
		let out = "";
		for (const [key, val] of entries) {
			if (isScalar(val)) {
				out += `${pad}${key}: ${yamlFormat(val, 0).trim()}\n`;
			} else {
				out += `${pad}${key}:\n${yamlFormat(val, indent + 1)}`;
			}
		}
		return out;
	}

	return `${pad}${value}\n`;
}
