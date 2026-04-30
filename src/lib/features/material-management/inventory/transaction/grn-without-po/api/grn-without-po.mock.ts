// Mock data for GRN Without PO (Penerimaan Barang Tanpa PO)

import type {
	GRNWithoutPO,
	GRNWithoutPOListResponse,
	GRNWithoutPODetailResponse,
	GRNWithoutPOStats
} from '../types/grn-without-po.types';

export const mockGRNWithoutPOs: GRNWithoutPO[] = [
	{
		id: '1',
		grn_number: 'GRN/WPO/2026/0001',
		date: '2026-04-28',
		store_id: 'store-001',
		store_name: 'Gudang Poliklinik A',
		supplier_id: 'sup-001',
		supplier_name: 'S. MUNTHE',
		ref_no: 'REF/WPO/2026/001',
		delivery_note_no: 'SJ/2026/001',
		delivery_date: '2026-04-28',
		vehicle_no: 'B 1234 ABC',
		transporter: 'PT Transport Jaya',
		remarks: 'Penerimaan barang tanpa PO dari supplier S. MUNTHE',
		approval_status: 'PENDING_APPROVAL',
		gross_amount: 2350000,
		total: 2350000,
		total_items: 3,
		created_at: '2026-04-28T08:00:00Z',
		created_by: 'Budi Santoso',
		updated_at: '2026-04-28T10:30:00Z',
		updated_by: 'Budi Santoso'
	},
	{
		id: '2',
		grn_number: 'GRN/WPO/2026/0002',
		date: '2026-04-27',
		store_id: 'store-003',
		store_name: 'Gudang',
		supplier_id: 'sup-002',
		supplier_name: 'PT Supplier Jaya',
		ref_no: 'REF/WPO/2026/002',
		delivery_note_no: 'SJ/2026/002',
		delivery_date: '2026-04-27',
		vehicle_no: 'B 5678 DEF',
		transporter: 'CV Logistik Nusantara',
		remarks: 'Penerimaan barang kebutuhan operasional',
		approval_status: 'APPROVED',
		gross_amount: 1800000,
		total: 1800000,
		total_items: 2,
		created_at: '2026-04-27T09:00:00Z',
		created_by: 'Siti Aminah',
		updated_at: '2026-04-27T14:30:00Z',
		updated_by: 'Ahmad Tekniker'
	},
	{
		id: '3',
		grn_number: 'GRN/WPO/2026/0003',
		date: '2026-04-26',
		store_id: 'store-004',
		store_name: 'Sub-Gudang Div 1',
		supplier_id: 'sup-003',
		supplier_name: 'CV Maju Bersama',
		ref_no: '',
		delivery_note_no: 'SJ/2026/003',
		delivery_date: '2026-04-26',
		vehicle_no: 'D 9012 GHI',
		transporter: 'None',
		remarks: 'Penerimaan barang darurat divisi 1',
		approval_status: 'REJECTED',
		gross_amount: 950000,
		total: 950000,
		total_items: 1,
		created_at: '2026-04-26T07:30:00Z',
		created_by: 'Rudi Hartono',
		updated_at: '2026-04-26T16:00:00Z',
		updated_by: 'Kepala Gudang'
	},
	{
		id: '4',
		grn_number: 'GRN/WPO/2026/0004',
		date: '2026-04-25',
		store_id: 'store-002',
		store_name: 'Sub-Gudang Poliklinik A',
		supplier_id: 'sup-004',
		supplier_name: 'UD Berkah Abadi',
		ref_no: 'REF/WPO/2026/004',
		delivery_note_no: '',
		delivery_date: '2026-04-25',
		vehicle_no: '',
		transporter: 'UD Kirim Cepat',
		remarks: '',
		approval_status: 'DRAFT',
		gross_amount: 3200000,
		total: 3200000,
		total_items: 4,
		created_at: '2026-04-25T11:00:00Z',
		created_by: 'Dewi Rahayu',
		updated_at: '2026-04-25T11:00:00Z',
		updated_by: 'Dewi Rahayu'
	},
	{
		id: '5',
		grn_number: 'GRN/WPO/2026/0005',
		date: '2026-04-24',
		store_id: 'store-005',
		store_name: 'Sub-Gudang Div 2',
		supplier_id: 'sup-001',
		supplier_name: 'S. MUNTHE',
		ref_no: 'REF/WPO/2026/005',
		delivery_note_no: 'SJ/2026/005',
		delivery_date: '2026-04-24',
		vehicle_no: 'B 3456 JKL',
		transporter: 'PT Transport Jaya',
		remarks: 'Penerimaan obat-obatan dari S. MUNTHE',
		approval_status: 'DRAFT',
		gross_amount: 1500000,
		total: 1500000,
		total_items: 2,
		created_at: '2026-04-24T08:45:00Z',
		created_by: 'Andi Wijaya',
		updated_at: '2026-04-24T08:45:00Z',
		updated_by: 'Andi Wijaya'
	}
];

// Function to add new GRN Without PO to mock data
export function addMockGRNWithoutPO(payload: any): GRNWithoutPO {
	const newGRN: GRNWithoutPO = {
		id: `${mockGRNWithoutPOs.length + 1}`,
		grn_number: `GRN/WPO/2026/${String(mockGRNWithoutPOs.length + 1).padStart(4, '0')}`,
		date: payload.date,
		store_id: payload.store_id,
		store_name: payload.store_name || '',
		supplier_id: payload.supplier_id,
		supplier_name: payload.supplier_name || '',
		ref_no: payload.ref_no || '',
		delivery_note_no: payload.delivery_note_no || '',
		delivery_date: payload.delivery_date || '',
		vehicle_no: payload.vehicle_no || '',
		transporter: payload.transporter || '',
		remarks: payload.remarks || '',
		approval_status: 'DRAFT',
		gross_amount: (payload.items || []).reduce(
			(sum: number, item: any) => sum + (item.accepted_quantity || 0) * (item.unit_rate || 0),
			0
		),
		total: (payload.items || []).reduce(
			(sum: number, item: any) => sum + (item.total_amount || item.accepted_quantity * item.unit_rate || 0),
			0
		),
		total_items: (payload.items || []).length,
		created_at: new Date().toISOString(),
		created_by: 'Current User',
		updated_at: new Date().toISOString(),
		updated_by: 'Current User'
	};

	mockGRNWithoutPOs.unshift(newGRN);
	console.log('Added new mock GRN Without PO:', newGRN);
	return newGRN;
}

export function getMockGRNWithoutPOs(
	page: number = 1,
	size: number = 10,
	search?: string,
	status?: string
): GRNWithoutPOListResponse {
	let filtered = [...mockGRNWithoutPOs];

	// Filter by search
	if (search) {
		const searchLower = search.toLowerCase();
		filtered = filtered.filter(
			(item) =>
				item.grn_number.toLowerCase().includes(searchLower) ||
				item.store_name.toLowerCase().includes(searchLower) ||
				item.supplier_name.toLowerCase().includes(searchLower) ||
				item.ref_no.toLowerCase().includes(searchLower)
		);
	}

	// Filter by status
	if (status && status !== 'all') {
		filtered = filtered.filter((item) => item.approval_status === status);
	}

	// Sort by date descending
	filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

export function getMockGRNWithoutPODetail(id: string): GRNWithoutPODetailResponse {
	const grn = mockGRNWithoutPOs.find((item) => item.id === id);

	if (!grn) {
		throw new Error('GRN Without PO not found');
	}

	return { data: grn };
}

export function getMockGRNWithoutPOStats(): GRNWithoutPOStats {
	return {
		total: mockGRNWithoutPOs.length,
		draft: mockGRNWithoutPOs.filter((item) => item.approval_status === 'DRAFT').length,
		pending_approval: mockGRNWithoutPOs.filter((item) => item.approval_status === 'PENDING_APPROVAL').length,
		approved: mockGRNWithoutPOs.filter((item) => item.approval_status === 'APPROVED').length,
		rejected: mockGRNWithoutPOs.filter((item) => item.approval_status === 'REJECTED').length
	};
}
