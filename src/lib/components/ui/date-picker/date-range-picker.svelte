<script lang="ts">
	import { DateRangePicker } from 'bits-ui';
	import { CalendarDays, X, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { Label } from '$lib/components/ui/label';
	import { cn } from '$lib/utils';
	import { parseDate, type DateValue } from '@internationalized/date';
	import type { DateRange } from 'bits-ui';
	import { isBefore } from '$lib/shared/utils/date-validation';

	let {
		id,
		label,
		startDate = $bindable(''),
		endDate = $bindable(''),
		disabled = false,
		class: className = '',
		numberOfMonths = 2
	}: {
		id?: string;
		label?: string;
		startDate: string;
		endDate: string;
		disabled?: boolean;
		class?: string;
		numberOfMonths?: number;
	} = $props();

	let calendarValue = $state<DateRange | undefined>(undefined);
	let error = $state<string | undefined>(undefined);

	const emptyPlaceholders = new Set(['hh', 'bb', 'tttt', 'jj', 'mm', 'dd']);

	const segmentPlaceholder: Record<string, string> = {
		day: 'tgl',
		month: 'bln',
		year: 'thn',
		hour: 'jam',
		minute: 'mnt',
		second: 'dtk'
	};

	function validateRange(start: string, end: string): string | undefined {
		if (!start || !end) return undefined;
		const startJs = new Date(start + 'T00:00:00');
		const endJs = new Date(end + 'T00:00:00');
		if (!isBefore(startJs, endJs) && start !== end) {
			return 'Tanggal awal tidak boleh lebih besar dari tanggal akhir';
		}
		return undefined;
	}

	$effect(() => {
		if (startDate && endDate) {
			try {
				const newStart = parseDate(startDate);
				const newEnd = parseDate(endDate);
				if (
					calendarValue?.start?.toString() !== newStart.toString() ||
					calendarValue?.end?.toString() !== newEnd.toString()
				) {
					calendarValue = { start: newStart, end: newEnd };
				}
			} catch {
				calendarValue = undefined;
			}
		} else if (!startDate && !endDate) {
			calendarValue = undefined;
		}

		error = validateRange(startDate, endDate);
	});

	function handleValueChange(val: DateRange | undefined) {
		if (val?.start && val?.end) {
			const newStart = val.start.toString();
			const newEnd = val.end.toString();
			error = validateRange(newStart, newEnd);
			if (!error) {
				startDate = newStart;
				endDate = newEnd;
			}
		} else if (val?.start && !val?.end) {
			startDate = val.start.toString();
			endDate = '';
			error = undefined;
		} else {
			startDate = '';
			endDate = '';
			error = undefined;
		}
	}

	function isDateUnavailable(date: DateValue): boolean {
		if (startDate && !endDate) {
			const startJs = new Date(startDate + 'T00:00:00');
			const dateJs = new Date(date.toString() + 'T00:00:00');
			return isBefore(dateJs, startJs);
		}
		return false;
	}

	function clearDates(e: MouseEvent) {
		e.stopPropagation();
		startDate = '';
		endDate = '';
		calendarValue = undefined;
		error = undefined;
	}
</script>

<div class={cn('flex flex-col gap-1', className)}>
	{#if label}
		<Label class="text-xs text-gray-700" for={id}>{label}</Label>
	{/if}

	<DateRangePicker.Root
		value={calendarValue}
		onValueChange={handleValueChange}
		{disabled}
		{isDateUnavailable}
		{numberOfMonths}
		weekdayFormat="short"
		locale="id-ID"
	>
		<div
			class={cn(
				'flex h-9 w-full items-center rounded-md border bg-background px-2 pe-2.5 text-sm shadow-sm transition-colors focus-within:ring-1',
				error
					? 'border-destructive focus-within:ring-destructive'
					: 'border-input focus-within:ring-ring',
				disabled && 'cursor-not-allowed opacity-50'
			)}
		>
			{#each ['start', 'end'] as const as type (type)}
				<DateRangePicker.Trigger
					class="cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
				>
					<CalendarDays class=" h-4 w-4 shrink-0 text-muted-foreground" />
				</DateRangePicker.Trigger>

				<DateRangePicker.Input {type}>
					{#snippet children({ segments })}
						{#each segments as { part, value }, i (part + i)}
							<div class="inline-block select-none">
								{#if part === 'literal'}
									<DateRangePicker.Segment {part} class="text-muted-foreground">
										{value}
									</DateRangePicker.Segment>
								{:else}
									<DateRangePicker.Segment
										{part}
										class={cn(
											'rounded px-1.5 py-0.5 focus:outline-none focus-visible:ring-0',
											'hover:bg-accent focus:bg-accent',
											'aria-[valuetext=Empty]:text-muted-foreground'
										)}
									>
										{emptyPlaceholders.has(value) ? (segmentPlaceholder[part] ?? value) : value}
									</DateRangePicker.Segment>
								{/if}
							</div>
						{/each}
					{/snippet}
				</DateRangePicker.Input>

				{#if type === 'start'}
					<div aria-hidden="true" class="mx-2 shrink-0 text-muted-foreground">–</div>
				{/if}
			{/each}

			<!-- Clear + Trigger tetap di kanan -->
			<div class="ml-auto flex items-center gap-1">
				{#if startDate || endDate}
					<button
						type="button"
						class="rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
						onclick={clearDates}
					>
						<X class="h-3.5 w-3.5" />
					</button>
				{/if}
			</div>
		</div>

		{#if error}
			<p class="text-xs text-destructive">{error}</p>
		{/if}

		<DateRangePicker.Content sideOffset={8} class="z-50">
			<DateRangePicker.Calendar
				class="rounded-md border bg-popover p-3 text-popover-foreground shadow-md"
			>
				{#snippet children({ months, weekdays })}
					<DateRangePicker.Header class="mb-3 flex items-center justify-between">
						<DateRangePicker.PrevButton
							class="inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-accent"
						>
							<ChevronLeft class="h-4 w-4" />
						</DateRangePicker.PrevButton>
						<DateRangePicker.Heading class="text-sm font-medium" />
						<DateRangePicker.NextButton
							class="inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-accent"
						>
							<ChevronRight class="h-4 w-4" />
						</DateRangePicker.NextButton>
					</DateRangePicker.Header>

					<div class="flex gap-6">
						{#each months as month (month.value)}
							<DateRangePicker.Grid class="w-full border-collapse space-y-1 select-none">
								<DateRangePicker.GridHead>
									<DateRangePicker.GridRow class="flex justify-between">
										{#each weekdays as day (day)}
											<DateRangePicker.HeadCell
												class="w-8 text-center text-xs font-normal text-muted-foreground"
											>
												{day.slice(0, 2)}
											</DateRangePicker.HeadCell>
										{/each}
									</DateRangePicker.GridRow>
								</DateRangePicker.GridHead>

								<DateRangePicker.GridBody>
									{#each month.weeks as weekDates (weekDates)}
										<DateRangePicker.GridRow class="mt-1 flex w-full justify-between">
											{#each weekDates as date (date)}
												<DateRangePicker.Cell
													{date}
													month={month.value}
													class="relative p-0 text-center text-sm"
												>
													<DateRangePicker.Day
														class={cn(
															'relative inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors',
															'hover:bg-accent',
															'data-[selected]:rounded-none data-[selected]:bg-accent',
															'data-[selection-start]:rounded-md data-[selection-start]:bg-primary data-[selection-start]:text-primary-foreground',
															'data-[selection-end]:rounded-md data-[selection-end]:bg-primary data-[selection-end]:text-primary-foreground',
															'data-[highlighted]:rounded-none data-[highlighted]:bg-accent',
															'data-[today]:font-semibold',
															'data-[outside-month]:pointer-events-none data-[outside-month]:text-muted-foreground data-[outside-month]:opacity-50',
															'data-[disabled]:pointer-events-none data-[disabled]:opacity-30',
															'data-[unavailable]:pointer-events-none data-[unavailable]:line-through data-[unavailable]:opacity-30'
														)}
													>
														{date.day}
													</DateRangePicker.Day>
												</DateRangePicker.Cell>
											{/each}
										</DateRangePicker.GridRow>
									{/each}
								</DateRangePicker.GridBody>
							</DateRangePicker.Grid>
						{/each}
					</div>
				{/snippet}
			</DateRangePicker.Calendar>
		</DateRangePicker.Content>
	</DateRangePicker.Root>
</div>
