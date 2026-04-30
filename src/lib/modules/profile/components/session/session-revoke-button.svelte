<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { ShieldOff } from 'lucide-svelte';

	let {
		onRevoke,
		is_current = false
	}: {
		onRevoke: () => void;
		is_current: boolean;
	} = $props();
</script>

{#if !is_current}
	<Button variant="outline" size="sm" class="text-red-600 hover:text-red-700" onclick={onRevoke}>
		<ShieldOff class="h-4 w-4" />
		<span>Akhiri Sesi</span>
	</Button>
{/if}
