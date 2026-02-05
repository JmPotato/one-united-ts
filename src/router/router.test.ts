import { expect, test } from "bun:test";

import { RANDOM_PROVIDER_CHANCE, Router } from "@/router/router";
import type { Config } from "@/types/config";

test("Router constructor - should initialize with valid config", () => {
	const config: Config = {
		rules: [
			{
				model: "gpt-4",
				providers: [
					{
						identifier: "openai",
						models: ["gpt-4"],
					},
				],
			},
		],
		providers: [
			{
				name: "OpenAI",
				identifier: "openai",
				endpoint: "https://api.openai.com/v1",
				path: "/v1/chat/completions",
				api_key: "test-key",
				models: ["gpt-4"],
			},
		],
	};

	const router = new Router(config);
	// If no error is thrown, the test passes
	expect(router).toBeInstanceOf(Router);
});

test("Router constructor - should throw error for duplicate provider identifiers", () => {
	const config: Config = {
		rules: [],
		providers: [
			{
				name: "OpenAI 1",
				identifier: "openai",
				endpoint: "https://api.openai.com/v1",
				path: "/v1/chat/completions",
				api_key: "test-key-1",
				models: ["gpt-4"],
			},
			{
				name: "OpenAI 2",
				identifier: "openai", // Duplicate identifier
				endpoint: "https://api.openai.com/v1",
				path: "/v1/chat/completions",
				api_key: "test-key-2",
				models: ["gpt-4"],
			},
		],
	};

	expect(() => new Router(config)).toThrow(
		"Provider openai are defined multiple times",
	);
});

test("Router constructor - should throw error for duplicate model rules", () => {
	const config: Config = {
		providers: [
			{
				name: "OpenAI",
				identifier: "openai",
				endpoint: "https://api.openai.com/v1",
				path: "/v1/chat/completions",
				api_key: "test-key",
				models: ["gpt-4"],
			},
		],
		rules: [
			{
				model: "gpt-4",
				providers: [
					{
						identifier: "openai",
						models: ["gpt-4"],
					},
				],
			},
			{
				model: "gpt-4", // Duplicate model
				providers: [
					{
						identifier: "openai",
						models: ["gpt-4"],
					},
				],
			},
		],
	};

	expect(() => new Router(config)).toThrow(
		"Rule for model gpt-4 are defined multiple times",
	);
});

test("Router constructor - should throw error for non-existent provider in rule", () => {
	const config: Config = {
		providers: [
			{
				name: "OpenAI",
				identifier: "openai",
				endpoint: "https://api.openai.com/v1",
				path: "/v1/chat/completions",
				api_key: "test-key",
				models: ["gpt-4"],
			},
		],
		rules: [
			{
				model: "gpt-4",
				providers: [
					{
						identifier: "non-existent", // Provider doesn't exist
						models: ["gpt-4"],
					},
				],
			},
		],
	};

	expect(() => new Router(config)).toThrow(
		"Provider non-existent does not exist in rule of model gpt-4",
	);
});

test("Router constructor - should throw error for invalid model in provider rule", () => {
	const config: Config = {
		providers: [
			{
				name: "OpenAI",
				identifier: "openai",
				endpoint: "https://api.openai.com/v1",
				path: "/v1/chat/completions",
				api_key: "test-key",
				models: ["gpt-4"],
			},
		],
		rules: [
			{
				model: "gpt-4",
				providers: [
					{
						identifier: "openai",
						models: ["non-existent-model"], // Model doesn't exist in provider
					},
				],
			},
		],
	};

	expect(() => new Router(config)).toThrow(
		"Forwarding model non-existent-model does not exist in provider openai from rule of model gpt-4",
	);
});

test("Router tryParseTargetModel - should return the target model and the identifier correctly", () => {
	const router = new Router({
		rules: [],
		providers: [],
	});

	let [tragetModel, identifier] = router.tryParseTargetModel("gpt-4@@openai");
	expect(tragetModel).toBe("gpt-4");
	expect(identifier).toBe("openai");

	[tragetModel, identifier] = router.tryParseTargetModel("gpt-4");
	expect(tragetModel).toBe("gpt-4");
	expect(identifier).toBe(undefined);

	[tragetModel, identifier] = router.tryParseTargetModel("gpt-4@@");
	expect(tragetModel).toBe("gpt-4@@");
	expect(identifier).toBe(undefined);

	[tragetModel, identifier] = router.tryParseTargetModel("@@openai");
	expect(tragetModel).toBe("@@openai");
	expect(identifier).toBe(undefined);

	[tragetModel, identifier] = router.tryParseTargetModel("@@");
	expect(tragetModel).toBe("@@");
	expect(identifier).toBe(undefined);

	[tragetModel, identifier] = router.tryParseTargetModel("@@@");
	expect(tragetModel).toBe("@@@");
	expect(identifier).toBe(undefined);

	[tragetModel, identifier] = router.tryParseTargetModel(
		"gpt-4@@openai@@openrouter",
	);
	expect(tragetModel).toBe("gpt-4@@openai");
	expect(identifier).toBe("openrouter");

	[tragetModel, identifier] = router.tryParseTargetModel("@@gpt-4@@openai");
	expect(tragetModel).toBe("@@gpt-4");
	expect(identifier).toBe("openai");

	[tragetModel, identifier] = router.tryParseTargetModel("gpt-4@@openai@@");
	expect(tragetModel).toBe("gpt-4@@openai@@");
	expect(identifier).toBe(undefined);
});

test("Router pickProviderModel - should throw error for non-existent model rule", () => {
	const router = new Router({
		rules: [],
		providers: [],
	});

	expect(() => router.pickProviderModel("non-existent-model")).toThrow(
		"No rule found for model non-existent-model",
	);
});

test("Router pickProviderModel - should return a valid provider-model pair", () => {
	const config: Config = {
		providers: [
			{
				name: "OpenAI",
				identifier: "openai",
				endpoint: "https://api.openai.com/v1",
				path: "/v1/chat/completions",
				api_key: "test-key",
				models: ["gpt-4", "gpt-3.5-turbo"],
			},
			{
				name: "Anthropic",
				identifier: "anthropic",
				endpoint: "https://api.anthropic.com",
				path: "/v1/complete",
				api_key: "test-key",
				models: ["claude-2", "claude-instant"],
			},
		],
		rules: [
			{
				model: "gpt-4",
				providers: [
					{
						identifier: "openai",
						models: ["gpt-4", "gpt-3.5-turbo"],
					},
					{
						identifier: "anthropic",
						models: ["claude-2"],
					},
				],
			},
		],
	};

	const router = new Router(config);
	const [model, provider] = router.pickProviderModel("gpt-4");

	// Check that the returned values are valid according to the rule
	const rule = config.rules[0];
	const validPairs = rule.providers.flatMap((p) =>
		p.models.map((m) => JSON.stringify([m, p.identifier])),
	);
	expect(validPairs.includes(JSON.stringify([model, provider]))).toBe(true);
});

test("Router pickProviderModel - should prefer faster providers based on latency", () => {
	const config: Config = {
		providers: [
			{
				name: "Fast Provider",
				identifier: "fast",
				endpoint: "https://fast.api.com",
				path: "/v1/complete",
				api_key: "test-key",
				models: ["model-1"],
			},
			{
				name: "Mid Provider",
				identifier: "mid",
				endpoint: "https://mid.api.com",
				path: "/v1/complete",
				api_key: "test-key",
				models: ["model-1"],
			},
			{
				name: "Slow Provider",
				identifier: "slow",
				endpoint: "https://slow.api.com",
				path: "/v1/complete",
				api_key: "test-key",
				models: ["model-1"],
			},
		],
		rules: [
			{
				model: "model-1",
				providers: [
					{
						identifier: "slow",
						models: ["model-1"],
					},
					{
						identifier: "fast",
						models: ["model-1"],
					},
					{
						identifier: "mid",
						models: ["model-1"],
					},
				],
			},
		],
	};

	const router = new Router(config);

	// Set latency values
	router.updateLatency("model-1", "fast", 100);
	router.updateLatency("model-1", "mid", 300);
	router.updateLatency("model-1", "slow", 500);

	// Test multiple times to account for randomization
	const sampleNumber = 1000;
	const samples = Array.from({ length: sampleNumber }, () =>
		router.pickProviderModel("model-1"),
	);
	const fastCount = samples.filter(
		([_, provider]) => provider === "fast",
	).length;

	const expectedPickCount = sampleNumber * (1 - 1.5 * RANDOM_PROVIDER_CHANCE);
	expect(fastCount >= expectedPickCount).toBe(true);
});
