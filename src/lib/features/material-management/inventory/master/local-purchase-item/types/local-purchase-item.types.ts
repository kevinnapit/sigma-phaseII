/**
 * Local Purchase Item types
 */

// Local Purchase Item
export interface LocalPurchaseItem {
	id: string;
	uoid: string;
	code: string;
	name: string;
	short_name?: string;
	is_field_item: boolean;
	decision: 'Diizinkan' | 'Tidak Diizinkan';
	status: 'Aktif' | 'Tidak Aktif';
	item_class?: {
		code: string;
		name: string;
		uoid: string;
	};
	base_uom?: {
		code: string;
		name: string;
		uoid: string;
	};
	synced_at?: string;
	last_modified_time?: string;
}

// API Response types
export interface Pagination {
	page: number;
	size: number;
	total_item: number;
	total_page: number;
}

export interface LocalPurchaseItemListResponse {
	$schema?: string;
	data: LocalPurchaseItem[];
	pagination: Pagination;
}

export interface LocalPurchaseItemDetailResponse {
	$schema?: string;
	data: LocalPurchaseItem;
}

// Query parameters
export interface LocalPurchaseItemListParams {
	page: number;
	size: number;
	search?: string;
	is_field_item?: boolean;
	decision?: 'Diizinkan' | 'Tidak Diizinkan';
	order_by?: 'code' | 'name';
	sort?: 'asc' | 'desc';
}

// Stats types
export interface LocalPurchaseItemStats {
	total_items: number;
	approved_items: number;
	field_items: number;
	non_field_items: number;
}

export interface LocalPurchaseItemStatsResponse {
	$schema?: string;
	data: LocalPurchaseItemStats;
}
