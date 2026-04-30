/**
 * Goods Issues types untuk Material Management
 */

// Detail item dalam goods issue
export interface GoodsIssueDetail {
	uoid: string;
	item_issue_header_id: string;
	item_id: string;
	uom_id: string;
	material_request_detail_id: string;
	stores_issue_request_detail_id: string;
	general_allocation_id: string;
	geographical_unit_id: string;
	differential_general_allocation_id: string;
	differential_rate: string;
	is_differential_rate: boolean;
	issue_rate: string;
	issue_value: string;
	issue_remarks: string;
	quantity_issued: string;
	quantity_issued_in_base_unit: string;
	i_version: number;
}

// Item dalam list goods issues
export interface GoodsIssueItem {
	uoid: string;
	issue_number: string;
	date: string;
	created_at: string;
	issue_type_id: string;
	issuing_store_id: string;
	source_of_request_id: string;
	requesting_department_id: string;
	requesting_administrative_unit_id: string;
	requesting_contractor_party_id: string;
	requesting_employee_id: string;
	requesting_store_id: string;
	issued_by: string;
	received_by: string;
	remarks: string;
	is_printed: boolean;
	i_version: number;
	details: GoodsIssueDetail[];
}

// Pagination dari API list
export interface GoodsIssuesPagination {
	current_page: number;
	page_size: number;
	total_items: number;
	total_pages: number;
}

// Response list goods issues
export interface GoodsIssuesListResponse {
	$schema?: string;
	code: number;
	status: string;
	data: GoodsIssueItem[];
	pagination: GoodsIssuesPagination;
}

// Response detail goods issue
export interface GoodsIssueDetailResponse {
	$schema?: string;
	data: GoodsIssueItem;
	errors?: string;
	paging?: {
		page: number;
		size: number;
		total_item: number;
		total_page: number;
	};
}

// Query params untuk list
export interface GoodsIssuesListParams {
	page: number;
	size: number;
	search?: string;
}
