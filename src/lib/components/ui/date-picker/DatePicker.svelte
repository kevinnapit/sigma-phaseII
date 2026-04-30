<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import { CalendarIcon } from 'lucide-svelte';
	import { parseDate, type DateValue } from '@internationalized/date';

	let {
		id,
		label,
		value = $bindable(''),
		placeholder = 'Pilih tanggal',
		required = false,
		disabled = false,
		error,
		class: className = ''
	}: {
		id?: string;
		label?: string;
		value: string;
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		error?: string;
		class?: string;
	} = $props();

	let calendarOpen = $state(false);
	let calendarValue = $state<DateValue | undefined>(undefined);

	function formatDateDisplay(dateString: string): string {
		if (!dateString) return '';
		try {
			const date = new Date(dateString);
			const day = date.getDate().toString().padStart(2, '0');
			const month = date.toLocaleDateString('id-ID', { month: 'long' });
			const year = date.getFullYear();
			return `${day} ${month} ${year}`;
		} catch {
			return dateString;
		}
	}

	$effect(() => {
		if (!value) {
			calendarValue = undefined;
			return;
		}
		try {
			calendarValue = parseDate(value);
		} catch {
			calendarValue = undefined;
		}
	});

	$effect(() => {
		if (calendarValue) {
			const newDate = calendarValue.toString();
			if (value !== newDate) {
				value = newDate;
				calendarOpen = false;
			}
		}
	});
</script>

{#if label}
	<div class="space-y-2">
		<Label for={id}>
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</Label>
		<Popover.Root bind:open={calendarOpen}>
			<Popover.Trigger>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="outline"
						class="w-full justify-start text-left font-normal {className}"
						{disabled}
					>
						<CalendarIcon class="mr-2 h-4 w-4" />
						{#if value}
							<span>{formatDateDisplay(value)}</span>
						{:else}
							<span class="text-muted-foreground">{placeholder}</span>
						{/if}
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-auto p-0" align="start">
				<Calendar
					type="single"
					bind:value={calendarValue as DateValue}
					locale="id-ID"
					captionLayout="dropdown"
				/>
			</Popover.Content>
		</Popover.Root>
		{#if error}
			<p class="text-xs text-red-500">{error}</p>
		{/if}
	</div>
{:else}
	<Popover.Root bind:open={calendarOpen}>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					variant="outline"
					class="w-full justify-start text-left font-normal {className}"
					{disabled}
				>
					<CalendarIcon class="mr-2 h-4 w-4" />
					{#if value}
						<span>{formatDateDisplay(value)}</span>
					{:else}
						<span class="text-muted-foreground">{placeholder}</span>
					{/if}
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-auto p-0" align="start">
			<Calendar
				type="single"
				bind:value={calendarValue as DateValue}
				locale="id-ID"
				captionLayout="dropdown"
			/>
		</Popover.Content>
	</Popover.Root>
	{#if error}
		<p class="text-xs text-red-500">{error}</p>
	{/if}
{/if}
