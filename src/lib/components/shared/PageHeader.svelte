<script lang="ts">
	let { title, description }: { title: string; description?: string } = $props();
</script>

<div>
	<h1 class="text-2xl font-semibold text-gray-900 ">{title}</h1>
	{#if description}
		<h3 class="text-sm text-gray-500">{description}</h3>
	{/if}
</div>
	