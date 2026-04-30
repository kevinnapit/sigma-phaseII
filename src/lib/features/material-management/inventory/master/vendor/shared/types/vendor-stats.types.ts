/**
 * Shared Vendor Stats types
 * Used by both local and central vendors
 */

export interface VendorStats {
	total_local_vendor: number;
	total_central_vendor: number;
	active_local_vendor: number;
	registration_emails_sent: number;
}

export interface VendorStatsResponse {
	$schema?: string;
	total_local_vendor: number;
	total_central_vendor: number;
	active_local_vendor: number;
	registration_emails_sent: number;
}
