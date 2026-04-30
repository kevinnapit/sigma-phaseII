// Types for Stock Transfer Request (Permintaan Transfer Stok)

export interface StockTransferRequestItem {
	id: string;
	item_code: string;
	item_name: string;
	quantity: number;
	uom: string;
	required_date: string;
	purpose: string;
}

export interface StockTransferRequest {
	id: string;
	request_number: string;
	request_date: string;
	from_estate_id: string;
	from_estate_name: string;
	to_estate_id: string;
	to_estate_name: string;
	from_store_id: string;
	from_store_name: string;
	to_store_id: string;
	to_store_name: string;
	requester_name: string;
	reference_number?: string;
	remarks?: string;
	status: 'draft' | 'pending_approval' | 'approved' | 'rejected';
	status_label: string;
	total_items: number;
	items: StockTransferRequestItem[];
	approval_date?: string;
	approval_by?: string;
	approval_notes?: string;
	rejection_reason?: string;
	created_at: string;
	updated_at: string;
}

export interface StockTransferRequestListParams {
	page: number;
	size: number;
	search?: string;
	status?: string;
}

export interface Pagination {
	page: number;
	size: number;
	total_item: number;
	total_page: number;
}

export interface StockTransferRequestListResponse {
	data: StockTransferRequest[];
	pagination: Pagination;
}

export interface StockTransferRequestDetailResponse {
	data: StockTransferRequest;
}

export interface StockTransferRequestCreatePayload {
	request_date: string;
	from_estate_id: string;
	to_estate_id: string;
	from_store_id: string;
	to_store_id: string;
	reference_number?: string;
	remarks?: string;
	items: {
		item_code: string;
		item_name: string;
		quantity: number;
		uom: string;
		required_date: string;
		purpose: string;
	}[];
}

export interface StockTransferRequestUpdatePayload extends StockTransferRequestCreatePayload {
	id: string;
}

export interface StockTransferRequestStats {
	total: number;
	pending: number;
	approved: number;
	rejected: number;
}
