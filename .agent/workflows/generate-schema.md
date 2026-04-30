---
description: How to generate OpenAPI TypeScript types and Zod schemas from backend services
---

# Generate OpenAPI Schema Workflow

This workflow generates TypeScript types (`openapi.gen.d.ts`) and Zod validation schemas (`schemas.gen.ts`) from backend OpenAPI specifications.

## Prerequisites

1. Backend services must be running and exposing `/openapi.json` endpoints
2. Environment variables configured in `.env`:
   - `PUBLIC_AUTH_API_URL` - Auth service URL (default: `http://localhost:8080`)
   - `PUBLIC_T2_API_URL` - Administration/Agronomy service URL (default: `http://localhost:3003`)

## Steps

// turbo

1. Run the generation script:

```bash
bun run generate:schema
```

2. The script will:
   - Fetch OpenAPI specs from configured services
   - Generate TypeScript types using `openapi-typescript`
   - Generate Zod schemas from the spec components
   - Format generated files with Prettier

## Generated Output

Files are generated to:

- **Auth Service**: `src/lib/generated/auth/`
  - `openapi.gen.d.ts` - TypeScript types
  - `schemas.gen.ts` - Zod validation schemas
- **Administration & Agronomy**: `src/lib/generated/administration_and_agronomy/`
  - `openapi.gen.d.ts` - TypeScript types
  - `schemas.gen.ts` - Zod validation schemas

## Configuration

Services are configured in `scripts/openapi.config.ts`:

```typescript
export const services: ServiceConfig[] = [
  {
    name: 'auth',
    source: `${auth_spec}/openapi.json`,
    outputDir: './src/lib/generated/auth'
  },
  {
    name: 'administration_and_agronomy',
    source: `${team2_spec}/openapi.json`,
    outputDir: './src/lib/generated/administration_and_agronomy'
  }
];
```

## Generating for a Specific Service

To generate for only one service:

```bash
bun run scripts/gen-zod-schema.ts --service auth
bun run scripts/gen-zod-schema.ts --service administration_and_agronomy
```

## Troubleshooting

- **Connection refused**: Ensure the backend service is running
- **Schema parsing errors**: Check if OpenAPI spec is valid JSON
- **Missing schemas**: Generic response schemas (e.g., `APIResponse{}`) are intentionally skipped

## Notes

- Never manually edit files in `src/lib/generated/` - they will be overwritten
- After generation, you may need to update TypeScript type imports in consuming modules
- Global type helpers are available in `src/app.d.ts` via `Schemas` and `AuthSchemas` types
