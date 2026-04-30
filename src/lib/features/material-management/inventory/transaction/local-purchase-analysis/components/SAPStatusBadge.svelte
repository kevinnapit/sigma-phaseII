<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';

	type SAPApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'MIXED';

	let { status }: { status?: SAPApprovalStatus } = $props();

	function getStatusConfig(currentStatus?: SAPApprovalStatus) {
		switch (currentStatus) {
			case 'PENDING':
				return {
					label: 'Menunggu SAP',
					className: 'border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
				};
			case 'APPROVED':
				return {
					label: 'Disetujui SAP',
					className: 'border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400'
				};
			case 'REJECTED':
				return {
					label: 'Ditolak SAP',
					className: 'border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400'
				};
			case 'MIXED':
				return {
					label: 'Sebagian Disetujui',
					className: 'border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
				};
			default:
				return {
					label: '-',
					className: 'border-gray-200 bg-gray-100 text-gray-800 dark:border-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
				};
		}
	}

	const config = $derived(getStatusConfig(status));
</script>

<Badge variant="outline" class={config.className}>{config.label}</Badge>