<script lang="ts">
	let {
		count,
		onClick
	}: {
		count: number;
		onClick: () => void;
	} = $props();
</script>

<button
	onclick={onClick}
	class="flex items-center gap-1 text-sm text-primary hover:underline focus:outline-none"
>
	{count} substitusi
</button>
