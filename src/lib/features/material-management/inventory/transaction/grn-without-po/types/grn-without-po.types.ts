// Types for GRN Without PO (Penerimaan Barang Tanpa PO)

export interface GRNWithoutPO {
	id: string;
	grn_number: string;
	date: string;
	store_id: string;
	store_name: string;
	supplier_id: string;
	supplier_name: string;
	ref_no: string;
	delivery_note_no: string;
	delivery_date: string;
	vehicle_no: string;
	transporter: string;
	remarks: string;
	approval_status: string;
	gross_amount: number;
	total: number;
	total_items: number;
	created_at: string;
	created_by: string;
	updated_at: string;
	updated_by: string;
}

export interface GRNWithoutPOItem {
	item_code: string;
	item_name: string;
	item_uom: string;
	grn_quantity: number;
	accepted_quantity: number;
	unit_rate: number;
	total_value: number;
	batch_no: string;
	batchwise_entries: any[];
	exp_date: string;
	mfd_date: string;
	offered_qty: number;
	storage: string;
	percentage_amount: number;
	additional_charges: any[];
	total_amount: number;
	// options for dropdowns
	batch_options: any[];
	available_storages: string[];
}

export interface GRNWithoutPOListParams {
	page: number;
	size: number;
	search?: string;
	status?: string;
}

export interface GRNWithoutPOListResponse {
	data: GRNWithoutPO[];
	pagination: {
		page: number;
		size: number;
		total_item: number;
		total_page: number;
	};
}

export interface GRNWithoutPODetailResponse {
	data: GRNWithoutPO;
}

export interface GRNWithoutPOCreatePayload {
	store_id: string;
	supplier_id: string;
	date: string;
	ref_no?: string;
	delivery_note_no?: string;
	delivery_date?: string;
	vehicle_no?: string;
	transporter?: string;
	remarks?: string;
	items: GRNWithoutPOItem[];
}

export interface GRNWithoutPOStats {
	total: number;
	draft: number;
	pending_approval: number;
	approved: number;
	rejected: number;
}
