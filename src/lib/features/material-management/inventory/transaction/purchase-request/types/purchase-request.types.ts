/**
 * Purchase Request types
 */

// Purchase Request Summary
export interface PurchaseRequestSummary {
	total_local_purchase_order: number;
	total_purchase_order: number;
	total_requests: number;
}

export interface PurchaseRequestSummaryResponse {
	$schema?: string;
	data: PurchaseRequestSummary;
	errors?: string;
}

// UOM
export interface UOM {
	id: string;
	uoid?: string;
	code: string;
	name: string;
}

// Master Value (for procurement source)
export interface MasterValue {
	id: string;
	uoid?: string;
	value: string;
	code: number;
}

// Status
export interface Status {
	label: string;
	severity: 'info' | 'warning' | 'none';
}

// Detail
export interface Detail {
	text: string;
	type: 'LOCAL_RULE' | 'ESTATE_LIST' | null;
	endpoint?: string;
}

// Local Purchase Order Detail
export interface LocalDetail {
	decision: string;
	remarks: string;
}

// Latest PO
export interface LatestPO {
	po_number: string;
	document_date: string;
	estate_code: string;
	item_code: string;
	material_short_text: string;
	quantity: number;
	uom: string;
	net_price: number;
	net_order_value: number;
	currency: string;
	synced_at: string;
}

// Latest LPO
export interface LatestLPO {
	lpo_number: string;
	lpo_date: string;
	purpose: string;
	quantity: number;
	uom: string;
	rate: number;
	amount: number;
	sanctioned_qty: number;
	received_qty: number;
}

// HO Budget Price
export interface HOBudgetPrice {
	budget_price: number;
	currency: string;
	fiscal_year: number;
	uom: string;
}

// Cousin Garden Availability
export interface CousinGardenAvailability {
	estate_id: string;
	estate_code: string;
	estate_name: string;
	current_stock: number;
	price: number;
	currency: string;
	uom: UOM;
}

// Sepupu Detail
export interface SepupuDetail {
	snapshot_time: string;
	availability: CousinGardenAvailability[];
}

// Approval Status
export interface ApprovalStatus {
	is_approved: boolean;
	is_dropping_material?: boolean;
	is_sack?: boolean;
}

// Item Info
export interface ItemInfo {
	id: string;
	code: string;
	name: string;
	short_name: string;
	uom: UOM;
	minimum_stock: string;
	maximum_stock: string;
	reorder_level: string;
	stock_total?: {
		total_current_stock: string;
		total_reserved_stock: string;
		total_available_stock: string;
		total_value: string;
		last_recalc_at: string;
	};
}

// Price Comparison
export interface PriceComparison {
	budget_price?: number;
	lpo_price?: number;
	ho_price?: number;
	budget_diff_percent?: number;
	ho_price_diff_percent?: number;
}

// Procurement Source Option
export interface ProcurementSourceOption {
	master_value: MasterValue;
	status: Status;
	detail: Detail;
	local?: LocalDetail;
	sepupu?: SepupuDetail;
	approval_status?: ApprovalStatus;
	price_comparison?: PriceComparison;
	latest_po?: LatestPO;
	latest_lpo?: LatestLPO;
	ho_budget_price?: HOBudgetPrice;
}

// Purchasing Group (Department)
export interface PurchasingGroup {
	uoid: string;
	code: string;
	name: string;
}

// Procurement Source Types (internal)
export type ProcurementSource = 'cousin_garden' | 'local_purchase' | 'head_office';

// Cousin Garden Stock Item (for display)
export interface CousinGardenStock {
	estate_code: string;
	estate_name: string;
	current_stock: number;
	price: number;
	currency: string;
	uom: UOM;
}

// Stock Information (dummy for now)
export interface StockInformation {
	current_stock: number;
	minimum_stock: number;
	percentage: number;
	uom: string;
	warehouse_stocks: WarehouseStock[];
}

export interface WarehouseStock {
	warehouse_code: string;
	warehouse_name: string;
	stock: number;
	uom: string;
}

// Purchase Request Item
export interface PurchaseRequestItem {
	item_id: string;
	item_code: string;
	item_name: string;
	quantity: number;
	uom: string;
	procurement_source: ProcurementSource;
	procurement_source_id: string; // ID of master value
	cousin_garden_code?: string; // For cousin garden selection
	purchasing_group_id?: string; // For head office (department)
	estimated_price?: number;
	notes?: string;
}

// Purchase Request Form Data
export interface PurchaseRequestFormData {
	warehouse_id: string;
	reference_number?: string;
	target_date: string;
	staff_id: string;
	items: PurchaseRequestItem[];
	is_urgent: boolean;
	general_notes?: string;
}

// API Response types
export interface ProcurementSourceResponse {
	$schema?: string;
	data: {
		item: ItemInfo;
		procurement_sources: ProcurementSourceOption[];
		approval_status?: ApprovalStatus;
		price_comparison?: PriceComparison;
	};
}

export interface PurchasingGroupResponse {
	$schema?: string;
	data: PurchasingGroup[];
	paging: {
		page: number;
		size: number;
		total_item: number;
		total_page: number;
	};
}

export interface CousinGardenStockResponse {
	data: CousinGardenStock[];
}

// Purchase Request List Item
export interface PurchaseRequestListItem {
	id: string;
	purchase_request_number: string;
	purchase_request_date: string;
	reference_number: string;
	remarks: string;
	requested_by: string;
	approval_status: string;
	total_items: number;
	total_estimated_price: number;
	i_version?: number;
	is_processed?: boolean; // Flag if already processed in Local Purchase Order module
}

// Purchase Request Detail Item
export interface PurchaseRequestDetailItem {
	id: string;
	item_id: string;
	item_code: string;
	item_name: string;
	uom: UOM;
	quantity: number;
	purpose: string;
}

// Purchase Request Detail
export interface PurchaseRequestDetail {
	id: string;
	purchase_request_number: string;
	purchase_request_date: string;
	purchase_request_type_id: string;
	purchase_request_type: MasterValue;
	request_source_id: string;
	RequestSource: MasterValue;
	reference_number?: string;
	remarks?: string;
	requested_by: string;
	i_version: number;
	approval_status: string;
	approval_id?: string;
	status_changed_by?: string;
	status_change_date?: string;
	status_change_remarks?: string;
	items: PurchaseRequestDetailItem[];
	is_processed?: boolean; // Flag if already processed in Local Purchase Order module
	cancelled_reason?: string; // Reason for cancellation
	cancelled_by?: string; // Who cancelled
	cancelled_at?: string; // When cancelled
}

// Purchase Request Detail Response
export interface PurchaseRequestDetailResponse {
	$schema?: string;
	data: PurchaseRequestDetail;
}

// Approval History Item
export interface ApprovalHistoryItem {
	uoid: string;
	level: number;
	level_name: string;
	action: string;
	approver_id: string;
	approver_name: string;
	action_date: number;
	remarks?: string;
}

// Approval History Response
export interface ApprovalHistoryResponse {
	$schema?: string;
	data: {
		uoid: string;
		document_type: string;
		document_id: string;
		document_number: string;
		current_level: number;
		status: string;
		submitted_by: string;
		submitted_at: number;
		business_location_id: string;
		actions: ApprovalHistoryItem[];
	};
}

// Approve/Reject Payload
export interface ApproveRejectPayload {
	remarks?: string;
}

// Cancel Payload
export interface CancelPurchaseRequestPayload {
	reason: string;
}

// Cancel Response
export interface CancelPurchaseRequestResponse {
	$schema?: string;
	data: {
		message: string;
	};
}

// Pagination
export interface Pagination {
	page: number;
	size: number;
	total_item: number;
	total_page: number;
}

// Purchase Request List Response
export interface PurchaseRequestListResponse {
	$schema?: string;
	data: PurchaseRequestListItemExtended[];
	paging: Pagination;
}

// Purchase Request List Params
export interface PurchaseRequestListParams {
	page: number;
	size: number;
	search?: string;
	approval_status?: string;
	source_type?: string; // REQ-001: Filter by source type
	follow_up_status?: string; // REQ-029: Filter by follow-up status
}

// API Request Body Types
export interface PurchaseRequestItemPayload {
	item_id: string;
	uom_id: string;
	quantity: number;
	requirement_date?: string;
	purpose: string;
	is_emergency: boolean;
	sepupu_estate_code?: string;
	purchasing_group_id?: string;
}

export interface PurchaseRequestPayload {
	administrative_unit_id: string;
	purchase_request_type_id: string;
	sepupu_estate_code?: string;
	purchasing_group_id?: string;
	purchase_request_date: string;
	request_source_id: string;
	is_emergency: boolean;
	reference_number?: string;
	remarks?: string;
	requested_by: string;
	i_version?: number;
	items: PurchaseRequestItemPayload[];
}

// API Response Types - Multi Group Response
export interface PurchaseRequestGroupItem {
	id: string;
	item_id: string;
	item_code: string;
	item_name: string;
	quantity: number;
	purpose: string;
	uom: {
		id: string;
		code: string;
		name: string;
	};
}

export interface PurchaseRequestGroup {
	hdr_uoid: string;
	pr_number: string;
	pr_type: string;
	sepupu_estate_code?: string;
	purchasing_group_id?: string;
	is_emergency: boolean;
	doc_type: string;
	item_count: number;
	items: PurchaseRequestGroupItem[];
}

export interface PurchaseRequestCreateResponse {
	$schema?: string;
	data: {
		parent_request_id: string;
		group_count: number;
		total_items: number;
		groups: PurchaseRequestGroup[];
		created_at: string;
	};
}

export interface PurchaseRequestSubmitResponse {
	$schema?: string;
	data: {
		message: string;
	};
}

// Tracking Types (REQ-028, REQ-029)
export type TrackingModule =
	| 'PURCHASE_REQUEST'
	| 'LOCAL_PURCHASE_PROCESS'
	| 'LOCAL_PURCHASE_ORDER'
	| 'GOODS_RECEIPT'
	| 'INTER_ESTATE_REQUEST';

export interface TrackingStatusItem {
	id: string;
	module: TrackingModule;
	module_name: string;
	document_number: string;
	status: string;
	status_label: string;
	timestamp: string;
	performed_by: string;
	performed_by_name: string;
	remarks?: string;
	related_items?: string[]; // Item codes related to this tracking entry
}

export interface NextActionInfo {
	action: string;
	waiting_for: string | null;
	waiting_for_role: string | null;
	description: string;
}

// Milestone-based tracking (simplified view)
export interface ItemProgress {
	item_code: string;
	item_name: string;
	quantity: number;
	uom: string;
	current_status: string;
	current_status_label: string;
	progress_percentage: number; // 0-100
	is_completed: boolean;
	documents: {
		rfq?: string;
		lpo?: string;
		grn?: string;
		gi?: string;
	};
	milestones: MilestoneItem[];
}

export interface MilestoneItem {
	id: string;
	milestone_type: 'MR_SUBMITTED' | 'MR_APPROVED' | 'RFQ_CREATED' | 'LPO_CREATED' | 'LPO_APPROVED' | 'GOODS_RECEIVED' | 'GOODS_ISSUED' | 'COMPLETED';
	label: string;
	status: 'completed' | 'in_progress' | 'pending';
	timestamp?: string;
	document_number?: string;
	performed_by?: string;
	remarks?: string;
}

export interface TrackingHistoryResponse {
	$schema?: string;
	data: TrackingStatusItem[];
	next_action?: NextActionInfo | null;
	// New: Milestone-based view
	items_progress?: ItemProgress[];
	overall_progress?: {
		completed_items: number;
		total_items: number;
		percentage: number;
	};
}

// Extended Purchase Request List Item with Status Lanjutan (REQ-029)
export interface PurchaseRequestListItemExtended extends PurchaseRequestListItem {
	source_type: string; // Tipe Sumber: "Lokal", "Sepupu", "HO"
	follow_up_status?: string; // Status Lanjutan: "LPO Dibuat", "Menunggu Persetujuan", etc.
	follow_up_module?: TrackingModule; // Module terakhir yang memproses
}

// ============================================
// LPO Tracking Types (Opsi C - Hybrid Approach)
// ============================================

export interface LPOTrackingItem {
	item_code: string;
	item_name: string;
	quantity: number;
	uom: string;
	source_mr: string; // MR number yang meminta item ini
	source_mr_id: string;
}

export interface LPOTrackingStatus {
	id: string;
	step: number; // 1-6
	status: string;
	status_label: string;
	timestamp: string;
	performed_by?: string;
	performed_by_name?: string;
	remarks?: string;
	is_current: boolean;
}

export interface LPOTrackingDetail {
	lpo_id: string;
	lpo_number: string;
	vendor_name: string;
	total_items: number;
	total_amount?: number;
	items: LPOTrackingItem[];
	timeline: LPOTrackingStatus[];
	current_status: string;
	current_status_label: string;
	progress_percentage: number; // 0-100
}

export interface LPOTrackingResponse {
	$schema?: string;
	data: LPOTrackingDetail;
}

// Simplified Milestone for MR Tracking (5 steps instead of 15)
export type SimplifiedMilestone = 
	| 'MR_APPROVED'           // Step 1: MR Disetujui
	| 'PURCHASE_PROCESS'      // Step 2: Proses Pembelian (RFQ/LPO)
	| 'WAITING_DELIVERY'      // Step 3: Menunggu Pengiriman
	| 'GOODS_RECEIVED'        // Step 4: Penerimaan Barang
	| 'GOODS_ISSUED';         // Step 5: Pengeluaran Barang

export interface SimplifiedTrackingItem {
	item_code: string;
	item_name: string;
	quantity: number;
	uom: string;
	current_milestone: SimplifiedMilestone;
	current_milestone_label: string;
	progress_percentage: number; // 0, 20, 40, 60, 80, 100
	related_documents: {
		rfq?: string;
		lpo?: string;
		lpo_id?: string; // For linking to LPO tracking
		grn?: string;
		gi?: string;
	};
	milestones: {
		milestone: SimplifiedMilestone;
		label: string;
		status: 'completed' | 'in_progress' | 'pending';
		timestamp?: string;
		document_number?: string;
	}[];
}
