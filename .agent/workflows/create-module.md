---
description: How to create a new feature module with queries, mutations, forms, and keys
---

# Create Feature Module Workflow

This workflow guides creating a new feature module following project conventions in `src/lib/modules/`.

## Module Structure

A complete module follows this structure:

```
src/lib/modules/{module-name}/
├── index.svelte.ts       # Main exports
├── keys.ts               # Query key factory
├── queries/              # TanStack Query hooks
│   ├── use{Entity}ListQuery.svelte.ts
│   ├── use{Entity}DetailQuery.svelte.ts
│   └── use{Entity}Mutation.svelte.ts
└── forms/                # TanStack Form hooks
    ├── index.ts
    └── use{Entity}Form.ts
```

## Step 1: Create Query Keys Factory

Create `keys.ts` with typed query keys derived from OpenAPI operations:

```typescript
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

export const {moduleName}Keys = {
  all: ['{module-name}'] as const,

  // Entity list with params
  {entities}: () => [...{moduleName}Keys.all, '{entities}'] as const,
  {entity}List: (params?: operations['list-{entities}']['parameters']['query']) =>
    [...{moduleName}Keys.{entities}(), 'list', params] as const,
  {entity}Detail: (id: operations['get-{entity}']['parameters']['path']['id']) =>
    [...{moduleName}Keys.{entities}(), 'detail', id] as const,
};
```

## Step 2: Create List Query Hook

Create `queries/use{Entity}ListQuery.svelte.ts`:

```typescript
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { createQuery } from '@tanstack/svelte-query';
import { {moduleName}Keys } from '../keys';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

type {Entity}ListParams = operations['list-{entities}']['parameters']['query'];

export const use{Entity}ListQuery = (params: () => {Entity}ListParams) => {
  const userCtx = getUserContext();
  const currentParams = $derived(params());

  return createQuery(() => ({
    queryKey: {moduleName}Keys.{entity}List(currentParams),
    queryFn: async () => {
      const { data, error } = await userCtx.client().GET('/api/{module}/{entities}', {
        params: { query: currentParams }
      });
      if (error) throw error;
      return data;
    },
    placeholderData: (prev) => prev
  }));
};
```

## Step 3: Create Detail Query Hook

Create `queries/use{Entity}DetailQuery.svelte.ts`:

```typescript
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { createQuery } from '@tanstack/svelte-query';
import { {moduleName}Keys } from '../keys';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

type {Entity}DetailParams = operations['get-{entity}']['parameters']['path'];

export const use{Entity}DetailQuery = (params: () => {Entity}DetailParams) => {
  const userCtx = getUserContext();
  const currentParams = $derived(params());

  return createQuery(() => ({
    queryKey: {moduleName}Keys.{entity}Detail(currentParams.id),
    queryFn: async () => {
      const { data, error } = await userCtx.client().GET('/api/{module}/{entities}/{id}', {
        params: { path: currentParams }
      });
      if (error) throw error;
      return data;
    },
    enabled: !!currentParams.id
  }));
};
```

## Step 4: Create Mutation Hooks

Create `queries/use{Entity}Mutation.svelte.ts`:

```typescript
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { useQueryClient, createMutation, type CreateMutationOptions } from '@tanstack/svelte-query';
import { {moduleName}Keys } from '../keys';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

// Create Mutation
type Create{Entity}Input = operations['create-{entity}']['requestBody']['content']['application/json'];
type Create{Entity}Response = operations['create-{entity}']['responses']['200']['content']['application/json'];

type Create{Entity}MutationResponse = {
  data?: Create{Entity}Response;
  error?: unknown;
};

export const useCreate{Entity}Mutation = (
  options?: CreateMutationOptions<Create{Entity}MutationResponse, Error, Create{Entity}Input>
) => {
  const userCtx = getUserContext();
  const queryClient = useQueryClient();

  return createMutation(() => {
    const { onSuccess, ...restOptions } = options || {};
    return {
      mutationFn: async (input: Create{Entity}Input) => {
        const { data, error } = await userCtx.client().POST('/api/{module}/{entities}', {
          body: input
        });
        return { data, error };
      },
      onSuccess: (...args) => {
        queryClient.invalidateQueries({ queryKey: {moduleName}Keys.{entities}() });
        onSuccess?.(...args);
      },
      ...restOptions
    };
  });
};

// Update Mutation (similar pattern with PUT)
// Delete Mutation (similar pattern with DELETE)
```

## Step 5: Create Form Hooks

Create `forms/use{Entity}Form.ts`:

```typescript
import { createFormHook, createEditFormHook } from '$lib/config/forms';
import { Create{Entity}RequestSchema, Update{Entity}RequestSchema } from '$lib/generated/administration_and_agronomy/schemas.gen';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

// Create Form
type Create{Entity}FormValues = operations['create-{entity}']['requestBody']['content']['application/json'];

const createDefaultValues: Create{Entity}FormValues = {
  // Initialize with default values matching schema
};

export const useCreate{Entity}Form = createFormHook({
  schema: Create{Entity}RequestSchema,
  defaultValues: createDefaultValues
});

// Update Form
type Update{Entity}FormValues = operations['update-{entity}']['requestBody']['content']['application/json'];

const updateDefaultValues: Update{Entity}FormValues = {
  // Initialize with default values
};

export const useUpdate{Entity}Form = createEditFormHook<typeof Update{Entity}RequestSchema, string>({
  schema: Update{Entity}RequestSchema,
  defaultValues: updateDefaultValues
});
```

## Step 6: Export Everything

Create `forms/index.ts`:

```typescript
export { useCreate{Entity}Form, useUpdate{Entity}Form, type Create{Entity}FormValues, type Update{Entity}FormValues } from './use{Entity}Form';
```

Create `index.svelte.ts`:

```typescript
// Keys
export { {moduleName}Keys } from './keys';

// Queries
export { use{Entity}ListQuery } from './queries/use{Entity}ListQuery.svelte';
export { use{Entity}DetailQuery } from './queries/use{Entity}DetailQuery.svelte';
export { useCreate{Entity}Mutation, useUpdate{Entity}Mutation } from './queries/use{Entity}Mutation.svelte';

// Forms
export * from './forms';
```

## Key Patterns

1. **Type Derivation**: Always derive types from `operations` - never re-declare
2. **Query Keys**: Use factory pattern with namespacing for cache invalidation
3. **Reactive Params**: Use `$derived()` for reactive parameter updates
4. **Auth Context**: Always get client via `getUserContext().client()`
5. **Error Handling**: Throw errors in queries, return `{ data, error }` in mutations
6. **Cache Invalidation**: Invalidate parent key to refresh related queries
