# AGENTS.md - one-united-ts

LLM API Gateway for routing requests to multiple providers with latency-based
load balancing.

## Quick Reference

```bash
bun run dev                # Start dev server with watch mode
bun run start              # Start production server
bun run lint               # Run linter (Biome)
bun run fmt                # Format code (Biome)
bun run fmt:check          # Check formatting
bun test                   # Run all tests
bun test src/router/router.test.ts                        # Run single test file
bun test --filter="Router constructor"                    # Run tests matching pattern
bun run typecheck          # Type check all source files
```

## Project Structure

```
src/
├── app.ts                 # Entry point, Elysia routes
├── global.ts              # SQLite storage, router singleton
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

- **Runtime**: Bun
- **Framework**: Elysia (web framework)
- **Storage**: Bun SQLite
- **Testing**: bun:test

## Code Style Guidelines

### Imports

Order imports in this sequence:

1. External packages (elysia, yaml, picocolors, etc.)
2. Local imports (`@/`)

```typescript
import { Elysia } from "elysia";
import pc from "picocolors";
import { stringify } from "yaml";
import { Router } from "@/router/router.ts";
```

Use path alias `@/` for local imports (maps to `./src/`). Always include `.ts`
extension for local imports.

### Formatting

Configured via Biome (run with `bunx @biomejs/biome`):

- Indent: 4 spaces
- Run `bun run fmt` before committing

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
    return new Response(
        JSON.stringify({
            error: error instanceof Error
                ? error.message
                : "An unknown error occurred",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
    );
}
```

### Testing

- Test files: `*.test.ts` next to source files
- Use `bun:test` with descriptive names
- Import assertions from `bun:test`

```typescript
import { describe, expect, test } from "bun:test";

test("Router constructor - should initialize with valid config", () => {
    // ...
    expect(router instanceof Router).toBe(true);
});

test("Router constructor - should throw error for duplicate providers", () => {
    expect(() => new Router(config)).toThrow("expected error message");
});
```

### Comments

- Avoid comments; write self-documenting code
- No docstrings unless documenting public API

### Async/Await

- Use `async/await` for asynchronous operations
- Handle Promise rejections properly

## CI/CD

GitHub Actions workflow (`.github/workflows/bun-test.yml`):

1. `bun run fmt:check` - Verify formatting
2. `bun run lint` - Run linter
3. `bun test` - Run all tests

All checks must pass before merging to `main`.

## Environment Variables

- `ONE_API_KEY` - API key for authentication (optional)
- `PORT` - Server port (default: 5299)
- `HOSTNAME` - Server hostname (default: 127.0.0.1)

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
