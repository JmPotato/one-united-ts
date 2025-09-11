import { Router } from "@/router/router.ts";
import { Config, hashConfig } from "@/types/config.ts";

const CONFIG_KEY = "config";

const KV = await openKv();
let llmRouter: Router | null = null;

export async function openKv(): Promise<Deno.Kv> {
    const isDenoDeploy = Boolean(Deno.env.get("DENO_DEPLOYMENT_ID"));

    if (isDenoDeploy) {
        return await Deno.openKv();
    }

    return await Deno.openKv("kv.db");
}

export async function getConfig(kv: Deno.Kv): Promise<Config | null> {
    const result = await kv.get<Config>([CONFIG_KEY]);
    if (!result.value) {
        console.warn("No config found");
        return null;
    }
    const config = result.value;
    const hash = await hashConfig(config);
    console.info(`Getting config with hash ${hash}`);
    return config;
}

export async function setConfig(kv: Deno.Kv, config: Config): Promise<void> {
    console.info(
        `Setting config with hash ${await hashConfig(config)}`,
    );
    await kv.set([CONFIG_KEY], config);
    // Re-generate router with new config
    llmRouter = await generateRouter();
}

async function generateRouter(): Promise<Router> {
    const config = await getConfig(KV);
    if (!config) {
        throw new Error(
            "No config found, please post one at /config first",
        );
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
