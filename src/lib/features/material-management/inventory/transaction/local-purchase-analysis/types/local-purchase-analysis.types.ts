/**
 * Local Purchase Analysis types untuk Material Management
 */

// LPO History item (nested in EligiblePRItem)
export interface LPOHistoryItem {
	lpo_number: string;
	lpo_date: string;
	vendor_code: string;
	vendor_name: string;
	unit_price: number;
	ordered_qty: number;
	received_qty: number;
	status: string;
	approval_date: string | null;
}

// Eligible Purchase Request Item
export interface EligiblePRItem {
	uoid: string;
	purchase_request_dtl_id: string;
	pr_number: string;
	pr_date: string;
	reference_number: string;
	system_reference: string;
	item_uoid: string;
	item_code: string;
	item_name: string;
	qty: number;
	uom: string;
	uom_uoid: string;
	purpose: string;
	requirement_date: string;
	requested_by: string;
	division: string;
	approval_status: string;
	approved_at: string | null;
	estimated_price: number;
	budget_unit_price: number;
	budget_currency: string;
	budget_fiscal_year: string;
	last_lpo_number: string | null;
	last_lpo_date: string | null;
	last_lpo_vendor_code: string | null;
	last_lpo_vendor_name: string | null;
	last_lpo_unit_price: number | null;
	last_lpo_id: string | null;
	lpo_history?: LPOHistoryItem[];
	local_purchase_approval_status?: 'APPROVED' | 'NEEDS_APPROVAL' | 'NOT_ALLOWED'; // Status izin pembelian lokal
	department_destination?: string | null; // Departemen tujuan untuk item yang perlu izin
}

// API Response types
export interface Pagination {
	page: number;
	limit: number;
	total_records: number;
	total_pages: number;
}

export interface EligiblePRsResponse {
	$schema?: string;
	data: EligiblePRItem[];
	pagination: Pagination;
	errors?: string;
}

// Query parameters
export interface EligiblePRsParams {
	page: number;
	limit: number;
	search?: string;
}

// Process steps
export type ProcessStep =
	| 'select-items'
	| 'select-vendor'
	| 'review-submit'
	| 'rfq-sent-status'
	| 'price-comparison'
	| 'create-lpo';

export interface ProcessStepInfo {
	id: ProcessStep;
	title: string;
	description: string;
	completed: boolean;
}

// Session storage data
export interface SelectedPRItems {
	items: EligiblePRItem[];
	processType: 'RFQ' | 'RO' | 'LPO';
	timestamp: number;
}

export interface SelectedVendors {
	vendors: VendorItem[];
	timestamp: number;
}

// Vendor item (from local vendor)
export interface VendorItem {
	uoid: string;
	party_id: string;
	code: string;
	name: string;
	company_name: string;
	short_name: string;
	is_active: boolean;
	email?: string;
}

// Vendor user for RFQ invitation (from /api/rfq/vendor-users)
export interface RFQVendorUser {
	uoid: string;
	username: string;
	email: string;
	vendor_code: string;
	vendor_name: string;
	is_active: boolean;
	is_email_verified: boolean;
	registration_status: string;
	party_id: string;
	activated_at: string | null;
	last_login_at: string | null;
	registration_sent_at: string | null;
}

export interface RFQVendorUserPagination {
	limit: number;
	page: number;
	total_pages: number;
	total_records: number;
}

export interface RFQVendorUsersResponse {
	$schema?: string;
	data: {
		data: RFQVendorUser[];
		pagination: RFQVendorUserPagination;
	};
	errors?: string;
	paging?: {
		page: number;
		size: number;
		total_item: number;
		total_page: number;
	};
}

export interface RFQVendorUsersParams {
	page: number;
	limit: number;
	search?: string;
}

// RFQ List types
export interface RFQItem {
	uoid: string;
	rfq_number: string;
	title: string;
	description: string;
	process_type: string;
	status: string;
	deadline_date: string;
	published_at: string | null;
	completed_at: string | null;
	cancelled_at: string | null;
	cancellation_reason: string | null;
	item_count: number;
	vendor_count: number;
	contact_person: string;
	contact_email: string;
	contact_phone: string;
	delivery_location: string;
	approval_status_summary?: 'APPROVED' | 'NEEDS_APPROVAL'; // Status izin untuk RFQ list
	sap_approval_status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'MIXED'; // Status approval SAP
	sap_submitted_at?: string | null; // Tanggal kirim ke SAP
	sap_responded_at?: string | null; // Tanggal response SAP
	approved_items_count?: number; // Jumlah item yang disetujui SAP
	rejected_items_count?: number; // Jumlah item yang ditolak SAP
	ho_transferred_items_count?: number; // Jumlah item yang dialihkan ke HO
	i_version: number;
}

export interface RFQListResponse {
	$schema?: string;
	data: RFQItem[];
	pagination: {
		page: number;
		limit: number;
		total_records: number;
		total_pages: number;
	};
}

export interface RFQListParams {
	page: number;
	limit: number;
	search?: string;
}

// SAP Approval types
export interface SAPApprovalItem {
	rfq_detail_id: string;
	item_code: string;
	item_name: string;
	qty: number;
	uom: string;
	vendor_name: string;
	unit_price: number;
	total_price: number;
	approval_status: 'APPROVED' | 'REJECTED';
	approval_reason?: string;
	ktu_notes?: string;
}

export interface SAPApprovalResponse {
	rfq_id: string;
	rfq_number: string;
	submitted_at: string;
	responded_at: string;
	ktu_name: string;
	ktu_notes: string;
	overall_status: 'APPROVED' | 'REJECTED' | 'MIXED';
	items: SAPApprovalItem[];
}

// Head Office Transfer types
export interface HOTransferItem {
	original_rfq_detail_id: string;
	item_code: string;
	item_name: string;
	qty: number;
	uom: string;
	specifications: string;
	estimated_price: number;
	requester_name: string;
	requester_division: string;
	transfer_reason: string;
	ho_reference_number: string;
	transferred_at: string;
	ho_status: 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED';
}

export interface HOTransferResponse {
	rfq_id: string;
	rfq_number: string;
	transferred_at: string;
	transferred_by: string;
	items: HOTransferItem[];
}
	vendor_ids: string[];
}

export interface CreateRFQResponse {
	$schema?: string;
	data: {
		uoid: string;
		rfq_number: string;
		title: string;
		status: string;
		deadline_date: string;
		published_at: string;
		item_count: number;
		vendor_count: number;
	};
	errors?: string;
}

// RFQ Detail types
export interface RFQDetailItem {
	uoid: string;
	purchase_request_dtl_id: string;
	purchase_request_number?: string;
	item_code: string;
	item_name: string;
	qty: number;
	uom: string;
	specifications: string;
	estimated_price: number;
	budget_price?: number;
	budget_currency?: string;
	budget_fiscal_year?: string;
	last_lpo_price?: number;
	last_lpo_number?: string;
	last_lpo_date?: string;
	ho_approval_status?: 'APPROVED' | 'TRANSFERRED_TO_HO' | 'PENDING'; // Status persetujuan HO per item
	ho_approval_staff?: string; // Nama staff HO yang menyetujui
	ho_approval_notes?: string; // Catatan dari HO
}

export interface RFQDetailVendor {
	uoid: string;
	vendor_id: string;
	vendor_code: string;
	vendor_name: string;
	vendor_email: string;
	status: string;
	vendor_rfq_number: string;
	invited_at: string | null;
	viewed_at: string | null;
	declined_at: string | null;
	decline_reason: string | null;
}

export interface RFQEquivalentItem {
	uoid: string;
	equivalent_item_code: string;
	equivalent_item_name: string;
	equivalent_brand: string;
	equivalent_manufacturer: string;
	equivalent_merk: string;
	equivalent_origin: string;
	equivalent_specifications: string;
	equivalent_type: string;
	qty: number;
	unit_price: number;
	total_price: number;
	stock_availability: string;
	stock_qty: number;
	is_selected: boolean;
	selection_reason: string;
	i_version: number;
	// New fields from API
	masa_berlaku_harga?: string | null;
	dibuat_oleh?: string;
	keterangan?: string;
	jumlah_inden?: number;
	lama_inden?: number;
	jumlah_tersedia?: number;
}

export interface RFQQuotationItem {
	uoid: string;
	rfq_detail_id: string;
	item_code: string;
	item_name: string;
	qty: number;
	unit_price: number;
	total_price: number;
	brand: string;
	origin: string;
	lead_time_days: number;
	notes: string;
	is_winner: boolean;
	selection_reason: string;
	equivalents: RFQEquivalentItem[];
	// New fields from API
	masa_berlaku_harga?: string | null;
	dibuat_oleh?: string;
	keterangan?: string;
	jumlah_inden?: number;
	lama_inden?: number;
	jumlah_tersedia?: number;
	budget_price?: number;
	budget_price_comparison_percent?: number;
	last_lpo_price?: number;
	price_comparison_percent?: number;
	ho_approval_status?: 'APPROVED' | 'TRANSFERRED_TO_HO' | 'PENDING'; // Status persetujuan HO per item
	ho_approval_staff?: string; // Nama staff HO yang menyetujui
	ho_approval_notes?: string; // Catatan dari HO
}

export interface RFQQuotation {
	uoid: string;
	rfq_vendor_id: string;
	vendor_code: string;
	vendor_name: string;
	quotation_number: string;
	status: string;
	total_amount: number;
	payment_terms: string;
	delivery_time_days: number;
	warranty: string;
	terms_conditions: string;
	valid_until: string | null;
	submitted_at: string | null;
	withdrawn_at: string | null;
	withdraw_reason: string | null;
	evaluation_score: number;
	evaluation_notes: string;
	is_winner: boolean;
	items: RFQQuotationItem[];
	i_version: number;
	vendor_rfq_number: string;
}

export interface RFQDetailData {
	uoid: string;
	rfq_number: string;
	transaction_number: string;
	title: string;
	description: string;
	process_type: string;
	status: string;
	deadline_date: string;
	published_at: string | null;
	completed_at: string | null;
	cancelled_at: string | null;
	cancellation_reason: string | null;
	item_count: number;
	vendor_count: number;
	contact_person: string;
	contact_email: string;
	contact_phone: string;
	delivery_location: string;
	approval_document_id: string;
	winner_quotation_id: string | null;
	winner_justification: string | null;
	winner_selected_at: string | null;
	department_destination?: string | null; // Departemen tujuan untuk RFQ dengan item yang perlu izin
	items: RFQDetailItem[];
	vendors: RFQDetailVendor[];
	quotations: RFQQuotation[];
	analytics?: ComparisonAnalytics;
	documents?: RFQDocumentData[];
	document_count?: number;
	lpo_count?: number;
	lpos?: RODetailLPO[];
	i_version: number;
}

// LPO summary nested in RO detail response
export interface RODetailLPO {
	uoid: string;
	lpo_number: string;
	lpo_date: string;
	approval_status: string;
	item_count: number;
	supplier_code: string;
	supplier_name: string;
	total_amount: number;
	created_at: string;
}

export interface RFQDetailResponse {
	$schema?: string;
	data: RFQDetailData;
	errors?: string;
	paging?: {
		page: number;
		size: number;
		total_item: number;
		total_page: number;
	};
}

// Quotation Comparison types
export interface ComparisonItemAnalytics {
	item_code: string;
	item_name: string;
	lowest_unit_price: number;
	highest_unit_price: number;
	average_unit_price: number;
	lowest_price_vendor_code?: string;
	lowest_price_vendor_name?: string;
}

export interface ComparisonAnalytics {
	lowest_total_amount: number;
	highest_total_amount: number;
	average_total_amount: number;
	price_variance_percent: number;
	item_analytics: ComparisonItemAnalytics[];
	lowest_vendor_code?: string;
	lowest_vendor_name?: string;
}

export interface ComparisonItem {
	uoid: string;
	purchase_request_dtl_id: string;
	purchase_request_number?: string;
	item_code: string;
	item_name: string;
	qty: number;
	uom: string;
	specifications: string;
	estimated_price: number;
	budget_price?: number;
	budget_currency?: string;
	budget_fiscal_year?: string;
	last_lpo_price?: number;
	last_lpo_number?: string;
	last_lpo_date?: string;
	document_count?: number;
	documents?: RFQDocumentData[];
}

export interface ComparisonEquivalentItem {
	uoid: string;
	rfq_quotation_dtl_id?: string;
	rfq_quotation_id?: string;
	rfq_detail_id?: string;
	equivalent_item_code: string;
	equivalent_item_name: string;
	equivalent_brand: string;
	equivalent_manufacturer: string;
	equivalent_merk: string;
	equivalent_origin: string;
	equivalent_specifications: string;
	equivalent_type: string;
	qty: number;
	unit_price: number;
	total_price: number;
	stock_availability: string;
	stock_qty: number;
	is_selected: boolean;
	selection_reason: string;
	i_version: number;
	indent_quantity?: number;
	indent_duration?: number;
	// New fields from API
	masa_berlaku_harga?: string | null;
	dibuat_oleh?: string;
	keterangan?: string;
	jumlah_inden?: number;
	lama_inden?: number;
	jumlah_tersedia?: number;
	jumlah_konversi?: number;
	konversi?: string;
	satuan_konversi?: string;
	ketersediaan_barang?: string;
}

export interface ComparisonQuotationItem {
	uoid: string;
	rfq_detail_id: string;
	item_code: string;
	item_name: string;
	qty: number;
	unit_price: number;
	total_price: number;
	brand: string;
	origin: string;
	lead_time_days: number;
	notes: string;
	is_winner: boolean;
	selection_reason: string;
	items: {
		qty: string;
	};
	equivalents: ComparisonEquivalentItem[];
	// New fields from API
	masa_berlaku_harga?: string | null;
	dibuat_oleh?: string;
	keterangan?: string;
	jumlah_inden?: number;
	lama_inden?: number;
	jumlah_tersedia?: number;
	jumlah_konversi?: number;
	konversi?: string;
	satuan_konversi?: string;
	ketersediaan_barang?: string;
	budget_price?: number;
	budget_price_comparison_percent?: number;
	last_lpo_price?: number;
	price_comparison_percent?: number;
	mata_uang?: string;
	per_harga_satuan?: string;
	document_count?: number;
	documents?: RFQDocumentData[];
}

export interface ComparisonQuotation {
	uoid?: string;
	quotation_id?: string;
	rfq_vendor_id?: string;
	vendor_code: string;
	vendor_name: string;
	quotation_number?: string;
	status?: string;
	total_amount: number;
	payment_terms: string;
	delivery_time_days: number;
	evaluation_score: number;
	evaluation_notes?: string;
	is_winner: boolean;
	submitted_at: string | null;
	withdrawn_at?: string | null;
	withdraw_reason?: string | null;
	valid_until?: string | null;
	warranty?: string;
	terms_conditions?: string;
	i_version?: number;
	items: ComparisonQuotationItem[];
	vendor_rfq_number: string;
}

// Pending vendor (belum merespons) — dari field pending_vendors di API response terbaru
export interface PendingVendor {
	vendor_code: string;
	vendor_name: string;
	vendor_rfq_number: string;
	invited_at: string;
	viewed_at?: string | null;
	status: string;
}

export interface QuotationComparisonData {
	rfq_id?: string;
	uoid?: string;
	rfq_number: string;
	rfq_title?: string;
	title?: string;
	description?: string;
	process_type?: string;
	status?: string;
	deadline_date?: string;
	published_at?: string | null;
	completed_at?: string | null;
	cancelled_at?: string | null;
	cancellation_reason?: string | null;
	item_count?: number;
	vendor_count?: number;
	contact_person?: string;
	contact_email?: string;
	contact_phone?: string;
	delivery_location?: string;
	approval_document_id?: string;
	winner_quotation_id?: string | null;
	winner_justification?: string | null;
	winner_selected_at?: string | null;
	items: ComparisonItem[];
	vendors?: RFQDetailVendor[];
	quotations: ComparisonQuotation[];
	pending_vendors?: PendingVendor[];
	analytics?: ComparisonAnalytics;
	i_version?: number;
}

export interface QuotationComparisonResponse {
	$schema?: string;
	data: QuotationComparisonData;
	errors?: string;
	paging?: {
		page: number;
		size: number;
		total_item: number;
		total_page: number;
	};
}

// Upload Document types
export interface UploadRFQDocumentParams {
	rfqId: string;
	file: File;
	document_type?: string;
	description?: string;
}

export interface RFQDocumentData {
	checksum: string;
	deleted_at: string | null;
	description: string;
	document_type: string;
	download_url: string;
	file_name: string;
	file_size: number;
	mime_type: string;
	quotation_id: string;
	rfq_detail_id: string;
	uoid: string;
	uploaded_at: string;
	uploaded_by: string;
}

export interface UploadRFQDocumentResponse {
	$schema?: string;
	data: RFQDocumentData;
	errors?: string;
	paging?: {
		page: number;
		size: number;
		total_item: number;
		total_page: number;
	};
}

// RFQ Summary
export interface RFQSummary {
	rfq_perbandingan_harga: number;
	rfq_terkirim: number;
	total_proses_lokal: number;
	total_repeat_order: number;
	total_rfq: number;
}

export interface RFQSummaryResponse {
	$schema?: string;
	data: RFQSummary;
	errors?: string;
}

// Winner Selection types
export interface ItemWinner {
	rfq_detail_id: string;
	quotation_detail_id: string;
	equivalent_id?: string;
	is_equivalent_winner: boolean;
	selection_reason?: string;
}

export interface SelectWinnerRequest {
	item_winners: ItemWinner[];
	justification: string;
}

export interface SelectWinnerResponse {
	$schema?: string;
	data?: any;
	errors?: string;
}

// Tracking Status types
export interface TrackingStatusItem {
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

export interface TrackingHistoryResponse {
	$schema?: string;
	data: TrackingStatusItem[];
}
