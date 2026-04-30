// Types for Issue Return (Pengembalian Pengeluaran)

export interface IssueReturnItem {
	id: string;
	item_code: string;
	item_name: string;
	issue_number: string;
	geographical_unit: string;
	allocation_code: string;
	batch_no: string;
	storage_location: string;
	uom: string;
	issue_quantity: number;
	unit_rate: number;
	quantity_returned: number;
	remarks: string;
}

export interface IssueReturn {
	id: string;
	return_number: string;
	return_date: string;
	store_id: string;
	store_name: string;
	return_by_id: string;
	return_by_name: string;
	remarks: string;
	status: 'processed';
	status_label: string;
	total_items: number;
	items: IssueReturnItem[];
	created_at: string;
	updated_at: string;
}

export interface IssueReturnListParams {
	page: number;
	size: number;
	search?: string;
	status?: string;
}

export interface IssueReturnListResponse {
	data: IssueReturn[];
	pagination: {
		page: number;
		size: number;
		total_item: number;
		total_page: number;
	};
}

export interface IssueReturnDetailResponse {
	data: IssueReturn;
}

export interface IssueReturnCreatePayload {
	return_date: string;
	store_id: string;
	store_name: string;
	return_by_id: string;
	return_by_name: string;
	remarks: string;
	items: {
		item_code: string;
		item_name: string;
		issue_number: string;
		geographical_unit: string;
		allocation_code: string;
		batch_no: string;
		storage_location: string;
		uom: string;
		issue_quantity: number;
		unit_rate: number;
		quantity_returned: number;
		remarks: string;
	}[];
}

export interface IssueReturnStats {
	total: number;
}
