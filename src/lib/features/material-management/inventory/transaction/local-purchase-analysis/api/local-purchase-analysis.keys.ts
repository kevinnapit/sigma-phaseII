import type {
	EligiblePRsParams,
	RFQListParams,
	RFQVendorUsersParams
} from '../types/local-purchase-analysis.types';

export const localPurchaseAnalysisKeys = {
	// Base key untuk semua query local purchase analysis
	all: ['material-management', 'local-purchase-analysis'] as const,

	// Eligible PRs list dengan params
	eligiblePRs: (params: EligiblePRsParams) =>
		[...localPurchaseAnalysisKeys.all, 'eligible-prs', params] as const,

	// RFQ list dengan params
	rfqList: (params: RFQListParams) =>
		[...localPurchaseAnalysisKeys.all, 'rfq-list', params] as const,

	// RFQ detail by ID
	rfqDetail: (id: string) => [...localPurchaseAnalysisKeys.all, 'rfq-detail', id] as const,

	// RO detail by ID (same endpoint, separate cache namespace)
	roDetail: (id: string) => [...localPurchaseAnalysisKeys.all, 'ro-detail', id] as const,

	// Quotation comparison by RFQ ID
	quotationComparison: (rfqId: string) =>
		[...localPurchaseAnalysisKeys.all, 'quotation-comparison', rfqId] as const,

	// Vendor users for RFQ invitation
	vendorUsers: (params: RFQVendorUsersParams) =>
		[...localPurchaseAnalysisKeys.all, 'vendor-users', params] as const,

	// RFQ summary statistics
	summary: () => [...localPurchaseAnalysisKeys.all, 'summary'] as const,

	// RFQ tracking history by ID
	tracking: (rfqId: string) => [...localPurchaseAnalysisKeys.all, 'tracking', rfqId] as const
};
