<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';

	let { is_active }: { is_active: boolean } = $props();
</script>

<div class="flex justify-center">
	{#if is_active}
		<Badge>Aktif</Badge>
	{:else}
		<Badge variant="secondary">Tidak Aktif</Badge>
	{/if}
</div>
