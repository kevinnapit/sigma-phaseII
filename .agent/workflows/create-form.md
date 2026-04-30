---
description: How to implement forms with TanStack Form and Zod validation
---

# Create Form with Validation Workflow

This workflow guides creating forms with TanStack Form integration and Zod schema validation using generated schemas.

## Form Architecture

The project uses a form factory pattern that integrates:

- **TanStack Svelte Form** for form state management
- **Zod schemas** generated from OpenAPI for validation
- **Type derivation** from OpenAPI operations

## Step 1: Identify Generated Resources

Locate in `src/lib/generated/{service}/`:

- `openapi.gen.d.ts` - TypeScript types with `operations` and `components`
- `schemas.gen.ts` - Zod validation schemas

Example schemas:

```typescript
// From schemas.gen.ts
export const CreateEntityRequestSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  // ...
});
```

## Step 2: Create Form Hook

Create `src/lib/modules/{module}/forms/use{Entity}Form.ts`:

```typescript
import { createFormHook, createEditFormHook } from '$lib/config/forms';
import {
  Create{Entity}RequestSchema,
  Update{Entity}RequestSchema
} from '$lib/generated/administration_and_agronomy/schemas.gen';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

// --- CREATE FORM ---
type Create{Entity}FormValues =
  operations['create-{entity}']['requestBody']['content']['application/json'];

// Default values must match schema structure
const createDefaultValues: Create{Entity}FormValues = {
  name: '',
  description: '',
  // Initialize all required fields
};

export const useCreate{Entity}Form = createFormHook({
  schema: Create{Entity}RequestSchema,
  defaultValues: createDefaultValues
});

// --- UPDATE FORM ---
type Update{Entity}FormValues =
  operations['update-{entity}']['requestBody']['content']['application/json'];

const updateDefaultValues: Update{Entity}FormValues = {
  name: '',
  description: '',
};

export const useUpdate{Entity}Form = createEditFormHook<
  typeof Update{Entity}RequestSchema,
  string  // ID type
>({
  schema: Update{Entity}RequestSchema,
  defaultValues: updateDefaultValues
});

// Export types for consumers
export type { Create{Entity}FormValues, Update{Entity}FormValues };
```

## Step 3: Use Form in Component

### Basic Form Usage

```svelte
<script lang="ts">
  import { useCreate{Entity}Form } from '$lib/modules/{module}/forms';
  import { useCreate{Entity}Mutation } from '$lib/modules/{module}/queries';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { toast } from 'svelte-sonner';

  const form = useCreate{Entity}Form();
  const createMutation = useCreate{Entity}Mutation();

  const handleSubmit = async (values: typeof form.state.values) => {
    const result = await createMutation.mutateAsync(values);
    
    if (result.error) {
      toast.error('Failed to create entity');
      return;
    }
    
    toast.success('Entity created successfully');
    form.reset();
  };
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		form.handleSubmit();
	}}
>
	<form.Field name="name">
		{#snippet children(field)}
			<div class="grid gap-2">
				<Label for="name">Name *</Label>
				<Input
					id="name"
					value={field.state.value}
					onchange={(e) => field.handleChange(e.currentTarget.value)}
					onblur={field.handleBlur}
				/>
				{#if field.state.meta.errors.length}
					<p class="text-sm text-red-500">{field.state.meta.errors[0]}</p>
				{/if}
			</div>
		{/snippet}
	</form.Field>

	<form.Field name="description">
		{#snippet children(field)}
			<div class="grid gap-2">
				<Label for="description">Description</Label>
				<Input
					id="description"
					value={field.state.value ?? ''}
					onchange={(e) => field.handleChange(e.currentTarget.value)}
					onblur={field.handleBlur}
				/>
			</div>
		{/snippet}
	</form.Field>

	<Button type="submit" disabled={createMutation.isPending}>
		{createMutation.isPending ? 'Saving...' : 'Save'}
	</Button>
</form>
```

### Edit Form with Initial Values

```svelte
<script lang="ts">
  import { useUpdate{Entity}Form } from '$lib/modules/{module}/forms';
  import { use{Entity}DetailQuery } from '$lib/modules/{module}/queries';

  let { id }: { id: string } = $props();

  const detailQuery = use{Entity}DetailQuery(() => ({ id }));
  
  // Create form with fetched initial values
  const { form, id: entityId } = useUpdate{Entity}Form(id, {
    initialValues: detailQuery.data?.data
  });
</script>
```

## Step 4: Form with Dialog

```svelte
<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import { useCreate{Entity}Form } from '$lib/modules/{module}/forms';
  import { useCreate{Entity}Mutation } from '$lib/modules/{module}/queries';

  let { open = $bindable(false) }: { open: boolean } = $props();

  const form = useCreate{Entity}Form();
  const mutation = useCreate{Entity}Mutation();

  const handleSubmit = async () => {
    const isValid = await form.validate();
    if (!isValid) return;

    const result = await mutation.mutateAsync(form.state.values);
    if (!result.error) {
      open = false;
      form.reset();
    }
  };
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create Entity</Dialog.Title>
		</Dialog.Header>

		<!-- Form fields here -->

		<Dialog.Footer>
			<Button variant="outline" onclick={() => (open = false)}>Cancel</Button>
			<Button onclick={handleSubmit} disabled={mutation.isPending}>Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
```

## Key Patterns

1. **Never Re-declare Types**: Always derive from `operations` types
2. **Schema Validation**: Use generated Zod schemas for validation
3. **Form Factory**: Use `createFormHook` / `createEditFormHook` helpers
4. **Validation on Submit**: Validation runs automatically on form submit
5. **Error Display**: Check `field.state.meta.errors` for field errors
6. **Reset After Success**: Call `form.reset()` after successful submission
7. **Mutation Integration**: Combine form with mutation hooks for submissions

## Available Utilities

From `$lib/config/forms`:

- `createFormHook` - Factory for create forms
- `createEditFormHook` - Factory for edit forms with ID tracking
- `createZodFormAdapter` - Direct Zod adapter for custom forms
- `createZodFieldValidator` - Single field validators
- `getFieldState`, `shouldShowError` - Error display helpers
