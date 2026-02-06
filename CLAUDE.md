# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

one-united-ts is a TypeScript LLM API Gateway that routes requests to multiple LLM providers with latency-based load balancing. It provides OpenAI-compatible endpoints (Chat Completions & Responses API) and intelligently selects providers based on measured latency.

## Development Commands

```bash
bun run dev          # Start dev server with watch mode (default: http://127.0.0.1:5299)
bun start            # Run in production mode
bun test             # Run test suite
bun test src/router/router.test.ts           # Run single test file
bun test --filter="Router constructor"       # Run tests matching pattern
bun run typecheck    # Type check without emit
bun run lint         # Run Biome linter
bun run fmt          # Format code with Biome
bun run fmt:check    # Check formatting
```

CI runs in order: `fmt:check` → `lint` → `test`. All must pass before merging to `main`.

## Architecture

### Core Components

- **src/app.ts** - Elysia HTTP server with route definitions, authentication middleware (Bearer token via ONE_API_KEY)
- **src/router/router.ts** - Core routing engine: provider selection, latency tracking, request forwarding, streaming support
- **src/store.ts** - SQLite persistence layer (WAL mode), lazy-loaded router singleton
- **src/types/** - TypeScript interfaces for OpenAI API types and gateway configuration
- **src/views/Dashboard.tsx** - HTML dashboard UI for monitoring (JSX with @kitajs/html)

### Request Flow

```
Client → Elysia (auth) → Router (provider selection) → Upstream LLM → Response Processing → Client
```

### Key Routing Features

- **Provider override syntax**: `model@@provider` (e.g., `gpt-4@@openrouter`)
- **Latency-based selection**: 20% chance to pick from unknown-latency providers when available; if all known, 20% chance to use weighted random (favor lower latency); otherwise select fastest (`RANDOM_PROVIDER_CHANCE`)
- **Deprecated field migration**: `max_tokens` → `max_completion_tokens`, `user` → `safety_identifier` + `prompt_cache_key`, `functions` → `tools`, `function_call` → `tool_choice`
- **Streaming**: Server-Sent Events via eventsource-parser

### Configuration

Providers and routing rules are configured via YAML/JSON POST to `/config`. Config schema in `src/types/config.ts`:

```yaml
providers:
  - name: "Display Name"
    identifier: "unique-id"
    endpoint: "https://api.example.com"
    api_key: "$ENV_VAR"
    models: ["model-1"]

rules:
  - model: "user-facing-model"
    providers:
      - identifier: "provider-id"
        models: ["backend-model"]
```

## Code Style

### Imports

1. External packages first (elysia, yaml, picocolors, etc.)
2. Local imports with `@/` alias (maps to `./src/`), always include `.ts` extension

```typescript
import { Elysia } from "elysia";
import pc from "picocolors";
import { Router } from "@/router/router.ts";
```

### Formatting & Naming

- Indent: 4 spaces (Biome). Run `bun run fmt` before committing.
- **Files**: lowercase with hyphens (`router.ts`, `config.test.ts`)
- **Classes/Interfaces/Types**: PascalCase (`Router`, `Provider`)
- **Functions**: camelCase (`buildConfig`, `getRouter`)
- **Constants**: UPPER_SNAKE_CASE (`RANDOM_PROVIDER_CHANCE`)

### Types

- Use `interface` for object shapes, `type` for unions/aliases
- Export types from dedicated files in `src/types/`
- Use explicit types for function parameters and return values

### Error Handling

Use typed `error: unknown` in catch blocks, return JSON error responses.

### Testing

- Test files: `*.test.ts` colocated next to source files
- Use `bun:test` (`describe`, `expect`, `test`) with descriptive names

### Comments

- Avoid comments; write self-documenting code
- No docstrings unless documenting public API

## Environment Variables

- `ONE_API_KEY` - Bearer token for API auth (optional)
- `PORT` - Server port (default: 5299)
- `HOSTNAME` - Server hostname (default: 127.0.0.1)
- `DATABASE_PATH` - SQLite path (default: kv.db)

## Tech Stack

- **Runtime**: Bun (≥1.0.0)
- **Framework**: Elysia
- **Database**: SQLite (bun:sqlite)
- **Linter/Formatter**: Biome (via bunx)
