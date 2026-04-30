<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';

	let { user_agent, is_current }: { user_agent: string; is_current: boolean } = $props();
</script>

<Tooltip.Root>
	<Tooltip.Trigger class="cursor-pointer">
		<p class="flex gap-2">
			<span class="max-w-100 truncate">
				{user_agent}
			</span>
			{#if is_current}
				<Badge>perangkat saat ini</Badge>
			{/if}
		</p>
	</Tooltip.Trigger>

	<Tooltip.Content>
		{user_agent}
	</Tooltip.Content>
</Tooltip.Root>
