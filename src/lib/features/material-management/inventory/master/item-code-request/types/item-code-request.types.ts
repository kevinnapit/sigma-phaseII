/**
 * Item Code Request types untuk Material Management
 */

// Item Code Request Status
export type ItemCodeRequestStatus =
	| 'PENDING' // Menunggu review
	| 'APPROVED' // Disetujui, kode sudah dibuat
	| 'REJECTED' // Ditolak
	| 'IN_REVIEW'; // Sedang direview

// Item Code Request Data
export interface ItemCodeRequest {
	uoid: string;
	request_number: string;
	item_name: string;
	description: string;
	uom: string;
	department_destination: string;
	status: ItemCodeRequestStatus;
	requested_by: string;
	requested_by_name: string;
	requested_at: string;
	reviewed_by?: string;
	reviewed_by_name?: string;
	reviewed_at?: string | null;
	review_notes?: string;
	approved_item_code?: string; // Kode barang yang sudah dibuat (jika approved)
	approved_item_id?: string; // ID barang yang sudah dibuat (jika approved)
	rejection_reason?: string;
	i_version: number;
}

// API Response types
export interface Pagination {
	page: number;
	limit: number;
	total_records: number;
	total_pages: number;
}

export interface ItemCodeRequestListResponse {
	$schema?: string;
	data: ItemCodeRequest[];
	pagination: Pagination;
	errors?: string;
}

export interface ItemCodeRequestDetailResponse {
	$schema?: string;
	data: ItemCodeRequest;
	errors?: string;
}

// Query parameters
export interface ItemCodeRequestListParams {
	page: number;
	limit: number;
	search?: string;
	status?: ItemCodeRequestStatus;
}

// Create request payload
export interface CreateItemCodeRequestPayload {
	item_name: string;
	description: string;
	uom: string;
	department_destination: string;
}

// Update request payload (for review)
export interface ReviewItemCodeRequestPayload {
	status: 'APPROVED' | 'REJECTED';
	review_notes?: string;
	approved_item_code?: string;
	approved_item_id?: string;
	rejection_reason?: string;
}

// Summary stats
export interface ItemCodeRequestSummary {
	total_requests: number;
	pending_requests: number;
	approved_requests: number;
	rejected_requests: number;
	in_review_requests: number;
}

export interface ItemCodeRequestSummaryResponse {
	$schema?: string;
	data: ItemCodeRequestSummary;
	errors?: string;
}
