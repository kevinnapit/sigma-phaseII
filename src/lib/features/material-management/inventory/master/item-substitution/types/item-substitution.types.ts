export interface ItemSubstitution {
	id: string;
	substitution_id: string; // e.g. "S0000"
	description: string;
	status: string; // "Aktif" | "Tidak Aktif"
	created_by: string;
	updated_by: string;
	created_at: string;
	updated_at: string;
	items: SubstitutionItem[];
}

export interface SubstitutionItem {
	item_code: string;
	item_name: string;
	status: string;
	created_by: string;
	created_at: string;
	updated_by: string;
	updated_at: string;
}

export interface ItemSubstitutionListParams {
	page: number;
	size: number;
	search?: string;
}

export interface ItemSubstitutionListResponse {
	data: ItemSubstitution[];
	pagination: {
		page: number;
		size: number;
		total_item: number;
		total_page: number;
	};
}

export interface ItemSubstitutionDetailResponse {
	data: ItemSubstitution;
}
