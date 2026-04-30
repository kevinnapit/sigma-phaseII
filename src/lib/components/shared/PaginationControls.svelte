<script lang="ts">
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';

	let {
		currentPage,
		totalPages,
		totalItems,
		pageSize,
		pageSizeOptions = [
			{ value: '10', label: '10 per page' },
			{ value: '20', label: '20 per page' },
			{ value: '50', label: '50 per page' },
			{ value: '100', label: '100 per page' }
		],
		onPageChange,
		onPageSizeChange
	}: {
		currentPage: number;
		totalPages: number;
		totalItems: number;
		pageSize: number;
		pageSizeOptions?: Array<{ value: string; label: string }>;
		onPageChange: (page: number) => void;
		onPageSizeChange: (size: number) => void;
	} = $props();

	function getPageNumbers(): (number | string)[] {
		const pages: (number | string)[] = [];

		if (totalPages <= 6) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		if (currentPage <= 3) {
			pages.push(1, 2, 3, 4, '...', totalPages);
		} else if (currentPage >= totalPages - 2) {
			pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
		} else {
			pages.push(1, '...', currentPage, currentPage + 1, '...', totalPages);
		}

		return pages;
	}

	const pageNumbers = $derived(getPageNumbers());
	const startItem = $derived(((currentPage - 1) * pageSize) + 1);
	const endItem = $derived(Math.min(currentPage * pageSize, totalItems));
</script>

<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
	<div class="flex items-center gap-2">
		<p class="text-gray-600 text-xs md:text-sm">
			Menampilkan <span class="font-bold">{startItem}</span> dari <span class="font-bold">{endItem}</span> total <span class="font-bold">{totalItems}</span> hasil
		</p>
		
		<select 
			class="h-9 w-35 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
			value={String(pageSize)}
			onchange={(e) => onPageSizeChange(Number(e.currentTarget.value))}
		>
			{#each pageSizeOptions as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</div>

	{#if totalPages > 1}
		<div class="flex items-center gap-2">
			<Button
				variant="outline"
				size="sm"
				disabled={currentPage === 1}
				onclick={() => onPageChange(Math.max(1, currentPage - 1))}
			>
				<ChevronLeft class="h-4 w-4 text-xs md:text-sm" />
			</Button>
			
			{#each pageNumbers as pageNum}
				{#if pageNum === '...'}
					<span class="px-3 py-2 text-sm text-gray-500">...</span>
				{:else}
					<Button
						variant={currentPage === pageNum ? 'default' : 'outline'}
						size="sm"
						class="min-w-[40px] text-xs md:text-sm {currentPage === pageNum ? 'bg-[#0f4c2a] hover:bg-[#0d4023]' : ''}"
						onclick={() => onPageChange(pageNum as number)}
					>
						{pageNum}
					</Button>
				{/if}
			{/each}
			
			<Button
				variant="outline"
				size="sm"
				disabled={currentPage === totalPages}
				onclick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
			>
				<ChevronRight class="h-4 w-4" />
			</Button>
		</div>
	{/if}
</div>
