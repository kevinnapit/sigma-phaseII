// Types for Stock Adjustment (Penyesuaian Stok)

export interface StockAdjustment {
	id: string;
	adjustment_number: string;
	date: string;
	store_id: string;
	store_name: string;
	allocation_code: string;
	ref_no: string;
	account: string;
	remarks: string;
	total_items: number;
	gross_amount: number;
	created_at: string;
	created_by: string;
}

export interface StockAdjustmentItem {
	grn_no: string;
	item_code: string;
	batch_no: string;
	item_uom: string;
	stk_qty: number;
	stk_value: number;
	unit_rate: number;
	quantity: number; // can be negative
	value: number; // auto-calculated, can be negative
	remarks: string;
}

export interface StockAdjustmentListParams {
	page: number;
	size: number;
	search?: string;
}

export interface StockAdjustmentListResponse {
	data: StockAdjustment[];
	pagination: { page: number; size: number; total_item: number; total_page: number };
}

export interface StockAdjustmentDetailResponse {
	data: StockAdjustment & { items: StockAdjustmentItem[] };
}

export interface StockAdjustmentCreatePayload {
	store_id: string;
	date: string;
	allocation_code?: string;
	ref_no?: string;
	account?: string;
	remarks?: string;
	items: StockAdjustmentItem[];
}
