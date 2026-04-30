/**
 * Item with usage data from API (new response structure)
 */
export interface ItemUsageWithRequest {
	approval_current_level: number;
	approval_level_name: string;
	approval_status: string;
	approved_min_stock: string;
	avg_daily_usage: string;
	current_min_stock: string;
	department_code: string;
	department_name: string;
	has_pending_request: boolean;
	item_class_code: string;
	item_class_name: string;
	item_code: string;
	item_id: string;
	item_name: string;
	last_calc_at: string;
	latest_request_id: string;
	latest_request_status: string;
	latest_requested_at: string;
	proposed_min_stock: string;
	suggested_min_stock: string;
	total_usage: string;
	window_days: number;
	window_end: string;
	window_start: string;
	item_uom: string;
}

/**
 * Pagination metadata
 */
export interface Pagination {
	page: number;
	size: number;
	total_item: number;
	total_page: number;
}

/**
 * API Response for list of items with usage
 */
export interface StockControlListResponse {
	$schema?: string;
	data: ItemUsageWithRequest[];
	paging: Pagination;
}

/**
 * Query parameters for list (new API)
 */
export interface StockControlListParams {
	page?: number;
	limit?: number;
	search?: string;
	department_code?: string;
	has_pending_request?: boolean;
	approval_status?: ApprovalStatus;
}

/**
 * Approval status values from new API
 */
export type ApprovalStatus =
	| 'NO_REQUEST'
	| 'DRAFT'
	| 'PENDING_APPROVAL_LEVEL_1'
	| 'PENDING_APPROVAL_LEVEL_2'
	| 'APPROVED'
	| 'REJECTED';

/**
 * Map approval_status to human-readable label
 */
export function getApprovalStatusLabel(status: string): string {
	const map: Record<string, string> = {
		NO_REQUEST: 'Belum Dibuat',
		DRAFT: 'Belum Diajukan',
		PENDING_APPROVAL_LEVEL_1: 'Menunggu Persetujuan Manajer',
		PENDING_APPROVAL_LEVEL_2: 'Menunggu Persetujuan Staff HO',
		APPROVED: 'Disetujui',
		REJECTED: 'Ditolak'
	};
	return map[status] ?? status;
}

/**
 * Detail response for a single stock control request
 */
export interface StockControlRequestDetail {
	$schema?: string;
	applied_at: string;
	applied_by: string;
	approval_status: string;
	cancellation_reason: string;
	cancelled_at: string;
	cancelled_by: string;
	current_approval_level: number;
	current_avg_daily_usage: string;
	current_last_calc_at: string;
	current_total_usage: string;
	current_window_end: string;
	current_window_start: string;
	department_code: string;
	department_name: string;
	fk_document_approval_hdr_id: string;
	i_version: number;
	is_applied: boolean;
	item_code: string;
	item_id: string;
	item_name: string;
	proposed_min_stock: string;
	reject_reason: string;
	rejected_at: string;
	rejected_by: string;
	request_note: string;
	request_source: string;
	requested_at: string;
	requested_by: string;
	snapshot_avg_daily_usage: string;
	snapshot_system_min_stock: string;
	item_uom: string;
	approved_min_stock: string;
	snapshot_total_usage: string;
	snapshot_window_end: string;
	snapshot_window_start: string;
	status: string;
	status_display: string;
	uoid: string;
	window_days: number;
}

/**
 * Approval action response
 */
export interface ApprovalAction {
	action: string;
	action_date: number;
	approver_name: string;
	level: number;
	level_name: string;
	remarks: string;
	uoid: string;
}

export interface ApprovalData {
	actions: ApprovalAction[];
	business_location_id: string;
	completed_at: number;
	current_level: number;
	document_id: string;
	document_number: string;
	document_type: string;
	status: string;
	submitted_at: number;
	submitted_by: string;
	uoid: string;
}

export interface ApprovalResponse {
	$schema?: string;
	data: ApprovalData;
	errors?: string;
}

/**
 * Helper to format unix timestamp (seconds) to locale display
 */
export function formatDateFromTimestamp(timestamp: number): string {
	if (!timestamp) return '-';
	const date = new Date(timestamp * 1000);
	const day = date.getUTCDate().toString().padStart(2, '0');
	const month = date.toLocaleDateString('id-ID', { month: 'long', timeZone: 'UTC' });
	const year = date.getUTCFullYear();
	const hours = date.getUTCHours().toString().padStart(2, '0');
	const minutes = date.getUTCMinutes().toString().padStart(2, '0');
	return `${day} ${month} ${year} pukul ${hours}.${minutes}`;
}

/**
 * Helper to format date string to date only (no time)
 */
export function formatDateOnly(dateString: string): string {
	if (!dateString) return '-';
	const date = new Date(dateString);
	const day = date.getUTCDate().toString().padStart(2, '0');
	const month = date.toLocaleDateString('id-ID', { month: 'long', timeZone: 'UTC' });
	const year = date.getUTCFullYear();
	return `${day} ${month} ${year}`;
}

/**
 * Stats/summary response
 */
export interface StockControlSummary {
	$schema?: string;
	approved_today: number;
	draft_requests: number;
	pending_approval: number;
	rejected_today: number;
	total_requests: number;
}

/**
 * Response for submit stock control request
 */
export interface SubmitStockControlResponse {
	$schema?: string;
	message: string;
	request_id: string;
	status: string;
}

/**
 * Payload for creating a stock control request (single item)
 */
export interface CreateStockControlPayload {
	item_id: string;
	proposed_min_stock: string;
	fk_master_value_valuation_type_id: string;
	fk_master_value_frequency_of_valuation_id: string;
	note?: string;
	request_source?: string;
	window_days: number;
}

/**
 * Response for create stock control — array of StockControlRequestDetail
 */
export type CreateStockControlResponse = StockControlRequestDetail[];

/**
 * Helper to format date string to locale display
 */
export function formatDate(dateString: string): string {
	if (!dateString) return '-';
	const date = new Date(dateString);
	const day = date.getUTCDate().toString().padStart(2, '0');
	const month = date.toLocaleDateString('id-ID', { month: 'long', timeZone: 'UTC' });
	const year = date.getUTCFullYear();
	const hours = date.getUTCHours().toString().padStart(2, '0');
	const minutes = date.getUTCMinutes().toString().padStart(2, '0');
	return `${day} ${month} ${year} pukul ${hours}.${minutes}`;
}
