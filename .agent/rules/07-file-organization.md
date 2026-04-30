# File Organization Patterns

## Route File Rules

SvelteKit routes (`src/routes/`) should **ONLY** contain official SvelteKit route files:

### Allowed in Routes

- `+page.svelte` - Page component
- `+page.ts` / `+page.server.ts` - Page load functions
- `+layout.svelte` - Layout component
- `+layout.ts` / `+layout.server.ts` - Layout load functions
- `+error.svelte` - Error boundary
- `+server.ts` - API routes

### NOT Allowed in Routes ❌

- Custom components (tables, forms, dialogs)
- Utility functions
- Type definitions
- Hooks or queries

## Component Organization

All reusable and page-specific components must be placed in the appropriate module's `components/` folder.

### Correct Structure ✅

```
src/lib/modules/nursery/
├── components/                    # All nursery-related components
│   ├── clone-setting-table.svelte
│   ├── clone-setting-form.svelte
│   ├── batch-list.svelte
│   └── nursery-bed-dialog.svelte
├── queries/
├── forms/
├── keys.ts
└── index.svelte.ts

src/routes/(app)/dashboard/nursery/clone-setting/
├── +page.svelte                   # Only imports from lib/modules
└── +page.ts                       # Load function if needed
```

### Incorrect Structure ❌

```
src/routes/(app)/dashboard/nursery/clone-setting/
├── +page.svelte
├── +page.ts
├── clone-setting-table.svelte     # ❌ WRONG - should be in lib/modules
├── clone-setting-form.svelte      # ❌ WRONG - should be in lib/modules
└── some-helper.ts                 # ❌ WRONG - should be in lib/modules
```

## Why This Matters

1. **Reusability**: Components in `lib/modules/` can be shared across multiple pages
2. **Testability**: Easier to unit test components outside of route context
3. **Cleaner Routes**: Routes only handle routing logic, not component definitions
4. **Discoverability**: All module-related code is in one place
5. **Refactoring**: Easier to move/reorganize when components are properly modular

## Migration Pattern

When you encounter components in routes, move them:

```bash
# FROM (wrong)
src/routes/(app)/dashboard/nursery/clone-setting/clone-setting-table.svelte

# TO (correct)
src/lib/modules/nursery/components/clone-setting-table.svelte
```

Then update the import in `+page.svelte`:

```svelte
<!-- Before -->
<script>
  import CloneSettingTable from './clone-setting-table.svelte';
</script>

<!-- After -->
<script>
  import CloneSettingTable from '$lib/modules/nursery/components/clone-setting-table.svelte';
</script>
```

Or better, export from the module index:

```typescript
// src/lib/modules/nursery/index.svelte.ts
export { default as CloneSettingTable } from './components/clone-setting-table.svelte';
```

```svelte
<script>
	import { CloneSettingTable } from '$lib/modules/nursery';
</script>
```

## Module Components Folder Structure

```
src/lib/modules/{module}/
├── components/
│   ├── tables/              # Data table components
│   │   ├── entity-table.svelte
│   │   └── entity-table-actions.svelte
│   ├── forms/               # Form dialogs/components
│   │   ├── create-entity-form.svelte
│   │   └── edit-entity-dialog.svelte
│   └── shared/              # Module-specific shared components
│       └── entity-badge.svelte
├── queries/
├── forms/                   # Form HOOKS (not components)
├── keys.ts
└── index.svelte.ts
```

## Page Component Pattern

`+page.svelte` should be thin, primarily composing components:

```svelte
<script lang="ts">
	import { CloneSettingTable } from '$lib/modules/nursery';
	// or
	import CloneSettingTable from '$lib/modules/nursery/components/clone-setting-table.svelte';
</script>

<div class="container py-6">
	<CloneSettingTable />
</div>
```

## Exceptions

Small, truly page-specific snippets can stay in `+page.svelte` if:

- They're under ~20 lines
- They're never reused
- They're tightly coupled to the route's data

Even then, consider extracting to the module for consistency.
