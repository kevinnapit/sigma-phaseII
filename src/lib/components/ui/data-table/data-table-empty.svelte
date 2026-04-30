<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as Table from '$lib/components/ui/table';

	type Props = {
		colspan: number;
		children?: Snippet;
		message?: string;
	};

	let { colspan, children, message = 'Tidak ada data.' }: Props = $props();
</script>

<Table.Row>
	<Table.Cell {colspan} class="h-24 text-center">
		{#if children}
			{@render children()}
		{:else}
			{message}
		{/if}
	</Table.Cell>
</Table.Row>
