<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';

	type LocalPurchaseApprovalStatus = 'APPROVED' | 'NEEDS_APPROVAL' | 'NOT_ALLOWED';

	let { status }: { status?: LocalPurchaseApprovalStatus } = $props();

	function getStatusConfig(currentStatus?: LocalPurchaseApprovalStatus) {
		if (currentStatus === 'NEEDS_APPROVAL') {
			return {
				label: 'Perlu Izin',
				className:
					'border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
			};
		}

		if (currentStatus === 'NOT_ALLOWED') {
			return {
				label: 'Tidak Diizinkan',
				className:
					'border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400'
			};
		}

		return {
			label: 'Diizinkan',
			className:
				'border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400'
		};
	}

	const config = $derived(getStatusConfig(status));
</script>

<Badge variant="outline" class={config.className}>{config.label}</Badge>
