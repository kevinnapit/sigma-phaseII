/**
 * Item Storage Layout types
 */

// Store reference
export interface StoreReference {
	id: string;
	uoid: string;
	code: string;
	name: string;
}

// Storage Layout Cell
export interface StorageLayoutCell {
	row: number;
	column: number;
	cell_code: string; // e.g., "R1C1", "R2C3"
	item_group_code?: string; // 3 letter code from item group
	is_occupied: boolean;
}

// Item Storage Layout
export interface ItemStorageLayout {
	id: string;
	uoid: string;
	code: string;
	name: string;
	store: StoreReference;
	parent?: {
		id: string;
		uoid: string;
		code: string;
		name: string;
	};
	number_of_columns: number;
	number_of_rows: number;
	is_active: boolean;
	cells: StorageLayoutCell[];
	created_at?: string;
	updated_at?: string;
	i_version?: number;
}

// API Response types
export interface Pagination {
	page: number;
	size: number;
	total_item: number;
	total_page: number;
}

export interface ItemStorageLayoutListResponse {
	$schema?: string;
	data: ItemStorageLayout[];
	pagination: Pagination;
}

export interface ItemStorageLayoutDetailResponse {
	$schema?: string;
	data: ItemStorageLayout;
}

// Query parameters
export interface ItemStorageLayoutListParams {
	page: number;
	size: number;
	search?: string;
	store_id?: string;
	is_active?: boolean;
	order_by?: 'code' | 'name';
	sort?: 'asc' | 'desc';
}

// Create/Update Request
export interface ItemStorageLayoutCreateRequest {
	code: string;
	name: string;
	store_id: string;
	parent_id?: string;
	number_of_columns: number;
	number_of_rows: number;
	is_active: boolean;
}

export interface ItemStorageLayoutUpdateRequest extends ItemStorageLayoutCreateRequest {
	i_version: number;
}

export interface ItemStorageLayoutCreateResponse {
	$schema?: string;
	data: ItemStorageLayout;
	errors?: string;
}

export interface ItemStorageLayoutUpdateResponse {
	$schema?: string;
	data: ItemStorageLayout;
	errors?: string;
}

export interface ItemStorageLayoutDeleteResponse {
	$schema?: string;
	data: {
		message: string;
	};
	errors?: string;
}

// Stats types
export interface ItemStorageLayoutStats {
	total_layouts: number;
	active_layouts: number;
	total_cells: number;
	occupied_cells: number;
}

export interface ItemStorageLayoutStatsResponse {
	$schema?: string;
	data: ItemStorageLayoutStats;
}
