// Types for Purchase Return (Pengembalian Pembelian)

export interface PurchaseReturn {
	id: string;
	return_number: string;
	return_date: string;
	store_id: string;
	store_name: string;
	supplier_id: string;
	supplier_name: string;
	return_account: string;
	remarks: string;
	total_items: number;
	gross_amount: number;
	created_at: string;
	created_by: string;
}

export interface PurchaseReturnItem {
	grn_no: string;
	item_code: string;
	item_name: string;
	item_uom: string;
	grn_qty: number;
	accepted_qty: number;
	returned_qty: number;
	batchwise_entries: any[];
	rate: number;
	total: number;
	reason: string;
}

export interface PurchaseReturnListParams {
	page: number;
	size: number;
	search?: string;
}

export interface PurchaseReturnListResponse {
	data: PurchaseReturn[];
	pagination: {
		page: number;
		size: number;
		total_item: number;
		total_page: number;
	};
}

export interface PurchaseReturnDetailResponse {
	data: PurchaseReturn & { items: PurchaseReturnItem[] };
}

export interface PurchaseReturnCreatePayload {
	store_id: string;
	supplier_id: string;
	return_date: string;
	return_account?: string;
	remarks?: string;
	items: PurchaseReturnItem[];
}
