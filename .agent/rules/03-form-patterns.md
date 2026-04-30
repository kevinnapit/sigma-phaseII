# Form Validation Patterns

Forms must use TanStack Form with Zod schemas generated from OpenAPI specifications.

## Form Architecture

```
src/lib/config/forms/
├── form-factory.ts    # createFormHook, createEditFormHook
├── zod-adapter.ts     # Zod validation integration
├── field-helpers.ts   # Error display utilities
├── types.ts           # Type definitions
└── index.ts           # Public exports
```

## Using Form Factory

### Create Form Hook

For creating new entities:

```typescript
// src/lib/modules/{module}/forms/use{Entity}Form.ts
import { createFormHook } from '$lib/config/forms';
import { CreateEntityRequestSchema } from '$lib/generated/administration_and_agronomy/schemas.gen';
import type { operations } from '$lib/generated/administration_and_agronomy/openapi.gen';

// 1. ALWAYS derive type from operations
type CreateFormValues =
  operations['create-entity']['requestBody']['content']['application/json'];

// 2. Provide default values matching schema structure
const defaultValues: CreateFormValues = {
  name: '',
  code: '',
  description: '',
  // All fields must be initialized
};

// 3. Create the form hook
export const useCreateEntityForm = createFormHook({
  schema: CreateEntityRequestSchema,  // From generated schemas
  defaultValues
});

export type { CreateFormValues };
```

### Edit Form Hook

For editing existing entities (includes ID tracking):

```typescript
import { createEditFormHook } from '$lib/config/forms';
import { UpdateEntityRequestSchema } from '$lib/generated/administration_and_agronomy/schemas.gen';

type UpdateFormValues =
  operations['update-entity']['requestBody']['content']['application/json'];

const defaultValues: UpdateFormValues = {
  name: '',
  code: '',
};

export const useUpdateEntityForm = createEditFormHook<
  typeof UpdateEntityRequestSchema,
  string  // Type of entity ID
>({
  schema: UpdateEntityRequestSchema,
  defaultValues
});
```

## Using Forms in Components

### Basic Usage

```svelte
<script lang="ts">
	import { useCreateEntityForm } from '$lib/modules/{module}/forms';
	import { useCreateEntityMutation } from '$lib/modules/{module}/queries';
	import { Field } from '@tanstack/svelte-form';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';

	const form = useCreateEntityForm();
	const mutation = useCreateEntityMutation();

	// Form handles validation automatically via onSubmit validator
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		form.handleSubmit();
	}}
>
	<!-- Use form.Field component for each field -->
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
					<p class="text-sm text-destructive">
						{field.state.meta.errors[0]}
					</p>
				{/if}
			</div>
		{/snippet}
	</form.Field>

	<Button type="submit" disabled={mutation.isPending || !form.state.canSubmit}>
		{mutation.isPending ? 'Saving...' : 'Save'}
	</Button>
</form>
```

### With Initial Values (Edit Form)

```typescript
const detailQuery = useEntityDetailQuery(() => ({ id }));

// Pass initialValues when creating form
const form = useCreateEntityForm({
  initialValues: detailQuery.data?.data
});
```

### Submit Handler Pattern

```typescript
// In component
const handleSubmit = async () => {
  // Validation runs automatically, but can be triggered manually
  const isValid = await form.validate();
  if (!isValid) return;

  const result = await mutation.mutateAsync(form.state.values);

  if (result.error) {
    // Show API errors
    toast.error('Failed to save');
    return;
  }

  toast.success('Saved successfully');
  form.reset();  // Reset form after success
};
```

## Validation Flow

1. **Form Factory** wraps Zod schema into TanStack Form validators
2. **onSubmit Validator** runs schema.safeParse() on form values
3. **Errors** are mapped to field paths (e.g., `name`, `address.city`)
4. **Field Component** exposes errors via `field.state.meta.errors`

The form factory automatically configures validation:

```typescript
// From form-factory.ts
validators: {
  onSubmit: ({ value }) => {
    const result = schema.safeParse(value);
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join('.') || '_form';
        if (!errors[path]) {
          errors[path] = issue.message;
        }
      }
      return errors;
    }
    return undefined;
  }
}
```

## Field Helpers

Available utilities from `$lib/config/forms`:

```typescript
import { getFieldState, shouldShowError, getFirstError } from '$lib/config/forms';

// Get computed field state
const state = getFieldState(field);
// { value, error, touched, dirty, valid }

// Check if error should display
if (shouldShowError(field)) {
  // Show error only if touched or submitted
}

// Get first error message
const errorMessage = getFirstError(field);
```

## Common Field Patterns

### Number Input

```svelte
<form.Field name="quantity">
	{#snippet children(field)}
		<Input
			type="number"
			value={field.state.value?.toString() ?? ''}
			onchange={(e) => field.handleChange(Number(e.currentTarget.value))}
		/>
	{/snippet}
</form.Field>
```

### Select/Dropdown

```svelte
<form.Field name="category_id">
	{#snippet children(field)}
		<Select.Root
			type="single"
			value={field.state.value}
			onValueChange={(v) => field.handleChange(v)}
		>
			<Select.Trigger>{selectedLabel}</Select.Trigger>
			<Select.Content>
				{#each options as option}
					<Select.Item value={option.id}>{option.name}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	{/snippet}
</form.Field>
```

### Nested Fields

For nested objects in schema:

```svelte
<form.Field name="address.city">
	{#snippet children(field)}
		<!-- Field for address.city -->
	{/snippet}
</form.Field>
```

## Best Practices

1. **Always derive types from operations** - Never re-declare form value types
2. **Use generated Zod schemas** - Matches API expectations exactly
3. **Initialize all fields** - Prevent undefined values in form state
4. **Show errors conditionally** - Only after touch or submit attempt
5. **Disable submit when pending** - Prevent double submissions
6. **Reset after success** - Clean form state for next entry
7. **Use .svelte.ts extension** - Required for files using Svelte runes
