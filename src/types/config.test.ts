import { assertEquals, assertThrows } from "@std/assert";

import { buildConfig } from "@/types/config.ts";

Deno.test("buildConfig - should parse a valid config correctly", () => {
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
    assertEquals(config.rules.length, 1);
    assertEquals(config.providers.length, 1);
    assertEquals(config.rules[0].model, "gpt-4");
    assertEquals(config.rules[0].providers[0].identifier, "openai");
    assertEquals(config.providers[0].name, "OpenAI");
});

Deno.test("buildConfig - should throw error when rules is missing", () => {
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

    assertThrows(
        () => buildConfig(yamlContent),
        Error,
        "Rules must be defined",
    );
});

Deno.test("buildConfig - should throw error when providers is missing", () => {
    const yamlContent = `
rules:
  - model: gpt-4
    providers:
      - identifier: openai
        models:
          - gpt-4
`;

    assertThrows(
        () => buildConfig(yamlContent),
        Error,
        "Providers must be defined",
    );
});

Deno.test("buildConfig - should throw error when rule model is missing", () => {
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

    assertThrows(
        () => buildConfig(yamlContent),
        Error,
        "Rule 0 must have a model name defined",
    );
});

Deno.test("buildConfig - should throw error when rule providers is missing", () => {
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

    assertThrows(
        () => buildConfig(yamlContent),
        Error,
        "Rule 0 must have at least one provider defined",
    );
});

Deno.test("buildConfig - should throw error when provider identifier is missing", () => {
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

    assertThrows(
        () => buildConfig(yamlContent),
        Error,
        "Provider 0 must have an identifier",
    );
});

Deno.test("buildConfig - should throw error when provider endpoint is missing", () => {
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

    assertThrows(
        () => buildConfig(yamlContent),
        Error,
        "Provider 0 must have an endpoint",
    );
});

Deno.test("buildConfig - should throw error when provider models is missing", () => {
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

    assertThrows(
        () => buildConfig(yamlContent),
        Error,
        "Provider 0 must have at least one model defined",
    );
});

Deno.test("buildConfig - should throw error for invalid YAML", () => {
    const yamlContent = `
rules:
  - model: gpt-4
    providers:
      - identifier: openai
        models:
          - gpt-4
  invalid-yaml-here
`;

    assertThrows(
        () => buildConfig(yamlContent),
        Error,
        "Failed to parse config",
    );
});
