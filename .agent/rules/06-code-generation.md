# Code Generation

## OpenAPI Schema Generation

TypeScript types and Zod validation schemas are auto-generated from backend OpenAPI specifications.

### Generated Files

```
src/lib/generated/
├── auth/
│   ├── openapi.gen.d.ts      # TypeScript types for auth service
│   └── schemas.gen.ts        # Zod schemas for auth service
├── administration_and_agronomy/
│   ├── openapi.gen.d.ts      # TypeScript types for main service
│   └── schemas.gen.ts        # Zod schemas for main service
├── menus.ts                  # Menu constant slugs
└── permissions.ts            # Permission constant slugs
```

### Generation Command

```bash
bun run generate:schema
```

This runs `scripts/gen-zod-schema.ts` which:

1. Fetches OpenAPI specs from running backend services
2. Generates TypeScript types using `openapi-typescript`
3. Generates Zod schemas using `json-schema-to-zod`
4. Formats output with Prettier

### Configuration

Services are defined in `scripts/openapi.config.ts`:

```typescript
export const services: ServiceConfig[] = [
  {
    name: 'auth',
    source: `${env.PUBLIC_AUTH_API_URL}/openapi.json`,
    outputDir: './src/lib/generated/auth'
  },
  {
    name: 'administration_and_agronomy',
    source: `${env.PUBLIC_T2_API_URL}/openapi.json`,
    outputDir: './src/lib/generated/administration_and_agronomy'
  }
];
```

### Environment Variables

Required in `.env`:

```env
PUBLIC_AUTH_API_URL=http://localhost:8080
PUBLIC_T2_API_URL=http://localhost:3003
```

## Using Generated Types

### Global Type Helpers

`src/app.d.ts` provides global type helpers:

```typescript
// Import generated components
import type { components as team2Components } from '$lib/generated/administration_and_agronomy/openapi.gen';
import type { components as authComponents } from '$lib/generated/auth/openapi.gen';

// Export cleaned-up schema types
export type Schemas = Prettify<CleanUp<team2Components['schemas']>>;
export type AuthSchemas = Prettify<CleanUp<authComponents['schemas']>>;
```

### Accessing Types in Code

```typescript
// For response/entity types - use components['schemas']
import type { components } from '$lib/generated/administration_and_agronomy/openapi.gen';
type EntityItem = components['schemas']['EntityItem'];

// For operation types - use operations
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';
type CreateInput = operations['create-entity']['requestBody']['content']['application/json'];
type ListParams = operations['list-entities']['parameters']['query'];
type GetResponse = operations['get-entity']['responses']['200']['content']['application/json'];

// For paths - use paths
import type { paths } from '$lib/generated/administration_and_agronomy/openapi.gen';
// Used primarily by openapi-fetch client
```

### Accessing Zod Schemas

```typescript
import {
  CreateEntityRequestSchema,
  UpdateEntityRequestSchema,
  EntityItemSchema
} from '$lib/generated/administration_and_agronomy/schemas.gen';

// Use for form validation
const result = CreateEntityRequestSchema.safeParse(formData);

// Use for runtime validation
const validated = EntityItemSchema.parse(apiResponse);
```

## Using Generated Permissions

```typescript
import { Permissions, type Permission } from '$lib/generated/permissions';

// Use constant for type safety
userCtx.hasPermission(Permissions.NURSERY_BATCH_VIEW);

// All available permissions
import { allPermissions } from '$lib/generated/permissions';
console.log(allPermissions); // ['nursery.batch.view', ...]
```

## Using Generated Menus

```typescript
import { Menus, type Menu, allMenus } from '$lib/generated/menus';

// Check menu access
const hasAccess = userModules.includes(Menus.NURSERY);
```

## When to Regenerate

Regenerate schemas when:

- Backend API changes (new endpoints, schema changes)
- New services are added
- After pulling backend updates

## Schema Generation Rules

1. **NEVER edit generated files** - They will be overwritten
2. **Derive types from operations** - Don't re-declare request/response types
3. **Use Zod schemas for validation** - Already match API expectations
4. **Import from correct module** - `auth` vs `administration_and_agronomy`
5. **Check for generation errors** - Invalid OpenAPI spec will cause failures

## Troubleshooting

### Connection Refused

Ensure backend services are running before generation:

```bash
# Check auth service
curl http://localhost:8080/openapi.json

# Check main service
curl http://localhost:3003/openapi.json
```

### Missing Schemas

Some generic schemas (e.g., `APIResponse{}`) are skipped intentionally:

- Schemas with `{}` in name (Go empty struct)
- Internal response wrappers

### Type Errors After Generation

1. Clear TypeScript cache: `bun run check`
2. Restart TypeScript server in editor
3. Check for breaking API changes and update consuming code
