// Mock data for Stock Transfer Request

import type {
	StockTransferRequest,
	StockTransferRequestListResponse,
	StockTransferRequestDetailResponse,
	StockTransferRequestStats
} from '../types/stock-transfer-request.types';

export const mockStockTransferRequests: StockTransferRequest[] = [
	{
		id: '1',
		request_number: 'TRF/2026/0001',
		request_date: '2026-04-28',
		from_estate_id: 'estate-001',
		from_estate_name: 'Aek Loba',
		to_estate_id: 'estate-001',
		to_estate_name: 'Aek Loba',
		from_store_id: 'store-001',
		from_store_name: 'Gudang Poliklinik A',
		to_store_id: 'store-003',
		to_store_name: 'Gudang',
		requester_name: 'Budi Santoso',
		reference_number: 'REF-001',
		remarks: 'Transfer stok untuk kebutuhan operasional',
		status: 'pending_approval',
		status_label: 'Menunggu Approval dari Askep/Tekniker 1',
		total_items: 3,
		items: [
			{
				id: 'item-1',
				item_code: 'BRG-001',
				item_name: 'Pupuk NPK 50kg',
				quantity: 50,
				uom: 'Sak',
				required_date: '2026-05-01',
				purpose: 'Pemupukan area blok A'
			},
			{
				id: 'item-2',
				item_code: 'BRG-002',
				item_name: 'Oli Mesin SAE 40',
				quantity: 20,
				uom: 'Liter',
				required_date: '2026-05-01',
				purpose: 'Maintenance mesin'
			},
			{
				id: 'item-3',
				item_code: 'BRG-003',
				item_name: 'Filter Udara',
				quantity: 10,
				uom: 'Pcs',
				required_date: '2026-05-01',
				purpose: 'Penggantian filter'
			}
		],
		created_at: '2026-04-28T08:00:00Z',
		updated_at: '2026-04-28T08:00:00Z'
	},
	{
		id: '2',
		request_number: 'TRF/2026/0002',
		request_date: '2026-04-27',
		from_estate_id: 'estate-001',
		from_estate_name: 'Aek Loba',
		to_estate_id: 'estate-001',
		to_estate_name: 'Aek Loba',
		from_store_id: 'store-003',
		from_store_name: 'Gudang',
		to_store_id: 'store-004',
		to_store_name: 'Sub-Gudang Div 1',
		requester_name: 'Siti Aminah',
		remarks: 'Transfer stok untuk proyek baru',
		status: 'approved',
		status_label: 'Disetujui',
		total_items: 2,
		items: [
			{
				id: 'item-4',
				item_code: 'BRG-004',
				item_name: 'Herbisida Glifosat',
				quantity: 30,
				uom: 'Liter',
				required_date: '2026-04-30',
				purpose: 'Penyemprotan gulma'
			},
			{
				id: 'item-5',
				item_code: 'BRG-005',
				item_name: 'Insektisida',
				quantity: 15,
				uom: 'Liter',
				required_date: '2026-04-30',
				purpose: 'Pengendalian hama'
			}
		],
		approval_date: '2026-04-27T14:30:00Z',
		approval_by: 'Askep Aek Loba',
		approval_notes: 'Disetujui, stok tersedia',
		created_at: '2026-04-27T09:00:00Z',
		updated_at: '2026-04-27T14:30:00Z'
	},
	{
		id: '3',
		request_number: 'TRF/2026/0003',
		request_date: '2026-04-26',
		from_estate_id: 'estate-001',
		from_estate_name: 'Aek Loba',
		to_estate_id: 'estate-001',
		to_estate_name: 'Aek Loba',
		from_store_id: 'store-006',
		from_store_name: 'Sub-Gudang Pupuk/Div 3',
		to_store_id: 'store-007',
		to_store_name: 'Sub-Gudang Pupuk/Div 4',
		requester_name: 'Ahmad Yani',
		status: 'rejected',
		status_label: 'Ditolak',
		total_items: 1,
		items: [
			{
				id: 'item-6',
				item_code: 'BRG-006',
				item_name: 'Spare Part Mesin',
				quantity: 5,
				uom: 'Unit',
				required_date: '2026-04-29',
				purpose: 'Perbaikan mesin'
			}
		],
		approval_date: '2026-04-26T16:00:00Z',
		approval_by: 'Askep Aek Loba',
		rejection_reason: 'Stok tidak mencukupi, sedang dalam proses pengadaan',
		created_at: '2026-04-26T10:00:00Z',
		updated_at: '2026-04-26T16:00:00Z'
	},
	{
		id: '4',
		request_number: 'TRF/2026/0004',
		request_date: '2026-04-28',
		from_estate_id: 'estate-001',
		from_estate_name: 'Aek Loba',
		to_estate_id: 'estate-001',
		to_estate_name: 'Aek Loba',
		from_store_id: 'store-002',
		from_store_name: 'Sub-Gudang Poliklinik A',
		to_store_id: 'store-005',
		to_store_name: 'Sub-Gudang Div 2',
		requester_name: 'Dewi Lestari',
		status: 'draft',
		status_label: 'Belum Diajukan',
		total_items: 2,
		items: [
			{
				id: 'item-7',
				item_code: 'BRG-007',
				item_name: 'Alat Tulis Kantor',
				quantity: 100,
				uom: 'Set',
				required_date: '2026-05-02',
				purpose: 'Kebutuhan administrasi'
			},
			{
				id: 'item-8',
				item_code: 'BRG-008',
				item_name: 'Tinta Printer',
				quantity: 20,
				uom: 'Pcs',
				required_date: '2026-05-02',
				purpose: 'Kebutuhan cetak dokumen'
			}
		],
		created_at: '2026-04-28T11:00:00Z',
		updated_at: '2026-04-28T11:00:00Z'
	}
];

// Function to add new request to mock data
export function addMockStockTransferRequest(payload: any) {
	const newRequest: StockTransferRequest = {
		id: `${mockStockTransferRequests.length + 1}`,
		request_number: `TRF/2026/${String(mockStockTransferRequests.length + 1).padStart(4, '0')}`,
		request_date: payload.request_date,
		from_estate_id: payload.from_estate_id,
		from_estate_name: 'Aek Loba',
		to_estate_id: payload.to_estate_id,
		to_estate_name: 'Aek Loba',
		from_store_id: payload.from_store_id,
		from_store_name: payload.from_store_name || 'Unknown Store',
		to_store_id: payload.to_store_id,
		to_store_name: payload.to_store_name || 'Unknown Store',
		requester_name: 'Current User',
		reference_number: payload.reference_number,
		remarks: payload.remarks,
		status: 'draft',
		status_label: 'Belum Diajukan',
		total_items: payload.items.length,
		items: payload.items.map((item: any, index: number) => ({
			id: `item-${Date.now()}-${index}`,
			...item
		})),
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	};

	mockStockTransferRequests.unshift(newRequest);
	console.log('Added new mock request:', newRequest);
	return newRequest;
}

export function getMockStockTransferRequests(
	page: number = 1,
	size: number = 10,
	search?: string,
	status?: string
): StockTransferRequestListResponse {
	let filtered = [...mockStockTransferRequests];

	// Filter by search
	if (search) {
		const searchLower = search.toLowerCase();
		filtered = filtered.filter(
			(item) =>
				item.request_number.toLowerCase().includes(searchLower) ||
				item.from_estate_name.toLowerCase().includes(searchLower) ||
				item.to_estate_name.toLowerCase().includes(searchLower) ||
				item.requester_name.toLowerCase().includes(searchLower)
		);
	}

	// Filter by status
	if (status && status !== 'all') {
		filtered = filtered.filter((item) => item.status === status);
	}

	// Sort by date descending
	filtered.sort((a, b) => new Date(b.request_date).getTime() - new Date(a.request_date).getTime());

	// Pagination
	const total = filtered.length;
	const start = (page - 1) * size;
	const end = start + size;
	const paginatedData = filtered.slice(start, end);

	return {
		data: paginatedData,
		pagination: {
			page,
			size,
			total_item: total,
			total_page: Math.ceil(total / size)
		}
	};
}

export function getMockStockTransferRequestDetail(
	id: string
): StockTransferRequestDetailResponse {
	const request = mockStockTransferRequests.find((item) => item.id === id);

	if (!request) {
		throw new Error('Stock transfer request not found');
	}

	return {
		data: request
	};
}

export function getMockStockTransferRequestStats(): StockTransferRequestStats {
	return {
		total: mockStockTransferRequests.length,
		pending: mockStockTransferRequests.filter((item) => item.status === 'pending_approval').length,
		approved: mockStockTransferRequests.filter((item) => item.status === 'approved').length,
		rejected: mockStockTransferRequests.filter((item) => item.status === 'rejected').length
	};
}
