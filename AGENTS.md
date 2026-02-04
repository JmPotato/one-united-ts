# AGENTS.md - one-united-ts

LLM API Gateway for routing requests to multiple providers with latency-based
load balancing.

## Quick Reference

```bash
deno task dev              # Start dev server with watch mode
deno task prod             # Start production server
deno lint                  # Run linter
deno fmt                   # Format code
deno fmt --check           # Check formatting
deno test -A               # Run all tests
deno test -A src/router/router.test.ts                    # Run single test file
deno test -A --filter="Router constructor"                # Run tests matching pattern
deno check src/            # Type check all source files
```

## Project Structure

```
src/
├── app.ts                 # Entry point, Oak routes, CLI
├── global.ts              # KV storage, router singleton
├── router/
│   ├── router.ts          # Core routing logic
│   └── router.test.ts     # Router tests
└── types/
    ├── config.ts          # Config types and parsing
    ├── config.test.ts     # Config tests
    ├── completaion.ts     # Chat Completions API types (note: typo is intentional)
    └── responses.ts       # Responses API types
```

## Technology Stack

- **Runtime**: Deno 2.x
- **Framework**: Oak (web framework)
- **Storage**: Deno KV
- **CLI**: Cliffy Command
- **Testing**: Deno built-in test runner

## Code Style Guidelines

### Imports

Order imports in this sequence:

1. Standard library (`@std/*`)
2. Framework imports (`@oak/*`, `@cliffy/*`)
3. npm packages
4. Local imports (`@/`)

```typescript
import { bold, yellow } from "@std/fmt/colors";
import { Application } from "@oak/oak/application";
import { createParser } from "eventsource-parser";
import { Router } from "@/router/router.ts";
```

Use path alias `@/` for local imports (maps to `./src/`). Always include `.ts`
extension for local imports.

### Formatting

Configured in `deno.json`:

- Indent: 4 spaces
- Run `deno fmt` before committing

### Types

- Use explicit types for function parameters and return values
- Use `interface` for object shapes, `type` for unions/aliases
- Export types from dedicated files in `src/types/`

```typescript
export type Model = string;
export type Identifier = string;

export interface Provider {
    name: string;
    identifier: Identifier;
    endpoint: string;
    // ...
}
```

### Naming Conventions

- **Files**: lowercase with hyphens (`router.ts`, `config.test.ts`)
- **Classes**: PascalCase (`Router`, `Config`)
- **Functions**: camelCase (`buildConfig`, `getRouter`)
- **Constants**: UPPER_SNAKE_CASE (`RANDOM_PROVIDER_CHANCE`, `CONFIG_PATH`)
- **Interfaces/Types**: PascalCase (`Provider`, `RouteContext`)

### Error Handling

Use typed error handling with `error: unknown`:

```typescript
try {
    // ...
} catch (error: unknown) {
    ctx.response.status = 500;
    ctx.response.body = {
        error: error instanceof Error
            ? error.message
            : "An unknown error occurred",
    };
}
```

### Testing

- Test files: `*.test.ts` next to source files
- Use `Deno.test()` with descriptive names
- Import assertions from `@std/assert`

```typescript
import { assertEquals, assertThrows } from "@std/assert";

Deno.test("Router constructor - should initialize with valid config", () => {
    // ...
    assertEquals(router instanceof Router, true);
});

Deno.test("Router constructor - should throw error for duplicate providers", () => {
    assertThrows(() => new Router(config), Error, "expected error message");
});
```

### Comments

- Avoid comments; write self-documenting code
- Use `// deno-lint-ignore <rule>` only when necessary
- No docstrings unless documenting public API

### Async/Await

- Use `async/await` for asynchronous operations
- Handle Promise rejections properly

## CI/CD

GitHub Actions workflow (`.github/workflows/deno-test.yml`):

1. `deno fmt --check` - Verify formatting
2. `deno lint` - Run linter
3. `deno test -A` - Run all tests

All checks must pass before merging to `main`.

## Environment Variables

- `ONE_API_KEY` - API key for authentication (optional)
- `DENO_DEPLOYMENT_ID` - Set automatically by Deno Deploy

## Key Patterns

### Request Routing

Models can be routed using `model@@provider` syntax:

```json
{ "model": "gpt-4@@openai" }
```

### Latency-Based Load Balancing

- 80% requests go to fastest provider
- 20% random for load distribution (`RANDOM_PROVIDER_CHANCE`)

### Deprecated Field Migration

Requests with deprecated OpenAI fields are auto-migrated:

- `max_tokens` → `max_completion_tokens`
- `user` → `safety_identifier` + `prompt_cache_key`
- `functions` → `tools`
- `function_call` → `tool_choice`
