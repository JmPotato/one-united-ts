import { expect, test } from "bun:test";
import { buildConfig } from "@/types/config";

test("buildConfig - should parse a valid config correctly", () => {
	const yamlContent = `
rules:
  - model: gpt-4
    providers:
      - identifier: openai
        models:
          - gpt-4
          - gpt-4-turbo
providers:
  - name: OpenAI
    identifier: openai
    endpoint: https://api.openai.com/v1
    path: /v1/chat/completions
    api_key: sk-test
    models:
      - gpt-4
      - gpt-4-turbo
`;

	const config = buildConfig(yamlContent);
	expect(config.rules.length).toBe(1);
	expect(config.providers.length).toBe(1);
	expect(config.rules[0].model).toBe("gpt-4");
	expect(config.rules[0].providers[0].identifier).toBe("openai");
	expect(config.providers[0].name).toBe("OpenAI");
});

test("buildConfig - should throw error when rules is missing", () => {
	const yamlContent = `
providers:
   - name: OpenAI
     identifier: openai
     endpoint: https://api.openai.com/v1
     path: /v1/chat/completions
     api_key: sk-test
     models:
       - gpt-4
`;

	expect(() => buildConfig(yamlContent)).toThrow("Rules must be defined");
});

test("buildConfig - should throw error when providers is missing", () => {
	const yamlContent = `
rules:
   - model: gpt-4
     providers:
       - identifier: openai
         models:
           - gpt-4
`;

	expect(() => buildConfig(yamlContent)).toThrow("Providers must be defined");
});

test("buildConfig - should throw error when rule model is missing", () => {
	const yamlContent = `
rules:
   - providers:
       - identifier: openai
         models:
           - gpt-4
providers:
   - name: OpenAI
     identifier: openai
     endpoint: https://api.openai.com/v1
     path: /v1/chat/completions
     api_key: sk-test
     models:
       - gpt-4
`;

	expect(() => buildConfig(yamlContent)).toThrow(
		"Rule 0 must have a model name defined",
	);
});

test("buildConfig - should throw error when rule providers is missing", () => {
	const yamlContent = `
rules:
   - model: gpt-4
providers:
   - name: OpenAI
     identifier: openai
     endpoint: https://api.openai.com/v1
     path: /v1/chat/completions
     api_key: sk-test
     models:
       - gpt-4
`;

	expect(() => buildConfig(yamlContent)).toThrow(
		"Rule 0 must have at least one provider defined",
	);
});

test("buildConfig - should throw error when provider identifier is missing", () => {
	const yamlContent = `
rules:
   - model: gpt-4
     providers:
       - identifier: openai
         models:
           - gpt-4
providers:
   - name: OpenAI
     endpoint: https://api.openai.com/v1
     path: /v1/chat/completions
     api_key: sk-test
     models:
       - gpt-4
`;

	expect(() => buildConfig(yamlContent)).toThrow(
		"Provider 0 must have an identifier",
	);
});

test("buildConfig - should throw error when provider endpoint is missing", () => {
	const yamlContent = `
rules:
   - model: gpt-4
     providers:
       - identifier: openai
         models:
           - gpt-4
providers:
   - name: OpenAI
     identifier: openai
     path: /v1/chat/completions
     api_key: sk-test
     models:
       - gpt-4
`;

	expect(() => buildConfig(yamlContent)).toThrow(
		"Provider 0 must have an endpoint",
	);
});

test("buildConfig - should throw error when provider models is missing", () => {
	const yamlContent = `
rules:
   - model: gpt-4
     providers:
       - identifier: openai
         models:
           - gpt-4
providers:
   - name: OpenAI
     identifier: openai
     endpoint: https://api.openai.com/v1
     path: /v1/chat/completions
     api_key: sk-test
`;

	expect(() => buildConfig(yamlContent)).toThrow(
		"Provider 0 must have at least one model defined",
	);
});

test("buildConfig - should throw error for invalid YAML", () => {
	const yamlContent = `
rules:
   - model: gpt-4
     providers:
       - identifier: openai
         models:
           - gpt-4
   invalid-yaml-here
`;

	expect(() => buildConfig(yamlContent)).toThrow("Failed to parse config");
});
