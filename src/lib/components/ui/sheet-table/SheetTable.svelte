<script lang="ts" generics="TData">
	import { type Table, type Header } from '@tanstack/table-core';
	import { FlexRender } from '../data-table';
	import { Button } from '../button';
	import { CirclePlus } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { tableHeaderRowSpan } from './helper-shit';

	interface Props {
		table: Table<TData>;
		class?: string;
		disabled?: boolean;
		onAddNewRow?: () => void;
		onFocusIn?: (data: TData, index: number) => void;
		hideAddButton?: boolean;
	}

	let {
		table,
		class: className,
		disabled = false,
		onAddNewRow,
		onFocusIn,
		hideAddButton = false
	}: Props = $props();

	function buildHeaderStyle(header: Header<TData, unknown>): string {
		let style = '';
		if (table.options.columnResizeMode === 'onEnd') {
			if (header.column.getIsResizing()) {
				style += `translateX(${
					(table.options.columnResizeDirection === 'rtl' ? -1 : 1) *
					(table.getState().columnSizingInfo.deltaOffset ?? 0)
				}px)`;
			}
		}
		return style;
	}
</script>

<div
	class={cn(
		'relative grid w-full grid-rows-[1fr_auto] overflow-x-auto',
		className,
		disabled && 'pointer-events-none opacity-50 select-none'
	)}
>
	<table class="w-full caption-bottom text-sm" style="min-width: {table.getCenterTotalSize()}px">
		<thead class="[&_tr]:border-b">
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<tr class="w-full transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
					{#each headerGroup.headers as header (header.id)}
						{@const rowSpan = tableHeaderRowSpan(header)}
						{#if rowSpan}
							<th
								colspan={header.colSpan}
								rowspan={rowSpan}
								class={cn(
									'relative h-12 border px-4 text-center align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
									// eslint-disable-next-line @typescript-eslint/no-explicit-any
									(header.column.columnDef.meta as any)?.class
								)}
								style="width: {header.getSize()}px"
							>
								<!-- {#if !header.isPlaceholder} -->
								<FlexRender
									content={header.column.columnDef.header}
									context={header.getContext()}
								/>
								<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
								<div
									class="resizer absolute top-0 h-full w-4 {table.options
										.columnResizeDirection} {header.column.getIsResizing() ? 'isResizing' : ''}"
									onmousedown={(e) => {
										e.stopPropagation();
										header.getResizeHandler()(e);
									}}
									ontouchstart={(e) => {
										e.stopPropagation();
										header.getResizeHandler()(e);
									}}
									role="separator"
									aria-orientation="vertical"
									aria-valuenow={header.column.getSize()}
									style={buildHeaderStyle(header)}
								></div>
								<!-- {/if} -->
							</th>
						{/if}
					{/each}
				</tr>
			{/each}
		</thead>
		<tbody class="[&_tr:last-child]:border-0">
			{#each table.getRowModel().rows as row (row.id)}
				<tr
					onfocusin={() => {
						onFocusIn?.(row.original, row.index);
					}}
					class="relative border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
				>
					{#each row.getVisibleCells() as cell (cell.id)}
						<td
							class="focusable-cell relative h-10 border-r p-0 align-middle last:border-r-0 [&:has([role=checkbox])]:pr-0"
							style="width: {cell.column.getSize()}px"
						>
							<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
	{#if typeof onAddNewRow === 'function' && !hideAddButton}
		<div class="flex w-full grow items-center justify-center">
			<Button
				class="flex w-full grow rounded-none border-t text-center"
				variant="ghost"
				onclick={onAddNewRow}
				{disabled}
			>
				<span>Tambah Baris</span>
				<CirclePlus />
			</Button>
		</div>
	{/if}
</div>

<style>
	.resizer {
		position: absolute;
		top: 0;
		height: 100%;
		width: 5px;
		background: rgba(0, 0, 0, 0.5);
		cursor: col-resize;
		user-select: none;
		touch-action: none;
	}

	.resizer.ltr {
		right: 0;
	}

	.resizer.rtl {
		left: 0;
	}

	.resizer.isResizing {
		background: blue;
		opacity: 1;
	}

	@media (hover: hover) {
		.resizer {
			opacity: 0;
		}

		*:hover > .resizer {
			opacity: 1;
		}
	}
	.touch-none {
		touch-action: none;
	}

	.focusable-cell::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		border: 2px solid transparent;
		transition: border-color 0.15s ease;
	}

	.focusable-cell:focus-within::after {
		border-color: #60a5fa; /* blue-400 */
	}
</style>
