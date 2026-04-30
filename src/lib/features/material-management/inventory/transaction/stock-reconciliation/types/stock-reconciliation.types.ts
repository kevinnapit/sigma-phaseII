// Types untuk Rekonsiliasi Stok

export interface StockReconciliation {
	id: string;
	reconciliation_number: string;
	store_id: string;
	store_name: string;
	from_date: string;
	to_date: string;
	entry_date: string;
	approved_date: string;
	verification_schedule_no: string;
	status: string;
	approved_by: string;
	remarks: string;
	total_items: number;
	created_at: string;
	created_by: string;
}

export interface ReconciliationItem {
	item_name: string;
	uom: string;
	system_quantity: number;
	system_value: number;
	physical_stock: number;
	physical_value: number;
	variations: number; // physical_stock - system_quantity, read-only
	batchwise_entries: any[];
	adjusted_quantity: number;
	adjusted_value: number;
	approved: boolean; // per-item checkbox
	remarks: string;
}

export interface StockReconciliationListParams {
	page: number;
	size: number;
	search?: string;
}

export interface StockReconciliationListResponse {
	data: StockReconciliation[];
	pagination: {
		page: number;
		size: number;
		total_item: number;
		total_page: number;
	};
}

export interface StockReconciliationDetailResponse {
	data: StockReconciliation & { items: ReconciliationItem[] };
}

export interface StockReconciliationCreatePayload {
	store_id: string;
	from_date?: string;
	to_date?: string;
	entry_date: string;
	approved_date: string;
	verification_schedule_no: string;
	approved_by: string;
	remarks?: string;
	items: ReconciliationItem[];
}
