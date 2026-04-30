/**
 * Mock data untuk Goods Issue (Pengeluaran Barang)
 * Data ini dibuat dari transaksi mobile app (gawai)
 */

import type {
	GoodsIssue,
	GoodsIssueDetail,
	GoodsIssueListParams,
	GoodsIssueListResponse,
	GoodsIssueDetailResponse,
	GoodsIssueSummaryResponse
} from '../types/goods-issue.types';

// Mock data storage - 3 items sesuai screenshot
const mockGoodsIssueList: GoodsIssue[] = [
	{
		id: 'gsir-001',
		gsir_number: 'GSIR/2026/0046',
		issue_number: 'ISSUE/2026/000046',
		grn_id: 'grn-065',
		grn_number: 'GRN/2026/0065',
		date: '2026-04-15',
		division_id: 'div-1',
		division_name: 'Divisi 1',
		vendor_id: 'vendor-panglong',
		vendor_name: 'PANGLONG TESTING',
		transporter_id: 'vendor-panglong',
		transporter_name: 'PANGLONG TESTING',
		vehicle_number: 'BK 1234 ABC',
		total_items: 1,
		approval_status: 'Disetujui',
		i_version: 1
	},
	{
		id: 'gsir-002',
		gsir_number: 'GSIR/2026/0042',
		issue_number: '-', // Belum ada karena masih menunggu persetujuan
		grn_id: 'grn-054',
		grn_number: 'GRN/2026/0054',
		date: '2026-04-15',
		division_id: 'div-1',
		division_name: 'Divisi 1',
		vendor_id: 'vendor-usaha-fitriati',
		vendor_name: 'USAHA FITRIATI',
		transporter_id: 'transporter-lautan',
		transporter_name: 'PT LAUTAN LUAS TBK.',
		vehicle_number: 'BK 2020 ASDF',
		total_items: 1,
		approval_status: 'Menunggu Persetujuan Askep/Tekniker 1',
		i_version: 1
	},
	{
		id: 'gsir-003',
		gsir_number: 'GSIR/2026/0020',
		issue_number: '-', // Belum ada karena masih menunggu persetujuan
		grn_id: 'grn-026',
		grn_number: 'GRN/2026/0026',
		date: '2026-04-10',
		division_id: 'div-1',
		division_name: 'Divisi 1',
		vendor_id: 'vendor-dodi',
		vendor_name: 'Dodi Mardiansyah',
		transporter_id: 'vendor-dodi',
		transporter_name: 'Dodi Mardiansyah',
		vehicle_number: 'BK 5678 XYZ',
		total_items: 1,
		approval_status: 'Menunggu Persetujuan Askep/Tekniker 1',
		i_version: 1
	}
];

const mockGoodsIssueDetails: Record<string, GoodsIssueDetail> = {
	'gsir-001': {
		id: 'gsir-001',
		gsir_number: 'GSIR/2026/0046',
		issue_number: 'ISSUE/2026/000046',
		grn_id: 'grn-065',
		grn_number: 'GRN/2026/0065',
		date: '2026-04-15',
		division_id: 'div-1',
		division_name: 'Divisi 1',
		vendor_id: 'vendor-panglong',
		vendor_name: 'PANGLONG TESTING',
		transporter_id: 'vendor-panglong',
		transporter_name: 'PANGLONG TESTING',
		vehicle_number: 'BK 1234 ABC',
		total_items: 1,
		approval_status: 'Disetujui',
		i_version: 1,
		items: [
			{
				id: 'gsir-item-001',
				item_id: 'item-7015062',
				item_code: '7015062',
				item_name: 'BATU KORAL',
				uom_id: 'uom-m3',
				uom_code: 'M3',
				quantity: 15,
				quantity_in_base_unit: 15,
				photo_url: 'https://placehold.co/600x400/e5e7eb/1f2937?text=BATU+KORAL',
				allocation_code: '004201',
				allocation_name: 'Biaya Pindah Pegawai',
				sub_block: 'Block 004/98',
				required_date: '2026-04-15',
				purpose: 'Test tujuan',
				worker_count: 1,
				worker_name: 'Adrian Amos Pangaribuan',
				cost_classification: 'Cost Classification',
				cost_classification_code: 'FPOM',
				remarks: 'Isi Catatan'
			}
		],
		approval_history: [
			{
				id: 'history-001',
				action: 'APPROVED',
				action_date: 1713513480, // 19 April 2025 pukul 08:18
				level_name: 'Persetujuan Askep/Tekniker I',
				approver_name: 'SOFYAN_ID/username/iba',
				remarks: 'setuju'
			}
		]
	},
	'gsir-002': {
		id: 'gsir-002',
		gsir_number: 'GSIR/2026/0042',
		issue_number: '-', // Belum ada karena masih menunggu persetujuan
		grn_id: 'grn-054',
		grn_number: 'GRN/2026/0054',
		date: '2026-04-15',
		division_id: 'div-1',
		division_name: 'Divisi 1',
		vendor_id: 'vendor-usaha-fitriati',
		vendor_name: 'USAHA FITRIATI',
		transporter_id: 'transporter-lautan',
		transporter_name: 'PT LAUTAN LUAS TBK.',
		vehicle_number: 'BK 2020 ASDF',
		total_items: 1,
		approval_status: 'Menunggu Persetujuan Askep/Tekniker 1',
		i_version: 1,
		items: [
			{
				id: 'gsir-item-002',
				item_id: 'item-7015062',
				item_code: '7015062',
				item_name: 'BATU KORAL',
				uom_id: 'uom-m3',
				uom_code: 'M3',
				quantity: 15,
				quantity_in_base_unit: 15,
				photo_url: 'https://placehold.co/600x400/d1d5db/374151?text=BATU+KORAL',
				allocation_code: '004201',
				allocation_name: 'Biaya Pindah Pegawai',
				sub_block: undefined,
				required_date: '2026-04-15',
				purpose: 'Untuk perbaikan jalan',
				worker_count: 2,
				worker_name: 'Budi Santoso',
				cost_classification: 'Cost Classification',
				cost_classification_code: 'FPOM',
				remarks: undefined
			}
		],
		approval_history: []
	},
	'gsir-003': {
		id: 'gsir-003',
		gsir_number: 'GSIR/2026/0020',
		issue_number: '-', // Belum ada karena masih menunggu persetujuan
		grn_id: 'grn-026',
		grn_number: 'GRN/2026/0026',
		date: '2026-04-10',
		division_id: 'div-1',
		division_name: 'Divisi 1',
		vendor_id: 'vendor-dodi',
		vendor_name: 'Dodi Mardiansyah',
		transporter_id: 'vendor-dodi',
		transporter_name: 'Dodi Mardiansyah',
		vehicle_number: 'BK 5678 XYZ',
		total_items: 1,
		approval_status: 'Menunggu Persetujuan Askep/Tekniker 1',
		i_version: 1,
		items: [
			{
				id: 'gsir-item-003',
				item_id: 'item-7015062',
				item_code: '7015062',
				item_name: 'BATU KORAL',
				uom_id: 'uom-m3',
				uom_code: 'M3',
				quantity: 20,
				quantity_in_base_unit: 20,
				photo_url: 'https://placehold.co/600x400/c7d2fe/4338ca?text=BATU+KORAL',
				allocation_code: '004201',
				allocation_name: 'Biaya Pindah Pegawai',
				sub_block: undefined,
				required_date: '2026-04-10',
				purpose: 'Untuk pembangunan',
				worker_count: 3,
				worker_name: 'Siti Aminah',
				cost_classification: 'Cost Classification',
				cost_classification_code: 'FPOM',
				remarks: 'Segera diproses'
			}
		],
		approval_history: []
	}
};

const mockGoodsIssueSummary = {
	total_issue: 3,
	pending: 2,
	approved: 1
};

export const goodsIssueMockApi = {
	/**
	 * Get Goods Issue summary statistics
	 */
	getGoodsIssueSummary: async (): Promise<GoodsIssueSummaryResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 300));

		return {
			$schema: 'goods-issue-summary-response',
			data: mockGoodsIssueSummary
		};
	},

	/**
	 * Get all Goods Issues with pagination and search
	 */
	getAllGoodsIssues: async (params: GoodsIssueListParams): Promise<GoodsIssueListResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		let filtered = [...mockGoodsIssueList];

		// Filter by search (issue number, gsir number, grn number, vendor, transporter)
		if (params.search) {
			const searchLower = params.search.toLowerCase();
			filtered = filtered.filter(
				(gi) =>
					gi.issue_number.toLowerCase().includes(searchLower) ||
					gi.gsir_number.toLowerCase().includes(searchLower) ||
					gi.grn_number.toLowerCase().includes(searchLower) ||
					gi.vendor_name.toLowerCase().includes(searchLower) ||
					gi.transporter_name?.toLowerCase().includes(searchLower)
			);
		}

		// Filter by approval status
		if (params.approval_status) {
			filtered = filtered.filter((gi) => gi.approval_status === params.approval_status);
		}

		// Filter by division
		if (params.division_id) {
			filtered = filtered.filter((gi) => gi.division_id === params.division_id);
		}

		// Filter by vendor
		if (params.vendor_id) {
			filtered = filtered.filter((gi) => gi.vendor_id === params.vendor_id);
		}

		// Filter by date range
		if (params.date_from) {
			filtered = filtered.filter((gi) => gi.date >= params.date_from!);
		}
		if (params.date_to) {
			filtered = filtered.filter((gi) => gi.date <= params.date_to!);
		}

		// Pagination
		const start = (params.page - 1) * params.size;
		const end = start + params.size;
		const paginated = filtered.slice(start, end);

		return {
			$schema: 'goods-issue-list-response',
			data: paginated,
			pagination: {
				page: params.page,
				size: params.size,
				total_item: filtered.length,
				total_page: Math.ceil(filtered.length / params.size)
			}
		};
	},

	/**
	 * Get Goods Issue detail by ID
	 */
	getGoodsIssueDetail: async (id: string): Promise<GoodsIssueDetailResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 400));

		const detail = mockGoodsIssueDetails[id];
		if (!detail) {
			throw new Error(`Goods Issue with ID ${id} not found`);
		}

		return {
			$schema: 'goods-issue-detail-response',
			data: detail
		};
	}
};
