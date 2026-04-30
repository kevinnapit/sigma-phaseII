/**
 * Central Vendor types - HO (Head Office) Vendors
 */

// Central Vendor Item from HO API
export interface CentralVendorItem {
	sap_vendor_code: string;
	vendor_code: string;
	name1: string;
	mcod1: string;
	stras: string;
	telf1: string;
	email: string;
	synced_at: string;
}

// API Response types
export interface Pagination {
	current_page: number;
	page_size: number;
	total_items: number;
	total_pages: number;
}

export interface CentralVendorListResponse {
	$schema?: string;
	data: CentralVendorItem[];
	pagination: Pagination;
}

export interface CentralVendorDetailResponse {
	$schema?: string;
	sap_vendor_code: string;
	vendor_code: string;
	name1: string;
	mcod1: string;
	stras: string;
	telf1: string;
	email: string;
	synced_at: string;
}

export interface CentralVendorPublishResponse {
	$schema?: string;
	address_uoid: string;
	code: string;
	message: string;
	name: string;
	party_uoid: string;
}

// Query parameters
export interface CentralVendorListParams {
	page: number;
	limit: number;
	search?: string;
}
