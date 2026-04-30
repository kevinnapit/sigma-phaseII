// Types for Physical Stocktake Entry (Entri Stok Opname Fisik)

export interface PhysicalStocktake {
	id: string;
	entry_number: string;
	schedule: string;
	store_id: string;
	store_name: string;
	from_date: string;
	to_date: string;
	entry_date: string;
	ref_no: string;
	status: string;
	verified_by: string;
	remarks: string;
	total_items: number;
	created_at: string;
	created_by: string;
}

export interface StocktakeItem {
	item_code: string;
	item_name: string;
	uom: string;
	physical_stock: number;
	physical_value: number;
}

export interface PhysicalStocktakeListParams {
	page: number;
	size: number;
	search?: string;
}

export interface PhysicalStocktakeListResponse {
	data: PhysicalStocktake[];
	pagination: { page: number; size: number; total_item: number; total_page: number };
}

export interface PhysicalStocktakeDetailResponse {
	data: PhysicalStocktake & { items: StocktakeItem[] };
}

export interface PhysicalStocktakeCreatePayload {
	schedule: string;
	store_id: string;
	from_date?: string;
	to_date?: string;
	entry_date: string;
	ref_no?: string;
	status: string;
	verified_by: string;
	remarks?: string;
	items: StocktakeItem[];
}
