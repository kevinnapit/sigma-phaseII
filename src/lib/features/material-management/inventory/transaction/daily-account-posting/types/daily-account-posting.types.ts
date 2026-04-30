// Types for Daily Account Posting (Posting Akun Harian)

export interface DailyAccountPosting {
	id: string;
	voucher_type: string;
	voucher_no: string;
	account_name: string;
	debit_amount: number;
	credit_amount: number;
	purpose: string;
	process_date: string;
	administrative_unit: string;
	store: string;
}

export interface DailyAccountPostingParams {
	administrative_unit: string;
	store: string;
	process_date: string;
}

export interface DailyAccountPostingHeader {
	id: string;
	posting_number: string; // DAP/2026/0001
	administrative_unit: string;
	store: string;
	store_name: string;
	process_date: string;
	remarks: string;
	total_items: number;
	total_debit: number;
	total_credit: number;
	created_at: string;
	created_by: string;
}

export interface DailyAccountPostingItem {
	voucher_type: string;
	voucher_no: string;
	account_name: string;
	debit_amount: number;
	credit_amount: number;
	purpose: string;
}

export interface DailyAccountPostingListParams {
	page: number;
	size: number;
	search?: string;
}

export interface DailyAccountPostingListResponse {
	data: DailyAccountPostingHeader[];
	pagination: {
		page: number;
		size: number;
		total_item: number;
		total_page: number;
	};
}

export interface DailyAccountPostingDetailResponse {
	data: DailyAccountPostingHeader & { items: DailyAccountPostingItem[] };
}

export interface DailyAccountPostingCreatePayload {
	administrative_unit: string;
	store: string;
	process_date: string;
	remarks?: string;
	items: DailyAccountPostingItem[];
}
