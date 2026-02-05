import { Elysia } from "elysia";
import pc from "picocolors";

import { getConfig, getRouter, setConfig } from "@/global";
import { buildConfig, Config } from "@/types/config";

const ONE_API_KEY = Bun.env.ONE_API_KEY;
const PORT = parseInt(Bun.env.PORT || "5299");
const HOSTNAME = Bun.env.HOSTNAME || "127.0.0.1";

const CONTENT_TYPE = "Content-Type";
const APPLICATION_JSON = "application/json";
const APPLICATION_YAML = "application/yaml";

const JSON_HEADERS = { [CONTENT_TYPE]: APPLICATION_JSON } as const;

function jsonResponse(body: object, status: number): Response {
	return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function errorResponse(error: unknown, status = 500): Response {
	const message =
		error instanceof Error ? error.message : "An unknown error occurred";
	return jsonResponse({ error: message }, status);
}

const app = new Elysia()
	.onBeforeHandle(({ request, set }) => {
		const apiKey = request.headers.get("Authorization");
		if (ONE_API_KEY && apiKey !== `Bearer ${ONE_API_KEY}`) {
			set.status = 401;
			return { error: "Unauthorized or invalid ONE_API_KEY in the header" };
		}
	})
	.get("/config", async ({ request }) => {
		try {
			const config = await getConfig();
			if (!config) {
				return jsonResponse({ error: "Configuration not found" }, 404);
			}

			const accept = request.headers.get("Accept") || APPLICATION_JSON;
			if (accept.includes(APPLICATION_YAML)) {
				return new Response(Bun.YAML.stringify(config), {
					headers: { [CONTENT_TYPE]: APPLICATION_YAML },
				});
			}

			return config;
		} catch (error: unknown) {
			return errorResponse(error);
		}
	})
	.post("/config", async ({ request }) => {
		try {
			const contentType = request.headers.get("content-type");
			let config: Config;
			if (contentType === APPLICATION_JSON) {
				config = await request.json();
			} else if (contentType === APPLICATION_YAML) {
				config = buildConfig(await request.text());
			} else {
				return jsonResponse({ error: "Unsupported media type" }, 415);
			}
			await setConfig(config);
			return { message: "Configuration updated successfully" };
		} catch (error: unknown) {
			return errorResponse(error);
		}
	})
	.get("/stats", async () => {
		try {
			const router = await getRouter();
			return await router.getStats();
		} catch (error: unknown) {
			return errorResponse(error);
		}
	})
	.get("/v1/models", async () => {
		try {
			const config = await getConfig();
			if (!config) {
				return jsonResponse({ error: "Configuration not found" }, 404);
			}

			const models = config.rules.map((rule) => rule.model);
			return {
				object: "list",
				data: models.map((model) => ({ id: model, object: "model" })),
			};
		} catch (error: unknown) {
			return errorResponse(error);
		}
	})
	.post("/v1/chat/completions", async ({ request }) => {
		try {
			const router = await getRouter();
			return await router.route(request);
		} catch (error: unknown) {
			return errorResponse(error);
		}
	})
	.post("/v1/responses", async ({ request }) => {
		try {
			const router = await getRouter();
			return await router.routeResponses(request);
		} catch (error: unknown) {
			return errorResponse(error);
		}
	})
	.listen({ port: PORT, hostname: HOSTNAME }, (server) => {
		console.log(
			`${pc.bold("Start listening on ")}${pc.yellow(
				`${server.hostname ?? HOSTNAME}:${server.port}`,
			)}`,
		);
	});

export default app;
