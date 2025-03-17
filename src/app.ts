import { bold, yellow } from "@std/fmt/colors";

import { Application } from "@oak/oak/application";
import { Router } from "@oak/oak/router";
import { Context } from "@oak/oak/context";

import { getConfig, getRouter, setConfig } from "@/global.ts";
import { buildConfig, Config } from "@/types/config.ts";

const PORT = 5299;
const ONE_API_KEY = Deno.env.get("ONE_API_KEY");

// Endpoint paths
const CONFIG_PATH = "/config";
const STATS_PATH = "/stats";
const MODELS_PATH = "/v1/models";
const COMPLETIONS_PATH = "/v1/chat/completions";

// Initialize KV database
const KV = await Deno.openKv();
const oakRouter = new Router();

// Config endpoints
oakRouter.get(CONFIG_PATH, async (ctx: Context) => {
    try {
        const config = await getConfig(KV);
        if (!config) {
            ctx.response.status = 404;
            ctx.response.body = { error: "Configuration not found" };
            return;
        }
        ctx.response.body = config;
    } catch (error: unknown) {
        ctx.response.status = 500;
        ctx.response.body = {
            error: error instanceof Error
                ? error.message
                : "An unknown error occurred",
        };
    }
});

oakRouter.post(CONFIG_PATH, async (ctx: Context) => {
    try {
        // Retrieve the config from the request body according to the CONTENT-TYPE header
        const contentType = ctx.request.headers.get("content-type");
        let config: Config;
        if (contentType === "application/json") {
            config = await ctx.request.body.json();
        } else if (contentType === "application/yaml") {
            config = buildConfig(await ctx.request.body.text());
        } else {
            ctx.response.status = 415;
            ctx.response.body = { error: "Unsupported media type" };
            return;
        }
        // Update the config in the KV database
        await setConfig(KV, config);
        ctx.response.body = {
            message: "Configuration updated successfully",
        };
    } catch (error: unknown) {
        ctx.response.status = 500;
        ctx.response.body = {
            error: error instanceof Error
                ? error.message
                : "An unknown error occurred",
        };
    }
});

// Stats endpoint
oakRouter.get(STATS_PATH, async (ctx: Context) => {
    try {
        const router = await getRouter();
        const stats = await router.getStats();
        ctx.response.body = stats;
    } catch (error: unknown) {
        ctx.response.status = 500;
        ctx.response.body = {
            error: error instanceof Error
                ? error.message
                : "An unknown error occurred",
        };
    }
});

// Models endpoint
oakRouter.get(MODELS_PATH, async (ctx: Context) => {
    try {
        const config = await getConfig(KV);
        if (!config) {
            ctx.response.status = 404;
            ctx.response.body = { error: "Configuration not found" };
            return;
        }

        // Get models from rules
        const models = config.rules.map((rule) => rule.model);

        // Format response according to OpenAI API spec
        // @see https://platform.openai.com/docs/api-reference/models/list
        ctx.response.body = {
            object: "list",
            data: models.map((model) => ({
                id: model,
                object: "model",
            })),
        };
    } catch (error: unknown) {
        ctx.response.status = 500;
        ctx.response.body = {
            error: error instanceof Error
                ? error.message
                : "An unknown error occurred",
        };
    }
});

// Completions endpoint
oakRouter.post(COMPLETIONS_PATH, async (ctx: Context) => {
    try {
        const router = await getRouter();
        ctx.response = await router.route(ctx.request);
    } catch (error: unknown) {
        ctx.response.status = 500;
        ctx.response.body = {
            error: error instanceof Error
                ? error.message
                : "An unknown error occurred",
        };
    }
});

const app = new Application();

// Add a middleware to check if the API key is valid
app.use(async (ctx, next) => {
    const apiKey = ctx.request.headers.get("Authorization");
    if (ONE_API_KEY && apiKey !== `Bearer ${ONE_API_KEY}`) {
        ctx.response.status = 401;
        ctx.response.body = {
            error: "Unauthorized or invalid ONE_API_KEY in the header",
        };
        return;
    }
    await next();
});
app.use(oakRouter.routes());
app.use(oakRouter.allowedMethods());

// Log when we start listening for requests
app.addEventListener("listen", ({ hostname, port, serverType }) => {
    console.log(
        `${bold("Start listening on ")}${yellow(`${hostname}:${port}`)} ${
            bold("using HTTP server:")
        } ${yellow(serverType)}`,
    );
});

// Start listening to requests
await app.listen({ hostname: "127.0.0.1", port: PORT });
