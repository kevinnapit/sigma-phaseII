// Types for Transfer Receipt (Penerimaan Barang Transfer)

export interface TransferReceiptItem {
	id: string;
	item_code: string;
	item_name: string;
	item_uom: string;
	mr_quantity: number;
	grn_quantity: number;
	grn_uom: string;
	accepted_quantity: number;
	unit_rate: number;
	total_value: number;
	batch_no: string;
	code: string;
	mfd_date: string;
	exp_date: string;
	storage: string;
	percentage_amount: number;
	total_amount: number;
	mr_allocation: string;
}

export interface TransferReceipt {
	id: string;
	grn_number: string;
	grn_date: string;
	delivery_date: string;
	store_id: string;
	store_name: string;
	administrative_unit_id: string;
	administrative_unit_name: string;
	from_store_id: string;
	from_store_name: string;
	ref_no: string;
	delivery_note_no: string;
	vehicle_no: string;
	transporter: string;
	mr_no: string;
	remarks: string;
	status: 'draft' | 'submitted' | 'approved' | 'rejected';
	status_label: string;
	total_items: number;
	gross_amount: number;
	items: TransferReceiptItem[];
	created_at: string;
	updated_at: string;
	created_by: string;
	updated_by: string;
}

export interface TransferReceiptListParams {
	page: number;
	size: number;
	search?: string;
	status?: string;
}

export interface TransferReceiptListResponse {
	data: TransferReceipt[];
	pagination: {
		page: number;
		size: number;
		total_item: number;
		total_page: number;
	};
}

export interface TransferReceiptDetailResponse {
	data: TransferReceipt;
}

export interface TransferReceiptCreatePayload {
	grn_date: string;
	delivery_date: string;
	store_id: string;
	store_name: string;
	administrative_unit_id: string;
	administrative_unit_name: string;
	from_store_id: string;
	from_store_name: string;
	ref_no: string;
	delivery_note_no: string;
	vehicle_no: string;
	transporter: string;
	mr_no: string;
	remarks: string;
	items: {
		item_code: string;
		item_name: string;
		item_uom: string;
		mr_quantity: number;
		grn_quantity: number;
		grn_uom: string;
		accepted_quantity: number;
		unit_rate: number;
		batch_no: string;
		code: string;
		mfd_date: string;
		exp_date: string;
		storage: string;
		percentage_amount: number;
		mr_allocation: string;
	}[];
}

export interface TransferReceiptStats {
	total: number;
	draft: number;
	submitted: number;
	approved: number;
	rejected: number;
}