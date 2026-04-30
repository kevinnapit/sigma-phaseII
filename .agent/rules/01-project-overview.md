# Project Overview

**SIGMA** is a modern web-based ERP (Enterprise Resource Planning) system for agriculture, built to modernize and replace the legacy **Harvest** desktop application.

This repository contains the **SvelteKit 5 frontend** for SIGMA, providing a modern, responsive interface for plantation and agricultural operations management.

## Tech Stack

### Core

- **Framework**: SvelteKit 5 with Svelte 5 runes (`$state`, `$derived`, `$effect`)
- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite 7
- **Runtime**: Node.js / Bun

### UI & Styling

- **CSS Framework**: Tailwind CSS 4
- **Component Library**: shadcn-svelte (Bits UI based)
- **Icons**: Lucide Svelte
- **Notifications**: svelte-sonner

### Data Management

- **Server State**: TanStack Query (Svelte Query v6)
- **Forms**: TanStack Form (Svelte Form)
- **Tables**: TanStack Table Core
- **API Client**: openapi-fetch

### Code Generation

- **Types**: openapi-typescript (generates `.d.ts` from OpenAPI specs)
- **Validation**: json-schema-to-zod (generates Zod schemas)
- **Runtime**: Bun for running generation scripts

## Project Structure

```
src/
├── app.d.ts                    # Global types (Schemas, AuthSchemas, etc.)
├── routes/                     # SvelteKit routes
│   ├── +layout.ts             # Root layout loader (QueryClient, UserContext)
│   ├── +layout.svelte         # Root layout component
│   └── (app)/dashboard/       # Protected dashboard routes
├── lib/
│   ├── config/                # Configuration
│   │   ├── fetcher/           # API clients (client.ts, auth-client.ts)
│   │   ├── forms/             # Form utilities and factories
│   │   └── queries/           # QueryClient configuration
│   ├── components/
│   │   ├── ui/                # shadcn-svelte components
│   │   │   └── data-table/    # TanStack Table integration
│   │   └── shared/            # Shared components (guard.svelte, etc.)
│   ├── generated/             # Auto-generated files (DO NOT EDIT)
│   │   ├── auth/              # Auth service types + schemas
│   │   ├── administration_and_agronomy/  # Main service types + schemas
│   │   ├── menus.ts           # Generated menu constants
│   │   └── permissions.ts     # Generated permission constants
│   ├── modules/               # Feature modules
│   │   ├── auth/              # Authentication module
│   │   ├── nursery/           # Nursery management module
│   │   ├── system-admin/      # System admin module
│   │   └── functional-admin/  # Functional admin module
│   └── features/              # Legacy feature organization
scripts/
├── gen-zod-schema.ts          # Schema generation script
└── openapi.config.ts          # Service configuration
```

## Key Patterns

### Type Derivation

Always derive types from generated OpenAPI types, never re-declare:

```typescript
// ✅ CORRECT - Derive from operations
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';
type CreateInput = operations['create-entity']['requestBody']['content']['application/json'];

// ❌ WRONG - Don't re-declare types
interface CreateInput {
  name: string;
  // ...
}
```

### Global Types

`src/app.d.ts` provides global type helpers - no import needed:

```typescript
// Available globally
type Schemas = Prettify<CleanUp<team2Components['schemas']>>;
type AuthSchemas = Prettify<CleanUp<authComponents['schemas']>>;
type ValidUser = Required<...>;
```

### API Clients

Two configured API clients available via UserContext:

```typescript
const userCtx = getUserContext();
userCtx.client()      // administration_and_agronomy service
userCtx.authClient()  // auth service
```

## Available Commands

```bash
# Development
bun run dev           # Start dev server
bun run build         # Production build
bun run preview       # Preview production build

# Type Checking & Linting
bun run check         # TypeScript check
bun run check:watch   # TypeScript watch mode
bun run lint          # ESLint + Prettier check
bun run format        # Format with Prettier

# Testing
bun run test:unit     # Vitest unit tests
bun run test:e2e      # Playwright E2E tests
bun run test          # Both unit + E2E

# Code Generation
bun run generate:schema  # Generate OpenAPI types + Zod schemas
```

## Module System

Feature modules live in `src/lib/modules/{module-name}/`:

```
{module}/
├── index.svelte.ts   # Main exports
├── keys.ts           # Query key factory
├── queries/          # TanStack Query hooks
└── forms/            # TanStack Form hooks
```

Each module is self-contained with its own queries, mutations, forms, and key definitions.
