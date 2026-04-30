// Mock data for Transfer Receipt

import type {
	TransferReceipt,
	TransferReceiptListResponse,
	TransferReceiptDetailResponse,
	TransferReceiptStats
} from '../types/transfer-receipt.types';

export const mockTransferReceipts: TransferReceipt[] = [
	{
		id: '1',
		grn_number: 'GRN/TR/2026/0001',
		grn_date: '2026-04-28',
		delivery_date: '2026-04-28',
		store_id: 'store-001',
		store_name: 'Gudang Poliklinik A',
		administrative_unit_id: 'admin-001',
		administrative_unit_name: 'Afd Penerima',
		from_store_id: 'store-002',
		from_store_name: 'Gudang',
		ref_no: 'REF/2026/001',
		delivery_note_no: 'DN/2026/001',
		vehicle_no: 'B 1234 ABC',
		transporter: 'PT Transport Jaya',
		mr_no: 'MR/2017/8/001',
		remarks: 'Penerimaan barang transfer dari gudang pusat',
		status: 'submitted',
		status_label: 'Menunggu Approval',
		total_items: 3,
		gross_amount: 1850000,
		items: [
			{
				id: 'item-1',
				item_code: '7011812',
				item_name: 'BECOM C',
				item_uom: 'Caplet',
				mr_quantity: 100,
				grn_quantity: 100,
				grn_uom: 'Caplet',
				accepted_quantity: 100,
				unit_rate: 5000,
				total_value: 500000,
				batch_no: 'BATCH001',
				code: 'BC001',
				mfd_date: '2026-01-01',
				exp_date: '2027-01-01',
				storage: 'RAK-A-01',
				percentage_amount: 0,
				total_amount: 500000,
				mr_allocation: 'ALLOC-001'
			},
			{
				id: 'item-2',
				item_code: '7021129',
				item_name: 'MIRASECT TAB / EXTRO',
				item_uom: 'Tablet',
				mr_quantity: 100,
				grn_quantity: 100,
				grn_uom: 'Tablet',
				accepted_quantity: 100,
				unit_rate: 7500,
				total_value: 750000,
				batch_no: 'BATCH002',
				code: 'MT002',
				mfd_date: '2026-02-01',
				exp_date: '2027-02-01',
				storage: 'RAK-B-02',
				percentage_amount: 0,
				total_amount: 750000,
				mr_allocation: 'ALLOC-002'
			},
			{
				id: 'item-3',
				item_code: '7011814',
				item_name: 'BIOSANBE',
				item_uom: 'Capsul',
				mr_quantity: 100,
				grn_quantity: 100,
				grn_uom: 'Capsul',
				accepted_quantity: 100,
				unit_rate: 6000,
				total_value: 600000,
				batch_no: 'BATCH003',
				code: 'BS003',
				mfd_date: '2026-03-01',
				exp_date: '2027-03-01',
				storage: 'RAK-C-03',
				percentage_amount: 0,
				total_amount: 600000,
				mr_allocation: 'ALLOC-003'
			}
		],
		created_at: '2026-04-28T08:00:00Z',
		updated_at: '2026-04-28T08:00:00Z',
		created_by: 'Budi Santoso',
		updated_by: 'Budi Santoso'
	},
	{
		id: '2',
		grn_number: 'GRN/TR/2026/0002',
		grn_date: '2026-04-27',
		delivery_date: '2026-04-27',
		store_id: 'store-003',
		store_name: 'Gudang',
		administrative_unit_id: 'admin-002',
		administrative_unit_name: 'Afd Penerima',
		from_store_id: 'store-001',
		from_store_name: 'Gudang Poliklinik A',
		ref_no: 'REF/2026/002',
		delivery_note_no: 'DN/2026/002',
		vehicle_no: 'B 5678 DEF',
		transporter: 'PT Logistik Mandiri',
		mr_no: 'MR/2018/9/012',
		remarks: 'Penerimaan barang transfer antar divisi',
		status: 'approved',
		status_label: 'Disetujui',
		total_items: 2,
		gross_amount: 1200000,
		items: [
			{
				id: 'item-4',
				item_code: '8011001',
				item_name: 'Pupuk NPK 50kg',
				item_uom: 'Sak',
				mr_quantity: 50,
				grn_quantity: 50,
				grn_uom: 'Sak',
				accepted_quantity: 50,
				unit_rate: 150000,
				total_value: 750000,
				batch_no: 'BATCH004',
				code: 'NPK001',
				mfd_date: '2026-01-15',
				exp_date: '2028-01-15',
				storage: 'JAC-2',
				percentage_amount: 0,
				total_amount: 750000,
				mr_allocation: 'ALLOC-004'
			},
			{
				id: 'item-5',
				item_code: '8011002',
				item_name: 'Oli Mesin SAE 40',
				item_uom: 'Liter',
				mr_quantity: 20,
				grn_quantity: 20,
				grn_uom: 'Liter',
				accepted_quantity: 20,
				unit_rate: 22500,
				total_value: 450000,
				batch_no: 'BATCH005',
				code: 'OLI001',
				mfd_date: '2026-02-10',
				exp_date: '2027-02-10',
				storage: 'RAK-D-04',
				percentage_amount: 0,
				total_amount: 450000,
				mr_allocation: 'ALLOC-005'
			}
		],
		created_at: '2026-04-27T09:00:00Z',
		updated_at: '2026-04-27T14:30:00Z',
		created_by: 'Siti Aminah',
		updated_by: 'Ahmad Tekniker'
	}
];

// Function to add new transfer receipt to mock data
export function addMockTransferReceipt(payload: any) {
	const newReceipt: TransferReceipt = {
		id: `${mockTransferReceipts.length + 1}`,
		grn_number: `GRN/TR/2026/${String(mockTransferReceipts.length + 1).padStart(4, '0')}`,
		grn_date: payload.grn_date,
		delivery_date: payload.delivery_date,
		store_id: payload.store_id,
		store_name: payload.store_name,
		administrative_unit_id: payload.administrative_unit_id,
		administrative_unit_name: payload.administrative_unit_name,
		from_store_id: payload.from_store_id,
		from_store_name: payload.from_store_name,
		ref_no: payload.ref_no,
		delivery_note_no: payload.delivery_note_no,
		vehicle_no: payload.vehicle_no,
		transporter: payload.transporter,
		mr_no: payload.mr_no,
		remarks: payload.remarks,
		status: 'draft',
		status_label: 'Draft',
		total_items: payload.items.length,
		gross_amount: payload.items.reduce((sum: number, item: any) => sum + (item.accepted_quantity * item.unit_rate), 0),
		items: payload.items.map((item: any, index: number) => ({
			id: `item-${Date.now()}-${index}`,
			...item,
			total_value: item.accepted_quantity * item.unit_rate,
			total_amount: item.accepted_quantity * item.unit_rate
		})),
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		created_by: 'Current User',
		updated_by: 'Current User'
	};

	mockTransferReceipts.unshift(newReceipt);
	console.log('Added new mock transfer receipt:', newReceipt);
	return newReceipt;
}

export function getMockTransferReceipts(
	page: number = 1,
	size: number = 10,
	search?: string,
	status?: string
): TransferReceiptListResponse {
	let filtered = [...mockTransferReceipts];

	// Filter by search
	if (search) {
		const searchLower = search.toLowerCase();
		filtered = filtered.filter(
			(item) =>
				item.grn_number.toLowerCase().includes(searchLower) ||
				item.store_name.toLowerCase().includes(searchLower) ||
				item.from_store_name.toLowerCase().includes(searchLower) ||
				item.mr_no.toLowerCase().includes(searchLower)
		);
	}

	// Filter by status
	if (status && status !== 'all') {
		filtered = filtered.filter((item) => item.status === status);
	}

	// Sort by date descending
	filtered.sort((a, b) => new Date(b.grn_date).getTime() - new Date(a.grn_date).getTime());

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

export function getMockTransferReceiptDetail(id: string): TransferReceiptDetailResponse {
	const transferReceipt = mockTransferReceipts.find((item) => item.id === id);

	if (!transferReceipt) {
		throw new Error('Transfer receipt not found');
	}

	return {
		data: transferReceipt
	};
}

export function getMockTransferReceiptStats(): TransferReceiptStats {
	return {
		total: mockTransferReceipts.length,
		draft: mockTransferReceipts.filter((item) => item.status === 'draft').length,
		submitted: mockTransferReceipts.filter((item) => item.status === 'submitted').length,
		approved: mockTransferReceipts.filter((item) => item.status === 'approved').length,
		rejected: mockTransferReceipts.filter((item) => item.status === 'rejected').length
	};
}