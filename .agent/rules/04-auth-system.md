# Authentication & Authorization System

The app uses a comprehensive auth system with user context, route protection, and permission-based access control.

## Architecture Overview

```
src/lib/modules/auth/
├── context/
│   └── user.svelte.ts       # UserContext class (core auth state)
├── components/
│   ├── auth-provider.svelte # Root provider - fetches and settles user
│   └── auth-guard.svelte    # Route guard - redirects unauthenticated users

src/lib/components/shared/
└── guard.svelte             # Permission-based content guard

src/lib/generated/
├── menus.ts                 # Generated menu constants
└── permissions.ts           # Generated permission constants
```

## User Context

### UserContext Class

The `UserContext` class manages all authentication state:

```typescript
// src/lib/modules/auth/context/user.svelte.ts
export class UserContext<T extends ValidUser | undefined> {
  // Reactive state
  user = $state<T>();
  token = $state<string | undefined>();
  estate = $state<EstateWithCommodity | undefined>();
  readonly xEstate = $derived((this.estate?.id ?? '') + ':' + (this.estate?.commodity?.id ?? ''));

  // Methods
  setUser(data: { user: ValidUser; estate?: EstateWithCommodity }, token: string)
  setEstate(estate: EstateWithCommodity)
  setCommodity(commodity: SelectedCommodity)
  clear()                    // Logout - clears token and storage

  // API Clients (auto-inject token)
  client(options)            // Main service client
  authClient(options)        // Auth service client

  // Auth helpers
  hasPermission(permission)  // Check if user has permission
  authenticated()            // Check if user is logged in
  validateUser(user)         // Type guard for valid user
}
```

### Accessing User Context

```typescript
import { getUserContext, getValidUser } from '$lib/modules/auth/context/user.svelte';

// General access (may be undefined before auth settles)
const userCtx = getUserContext();
if (userCtx.user) {
  console.log(userCtx.user.name);
}

// Inside protected routes (throws if no user)
const validUserCtx = getValidUser();
// validUserCtx.user is guaranteed to be defined
```

## Auth Flow

### 1. Layout Setup (`+layout.ts`)

```typescript
export const load: LayoutLoad = async ({ depends }) => {
  depends('user:current');
  const token = localStorage.getItem(UserContext.getTokenKey()) ?? undefined;
  const authClient = new UserContext(undefined, token);
  const queryClient = createQueryClient();
  return { auth: authClient, queryClient };
};
```

### 2. Layout Component (`+layout.svelte`)

```svelte
<script lang="ts">
	import { setUserContext } from '$lib/modules/auth/context/user.svelte';
	import AuthProvider from '$lib/modules/auth/components/auth-provider.svelte';

	let { children, data } = $props();
	setUserContext(data.auth);
</script>

<QueryClientProvider client={data.queryClient}>
	<AuthProvider>
		{@render children()}
	</AuthProvider>
</QueryClientProvider>
```

### 3. Auth Provider (`auth-provider.svelte`)

The provider handles initial auth check:

```typescript
async function settleUserInfoAndContext({ existing_token, send_credentials }) {
  // Skip if no credentials
  if (!existing_token && !send_credentials) return;

  // Fetch user info
  const { data, error } = await queryClient.fetchQuery({
    queryKey: ['user:current'],
    queryFn: async () => await userCtx.authClient().GET('/api/auth/info'),
    staleTime: 1000 * 60 * 5,
    retry: false
  });

  // Handle errors
  if (error?.status === 401) {
    userCtx.clear();  // Token expired
  } else if (data?.user) {
    // Validate and set user
    if (userCtx.validateUser(user)) {
      userCtx.setUser({ user, estate: userCtx.estate }, existing_token ?? '');
    }
  }
}
```

### 4. Auth Guard (`auth-guard.svelte`)

Protects routes that require authentication:

```svelte
<script lang="ts">
	import { getUserContext } from '$lib/modules/auth/context/user.svelte';

	const userCtx = getUserContext();

	onMount(async () => {
		if (!userCtx.user) {
			await goto(resolve('/')); // Redirect to login
			return;
		}
		settled = true;
	});
</script>

{#if !settled}
	<LoadingScreen />
{:else}
	{@render children?.()}
{/if}
```

## Permission-Based Access Control

### Generated Types

Permissions and menus are generated from backend:

```typescript
// src/lib/generated/permissions.ts
export const Permissions = {
  NURSERY_BATCH_VIEW: 'nursery.batch.view',
  NURSERY_BATCH_CREATE: 'nursery.batch.create',
  // ...
} as const;

export type Permission = typeof Permissions[keyof typeof Permissions];

// src/lib/generated/menus.ts
export const Menus = {
  NURSERY: 'nursery',
  NURSERY_BATCH: 'nursery-batch',
  // ...
} as const;
```

### Checking Permissions

```typescript
const userCtx = getUserContext();

// Check single permission
if (userCtx.hasPermission(Permissions.NURSERY_BATCH_CREATE)) {
  // User can create batches
}

// Type allows both strict Permission and loose string
userCtx.hasPermission('custom.permission.view'); // Also valid
```

### Guard Component

Show/hide content based on permissions:

```svelte
<script lang="ts">
	import Guard from '$lib/components/shared/guard.svelte';
	import { Permissions } from '$lib/generated/permissions';
</script>

<Guard permissions={Permissions.NURSERY_BATCH_CREATE}>
	<Button>Create Batch</Button>

	{#snippet rejected()}
		<span class="text-muted-foreground">No permission</span>
	{/snippet}
</Guard>
```

### Guard Component API

```typescript
interface Props {
  permissions: Permission | (string & {});  // Loose typing intentional
  onRejected?: () => MaybePromise<any>;     // Callback when no permission
  rejected?: Snippet;                        // Fallback content
  children: Snippet;                         // Protected content
}
```

## Route Protection Pattern

### Protected Layout

```
routes/(app)/dashboard/+layout.svelte
```

```svelte
<script lang="ts">
	import AuthGuard from '$lib/modules/auth/components/auth-guard.svelte';
</script>

<AuthGuard>
	{@render children()}
</AuthGuard>
```

### Public vs Protected

```
routes/
├── +page.svelte              # Public (login page)
├── (app)/dashboard/          # Protected (auth-guard applied)
│   ├── +layout.svelte        # Wraps with AuthGuard
│   └── ...                   # All child routes protected
```

## ValidUser Type

```typescript
// src/app.d.ts
export type ValidUser = Prettify<
  Required<{
    [K in keyof AuthSchemas['User']]: NonNullable<AuthSchemas['User'][K]>;
  }>
>;
```

A `ValidUser` requires all fields to be present and non-null:

- `id`: string
- `name`: string
- `role`: Role (id, name, description)
- `modules`: Module[] (navigation menu)
- `permissions`: string[] (permission slugs)

## Best Practices

1. **Always use context** - Don't access tokens directly from localStorage
2. **Use getValidUser in protected routes** - Ensures user is defined
3. **Permission loose typing** - Not all permissions are generated, use string fallback
4. **Guard component for UI** - Don't just hide, show fallback or message
5. **Clear on 401** - Always clear tokens on unauthorized responses
6. **Estate header** - Include X-Estate-Selection for multi-tenant contexts
