// Mock data for Inter Estate Transfer

import type {
	InterEstateTransfer,
	InterEstateTransferListResponse,
	InterEstateTransferDetailResponse
} from '../types/inter-estate-transfer.types';

export const mockInterEstateTransfers: InterEstateTransfer[] = [
	{
		id: '1',
		document_number: 'TAK/2024/01/001',
		mr_number: 'AL/MP/MR/2024/0001',
		request_date: '2024-01-15',
		required_date: '2024-01-20',
		from_estate_id: 'estate-001',
		from_estate_name: 'Aek Loba',
		to_estate_id: 'estate-002',
		to_estate_name: 'Mata Pao',
		requester_name: 'Budi Santoso',
		department_name: 'Departemen Produksi',
		status: 'pending_approval',
		status_label: 'Menunggu Persetujuan Manager Kebun Diminta',
		total_items: 5,
		total_amount: 15000000,
		justification: 'Kebutuhan mendesak untuk operasional pabrik',
		is_urgent: true,
		items: [
			{
				id: 'item-1',
				item_code: 'BRG-001',
				item_name: 'Pupuk NPK 50kg',
				quantity: 100,
				uom: 'Sak',
				unit_price: 150000,
				total_price: 15000000,
				notes: 'Untuk area blok A',
				purpose: 'Pemupukan area blok A'
			}
		],
		created_at: '2024-01-15T08:00:00Z',
		updated_at: '2024-01-15T08:00:00Z'
	},
	{
		id: '2',
		document_number: 'TAK/2024/01/002',
		mr_number: 'AL/SL/MR/2024/0001',
		request_date: '2024-01-14',
		required_date: '2024-01-18',
		from_estate_id: 'estate-001',
		from_estate_name: 'Aek Loba',
		to_estate_id: 'estate-003',
		to_estate_name: 'Sei Liput',
		requester_name: 'Siti Aminah',
		department_name: 'Departemen Maintenance',
		status: 'approved',
		status_label: 'Disetujui',
		total_items: 3,
		total_amount: 8500000,
		justification: 'Penggantian spare part mesin',
		is_urgent: false,
		items: [
			{
				id: 'item-2',
				item_code: 'BRG-002',
				item_name: 'Oli Mesin SAE 40',
				quantity: 50,
				uom: 'Liter',
				unit_price: 85000,
				total_price: 4250000,
				purpose: 'Maintenance mesin produksi'
			},
			{
				id: 'item-3',
				item_code: 'BRG-003',
				item_name: 'Filter Udara',
				quantity: 25,
				uom: 'Pcs',
				unit_price: 170000,
				total_price: 4250000,
				purpose: 'Penggantian filter mesin'
			}
		],
		approval_date: '2024-01-14T14:30:00Z',
		approval_by: 'Manager Kebun Sei Liput',
		approval_notes: 'Disetujui, barang tersedia',
		created_at: '2024-01-14T09:00:00Z',
		updated_at: '2024-01-14T14:30:00Z'
	},
	{
		id: '3',
		document_number: 'TAK/2024/01/003',
		mr_number: 'AL/MP/MR/2024/0002',
		request_date: '2024-01-13',
		required_date: '2024-01-17',
		from_estate_id: 'estate-001',
		from_estate_name: 'Aek Loba',
		to_estate_id: 'estate-002',
		to_estate_name: 'Mata Pao',
		requester_name: 'Ahmad Yani',
		department_name: 'Departemen Logistik',
		status: 'rejected',
		status_label: 'Ditolak',
		total_items: 2,
		total_amount: 5000000,
		justification: 'Kebutuhan operasional',
		is_urgent: false,
		items: [
			{
				id: 'item-4',
				item_code: 'BRG-004',
				item_name: 'Herbisida Glifosat',
				quantity: 100,
				uom: 'Liter',
				unit_price: 50000,
				total_price: 5000000,
				purpose: 'Penyemprotan gulma'
			}
		],
		approval_date: '2024-01-13T16:00:00Z',
		approval_by: 'Manager Kebun Mata Pao',
		rejection_reason: 'Stok tidak tersedia, sedang dalam proses pengadaan',
		created_at: '2024-01-13T10:00:00Z',
		updated_at: '2024-01-13T16:00:00Z'
	}
];

export function getMockInterEstateTransfers(
	page: number = 1,
	size: number = 10,
	search?: string,
	status?: string
): InterEstateTransferListResponse {
	let filtered = [...mockInterEstateTransfers];

	// Filter by search
	if (search) {
		const searchLower = search.toLowerCase();
		filtered = filtered.filter(
			(item) =>
				item.document_number.toLowerCase().includes(searchLower) ||
				item.mr_number.toLowerCase().includes(searchLower) ||
				item.from_estate_name.toLowerCase().includes(searchLower) ||
				item.to_estate_name.toLowerCase().includes(searchLower)
		);
	}

	// Filter by status
	if (status && status !== 'all') {
		filtered = filtered.filter((item) => item.status === status);
	}

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

export function getMockInterEstateTransferDetail(id: string): InterEstateTransferDetailResponse {
	const transfer = mockInterEstateTransfers.find((item) => item.id === id);

	if (!transfer) {
		throw new Error('Transfer not found');
	}

	return {
		data: transfer
	};
}
