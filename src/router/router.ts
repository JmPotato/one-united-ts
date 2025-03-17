import { Request } from "@oak/oak/request";
import { Response } from "@oak/oak/response";
import { createParser } from "eventsource-parser";

import {
    Config,
    hashConfig,
    Identifier,
    Model,
    Provider,
    Rule,
} from "@/types/config.ts";
import { CompletionResponse } from "@/types/completaion.ts";

export const RANDOM_PROVIDER_CHANCE = 0.2;
const HTTP_REFERER_HEADER = "HTTP-Referer";
const HTTP_REFERER_HEADER_VALUE = "https://github.com/JmPotato/one-united-ts";
const X_TITLE_HEADER = "X-Title";
const X_TITLE_HEADER_VALUE = "one-united";

/**
 * Router is the main class for routing requests to the appropriate provider
 * based on the model and the rules defined in the config.
 */
export class Router {
    private config: Config;
    private providers: Map<Identifier, Provider>;
    private rules: Map<Model, Rule>;
    private latency: Map<string, number>; // Key: model@@provider

    constructor(config: Config) {
        this.config = config;
        this.providers = new Map();
        this.rules = new Map();
        this.latency = new Map();

        config.providers.forEach((provider) => {
            // Check if the provider already exists
            if (this.providers.has(provider.identifier)) {
                throw new Error(
                    `Provider ${provider.identifier} are defined multiple times with one: ${
                        this.providers.get(provider.identifier)?.name
                    }`,
                );
            }

            this.providers.set(provider.identifier, provider);
        });

        config.rules.forEach((rule) => {
            // Check if the rule already exists
            if (this.rules.has(rule.model)) {
                throw new Error(
                    `Rule for model ${rule.model} are defined multiple times`,
                );
            }
            if (rule.providers.length === 0) {
                throw new Error(
                    `Rule for model ${rule.model} has no providers`,
                );
            }
            // Check if the provider and model are valid
            rule.providers.forEach((ruleProvider) => {
                const provider = this.providers.get(ruleProvider.identifier);
                if (!provider) {
                    throw new Error(
                        `Provider ${ruleProvider.identifier} does not exist in rule of model ${rule.model}`,
                    );
                }
                ruleProvider.models.forEach((model) => {
                    if (!provider.models.includes(model)) {
                        throw new Error(
                            `Forwarding model ${model} does not exist in provider ${ruleProvider.identifier} from rule of model ${rule.model}`,
                        );
                    }
                });
            });

            this.rules.set(rule.model, rule);
        });
    }

    /**
     * Route the request to the appropriate provider based on the model
     * @param {Request} request - the original request
     * @returns Promise<TargetRequestInfo> the target request info
     */
    public async route(
        request: Request,
    ): Promise<Response> {
        const body = await request.body.json();
        const [model, stream] = [body.model, body.stream];

        // Get the target model and its provider identifier
        let [targetModel, providerId] = this.tryParseTargetModel(model);
        if (!providerId) {
            [targetModel, providerId] = this.pickProviderModel(model);
        }

        const provider = this.providers.get(providerId);
        if (!provider) {
            throw new Error(
                `Provider ${providerId} for target model ${targetModel} not found`,
            );
        }
        console.info(
            `Routing ${
                stream ? "stream" : "non-stream"
            } request: ${model} -> ${targetModel}@@${providerId}`,
        );

        // Modify to the target URL by joining the provider's endpoint and path
        const url = new URL(provider.endpoint);
        url.pathname = provider.path;
        // Modify the request headers
        const headers = new Headers(request.headers);
        if (provider.api_key) {
            headers.set("Authorization", `Bearer ${provider.api_key}`);
        }
        // Add `HTTP-Referer` and `X-Title` headers to enable provider like OpenRouter to identify the request
        headers.set(HTTP_REFERER_HEADER, HTTP_REFERER_HEADER_VALUE);
        headers.set(X_TITLE_HEADER, X_TITLE_HEADER_VALUE);
        // Modify the request body with the target model
        body.model = targetModel;

        // Send the request to the target provider
        const startTime = performance.now();
        const rawResponse = await fetch(url.toString(), {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        });
        const latency = performance.now() - startTime;
        this.updateLatency(targetModel, providerId, latency);

        // Build the response object
        const response = new Response(request);
        response.status = rawResponse.status;
        response.headers = rawResponse.headers;
        response.type = rawResponse.type;

        let completionResp: CompletionResponse | undefined;
        if (stream) {
            if (!rawResponse.body) {
                throw new Error("Stream response body is empty");
            }
            const bodyStream = rawResponse.body;
            // Tee the response stream to retrieve data from the SSE
            const [responseStream, middlewareStream] = bodyStream.tee();
            // Read and parse the data from the SSE stream
            const parser = createParser({
                onEvent: (event) => {
                    const trimmedData = event.data.trim();
                    if (trimmedData === "[DONE]") {
                        return;
                    }
                    try {
                        completionResp = JSON.parse(
                            trimmedData,
                        ) as CompletionResponse;
                    } catch {
                        // Ignore the error since the SSE event data is not always a valid JSON object
                    }
                },
            });
            const reader = middlewareStream.getReader();
            await reader.read().then(
                function chunkReader({ done, value }): Promise<void> {
                    if (done) {
                        return Promise.resolve();
                    }
                    const chunk = new TextDecoder().decode(value);
                    parser.feed(chunk);
                    return reader.read().then(chunkReader);
                },
            );

            response.body = responseStream;
        } else {
            response.body = await rawResponse.json();
            completionResp = response.body as CompletionResponse;
        }
        if (completionResp) {
            console.info(
                `Finished routing ${completionResp.id}: ${model} -> ${targetModel}@@${providerId} ~ ${latency}ms`,
            );
            if (completionResp.usage) {
                console.info(
                    `ID ${completionResp.id} consumed ${completionResp.usage.total_tokens} tokens = ${completionResp.usage.prompt_tokens} prompt tokens + ${completionResp.usage.completion_tokens} completion tokens`,
                );
            }
        }

        return response;
    }

    /**
     * Try to parse the target model from the name pattern `model@@provider` directly,
     * @param {Model} model - the model name retrieved directly from the request body
     * @returns {[Model, Identifier| undefined]} the target model name and the identifier of the provider
     */
    tryParseTargetModel(model: Model): [Model, Identifier | undefined] {
        const parts = model.split("@@");

        // If we have exactly 2 parts and both are non-empty, it's a valid `model@@provider` pattern
        if (parts.length === 2 && parts[0] && parts[1]) {
            return [parts[0], parts[1]];
        }

        // If we have more than 2 parts, take the last non-empty part as identifier
        // and join the rest with `@@` as the model name
        if (parts.length > 2) {
            const lastPart = parts[parts.length - 1];
            if (lastPart) {
                const modelParts = parts.slice(0, -1);
                return [modelParts.join("@@"), lastPart];
            }
        }

        // For all other cases, return the original model with undefined identifier
        return [model, undefined];
    }

    /**
     * Pick the target model and its provider identifier according to the rules and latency performance.
     * @param {Model} model - The model name to route
     * @returns {[Model, Identifier]} the target model name and the identifier of the provider
     */
    pickProviderModel(model: Model): [Model, Identifier] {
        const rule = this.rules.get(model);
        if (!rule) {
            throw new Error(`No rule found for model ${model}`);
        }

        // Flatten the (model, providerId) pairs into a single array
        const models: Array<[Model, Identifier]> = [];
        for (const provider of rule.providers) {
            for (const providerModel of provider.models) {
                models.push([providerModel, provider.identifier]);
            }
        }
        if (models.length === 0) {
            throw new Error("No target model available to pick");
        }

        // Sort by latency
        models.sort(([model1, id1], [model2, id2]) => {
            const latency1 = this.latency.get(`${model1}@@${id1}`) ??
                Number.MIN_SAFE_INTEGER;
            const latency2 = this.latency.get(`${model2}@@${id2}`) ??
                Number.MIN_SAFE_INTEGER;
            return latency1 - latency2;
        });

        // 20% chance to use a random provider for load balancing
        if (Math.random() < RANDOM_PROVIDER_CHANCE) {
            const randomIndex = Math.floor(Math.random() * models.length);
            return models[randomIndex] ?? models[0];
        }
        // Otherwise use the fastest one
        return models[0];
    }

    /**
     * Update the latency for a given model and provider
     * @param {Model} model - The model name
     * @param {Identifier} provider - The provider identifier
     * @param {number} latency - The latency value
     */
    updateLatency(model: Model, provider: Identifier, latency: number) {
        this.latency.set(`${model}@@${provider}`, latency);
    }

    public async getStats(): Promise<{
        hash: string;
        latency: Record<string, number>;
    }> {
        // Sort by the latency value
        const sortedLatency = new Map(
            [...this.latency.entries()].sort(([, latency1], [, latency2]) => {
                return latency1 - latency2;
            }),
        );
        return {
            hash: await hashConfig(this.config),
            latency: Object.fromEntries(sortedLatency.entries()),
        };
    }
}
