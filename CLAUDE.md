# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

one-united-ts is a TypeScript LLM API Gateway that routes requests to multiple LLM providers with latency-based load balancing. It provides OpenAI-compatible endpoints (Chat Completions & Responses API) and intelligently selects providers based on measured latency.

## Development Commands

```bash
bun run dev          # Start dev server with watch mode (default: http://127.0.0.1:5299)
bun start            # Run in production mode
bun test             # Run test suite
bun test src/app.test.ts                  # Run UI SSR route tests
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

- **src/app.ts** - Elysia app factory (`createApp`) and HTTP entry point with authentication middleware (Bearer token via ONE_API_KEY)
- **src/app.test.ts** - SSR coverage for static UI routes
- **src/router/router.ts** - Core routing engine: provider selection, latency tracking, request forwarding, streaming support
- **src/store.ts** - Lazy-initialized SQLite persistence layer (WAL mode), router singleton
- **src/types/** - TypeScript interfaces for OpenAI API types and gateway configuration
- **src/views/layout.tsx** - Shared layout component: HTML shell, nav, auth widget, design system CSS/JS (@kitajs/html)
- **src/views/dashboard.tsx** - Latency monitoring dashboard
- **src/views/models.tsx** - Models & routing visualization
- **src/views/providers.tsx** - Provider fleet status
- **src/views/config-editor.tsx** - YAML configuration editor with validate/format/deploy
- **src/views/playground.tsx** - API playground with streaming support

### Request Flow

```
Client → Elysia (auth) → Router (provider selection) → Upstream LLM → Response Processing → Client
```

### Frontend UI

Server-rendered JSX pages via @kitajs/html with client-side vanilla JS. All pages share a Layout component (`src/views/layout.tsx`) that provides:
- Shared design system (CSS variables)
- Sticky header with navigation and auth widget
- Shared auth logic (localStorage API key, `apiFetch()`, `onAuthenticated()` callback pattern)

| Route | Page | Data Source |
|-------|------|-------------|
| `/` | Latency Dashboard | `GET /stats` (3s polling) |
| `/ui/models` | Models & Routing | `GET /stats/routing` (10s polling) |
| `/ui/providers` | Provider Fleet | `GET /stats/routing` (10s polling) |
| `/ui/config` | Config Editor | `GET /config`, `POST /config/validate`, `POST /config/format` |
| `/ui/playground` | API Console | `POST /v1/chat/completions`, `POST /v1/responses` |

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | No | Latency dashboard HTML |
| GET | `/ui/*` | No | UI pages (models, providers, config, playground) |
| GET | `/config` | Yes | Get current config (JSON or YAML via Accept header) |
| POST | `/config` | Yes | Apply new config (JSON or YAML) |
| POST | `/config/validate` | Yes | Validate config without applying |
| POST | `/config/format` | Yes | Format YAML config with canonical indentation |
| GET | `/stats` | Yes | Latency stats and config hash |
| GET | `/stats/routing` | Yes | Full routing info: models, providers, latency map |
| GET | `/v1/models` | Yes | List available models (OpenAI-compatible) |
| POST | `/v1/chat/completions` | Yes | Chat completions proxy (streaming supported) |
| POST | `/v1/responses` | Yes | Responses API proxy (streaming supported) |

### Key Routing Features

- **Provider override syntax**: `model@@provider` (e.g., `gpt-4@@openrouter`)
- **Latency-based selection**: 20% chance to pick from unknown-latency providers when available; if all known, 20% chance to use weighted random (favor lower latency); otherwise select fastest (`RANDOM_PROVIDER_CHANCE`)
- **Deprecated field migration**: `max_tokens` → `max_completion_tokens`, `user` → `safety_identifier` + `prompt_cache_key`, `functions` → `tools`, `function_call` → `tool_choice`
- **Extra fields injection**: `extra_fields` on rule providers injects custom fields into forwarded requests (operator config overrides user input; cannot overwrite `model`)
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
        extra_fields:               # Optional: injected into forwarded request body
          thinking:
            type: "disabled"
```

## Code Style

### Imports

1. External packages first (elysia, yaml, picocolors, etc.)
2. Local imports with `@/` alias (maps to `./src/`), no file extension

```typescript
import { Elysia } from "elysia";
import pc from "picocolors";
import { Router } from "@/router/router";
```

### Formatting & Naming

- Indent: tab-width 4 (Biome). Run `bun run fmt` before committing.
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
- Keep SSR route tests focused on stable page markers rather than theme-specific implementation details

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
