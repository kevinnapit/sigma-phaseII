<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import { CalendarDays } from 'lucide-svelte';
	import { parseDate, type DateValue } from '@internationalized/date';
	import { formatDate } from '$lib/shared/utils';

	let { value, updateValue }: { value: string; updateValue: (val: string) => void } = $props();

	let calendarOpen = $state(false);
	let calendarValue = $state<DateValue | undefined>(undefined);

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
				updateValue(newDate);
				calendarOpen = false;
			}
		}
	});
</script>

<Popover.Root bind:open={calendarOpen}>
	<Popover.Trigger
		class="flex h-full w-full items-center gap-2 border-0 bg-transparent px-2 py-1 text-left text-sm outline-none hover:bg-gray-50 focus:ring-0"
	>
		<CalendarDays size={14} class="shrink-0 text-gray-400" />
		{#if value}
			<span>{formatDate(value)}</span>
		{:else}
			<span class="text-gray-400">Pilih tanggal</span>
		{/if}
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
