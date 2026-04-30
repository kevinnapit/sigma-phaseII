/**
 * Store types
 */

// Base types
export interface AdministrativeUnit {
	code: string;
	is_active: boolean;
	is_factory: boolean;
	name: string;
	parent: AdministrativeUnit | null;
	parent_administrative_unit_id: string;
	stores: StoreItem[];
	uoid: string;
}

export interface StoreType {
	code: number;
	uid: string;
	value: string;
}

export interface StoreItem {
	administrative_unit: AdministrativeUnit;
	administrative_unit_id: string;
	child_stores: StoreItem[];
	code: string;
	i_version: number;
	is_active: boolean;
	last_modified_time: number;
	name: string;
	parent_store: StoreItem | null;
	parent_store_id: string;
	store_type: StoreType;
	store_type_id: string;
	uoid: string;
}

// API Request types
export interface CreateStoreRequest {
	administrative_unit_id: string;
	code: string;
	is_active: boolean;
	name: string;
	parent_store_id?: string;
	store_type_id: string;
}

export interface UpdateStoreRequest {
	administrative_unit_id: string;
	code: string;
	i_version: number;
	is_active: boolean;
	name: string;
	parent_store_id?: string;
	store_type_id: string;
}

// API Response types
export interface Paging {
	page: number;
	size: number;
	total_item: number;
	total_page: number;
}

export interface WebResponse<T> {
	$schema?: string;
	data: T;
	errors?: string;
	paging?: Paging;
}

export interface StoreListResponse extends WebResponse<StoreItem[]> {}

export interface StoreDetailResponse extends WebResponse<StoreItem> {}

// Store stats types
export interface StoreTypeCount {
	count: number;
	store_type_id: string;
	store_type_name: string;
}

export interface StoreSummary {
	active_stores: number;
	inactive_stores: number;
	store_types: StoreTypeCount[];
	total_stores: number;
}

export interface StoreStatsResponse extends WebResponse<StoreSummary> {}

// Query parameters
export interface StoreListParams {
	page: number;
	size: number;
	search?: string;
	administrative_unit_id?: string;
	parent_store_id?: string;
	store_type?: string;
	is_active?: boolean;
	is_root?: boolean;
	has_children?: boolean;
	order_by?: 'code' | 'name';
	sort?: 'asc' | 'desc';
}

// Type alias for convenience
export type StoreData = StoreItem;
