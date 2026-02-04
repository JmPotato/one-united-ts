import { Request } from "@oak/oak/request";
import { Response } from "@oak/oak/response";
import { createParser } from "eventsource-parser";

import { CompletionChunk, CompletionResponse } from "@/types/completaion.ts";
import { ResponsesResponse, ResponsesStreamEvent } from "@/types/responses.ts";
import {
    Config,
    hashConfig,
    Identifier,
    Model,
    Provider,
    Rule,
} from "@/types/config.ts";

export const RANDOM_PROVIDER_CHANCE = 0.2;

const HTTP_REFERER_HEADER = "HTTP-Referer";
const HTTP_REFERER_HEADER_VALUE = "https://github.com/JmPotato/one-united-ts";
const X_TITLE_HEADER = "X-Title";
const X_TITLE_HEADER_VALUE = "one-united";

const MAX_CONTENT_PREVIEW_LENGTH = 50;
const SENSITIVE_DATA_PLACEHOLDER = "[REDACTED]";
const DEFAULT_RESPONSES_PATH = "/v1/responses";

function truncateString(
    str: string | null | undefined,
    maxLength: number = MAX_CONTENT_PREVIEW_LENGTH,
): string {
    if (!str) return "";
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + "...";
}

function redactBase64Data(data: string | null | undefined): string {
    if (!data) return "";
    const looksLikeBase64 = data.length > 100 &&
        /^[A-Za-z0-9+/=]+$/.test(data.slice(0, 100));
    return looksLikeBase64 ? SENSITIVE_DATA_PLACEHOLDER : truncateString(data);
}

// deno-lint-ignore no-explicit-any
function migrateDeprecatedFields(body: any): void {
    if (
        body.max_tokens !== undefined &&
        body.max_completion_tokens === undefined
    ) {
        body.max_completion_tokens = body.max_tokens;
        delete body.max_tokens;
        console.info(
            "Migrated deprecated field: max_tokens -> max_completion_tokens",
        );
    }

    if (body.user !== undefined) {
        if (body.safety_identifier === undefined) {
            body.safety_identifier = body.user;
        }
        if (body.prompt_cache_key === undefined) {
            body.prompt_cache_key = body.user;
        }
        delete body.user;
        console.info(
            "Migrated deprecated field: user -> safety_identifier, prompt_cache_key",
        );
    }

    if (body.functions !== undefined && body.tools === undefined) {
        body.tools = body.functions.map((
            fn: { name: string; description?: string; parameters?: object },
        ) => ({
            type: "function",
            function: {
                name: fn.name,
                description: fn.description,
                parameters: fn.parameters,
            },
        }));
        delete body.functions;
        console.info("Migrated deprecated field: functions -> tools");
    }

    if (body.function_call !== undefined && body.tool_choice === undefined) {
        if (body.function_call === "none" || body.function_call === "auto") {
            body.tool_choice = body.function_call;
        } else if (
            typeof body.function_call === "object" && body.function_call.name
        ) {
            body.tool_choice = {
                type: "function",
                function: { name: body.function_call.name },
            };
        }
        delete body.function_call;
        console.info("Migrated deprecated field: function_call -> tool_choice");
    }
}

interface RouteContext {
    requestId: string;
    sourceModel: Model;
    targetModel: Model;
    providerId: Identifier;
    latencyMs: number;
}

function logRouteCompletion(ctx: RouteContext): void {
    console.info(
        `Finished routing ${ctx.requestId}: ${ctx.sourceModel} -> ${ctx.targetModel}@@${ctx.providerId} ~ ${
            ctx.latencyMs.toFixed(0)
        }ms`,
    );
}

type UsageInfo = {
    total_tokens: number;
    prompt_tokens?: number;
    completion_tokens?: number;
    input_tokens?: number;
    output_tokens?: number;
    prompt_tokens_details?: { cached_tokens?: number };
    input_tokens_details?: { cached_tokens?: number };
    completion_tokens_details?: { reasoning_tokens?: number };
    output_tokens_details?: { reasoning_tokens?: number };
};

function formatTokenDetails(usage: UsageInfo): string {
    const isCompletionApi = "prompt_tokens" in usage;
    const inputTokens = isCompletionApi
        ? usage.prompt_tokens
        : usage.input_tokens;
    const outputTokens = isCompletionApi
        ? usage.completion_tokens
        : usage.output_tokens;
    const inputLabel = isCompletionApi ? "prompt" : "input";
    const outputLabel = isCompletionApi ? "completion" : "output";

    let details =
        `${usage.total_tokens} tokens = ${inputTokens} ${inputLabel} + ${outputTokens} ${outputLabel}`;

    const cachedTokens = usage.prompt_tokens_details?.cached_tokens ??
        usage.input_tokens_details?.cached_tokens;
    if (cachedTokens) {
        details += ` (${cachedTokens} cached)`;
    }

    const reasoningTokens = usage.completion_tokens_details?.reasoning_tokens ??
        usage.output_tokens_details?.reasoning_tokens;
    if (reasoningTokens) {
        details += ` (${reasoningTokens} reasoning)`;
    }

    return details;
}

function logCompletionResult(
    resp: CompletionResponse | CompletionChunk,
    ctx: RouteContext,
    isStream: boolean,
): void {
    if (!resp?.usage) return;

    logRouteCompletion(ctx);
    console.info(`ID ${resp.id} consumed ${formatTokenDetails(resp.usage)}`);

    const choice = resp.choices?.[0];
    if (!choice) return;

    const finishReason = choice.finish_reason || "unknown";
    const serviceTier = resp.service_tier
        ? ` | tier: ${resp.service_tier}`
        : "";

    if (isStream) {
        console.info(
            `ID ${resp.id} response: finish=${finishReason}${serviceTier} | content=[streamed]`,
        );
        return;
    }

    const message =
        (choice as { message?: CompletionResponse["choices"][0]["message"] })
            .message;
    const contentPreview = typeof message?.content === "string"
        ? truncateString(message.content)
        : message?.content
        ? "[multipart]"
        : "[empty]";
    const toolCallsInfo = message?.tool_calls?.length
        ? ` | tool_calls: ${
            message.tool_calls.map((tc) => tc.function.name).join(", ")
        }`
        : "";
    const audioInfo = message?.audio
        ? ` | audio: ${redactBase64Data(message.audio.data)}`
        : "";

    console.info(
        `ID ${resp.id} response: finish=${finishReason}${serviceTier} | content="${contentPreview}"${toolCallsInfo}${audioInfo}`,
    );
}

function logResponsesResult(resp: ResponsesResponse, ctx: RouteContext): void {
    if (!resp?.usage) return;

    logRouteCompletion(ctx);
    console.info(`ID ${resp.id} consumed ${formatTokenDetails(resp.usage)}`);

    const status = resp.status || "unknown";
    const outputTextPreview = resp.output_text
        ? truncateString(resp.output_text)
        : "[empty]";
    const toolCalls = resp.output?.filter((item) => item.type !== "message")
        .map((item) => ("name" in item && item.name) ? item.name : item.type);
    const toolCallsInfo = toolCalls?.length
        ? ` | tool_calls: ${toolCalls.join(", ")}`
        : "";
    const errorInfo = resp.error ? ` | error: ${resp.error.code}` : "";

    console.info(
        `ID ${resp.id} response: status=${status} | output="${outputTextPreview}"${toolCallsInfo}${errorInfo}`,
    );
}

export class Router {
    private config: Config;
    private providers: Map<Identifier, Provider>;
    private rules: Map<Model, Rule>;
    private latency: Map<string, number>;

    constructor(config: Config) {
        this.config = config;
        this.providers = new Map();
        this.rules = new Map();
        this.latency = new Map();

        this.initializeProviders(config.providers);
        this.initializeRules(config.rules);
    }

    private initializeProviders(providers: Provider[]): void {
        for (const provider of providers) {
            if (this.providers.has(provider.identifier)) {
                throw new Error(
                    `Provider ${provider.identifier} are defined multiple times with one: ${
                        this.providers.get(provider.identifier)?.name
                    }`,
                );
            }
            this.providers.set(provider.identifier, provider);
        }
    }

    private initializeRules(rules: Rule[]): void {
        for (const rule of rules) {
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
            this.validateRuleProviders(rule);
            this.rules.set(rule.model, rule);
        }
    }

    private validateRuleProviders(rule: Rule): void {
        for (const ruleProvider of rule.providers) {
            const provider = this.providers.get(ruleProvider.identifier);
            if (!provider) {
                throw new Error(
                    `Provider ${ruleProvider.identifier} does not exist in rule of model ${rule.model}`,
                );
            }
            for (const model of ruleProvider.models) {
                if (!provider.models.includes(model)) {
                    throw new Error(
                        `Forwarding model ${model} does not exist in provider ${ruleProvider.identifier} from rule of model ${rule.model}`,
                    );
                }
            }
        }
    }

    private resolveTargetModel(model: Model): [Model, Identifier, Provider] {
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

        return [targetModel, providerId, provider];
    }

    tryParseTargetModel(model: Model): [Model, Identifier | undefined] {
        const parts = model.split("@@");

        if (parts.length === 2 && parts[0] && parts[1]) {
            return [parts[0], parts[1]];
        }

        if (parts.length > 2) {
            const lastPart = parts[parts.length - 1];
            if (lastPart) {
                return [parts.slice(0, -1).join("@@"), lastPart];
            }
        }

        return [model, undefined];
    }

    pickProviderModel(model: Model): [Model, Identifier] {
        const rule = this.rules.get(model);
        if (!rule) {
            throw new Error(`No rule found for model ${model}`);
        }

        const models: Array<[Model, Identifier]> = [];
        for (const provider of rule.providers) {
            for (const providerModel of provider.models) {
                models.push([providerModel, provider.identifier]);
            }
        }
        if (models.length === 0) {
            throw new Error("No target model available to pick");
        }

        models.sort(([model1, id1], [model2, id2]) => {
            const latency1 = this.latency.get(`${model1}@@${id1}`) ??
                Number.MIN_SAFE_INTEGER;
            const latency2 = this.latency.get(`${model2}@@${id2}`) ??
                Number.MIN_SAFE_INTEGER;
            return latency1 - latency2;
        });

        if (Math.random() < RANDOM_PROVIDER_CHANCE) {
            const randomIndex = Math.floor(Math.random() * models.length);
            return models[randomIndex] ?? models[0];
        }

        return models[0];
    }

    private buildForwardRequest(
        request: Request,
        provider: Provider,
        path: string,
    ): { url: string; headers: Headers } {
        const url = new URL(provider.endpoint);
        url.pathname = path;

        const headers = new Headers(request.headers);
        if (provider.api_key) {
            headers.set("Authorization", `Bearer ${provider.api_key}`);
        }
        headers.set(HTTP_REFERER_HEADER, HTTP_REFERER_HEADER_VALUE);
        headers.set(X_TITLE_HEADER, X_TITLE_HEADER_VALUE);

        return { url: url.toString(), headers };
    }

    private async forwardRequest(
        url: string,
        headers: Headers,
        body: unknown,
    ): Promise<{ rawResponse: globalThis.Response; latencyMs: number }> {
        const startTime = performance.now();
        const rawResponse = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        });
        const latencyMs = performance.now() - startTime;
        return { rawResponse, latencyMs };
    }

    private buildResponse(
        request: Request,
        rawResponse: globalThis.Response,
    ): Response {
        const response = new Response(request);
        response.status = rawResponse.status;
        response.headers = rawResponse.headers;
        response.type = rawResponse.type;
        return response;
    }

    private processStreamResponse<T>(
        rawResponse: globalThis.Response,
        response: Response,
        onEvent: (data: T) => void,
    ): void {
        if (!rawResponse.body) {
            throw new Error("Stream response body is empty");
        }

        const [responseStream, middlewareStream] = rawResponse.body.tee();
        response.body = responseStream;

        const parser = createParser({
            onEvent: (event: { event?: string; data: string }) => {
                const trimmedData = event.data.trim();
                if (trimmedData === "[DONE]") return;

                try {
                    onEvent(JSON.parse(trimmedData) as T);
                    // deno-lint-ignore no-empty
                } catch {}
            },
        });

        const reader = middlewareStream.getReader();
        reader.read().then(
            function chunkReader({ done, value }): Promise<void> {
                if (done) return Promise.resolve();
                parser.feed(new TextDecoder().decode(value));
                return reader.read().then(chunkReader);
            },
        );
    }

    public async route(request: Request): Promise<Response> {
        const body = await request.body.json();
        migrateDeprecatedFields(body);

        const [sourceModel, isStream] = [
            body.model as Model,
            body.stream as boolean,
        ];
        const [targetModel, providerId, provider] = this.resolveTargetModel(
            sourceModel,
        );

        console.info(
            `Routing ${
                isStream ? "stream" : "non-stream"
            } request: ${sourceModel} -> ${targetModel}@@${providerId}`,
        );

        const { url, headers } = this.buildForwardRequest(
            request,
            provider,
            provider.path,
        );
        body.model = targetModel;

        const { rawResponse, latencyMs } = await this.forwardRequest(
            url,
            headers,
            body,
        );
        this.updateLatency(targetModel, providerId, latencyMs);

        const response = this.buildResponse(request, rawResponse);
        const ctx: RouteContext = {
            requestId: "",
            sourceModel,
            targetModel,
            providerId,
            latencyMs,
        };

        if (isStream) {
            this.processStreamResponse<CompletionChunk>(
                rawResponse,
                response,
                (chunk) => {
                    ctx.requestId = chunk.id;
                    logCompletionResult(chunk, ctx, true);
                },
            );
        } else {
            const result = await rawResponse.json() as CompletionResponse;
            response.body = result;
            ctx.requestId = result.id;
            logCompletionResult(result, ctx, false);
        }

        return response;
    }

    public async routeResponses(request: Request): Promise<Response> {
        const body = await request.body.json();

        const [sourceModel, isStream] = [
            body.model as Model,
            body.stream as boolean,
        ];
        const [targetModel, providerId, provider] = this.resolveTargetModel(
            sourceModel,
        );

        console.info(
            `Routing responses ${
                isStream ? "stream" : "non-stream"
            } request: ${sourceModel} -> ${targetModel}@@${providerId}`,
        );

        const responsesPath = provider.responses_path || DEFAULT_RESPONSES_PATH;
        const { url, headers } = this.buildForwardRequest(
            request,
            provider,
            responsesPath,
        );
        body.model = targetModel;

        const { rawResponse, latencyMs } = await this.forwardRequest(
            url,
            headers,
            body,
        );
        this.updateLatency(targetModel, providerId, latencyMs);

        const response = this.buildResponse(request, rawResponse);
        const ctx: RouteContext = {
            requestId: "",
            sourceModel,
            targetModel,
            providerId,
            latencyMs,
        };

        if (isStream) {
            this.processStreamResponse<ResponsesStreamEvent>(
                rawResponse,
                response,
                (event) => {
                    if (event.type === "response.completed" && event.response) {
                        const resp = event.response as ResponsesResponse;
                        ctx.requestId = resp.id;
                        logResponsesResult(resp, ctx);
                    }
                },
            );
        } else {
            const result = await rawResponse.json() as ResponsesResponse;
            response.body = result;
            ctx.requestId = result.id;
            logResponsesResult(result, ctx);
        }

        return response;
    }

    updateLatency(model: Model, provider: Identifier, latency: number): void {
        this.latency.set(`${model}@@${provider}`, latency);
    }

    public async getStats(): Promise<
        { hash: string; latency: Record<string, number> }
    > {
        const sortedLatency = new Map(
            [...this.latency.entries()].sort(([, a], [, b]) => a - b),
        );
        return {
            hash: await hashConfig(this.config),
            latency: Object.fromEntries(sortedLatency.entries()),
        };
    }
}
