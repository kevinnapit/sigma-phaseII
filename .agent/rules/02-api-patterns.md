# API & Network Patterns

All network requests must follow consistent patterns using openapi-fetch and TanStack Query.

## OpenAPI Fetch Client

### Configuration

Two API clients are configured in `src/lib/config/fetcher/`:

```typescript
// client.ts - Administration & Agronomy Service
import type { paths } from '$lib/generated/administration_and_agronomy/openapi.gen';
export const configureClient = (options?: ClientOptions & { token?: string; xEstate?: string }) => {
  return createClient<paths>({
    baseUrl: env.PUBLIC_T2_API_URL,
    headers: {
      Authorization: `Bearer ${options?.token}`,
      'X-Estate-Selection': options?.xEstate
    }
  });
};

// auth-client.ts - Auth Service
import type { paths } from '$lib/generated/auth/openapi.gen';
// Similar configuration for auth service
```

### Accessing Clients

Always access API clients through the user context, which automatically injects auth tokens:

```typescript
import { getUserContext } from '$lib/modules/auth/context/user.svelte';

const userCtx = getUserContext();

// For main service
const { data, error } = await userCtx.client().GET('/api/path', { params: {...} });

// For auth service
const { data, error } = await userCtx.authClient().GET('/api/auth/info');
```

## TanStack Query Patterns

### Query Hooks

Create dedicated query hooks in `queries/` folder with the naming convention `use{Entity}Query.svelte.ts`:

```typescript
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { createQuery } from '@tanstack/svelte-query';
import { moduleKeys } from '../keys';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

// 1. Derive parameter types from operations
type ListParams = operations['list-entities']['parameters']['query'];

// 2. Accept reactive params via getter function
export const useEntityListQuery = (params: () => ListParams) => {
  const userCtx = getUserContext();

  // 3. Use $derived for reactive params
  const currentParams = $derived(params());

  return createQuery(() => ({
    // 4. Use namespaced query keys
    queryKey: moduleKeys.entityList(currentParams),

    queryFn: async () => {
      // 5. Use client from context
      const { data, error } = await userCtx.client().GET('/api/entities', {
        params: { query: currentParams }
      });

      // 6. Throw errors in queries
      if (error) throw error;
      return data;
    },

    // 7. Enable placeholder for smooth transitions
    placeholderData: (prev) => prev
  }));
};
```

### Mutation Hooks

Create mutation hooks with cache invalidation:

```typescript
import { createMutation, useQueryClient, type CreateMutationOptions } from '@tanstack/svelte-query';

// 1. Define types from operations
type CreateInput = operations['create-entity']['requestBody']['content']['application/json'];
type CreateResponse = operations['create-entity']['responses']['200']['content']['application/json'];

// 2. Wrapper response type for error handling
type MutationResponse = {
  data?: CreateResponse;
  error?: unknown;
};

// 3. Allow options passthrough for customization
export const useCreateEntityMutation = (
  options?: CreateMutationOptions<MutationResponse, Error, CreateInput>
) => {
  const userCtx = getUserContext();
  const queryClient = useQueryClient();

  return createMutation(() => {
    const { onSuccess, ...restOptions } = options || {};
    return {
      mutationFn: async (input: CreateInput) => {
        const { data, error } = await userCtx.client().POST('/api/entities', {
          body: input
        });
        // 4. Return both data and error for caller to handle
        return { data, error };
      },
      onSuccess: (...args) => {
        // 5. Invalidate parent key to refresh related queries
        queryClient.invalidateQueries({ queryKey: moduleKeys.entities() });
        onSuccess?.(...args);
      },
      ...restOptions
    };
  });
};
```

### Query Keys Factory

Create a centralized key factory per module:

```typescript
// keys.ts
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

export const moduleKeys = {
  // Root namespace
  all: ['module-name'] as const,

  // Entity namespace
  entities: () => [...moduleKeys.all, 'entities'] as const,

  // List with params for cache granularity
  entityList: (params?: operations['list-entities']['parameters']['query']) =>
    [...moduleKeys.entities(), 'list', params] as const,

  // Detail by ID
  entityDetail: (id: operations['get-entity']['parameters']['path']['id']) =>
    [...moduleKeys.entities(), 'detail', id] as const,
};
```

## Error Handling

### In Queries

Errors thrown in `queryFn` are caught by TanStack Query and exposed via `isError` and `error`:

```typescript
// Throw in query
queryFn: async () => {
  const { data, error } = await userCtx.client().GET(...);
  if (error) throw error;
  return data;
}

// Handle in component
{#if query.isError}
  <p>Error: {query.error?.message}</p>
{/if}
```

### In Mutations

Return error object for caller to handle:

```typescript
// Return in mutation
return { data, error };

// Handle in component
const result = await mutation.mutateAsync(input);
if (result.error) {
  toast.error('Operation failed');
  return;
}
toast.success('Success!');
```

## Best Practices

1. **Never hardcode tokens**: Always use `getUserContext().client()`
2. **Use operations types**: Derive all request/response types from OpenAPI
3. **Namespace query keys**: Use factory pattern for consistent cache keys
4. **Invalidate on mutation**: Clear related caches after successful mutations
5. **Type file extensions**: Use `.svelte.ts` for files with runes (`$state`, `$derived`)
6. **Reactive parameters**: Accept params as getter functions for reactivity
