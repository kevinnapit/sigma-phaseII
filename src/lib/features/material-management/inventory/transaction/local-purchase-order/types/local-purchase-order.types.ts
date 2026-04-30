/**
 * Types untuk Local Purchase Order (LPO)
 */

// Winner vendor item dari API
export interface LPOWinnerItem {
	rfq_id: string;
	rfq_number: string;
	rfq_detail_id: string;
	item_id: string;
	pr_number: string;
	pr_barang_number: string;
	pr_purpose: string;
	pr_remarks: string;
	item_code: string;
	item_name: string;
	qty: number;
	uom: string;
	uom_id: string;
	unit_price: number;
	total_price: number;
	quotation_detail_id: string;
	is_equivalent: boolean;
	equivalent_item_code?: string;
	equivalent_item_name?: string;
	purchase_request_dtl_id: string;
	local_purchase_approval_status?: 'APPROVED' | 'NEEDS_APPROVAL' | 'NOT_ALLOWED'; // Status izin pembelian lokal
}

export interface LPOWinnerRFQ {
	rfq_id: string;
	rfq_number: string;
	rfq_title: string;
	item_count: number;
	total_amount: number;
}

export interface LPOWinnerVendor {
	vendor_id: string;
	vendor_code: string;
	vendor_name: string;
	item_count: number;
	rfqs: LPOWinnerRFQ[];
	items: LPOWinnerItem[];
}

export interface LPOWinnerVendorListResponse {
	$schema?: string;
	data: LPOWinnerVendor[];
	errors?: string;
	paging: {
		page: number;
		size: number;
		total_item: number;
		total_page: number;
	};
}

// Manual LPO item (from EligiblePRItem, used when is_manual = true)
export interface LPOManualItem {
	item_id: string;
	item_code: string;
	item_name: string;
	qty: number;
	uom: string;
	uom_id: string;
	purchase_request_dtl_id: string;
	purpose: string;
}

// Session storage data
export interface LPOSessionData {
	vendor: LPOWinnerVendor;
	selectedItems: LPOWinnerItem[];
	timestamp: number;
	isManual?: boolean;
	manualItems?: LPOManualItem[];
}

// LPO List
export interface LPOListItem {
	id: string;
	lpo_number: string;
	lpo_date: string;
	lpo_based_on: string;
	reference_number: string;
	supplier_code: string;
	supplier_name: string;
	item_count: number;
	total_amount: number;
	required_by_date: string;
	approval_status: string;
	version: number;
	lpo_type: string;
}

export interface LPOListResponse {
	$schema?: string;
	data: LPOListItem[];
	errors?: string;
	paging: {
		page: number;
		size: number;
		total_item: number;
		total_page: number;
	};
}

export interface LPOListParams {
	page: number;
	size: number;
	search?: string;
	approval_status?: string;
}

// LPO Summary
export interface LPOSummary {
	total_lpo: number;
	draft: number;
	pending_approval: number;
	approved: number;
	rejected: number;
	cancelled: number;
}

export interface LPOSummaryResponse {
	$schema?: string;
	data: LPOSummary;
	errors?: string;
}

// LPO Detail
export interface LPODetailItem {
	id: string;
	item_code: string;
	item_name: string;
	quantity: number;
	uom_code: string;
	rate: number;
	amount: number;
	purpose: string;
}

export interface LPODetail {
	id: string;
	lpo_number: string;
	lpo_date: string;
	lpo_based_on: string;
	lpo_based_on_id?: string;
	reference_number: string;
	supplier_code: string;
	supplier_name: string;
	store_code?: string;
	store_name?: string;
	payment_type?: string;
	credit_days?: number;
	required_by_date: string;
	remarks?: string;
	approval_status: string;
	approval_id?: string;
	version: number;
	items: LPODetailItem[];
}

export interface LPODetailResponse {
	$schema?: string;
	data: LPODetail;
	errors?: string;
}

// Query params
export interface LPOWinnerVendorParams {
	page: number;
	size: number;
	search?: string;
}

// Create LPO
export interface LPOCreateItem {
	item_id: string;
	purpose: string;
	quantity: number;
	rate: number;
	uom_id: string;
	purchase_request_dtl_id?: string;
}

export interface LPOCreateParams {
	advance_account_id?: string;
	credit_days: number;
	is_credit_settled_locally: boolean;
	is_manual?: boolean;
	items: LPOCreateItem[];
	lpo_based_on_id: string;
	lpo_date: string;
	payment_type_id?: string;
	purchase_account_id?: string;
	reference_number?: string;
	remarks?: string;
	requested_advance_amount: number;
	required_by_date: string;
	store_id?: string;
	supplier_control_account_id?: string;
	supplier_id: string;
}

export interface LPOCreateResponseItem {
	amount: number;
	id: string;
	item_code: string;
	item_id: string;
	item_name: string;
	purpose: string;
	quantity: number;
	rate: number;
	uom_code: string;
	uom_id: string;
}

export interface LPOCreateResponse {
	$schema?: string;
	data: {
		approval_id: string;
		approval_status: string;
		created_at: string;
		created_by: string;
		credit_days: number;
		id: string;
		is_credit_settled_locally: boolean;
		item_count: number;
		items: LPOCreateResponseItem[];
		lpo_based_on: string;
		lpo_date: string;
		lpo_number: string;
		payment_type: string;
		reference_number: string;
		remarks: string;
		requested_advance_amount: number;
		required_by_date: string;
		store_id: string;
		store_name: string;
		supplier_code: string;
		supplier_id: string;
		supplier_name: string;
		total_amount: number;
		version: number;
	};
	errors?: string;
}

export interface LPOSubmitResponse {
	$schema?: string;
	data: Record<string, string>;
	errors?: string;
}

export interface LPOApprovalAction {
	action: string;
	action_date: number;
	approver_name: string;
	level: number;
	level_name: string;
	remarks: string;
	uoid: string;
}

export interface LPOApprovalHistoryData {
	actions: LPOApprovalAction[];
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

export interface LPOApprovalHistoryResponse {
	$schema?: string;
	data: LPOApprovalHistoryData;
	errors?: string;
}

export interface LPOApprovalResponse {
	$schema?: string;
	data: {
		actions: LPOApprovalAction[];
		status: string;
		uoid: string;
		document_number: string;
	};
	errors?: string;
}

export interface LPOItemFormState {
	quotation_detail_id: string;
	item_id: string;
	item_code: string;
	item_name: string;
	uom: string;
	uom_id: string;
	unit_price: number;
	original_qty: number;
	quantity: number;
	purpose: string;
}

export interface LPOSendPOResponse {
	$schema?: string;
	data: Record<string, unknown>;
	errors?: string;
}

// Repeat Order
export interface ROCreateItem {
	last_lpo_id: string;
	pr_detail_id: string;
}

export interface ROCreateParams {
	items: ROCreateItem[];
	lpo_date: string;
	published_at: string;
	required_by_date: string;
}

export interface ROLPOData {
	approval_id: string;
	approval_status: string;
	created_at: string;
	created_by: string;
	credit_days: number;
	id: string;
	is_credit_settled_locally: boolean;
	item_count: number;
	items: LPOCreateResponseItem[];
	lpo_based_on: string;
	lpo_date: string;
	lpo_number: string;
	lpo_type: string;
	payment_type: string;
	reference_number: string;
	remarks: string;
	requested_advance_amount: number;
	required_by_date: string;
	store_id: string;
	store_name: string;
	supplier_code: string;
	supplier_id: string;
	supplier_name: string;
	total_amount: number;
	version: number;
}

export interface ROCreateResponse {
	$schema?: string;
	data: {
		lpo_count: number;
		lpos: ROLPOData[];
		primary_lpo: ROLPOData;
		rfq_number: string;
		total_items: number;
		vendor_count: number;
	};
	errors?: string;
	paging?: {
		page: number;
		size: number;
		total_item: number;
		total_page: number;
	};
}

// Activity Log Types
export type LPOActivityAction = 
	| 'CREATED' 
	| 'EDITED' 
	| 'SUBMITTED' 
	| 'APPROVED' 
	| 'REJECTED' 
	| 'CANCELLED'
	| 'RESUBMITTED';

export type LPOStatus = 
	| 'DRAFT' 
	| 'PENDING_APPROVAL' 
	| 'APPROVED' 
	| 'REJECTED' 
	| 'CANCELLED'
	| 'PRINTED'
	| 'FINALIZED';

export interface LPOActivityLog {
	id: string;
	lpo_id: string;
	action: LPOActivityAction;
	status_from?: LPOStatus;
	status_to?: LPOStatus;
	reason?: string; // For REJECTED or CANCELLED
	performed_by: string;
	performed_by_name: string;
	performed_at: string;
	changes?: Record<string, any>; // For EDITED action
}

export interface LPOActivityLogResponse {
	$schema?: string;
	data: LPOActivityLog[];
	errors?: string;
}

// Cancel LPO
export interface LPOCancelParams {
	reason: string;
}

export interface LPOCancelResponse {
	$schema?: string;
	data: {
		id: string;
		lpo_number: string;
		approval_status: string;
		cancelled_at: string;
		cancelled_by: string;
		cancellation_reason: string;
	};
	errors?: string;
}

// Update LPO
export interface LPOUpdateParams {
	credit_days?: number;
	is_credit_settled_locally?: boolean;
	items?: LPOCreateItem[];
	lpo_date?: string;
	payment_type_id?: string;
	reference_number?: string;
	remarks?: string;
	requested_advance_amount?: number;
	required_by_date?: string;
	store_id?: string;
}

export interface LPOUpdateResponse {
	$schema?: string;
	data: LPODetail;
	errors?: string;
}

// Resubmit LPO (after edit from rejected)
export interface LPOResubmitResponse {
	$schema?: string;
	data: {
		id: string;
		lpo_number: string;
		approval_status: string;
		approval_id: string;
	};
	errors?: string;
}

// LPO Tracking Types
export interface LPOTrackingStatusItem {
	id: string;
	module: string;
	module_name: string;
	document_number: string;
	status: string;
	status_label: string;
	timestamp: string;
	performed_by: string;
	performed_by_name: string;
	remarks?: string;
	related_items?: string[];
}

export interface LPOTrackingHistoryResponse {
	$schema?: string;
	data: LPOTrackingStatusItem[];
	errors?: string;
}

