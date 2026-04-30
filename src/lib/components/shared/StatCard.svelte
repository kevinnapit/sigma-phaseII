<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	let {
		title,
		value,
		icon: Icon,
		iconColor = 'blue',
		unit
	}: {
		title: string;
		value: string | number;
		icon: any;
		iconColor?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange';
		unit?: string;
	} = $props();

	const colorClasses = {
		blue: 'bg-blue-50 text-blue-500',
		green: 'bg-green-50 text-green-500',
		yellow: 'bg-yellow-50 text-yellow-500',
		red: 'bg-red-50 text-red-500',
		purple: 'bg-purple-50 text-purple-500',
		orange: 'bg-orange-50 text-orange-500'
	};

	const valueColorClasses = {
		blue: 'text-blue-600',
		green: 'text-green-600',
		yellow: 'text-yellow-600',
		red: 'text-red-600',
		purple: 'text-purple-600',
		orange: 'text-orange-600'
	};

	const iconClass = $derived(colorClasses[iconColor]);
	const valueClass = $derived(valueColorClasses[iconColor]);
</script>

<Card.Root class="flex-1 border border-gray-200 shadow-sm">
	<Card.Content class="p-4">
		<div class="flex items-start justify-between gap-2">
			<div class="min-w-0 flex-1">
				<p class="text-xs font-medium tracking-wide text-gray-500 uppercase">{title}</p>
				<div class="mt-2 flex flex-wrap items-baseline gap-1">
					<p class="text-2xl font-bold {valueClass}">{value}</p>
					{#if unit}
						<span class="text-sm font-medium text-gray-500">{unit}</span>
					{/if}
				</div>
			</div>
			<div class="shrink-0 rounded-full p-2.5 {iconClass}">
				<Icon class="h-5 w-5" />
			</div>
		</div>
	</Card.Content>
</Card.Root>
