import type { PurchaseRequestListParams } from '../types/purchase-request.types';

/**
 * Query keys for Purchase Requests
 * Provides consistent key generation for TanStack Query caching
 */
export const purchaseRequestKeys = {
	// Base key for all purchase request-related queries
	all: ['material-management', 'purchase-requests'] as const,

	// Purchase request list queries with parameters
	list: (params: PurchaseRequestListParams) =>
		[...purchaseRequestKeys.all, 'list', params] as const,

	// Purchase request detail queries
	detail: (id: string) => [...purchaseRequestKeys.all, 'detail', id] as const,

	// Approval history queries
	approvalHistory: (approvalId: string) =>
		[...purchaseRequestKeys.all, 'approval-history', approvalId] as const,

	// Procurement sources for an item
	procurementSources: (itemId: string) =>
		[...purchaseRequestKeys.all, 'procurement-sources', itemId] as const,

	// Purchasing groups (departments)
	purchasingGroups: () => [...purchaseRequestKeys.all, 'purchasing-groups'] as const,

	// Summary statistics
	summary: () => [...purchaseRequestKeys.all, 'summary'] as const,

	// Tracking history (REQ-028)
	tracking: (requestId: string) => [...purchaseRequestKeys.all, 'tracking', requestId] as const
};
