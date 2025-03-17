import { parse } from "@std/yaml";

import { blake3 } from "hash-wasm";

const DEFAULT_COMPLETION_PATH = "/v1/chat/completions";

export type Model = string;
export type Identifier = string;

export interface ProviderModel {
    identifier: Identifier;
    models: Model[];
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
    api_key: string;
    models: Model[];
}

export interface Config {
    rules: Rule[];
    providers: Provider[];
}

export function buildConfig(yamlContent: string): Config {
    try {
        const config = parse(yamlContent) as Config;

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
            // Normalize the endpoint and path
            if (provider.endpoint.endsWith("/")) {
                provider.endpoint = provider.endpoint.slice(0, -1);
            }
            if (!provider.path.startsWith("/")) {
                provider.path = `/${provider.path}`;
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
