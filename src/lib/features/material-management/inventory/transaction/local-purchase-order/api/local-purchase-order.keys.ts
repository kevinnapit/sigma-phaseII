import type { LPOWinnerVendorParams, LPOListParams } from '../types/local-purchase-order.types';

export const localPurchaseOrderKeys = {
	all: ['material-management', 'local-purchase-order'] as const,

	winnerVendors: (params: LPOWinnerVendorParams) =>
		[...localPurchaseOrderKeys.all, 'winner-vendors', params] as const,

	list: (params: LPOListParams) => [...localPurchaseOrderKeys.all, 'list', params] as const,

	summary: () => [...localPurchaseOrderKeys.all, 'summary'] as const,

	detail: (id: string) => [...localPurchaseOrderKeys.all, 'detail', id] as const,

	approvalHistory: (approvalId: string) =>
		[...localPurchaseOrderKeys.all, 'approval-history', approvalId] as const,

	activityLogs: (lpoId: string) =>
		[...localPurchaseOrderKeys.all, 'activity-logs', lpoId] as const,

	tracking: (lpoId: string) => [...localPurchaseOrderKeys.all, 'tracking', lpoId] as const
};
