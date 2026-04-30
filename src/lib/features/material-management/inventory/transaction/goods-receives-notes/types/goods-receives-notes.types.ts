/**
 * Goods Receives Notes types untuk Material Management
 */

// GRN item dari API list
export interface GRNItem {
	id: string;
	grn_number: string;
	date: string;
	supplier_id: string;
	supplier_name: string;
	total_items: number;
	gross_total: number;
	approval_status: string;
}

// GRN detail item
export interface GRNDetailItem {
	id: string;
	item_id: string;
	item_code: string;
	item_name: string;
	uom_id: string;
	uom_code: string;
	offer_quantity: number;
	offer_quantity_in_base_unit: number;
	grn_received_quantity: number;
	grn_received_quantity_in_base_unit: number;
	accepted_quantity: number;
	accepted_quantity_in_base_unit: number;
	unit_rate: number;
	value: number;
	value_local_currency: number;
	gross_total: number;
	volume?: GRNItemVolume;
	weighment?: GRNItemWeighment;
}

// GRN detail data
export interface GRNDetailData {
	id: string;
	gross_total: any;
	grn_number: string;
	date: string;
	reference_number: string;
	delivery_despatch_note_number: string;
	delivery_despatch_note_date: string;
	vehicle_number: string;
	supplier_id: string;
	supplier_name: string;
	store_id: string;
	store_name: string;
	type: number;
	approval_status: string;
	document_approval_id?: string;
	remarks: string;
	total: number;
	i_version: number;
	items: GRNDetailItem[];
}

// Approval action item
export interface GRNApprovalAction {
	uoid: string;
	action: string;
	action_date: number;
	approver_name: string;
	level: number;
	level_name: string;
	remarks: string;
}

// Approval response data
export interface GRNApprovalData {
	uoid: string;
	document_id: string;
	document_number: string;
	document_type: string;
	status: string;
	current_level: number;
	submitted_at: number;
	submitted_by: string;
	completed_at: number;
	business_location_id: string;
	actions: GRNApprovalAction[];
}

// Approval response
export interface GRNApprovalResponse {
	$schema?: string;
	data: GRNApprovalData;
	errors?: string;
}

// API Responses
export interface GRNDetailResponse {
	$schema?: string;
	code: number;
	status: string;
	data: GRNDetailData;
}

// Pagination dari API GRN
export interface GRNPagination {
	current_page: number;
	page_size: number;
	total_items: number;
	total_pages: number;
}

// API Response
export interface GRNListResponse {
	$schema?: string;
	code: number;
	status: string;
	data: GRNItem[];
	pagination: GRNPagination;
}

// Query parameters
export interface GRNListParams {
	page: number;
	size: number;
	search?: string;
	approval_status?: string;
}

// Approved LPO item (for GRN creation)
export interface ApprovedLPOItem {
	id: string;
	lpo_number: string;
	lpo_date: string;
	supplier_id: string;
	supplier_code: string;
	supplier_name: string;
	approval_status: string;
	approval_date: string;
	approved_by: string;
	remarks: string;
}

export interface ApprovedLPOListResponse {
	$schema?: string;
	code: number;
	status: string;
	data: ApprovedLPOItem[];
	pagination: GRNPagination;
}

export interface ApprovedLPOListParams {
	page: number;
	size: number;
	search?: string;
}

// Approved LPO detail item
export interface ApprovedLPODetailItem {
	id: string;
	item_id: string;
	item_code: string;
	item_name: string;
	uom_id: string;
	uom_code: string;
	quantity: number;
	quantity_in_base_unit: number;
	rate: number;
	amount: number;
	purpose: string;
	received_quantity: number;
	received_quantity_in_base_unit: number;
	outstanding_quantity: number;
	outstanding_qty_in_base_unit: number;
	receiving_status: string;
	sanctioned_quantity?: number;
	sanctioned_quantity_in_base_unit?: number;
}

// Approved LPO detail data
export interface ApprovedLPODetailData {
	id: string;
	lpo_number: string;
	lpo_date: string;
	lpo_based_on_id: string;
	lpo_based_on_name: string;
	supplier_id: string;
	supplier_code: string;
	supplier_name: string;
	store_id: string;
	store_name: string;
	payment_type_id: string;
	payment_type_name: string;
	reference_number: string;
	remarks: string;
	is_credit_settled_locally: boolean;
	credit_days: number;
	required_by_date: string;
	requested_advance_amount: number;
	approval_status: string;
	approval_date: string;
	approved_by: string;
	total_amount: number;
	item_count: number;
	version: number;
	items: ApprovedLPODetailItem[];
}

export interface ApprovedLPODetailResponse {
	$schema?: string;
	code: number;
	status: string;
	data: ApprovedLPODetailData;
}

// Material check response
export interface MaterialCheckData {
	exists: boolean;
	is_dropping_material: boolean;
	is_sack: boolean;
	material_code: string;
	requires_volume: boolean;
	requires_weighment: boolean;
}

export interface MaterialCheckResponse {
	$schema?: string;
	code: number;
	status: string;
	data: MaterialCheckData;
}

// Docket (weighment) item
export interface DocketItem {
	docket_number: string;
	estate_code: string;
	estate_id: string;
	estate_name: string;
	gross_weight: number;
	is_used: boolean;
	material_code: string;
	material_name: string;
	net_weight: number;
	second_weighment_date_time: string;
	sending_ref_no: string;
	tare_weight: number;
	ticket_number: string;
	used_by_grn_id: string;
	used_by_grn_number: string;
	vehicle_registration_number: string;
	weighment_date_time: string;
}

export interface DocketPagination {
	current_page: number;
	page_size: number;
	total_items: number;
	total_pages: number;
}

export interface DocketListResponse {
	$schema?: string;
	code: number;
	status: string;
	data: DocketItem[];
	pagination: DocketPagination;
}

// Volume data for dropping material
export interface GRNItemVolume {
	length: number;
	width: number;
	height: number;
	calculated_volume: number;
}

// Weighment data for dropping material
export interface GRNItemWeighment {
	docket_number: string;
	gross_weight: number;
	net_weight: number;
	tare_weight: number;
	vehicle_number: string;
	weighment_date_time: string;
}

// GRN create item payload
export interface GRNCreateItemPayload {
	lpo_item_id: string;
	item_id: string;
	uom_id: string;
	offer_quantity: number;
	offer_quantity_in_base_unit: number;
	grn_received_quantity: number;
	grn_received_quantity_in_base_unit: number;
	accepted_quantity: number;
	accepted_quantity_in_base_unit: number;
	unit_rate: number;
	value_local_currency: number;
	item_storage_dtl_id?: string;
	remarks?: string;
	volume?: GRNItemVolume;
	weighment?: GRNItemWeighment;
}

// Item storage layout
export interface ItemStorageLayout {
	id: string;
	item_storage_id: string;
	item_storage_name: string;
	layout_unit_name: string;
	column_number: number;
	row_number: number;
	is_active: boolean;
	version: number;
}

export interface ItemStorageLayoutResponse {
	$schema?: string;
	data: ItemStorageLayout[];
	errors?: string;
	paging?: {
		page: number;
		size: number;
		total_item: number;
		total_page: number;
	};
}

// GRN create form payload
export interface GRNCreatePayload {
	grn_base_id: string;
	date: string;
	delivery_despatch_note_number: string;
	delivery_despatch_note_date: string;
	store_id: string;
	supplier_id: string;
	transporter_party_id?: string;
	reference_number?: string;
	vehicle_number?: string;
	remarks?: string;
	items: GRNCreateItemPayload[];
}

// GRN create response
export interface GRNCreateResponse {
	$schema?: string;
	data: GRNDetailData;
	errors?: string;
}

export interface LPOItemByQRData {
	amount: number;
	approval_status: string;
	can_receive: boolean;
	item_code: string;
	item_detail_id: string;
	item_id: string;
	item_name: string;
	lpo_based_on: string;
	lpo_date: string;
	lpo_id: string;
	lpo_number: string;
	ordered_quantity: number;
	purpose: string;
	rate: number;
	received_quantity: number;
	receiving_completed: boolean;
	remaining_quantity: number;
	required_by_date: string;
	store_id: string;
	store_name: string;
	supplier_code: string;
	supplier_id: string;
	supplier_name: string;
	uom_code: string;
	uom_id: string;
}

export interface LPOItemByQRResponse {
	$schema?: string;
	data: LPOItemByQRData;
	errors?: string;
}

export interface LPOItemByQRParams {
	lpo_number: string;
	item_code: string;
}

// LPO by QR code response
export interface LPOByQRItem {
	id: string;
	amount: number;
	item_code: string;
	item_id: string;
	item_name: string;
	purpose: string;
	quantity: number;
	rate: number;
	uom_code: string;
	uom_id: string;
}

export interface LPOByQRData {
	approval_id: string;
	approval_status: string;
	created_at: string;
	created_by: string;
	credit_days: number;
	id: string;
	is_credit_settled_locally: boolean;
	item_count: number;
	items: LPOByQRItem[];
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
}

export interface LPOByQRResponse {
	$schema?: string;
	data: LPOByQRData;
	errors?: string;
	paging?: {
		page: number;
		size: number;
		total_item: number;
		total_page: number;
	};
}

export interface LPOByQRParams {
	lpo_number: string;
	supplier_code: string;
	supplier_name: string;
}

// GRN summary data
export interface GRNSummaryData {
	total_grn: number;
	draft: number;
	pending_approval: number;
	approved: number;
	rejected: number;
	cancelled: number;
}

export interface GRNSummaryResponse {
	$schema?: string;
	code: number;
	status: string;
	data: GRNSummaryData;
}
