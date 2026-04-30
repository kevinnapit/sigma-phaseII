// Inter Estate Transfer Types

export interface InterEstateTransferItem {
	id: string;
	item_code: string;
	item_name: string;
	quantity: number;
	uom: string;
	unit_price: number;
	total_price: number;
	notes?: string;
}

export interface InterEstateTransfer {
	id: string;
	document_number: string;
	mr_number: string;
	request_date: string;
	required_date: string;
	from_estate_id: string;
	from_estate_name: string;
	to_estate_id: string;
	to_estate_name: string;
	requester_name: string;
	department_name: string;
	status: 'pending_approval' | 'approved' | 'rejected' | 'received';
	status_label: string;
	total_items: number;
	total_amount: number;
	justification: string;
	is_urgent: boolean;
	items: InterEstateTransferItem[];
	approval_date?: string;
	approval_by?: string;
	approval_notes?: string;
	rejection_reason?: string;
	created_at: string;
	updated_at: string;
}

export interface InterEstateTransferListParams {
	page: number;
	size: number;
	search?: string;
	status?: string;
	from_estate_id?: string;
	to_estate_id?: string;
	date_from?: string;
	date_to?: string;
}

export interface InterEstateTransferListResponse {
	$schema?: string;
	data: InterEstateTransfer[];
	pagination: {
		page: number;
		size: number;
		total_item: number;
		total_page: number;
	};
}

export interface InterEstateTransferDetailResponse {
	$schema?: string;
	data: InterEstateTransfer;
}

export interface ApprovalRequest {
	notes?: string;
}

export interface RejectionRequest {
	reason: string;
}

export interface ApprovalResponse {
	$schema?: string;
	data: InterEstateTransfer;
	message: string;
}
