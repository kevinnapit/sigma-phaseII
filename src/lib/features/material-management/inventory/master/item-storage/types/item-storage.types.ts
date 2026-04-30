/**
 * Item Storage (Penyimpanan Barang) types
 */

export interface StorageRack {
	id: string;
	rack_name: string; // e.g., "RAK INDUK G", "LEMARI-4 JAO"
	item_group_id: string;
	item_group_code: string; // e.g., "G", "JAO"
	item_group_name: string;
}

export interface StorageCell {
	id: string;
	rack_id: string;
	cell_code: string; // e.g., "R1C1"
	// cell_name is derived from assigned items' item group code2
	// before assignment: shows cell_code
	// after assignment: "[GROUP_CODE2] [ROW]/[COL][LETTER]" e.g., "G 1/1"
	cell_name: string;
	rack_name: string;
	item_group_id: string;
	item_group_code: string;
	item_group_name: string;
	is_occupied: boolean;
	assigned_items: AssignedItem[];
}

export interface AssignedItem {
	id: string;
	item_code: string;
	item_name: string;
	assigned_at: string;
}

// A single assignment record = one cell + multiple items
export interface ItemStorageAssignment {
	id: string;
	assignment_number: string; // ISA/2026/0001
	store_name: string;
	rack_id: string;
	rack_name: string;         // original rack name e.g. "RAK INDUK G"
	cell_id: string;
	cell_code: string;         // e.g. "R1C1"
	cell_name: string;         // derived from item group code2 e.g. "G 1/1"
	item_group_id: string;
	item_group_name: string;
	items: AssignedItem[];     // multiple items per assignment
	assigned_at: string;
	assigned_by: string;
	notes: string;
}

export interface ItemStorageAssignmentListParams {
	page: number;
	size: number;
	search?: string;
}

export interface ItemStorageAssignmentListResponse {
	data: ItemStorageAssignment[];
	pagination: {
		page: number;
		size: number;
		total_item: number;
		total_page: number;
	};
}

export interface ItemStorageAssignmentDetailResponse {
	data: ItemStorageAssignment;
}

export interface ItemStorageAssignmentCreatePayload {
	rack_id: string;
	cell_id: string;
	items: { item_code: string; item_name: string }[];
	notes?: string;
}
