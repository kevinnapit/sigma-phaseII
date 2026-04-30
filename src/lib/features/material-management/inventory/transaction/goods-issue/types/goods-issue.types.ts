/**
 * Types for Goods Issue (Pengeluaran Barang)
 */

export interface GoodsIssue {
	id: string;
	gsir_number: string; // Nomor Permintaan dari gawai (GSIR/2026/0042)
	issue_number: string; // Nomor Pengeluaran setelah posting (ISSUE/2026/000001)
	grn_id: string;
	grn_number: string; // No Penerimaan
	date: string; // Tanggal Penerimaan
	division_id?: string;
	division_name?: string; // Divisi
	vendor_id: string;
	vendor_name: string; // Vendor
	transporter_id?: string;
	transporter_name?: string; // Nama Transporter
	vehicle_number?: string; // No Kendaraan
	total_items: number;
	approval_status: 'Menunggu Persetujuan Askep/Tekniker 1' | 'Disetujui';
	i_version: number;
}

export interface GoodsIssueItem {
	id: string;
	item_id: string;
	item_code: string;
	item_name: string;
	uom_id: string;
	uom_code: string;
	quantity: number; // Jumlah Pengeluaran
	quantity_in_base_unit: number;
	photo_url?: string; // Foto Pengeluaran Barang
	allocation_code?: string; // Kode Alokasi
	allocation_name?: string; // Nama Alokasi
	sub_block?: string; // Sub Blok
	required_date?: string; // Dibutuhkan Tanggal
	purpose?: string; // Tujuan
	worker_count?: number; // Detail Pekerja (jumlah orang)
	worker_name?: string; // Nama pekerja
	cost_classification?: string; // Analisa - Tipe
	cost_classification_code?: string; // Analisa - Kode
	remarks?: string; // Catatan
}

export interface GoodsIssueApprovalHistory {
	id: string;
	action: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
	action_date: number; // Unix timestamp
	level_name: string;
	approver_name: string;
	remarks?: string;
}

export interface GoodsIssueDetail extends GoodsIssue {
	items: GoodsIssueItem[];
	approval_history?: GoodsIssueApprovalHistory[];
}

export interface GoodsIssueListParams {
	page: number;
	size: number;
	search?: string;
	approval_status?: string;
	division_id?: string;
	vendor_id?: string;
	date_from?: string;
	date_to?: string;
}

export interface Pagination {
	page: number;
	size: number;
	total_item: number;
	total_page: number;
}

export interface GoodsIssueListResponse {
	$schema?: string;
	data: GoodsIssue[];
	pagination: Pagination;
}

export interface GoodsIssueDetailResponse {
	$schema?: string;
	data: GoodsIssueDetail;
}

export interface GoodsIssueSummary {
	total_issue: number;
	pending: number;
	approved: number;
}

export interface GoodsIssueSummaryResponse {
	$schema?: string;
	data: GoodsIssueSummary;
}
