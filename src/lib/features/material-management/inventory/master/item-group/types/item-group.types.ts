/**
 * Item Group (Item Class) types
 */

// Item Group Item from API
export interface ItemGroupItem {
	uoid: string;
	code: string;
	name: string;
	short_name: string;
	i_version: number;
	b_arch: boolean;
	b_locked: boolean;
	last_modified_time: string;
	business_location_id: string;
	valuation_type_id: string;
	valuation_type_value: string;
	frequency_of_valuation_id: string;
	frequency_of_valuation_value: string;
	stock_account_id: string;
	stock_account_name: string;
	stock_issue_account_id?: string;
	stock_issue_account_name?: string;
	parent_item_class_id?: string;
	parent_item_class_name?: string;
}

// API Response types
export interface Pagination {
	page: number;
	size: number;
	total_item: number;
	total_page: number;
}

export interface ItemGroupListResponse {
	$schema?: string;
	data: ItemGroupItem[];
	paging: Pagination;
}

export interface ItemGroupDetailResponse {
	$schema?: string;
	data: ItemGroupItem;
}

// Query parameters
export interface ItemGroupListParams {
	page: number;
	size: number;
	search?: string;
	has_parent?: boolean;
	is_active?: boolean;
	valuation_type_id?: string;
	parent_id?: string;
	order_by?: 'code' | 'name' | 'last_modified_time';
	sort?: 'asc' | 'desc';
}

// Stats types
export interface ItemGroupStats {
	total_item_class: number;
	total_parent: number;
	distinct_valuation_type: number;
	distinct_frequency_of_valuation: number;
}

export interface ItemGroupStatsResponse {
	$schema?: string;
	data: ItemGroupStats;
	errors?: string;
	paging?: Pagination;
}

// Update request type
export interface UpdateItemGroupRequest {
	code: string;
	name: string;
	short_name: string;
	i_version: number;
	valuation_type_id: string;
	frequency_of_valuation_id: string;
	stock_account_id: string;
	stock_issue_account_id?: string;
	parent_item_class_id?: string;
}
