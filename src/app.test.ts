import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";

import { createApp } from "@/app";

interface UiRouteExpectation {
	path: string;
	title: string;
	markers: string[];
}

const UI_ROUTES: UiRouteExpectation[] = [
	{
		path: "/",
		title: "One United - Global Telemetry",
		markers: ['id="grid"', 'id="lastUpdated"'],
	},
	{
		path: "/ui/models",
		title: "One United - Model Routing Strategy",
		markers: [
			'id="modelsContent"',
			"Connect to view model routing information",
		],
	},
	{
		path: "/ui/providers",
		title: "One United - Upstream Providers",
		markers: ['id="providerGrid"', 'id="sortSelect"', "Provider fleet status"],
	},
	{
		path: "/ui/config",
		title: "One United - Gateway Configuration",
		markers: ['id="configEditor"', 'id="btnDeploy"', 'id="feedbackBar"'],
	},
	{
		path: "/ui/playground",
		title: "One United - Console",
		markers: [
			'class="console"',
			'id="responseArea"',
			'class="api-toggle-btn api-type-btn active"',
			'id="modelInput"',
		],
	},
];

describe("UI routes", () => {
	test("static UI routes should not initialize the database", async () => {
		const tempDir = mkdtempSync(join(tmpdir(), "one-united-ui-routes-"));
		const dbPath = join(tempDir, "ui-only.db");
		const previousDatabasePath = Bun.env.DATABASE_PATH;

		Bun.env.DATABASE_PATH = dbPath;

		try {
			const app = createApp();
			const response = await app.handle(
				new Request("http://localhost/ui/providers"),
			);

			expect(response.status).toBe(200);
			expect(existsSync(dbPath)).toBe(false);
		} finally {
			if (previousDatabasePath === undefined) {
				delete Bun.env.DATABASE_PATH;
			} else {
				Bun.env.DATABASE_PATH = previousDatabasePath;
			}
			rmSync(tempDir, { recursive: true, force: true });
		}
	});

	for (const route of UI_ROUTES) {
		test(`${route.path} should render expected SSR markup`, async () => {
			const app = createApp();
			const response = await app.handle(
				new Request(`http://localhost${route.path}`),
			);

			expect(response.status).toBe(200);
			expect(response.headers.get("content-type")).toContain("text/html");

			const html = await response.text();
			expect(html).toContain(route.title);

			for (const marker of route.markers) {
				expect(html).toContain(marker);
			}
		});
	}
});
