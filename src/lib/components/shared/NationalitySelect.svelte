<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { Label } from '$lib/components/ui/label';
	import { useKebangsaanListQuery } from '$lib/modules/functional-admin/index.svelte';

	interface Props {
		label: string;
		value?: string;
		onValueChange?: (value: string | undefined) => void;
		placeholder?: string;
		required?: boolean;
		error?: string | string[];
		disabled?: boolean;
	}

	let {
		label,
		value = $bindable(),
		onValueChange,
		placeholder = 'Pilih...',
		required = false,
		error,
		disabled = false
	}: Props = $props();

	const errorMessage = $derived(
		error ? (Array.isArray(error) ? error[0] : error) : undefined
	);

	const query = useKebangsaanListQuery(() => ({
		page: 1,
		page_size: 100
	}));

	const options = $derived(
		query.data?.data?.map((item) => ({
			value: item.uoid || item.id,
			label: `${item.country_name} (${item.name})`
		})) || []
	);

	const triggerContent = $derived(
		options.find((opt) => opt.value === value)?.label ?? placeholder
	);
</script>

<div class="space-y-2">
	<Label>
		{label}
		{#if required}
			<span class="text-red-500">*</span>
		{/if}
	</Label>
	
	<Select.Root type="single" bind:value {disabled}>
		<Select.Trigger class="w-full h-10">
			{triggerContent}
		</Select.Trigger>
		<Select.Content class="max-h-[300px]">
			{#if query.isLoading} 
				<Select.Item value="" disabled>Memuat...</Select.Item>
			{:else if !options.length}
				<Select.Item value="" disabled>Tidak ada data</Select.Item>
			{:else}
				{#each options as option (option.value)}
					<Select.Item value={option.value} label={option.label}>
						{option.label}
					</Select.Item>
				{/each}
			{/if}
		</Select.Content>
	</Select.Root>

	{#if errorMessage}
		<p class="text-sm text-red-500">{errorMessage}</p>
	{/if}
</div>
