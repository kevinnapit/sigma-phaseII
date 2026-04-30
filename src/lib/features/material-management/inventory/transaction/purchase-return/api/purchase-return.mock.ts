// Mock data for Purchase Return (Pengembalian Pembelian)

import type {
	PurchaseReturn,
	PurchaseReturnItem,
	PurchaseReturnListResponse,
	PurchaseReturnDetailResponse,
	PurchaseReturnCreatePayload
} from '../types/purchase-return.types';

export const mockPurchaseReturns: (PurchaseReturn & { items: PurchaseReturnItem[] })[] = [
	{
		id: '1',
		return_number: 'PR/2026/0001',
		return_date: '2026-04-28',
		store_id: 'store-gudang',
		store_name: 'GUDANG',
		supplier_id: 'sup-001',
		supplier_name: 'S. MUNTHE',
		return_account: '09328-Langganan Macam2',
		remarks: 'Pengembalian barang kadaluarsa',
		total_items: 2,
		gross_amount: 875000,
		created_at: '2026-04-28T08:00:00Z',
		created_by: 'Budi Santoso',
		items: [
			{
				grn_no: 'GRN/2026/0001',
				item_code: '7011812',
				item_name: 'BECOM C',
				item_uom: 'Caplet',
				grn_qty: 100,
				accepted_qty: 100,
				returned_qty: 10,
				batchwise_entries: [],
				rate: 5000,
				total: 50000,
				reason: 'Kadaluarsa'
			},
			{
				grn_no: 'GRN/2026/0001',
				item_code: '7021129',
				item_name: 'MIRASECT TAB / EXTRO',
				item_uom: 'Tablet',
				grn_qty: 50,
				accepted_qty: 50,
				returned_qty: 5,
				batchwise_entries: [],
				rate: 7500,
				total: 37500,
				reason: 'Rusak'
			}
		]
	},
	{
		id: '2',
		return_number: 'PR/2026/0002',
		return_date: '2026-04-27',
		store_id: 'store-gudang',
		store_name: 'GUDANG',
		supplier_id: 'sup-001',
		supplier_name: 'S. MUNTHE',
		return_account: '',
		remarks: 'Kelebihan stok',
		total_items: 1,
		gross_amount: 120000,
		created_at: '2026-04-27T09:00:00Z',
		created_by: 'Siti Aminah',
		items: [
			{
				grn_no: 'GRN/2026/0002',
				item_code: '7011814',
				item_name: 'BIOSANBE',
				item_uom: 'Capsul',
				grn_qty: 200,
				accepted_qty: 200,
				returned_qty: 20,
				batchwise_entries: [],
				rate: 6000,
				total: 120000,
				reason: 'Kelebihan stok'
			}
		]
	},
	{
		id: '3',
		return_number: 'PR/2026/0003',
		return_date: '2026-04-26',
		store_id: 'store-gudang',
		store_name: 'GUDANG',
		supplier_id: 'sup-002',
		supplier_name: 'PT Supplier Jaya',
		return_account: '09328-Langganan Macam2',
		remarks: 'Barang tidak sesuai spesifikasi',
		total_items: 1,
		gross_amount: 1500000,
		created_at: '2026-04-26T10:00:00Z',
		created_by: 'Ahmad Fauzi',
		items: [
			{
				grn_no: 'GRN/2026/0003',
				item_code: '8011001',
				item_name: 'Pupuk NPK 50kg',
				item_uom: 'Sak',
				grn_qty: 20,
				accepted_qty: 20,
				returned_qty: 10,
				batchwise_entries: [],
				rate: 150000,
				total: 1500000,
				reason: 'Tidak sesuai spesifikasi'
			}
		]
	},
	{
		id: '4',
		return_number: 'PR/2026/0004',
		return_date: '2026-04-25',
		store_id: 'store-gudang',
		store_name: 'GUDANG',
		supplier_id: 'sup-003',
		supplier_name: 'CV Maju Bersama',
		return_account: '',
		remarks: '',
		total_items: 1,
		gross_amount: 225000,
		created_at: '2026-04-25T11:00:00Z',
		created_by: 'Dewi Rahayu',
		items: [
			{
				grn_no: 'GRN/2026/0004',
				item_code: '8011002',
				item_name: 'Oli Mesin SAE 40',
				item_uom: 'Liter',
				grn_qty: 50,
				accepted_qty: 50,
				returned_qty: 10,
				batchwise_entries: [],
				rate: 22500,
				total: 225000,
				reason: 'Bocor'
			}
		]
	},
	{
		id: '5',
		return_number: 'PR/2026/0005',
		return_date: '2026-04-24',
		store_id: 'store-gudang',
		store_name: 'GUDANG',
		supplier_id: 'sup-004',
		supplier_name: 'UD Berkah Abadi',
		return_account: '09328-Langganan Macam2',
		remarks: 'Pengembalian rutin',
		total_items: 2,
		gross_amount: 300000,
		created_at: '2026-04-24T08:30:00Z',
		created_by: 'Budi Santoso',
		items: [
			{
				grn_no: 'GRN/2026/0001',
				item_code: '7011812',
				item_name: 'BECOM C',
				item_uom: 'Caplet',
				grn_qty: 100,
				accepted_qty: 100,
				returned_qty: 30,
				batchwise_entries: [],
				rate: 5000,
				total: 150000,
				reason: 'Kelebihan'
			},
			{
				grn_no: 'GRN/2026/0001',
				item_code: '7021129',
				item_name: 'MIRASECT TAB / EXTRO',
				item_uom: 'Tablet',
				grn_qty: 50,
				accepted_qty: 50,
				returned_qty: 20,
				batchwise_entries: [],
				rate: 7500,
				total: 150000,
				reason: 'Kelebihan'
			}
		]
	}
];

// Function to add new purchase return to mock data
export function addMockPurchaseReturn(payload: PurchaseReturnCreatePayload) {
	const newReturn: PurchaseReturn & { items: PurchaseReturnItem[] } = {
		id: `${mockPurchaseReturns.length + 1}`,
		return_number: `PR/2026/${String(mockPurchaseReturns.length + 1).padStart(4, '0')}`,
		return_date: payload.return_date,
		store_id: payload.store_id,
		store_name: 'GUDANG',
		supplier_id: payload.supplier_id,
		supplier_name: getSupplierName(payload.supplier_id),
		return_account: payload.return_account || '',
		remarks: payload.remarks || '',
		total_items: payload.items.length,
		gross_amount: payload.items.reduce((sum, item) => sum + item.total, 0),
		created_at: new Date().toISOString(),
		created_by: 'Current User',
		items: payload.items
	};

	mockPurchaseReturns.unshift(newReturn);
	console.log('Added new mock purchase return:', newReturn);
	return newReturn;
}

function getSupplierName(supplierId: string): string {
	const map: Record<string, string> = {
		'sup-001': 'S. MUNTHE',
		'sup-002': 'PT Supplier Jaya',
		'sup-003': 'CV Maju Bersama',
		'sup-004': 'UD Berkah Abadi'
	};
	return map[supplierId] || supplierId;
}

export function getMockPurchaseReturns(
	page: number = 1,
	size: number = 10,
	search?: string
): PurchaseReturnListResponse {
	let filtered = [...mockPurchaseReturns];

	// Filter by search
	if (search) {
		const searchLower = search.toLowerCase();
		filtered = filtered.filter(
			(item) =>
				item.return_number.toLowerCase().includes(searchLower) ||
				item.supplier_name.toLowerCase().includes(searchLower) ||
				item.store_name.toLowerCase().includes(searchLower)
		);
	}

	// Sort by date descending
	filtered.sort((a, b) => new Date(b.return_date).getTime() - new Date(a.return_date).getTime());

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

export function getMockPurchaseReturnDetail(id: string): PurchaseReturnDetailResponse {
	const purchaseReturn = mockPurchaseReturns.find((item) => item.id === id);

	if (!purchaseReturn) {
		throw new Error('Purchase return not found');
	}

	return {
		data: purchaseReturn
	};
}
