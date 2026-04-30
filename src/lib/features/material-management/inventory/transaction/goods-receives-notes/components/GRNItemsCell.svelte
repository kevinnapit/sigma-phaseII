<script lang="ts">
	let { totalItems, onClick }: { totalItems: number; onClick: () => void } = $props();
</script>

<button
	onclick={onClick}
	class="flex items-center gap-1 text-sm text-primary hover:underline focus:outline-none"
>
	{totalItems} barang
</button>
