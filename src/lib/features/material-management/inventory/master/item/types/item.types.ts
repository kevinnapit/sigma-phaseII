/**
 * Item types
 */

// UOM (Unit of Measure)
export interface UOM {
	code: string;
	name: string;
	uoid: string;
}

// Master Value
export interface MasterValue {
	code: number;
	uoid: string;
	value: string;
}

// Item Class
export interface ItemClass {
	code: string;
	name: string;
	short_name: string;
	uoid: string;
}

// Store stock information
export interface StoreStock {
	store_id: string;
	store_code: string;
	store_name: string;
	current_stock: number;
	reserved_stock: number;
	available_stock: number;
	recommended_min_stock: number;
	avg_daily_usage: number;
	stock_percentage: number;
	stock_status: string;
}

// Stock control information
export interface StockControl {
	total_stores: number;
	stores_below_min: number;
	recommended_min_stock: number;
	avg_daily_usage: number;
	stock_status: string;
	stores: StoreStock[];
}

// Budget price information
export interface BudgetPrice {
	fiscal_year: string;
	matnr: string;
	real_price: number;
	real_currency: string;
	budget_price: number;
	budget_currency: string;
	material_group: string;
	uom: string;
	last_changed_date: string;
	last_changed_time: string;
	synced_at: string;
}

// Item Stock
export interface ItemStock {
	store_count: number;
	total_current_stock: number;
	total_reserved_stock: number;
	total_value: number;
}

// Item VRL (Valuation, Rate, Limit)
export interface ItemVRL {
	default_general_allocation?: {
		code: string;
		name: string;
		uoid: string;
	};
	frequency_of_valuation?: MasterValue;
	is_batch_required: boolean;
	is_expiry_date_required: boolean;
	is_manufacturing_date_required: boolean;
	is_non_stock_item: boolean;
	is_purchase_limit_required: boolean;
	is_stock_storage_location_wise: boolean;
	lead_time_external: number;
	lead_time_internal: number;
	movement_criteria?: MasterValue;
	sanctioned_by?: string;
	technical_specification?: string;
	uoid: string;
	valuation_type?: MasterValue;
}

// Item Class VRL
export interface ItemClassVRL {
	is_expiry_info_required: boolean;
	is_stock_storage_location_wise: boolean;
	is_technical_specification_required: boolean;
	movement_criteria: string;
	sanctioned_by: string;
	stock_issue_general_allocation: string;
	uoid: string;
}

// Item Image
export interface ItemImage {
	has_image: boolean;
	image_size: number;
	uoid: string;
}

// Conversion
export interface Conversion {
	factor: number;
	from_uom: UOM;
	to_uom: UOM;
	uoid: string;
}

export interface ConversionWrapper {
	conversion: Conversion;
	factor: number;
	uoid: string;
}

// Substitute Item
export interface SubstituteItem {
	priority: number;
	substitute_item: {
		code: string;
		name: string;
		uoid: string;
	};
	uoid: string;
}

// Manufacture
export interface Manufacture {
	name: string;
	reference_code: string;
	uoid: string;
}

// Tolerance
export interface ToleranceOfAcceptedQty {
	tolerance_percentage: number;
	uoid: string;
}

// UOM Link
export interface UOMLink {
	movement_type: MasterValue;
	uoid: string;
	uom: UOM;
}

// Usage
export interface Usage {
	asset: {
		code: string;
		name: string;
		uoid: string;
	};
	uoid: string;
}

// Usage Stats
export interface UsageStats {
	avg_daily_usage?: string;
	last_calc_at?: string;
	total_usage?: string;
	window_days?: number;
	window_end_date?: string;
	window_start_date?: string;
}

// Critical Item
export interface CriticalItem {
	effective_date?: string;
	expiry_date?: string;
	is_critical: boolean;
	priority?: number;
	reason?: string;
	remarks?: string;
}

// Last Issue
export interface LastIssue {
	days_since_last_issue?: number;
	issue_date?: string;
	issue_number?: string;
	issued_by?: string;
	quantity_issued?: string;
	store_name?: string;
	uom_code?: string;
}

// Item Comprehensive Data (from new API response)
export interface ItemComprehensiveData {
	$schema?: string;
	base_uom: UOM;
	budget_price?: BudgetPrice;
	business_location_id: string;
	code: string;
	conversion_uom_count: number;
	conversions: ConversionWrapper[];
	critical_item?: CriticalItem;
	i_version: number;
	issue_rate: number;
	item_class: ItemClass;
	item_class_vrl: ItemClassVRL;
	item_image?: ItemImage;
	item_stock?: ItemStock;
	item_usage_count: number;
	item_vrl: ItemVRL;
	last_issue?: LastIssue;
	last_modified_time: string;
	manufactures: Manufacture[];
	movement_status?: string;
	name: string;
	short_name: string;
	stock_control?: StockControl;
	substitute_item_count: number;
	substitutes: SubstituteItem[];
	tolerance_of_accepted_qty?: ToleranceOfAcceptedQty;
	uoid: string;
	id: string;
	uom_links: UOMLink[];
	usage_stats?: UsageStats;
	usages: Usage[];
	last_transaction: {
		transaction_date: string;
		days_since_transaction: string;
	};
}

// Legacy ItemData for backward compatibility
export interface ItemData {
	id: string;
	uoid?: string;
	code: string;
	name: string;
	short_name?: string;
	i_version?: number;
	b_arch?: boolean;
	b_locked?: boolean;
	last_modified_time?: string;
	business_location_id?: string;
	issue_rate?: number;
	item_class_id?: string;
	item_class_code?: string;
	item_class_name?: string;
	base_uom: {
		uoid: string;
		code: string;
		name: string;
	};
	stock_control?: StockControl;
	budget_price?: BudgetPrice;
}

// API Response types
export interface Pagination {
	page: number;
	size: number;
	total_item: number;
	total_page: number;
}

export interface ItemComprehensiveListResponse {
	$schema?: string;
	data: ItemComprehensiveData[];
	pagination: Pagination;
}

export interface ItemListResponse {
	$schema?: string;
	data: ItemData[];
	paging: Pagination;
}

export interface ItemDetailResponse {
	$schema?: string;
	data: ItemData;
}

// Query parameters
export interface ItemListParams {
	page: number;
	size: number;
	search?: string;
	item_class_id?: string;
	has_expiry?: boolean;
	is_active?: boolean;
	is_critical?: boolean;
	is_non_stock?: boolean;
	has_conversion?: boolean;
	movement_status?: string;
	order_by?: 'code' | 'name';
	sort?: 'asc' | 'desc';
}

// Stats types
export interface ItemStats {
	total_items: number;
	items_with_expiry: number;
	critical_items: number;
	fast_moving_items: number;
	slow_moving_items: number;
}

export interface ItemStatsResponse {
	$schema?: string;
	data: ItemStats;
}

// Item VRL Detail Data (from /item-vrl endpoint)
export interface ItemVRLDetailData {
	base_uom: UOM;
	conversion_uom_count: number;
	default_general_allocation?: {
		code: string;
		name: string;
		uoid: string;
	};
	fk_default_general_allocation_hdrid?: string;
	fk_item_hdrid: string;
	fk_master_value_frequency_of_valuation_id?: string;
	fk_master_value_movement_criteria_id?: string;
	fk_master_value_valuation_type_id?: string;
	frequency_of_valuation?: MasterValue;
	i_version: number;
	image?: {
		i_version: number;
		item_image: string; // base64 encoded
		uoid: string;
	};
	is_batch_required: boolean;
	is_expiry_date_required: boolean;
	is_manufacturing_date_required: boolean;
	is_non_stock_item: boolean;
	is_purchase_limit_required: boolean;
	is_stock_storage_location_wise: boolean;
	item: {
		code: string;
		name: string;
		short_name: string;
		uoid: string;
	};
	item_class: {
		code: string;
		name: string;
		uoid: string;
	};
	lead_time_external: number;
	lead_time_internal: number;
	movement_criteria?: MasterValue;
	sanctioned_by?: string;
	substitute_item_count: number;
	technical_specification?: string;
	tolerance?: {
		i_version: number;
		tolerance_percentage: number;
		uoid: string;
	};
	uoid: string;
	valuation_type?: MasterValue;
}

// Item Manufacture
export interface ItemManufacture {
	$schema?: string;
	fk_item_hdrid: string;
	i_version: number;
	item: {
		code: string;
		name: string;
		short_name: string;
		uoid: string;
	};
	name: string;
	reference_code: string;
	uoid: string;
}

export interface ItemManufactureListResponse {
	$schema?: string;
	data: ItemManufacture[];
	pagination: Pagination;
}

// Item UOM Link
export interface ItemUOMLink {
	$schema?: string;
	fk_item_hdrid: string;
	fk_master_value_stores_movement_type_id: string;
	fk_uom_hdrid: string;
	i_version: number;
	item: {
		code: string;
		name: string;
		short_name: string;
		uoid: string;
	};
	stores_movement_type: {
		code: number;
		uoid: string;
		value: string;
	};
	uoid: string;
	uom: {
		code: string;
		name: string;
		uoid: string;
	};
}

export interface ItemUOMLinkListResponse {
	$schema?: string;
	data: ItemUOMLink[];
	pagination: Pagination;
}

export interface ItemUOMLinkCreateRequest {
	fk_master_value_stores_movement_type_id: string;
	fk_uom_hdrid: string;
}

export interface ItemUOMLinkCreateResponse {
	$schema?: string;
	data: ItemUOMLink;
	errors?: string;
	paging?: Pagination;
}

// Item Substitute
export interface ItemSubstitute {
	$schema?: string;
	fk_item_hdrid: string;
	fk_substitute_item_hdrid: string;
	i_version: number;
	main_item: {
		code: string;
		name: string;
		short_name: string;
		uoid: string;
	};
	priority: number;
	substitute_item: {
		code: string;
		name: string;
		short_name: string;
		uoid: string;
	};
	uoid: string;
}

export interface ItemSubstituteListResponse {
	$schema?: string;
	data: ItemSubstitute[];
	pagination: Pagination;
}

// UOM from functional-admin API
export interface UOMData {
	id: string;
	code: string;
	name: string;
}

// Item Usage
export interface ItemUsage {
	$schema?: string;
	asset: {
		code: string;
		is_active: boolean;
		model: string;
		name: string;
		reg_no: string;
		uoid: string;
	};
	fk_asset_id: string;
	fk_item_hdrid: string;
	i_version: number;
	item: {
		code: string;
		name: string;
		short_name: string;
		uoid: string;
	};
	uoid: string;
}

export interface ItemUsageListResponse {
	$schema?: string;
	data: ItemUsage[];
	pagination: Pagination;
}

export interface ItemUsageCreateRequest {
	fk_asset_id: string;
}

export interface ItemUsageCreateResponse {
	$schema?: string;
	data: ItemUsage;
	errors?: string;
	paging?: Pagination;
}

// Item Store
export interface ItemStore {
	$schema?: string;
	available_stock: number;
	current_stock: number;
	fk_item_hdrid: string;
	fk_store_hdrid: string;
	i_version: number;
	item_code: string;
	item_name: string;
	reserved_stock: number;
	store_code: string;
	store_name: string;
	uoid: string;
	value: number;
}

export interface ItemStoreListResponse {
	$schema?: string;
	data: ItemStore[];
	pagination: {
		current_page: number;
		page_size: number;
		total_items: number;
		total_pages: number;
	};
}

export interface ItemStoreCreateRequest {
	fk_store_hdrid: string;
}

export interface ItemStoreUpdateRequest {
	fk_store_hdrid: string;
	i_version: number;
}

// Item VRL Create/Update Request
export interface ItemVRLCreateRequest {
	fk_default_general_allocation_hdrid?: string;
	fk_master_value_frequency_of_valuation_id?: string;
	fk_master_value_movement_criteria_id?: string;
	fk_master_value_valuation_type_id?: string;
	is_batch_required: boolean;
	is_expiry_date_required: boolean;
	is_manufacturing_date_required: boolean;
	is_non_stock_item: boolean;
	is_purchase_limit_required: boolean;
	is_stock_storage_location_wise: boolean;
	item_image?: string; // base64 encoded image
	lead_time_external: number;
	lead_time_internal: number;
	sanctioned_by?: string;
	technical_specification?: string;
	tolerance_percentage: number;
}

export interface ItemVRLUpdateRequest extends ItemVRLCreateRequest {
	i_version: number;
}

export interface ItemVRLResponse {
	$schema?: string;
	data: ItemVRLDetailData;
	errors?: string;
	paging?: Pagination;
}

// Item Conversion
export interface ItemConversion {
	$schema?: string;
	deskripsi_satuan_dasar: string;
	deskripsi_satuan_konversi: string;
	factor: number;
	fk_item_hdrid: string;
	fk_uom_conversion_id: string;
	i_version: number;
	item: {
		base_uom: {
			name: string;
		};
		code: string;
		name: string;
		short_name: string;
		uoid: string;
	};
	qty_konversi: number;
	qty_satuan_dasar: number;
	uoid: string;
	uom: {
		code: string;
		name: string;
		uoid: string;
	};
}

export interface ItemConversionListResponse {
	$schema?: string;
	data: ItemConversion[];
	pagination: Pagination;
}

export interface ItemConversionCreateRequest {
	deskripsi_satuan_dasar: string;
	deskripsi_satuan_konversi: string;
	fk_uom_conversion_id: string;
	qty_konversi: number;
	qty_satuan_dasar: number;
}

export interface ItemConversionUpdateRequest extends ItemConversionCreateRequest {
	i_version: number;
}

export interface ItemConversionDeleteResponse {
	$schema?: string;
	data: {
		message: string;
	};
	errors?: string;
	paging?: Pagination;
}
