import { Router } from "@/router/router.ts";
import { Config } from "@/types/config.ts";

const CONFIG_KEY = "config";

const KV = await Deno.openKv();
let llmRouter: Router | null = null;

export async function getConfig(kv: Deno.Kv): Promise<Config | null> {
    console.info("Getting config");
    const result = await kv.get<Config>([CONFIG_KEY]);
    return result.value;
}

export async function setConfig(kv: Deno.Kv, config: Config): Promise<void> {
    console.info("Setting config");
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
    return new Router(config);
}

export async function getRouter(): Promise<Router> {
    if (!llmRouter) {
        llmRouter = await generateRouter();
    }
    return llmRouter;
}
