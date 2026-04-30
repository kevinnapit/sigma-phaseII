// Mock data for Stock Adjustment (Penyesuaian Stok)

import type {
	StockAdjustment,
	StockAdjustmentItem,
	StockAdjustmentListResponse,
	StockAdjustmentDetailResponse,
	StockAdjustmentCreatePayload
} from '../types/stock-adjustment.types';

// Mock stock items available for selection
export const mockStockItems = [
	{
		grn_no: 'GRN/2026/0001',
		item_code: '7006825',
		batch_no: 'BATCH001',
		uom: 'Batang',
		stk_qty: 79,
		stk_value: 1500000,
		unit_rate: 18987
	},
	{
		grn_no: 'GRN/2026/0001',
		item_code: '7006825',
		batch_no: 'BATCH002',
		uom: 'Batang',
		stk_qty: 4,
		stk_value: 75948,
		unit_rate: 18987
	},
	{
		grn_no: 'GRN/2026/0002',
		item_code: '7011812',
		batch_no: 'BATCH003',
		uom: 'Caplet',
		stk_qty: 100,
		stk_value: 500000,
		unit_rate: 5000
	},
	{
		grn_no: 'GRN/2026/0003',
		item_code: '7021129',
		batch_no: 'BATCH004',
		uom: 'Tablet',
		stk_qty: 50,
		stk_value: 375000,
		unit_rate: 7500
	},
	{
		grn_no: 'GRN/2026/0004',
		item_code: '8011001',
		batch_no: 'BATCH005',
		uom: 'Sak',
		stk_qty: 20,
		stk_value: 3000000,
		unit_rate: 150000
	}
];

export const mockStockAdjustments: (StockAdjustment & { items: StockAdjustmentItem[] })[] = [
	{
		id: '1',
		adjustment_number: 'Adj/2026/0001',
		date: '2026-04-28',
		store_id: 'store-gudang',
		store_name: 'GUDANG',
		allocation_code: 'Perk. Sementara/For Adjustment',
		ref_no: 'REF-001',
		account: 'Perk. Sementara/For Adjustment',
		remarks: 'Penyesuaian stok akhir bulan April',
		total_items: 2,
		gross_amount: -189870,
		created_at: '2026-04-28T08:00:00Z',
		created_by: 'Budi Santoso',
		items: [
			{
				grn_no: 'GRN/2026/0001',
				item_code: '7006825',
				batch_no: 'BATCH001',
				item_uom: 'Batang',
				stk_qty: 79,
				stk_value: 1500000,
				unit_rate: 18987,
				quantity: -10,
				value: -189870,
				remarks: 'Stok rusak'
			},
			{
				grn_no: 'GRN/2026/0002',
				item_code: '7011812',
				batch_no: 'BATCH003',
				item_uom: 'Caplet',
				stk_qty: 100,
				stk_value: 500000,
				unit_rate: 5000,
				quantity: 0,
				value: 0,
				remarks: ''
			}
		]
	},
	{
		id: '2',
		adjustment_number: 'Adj/2026/0002',
		date: '2026-04-27',
		store_id: 'store-gudang',
		store_name: 'GUDANG',
		allocation_code: 'Alokasi Umum',
		ref_no: '',
		account: 'Akun Persediaan',
		remarks: 'Koreksi selisih stok fisik',
		total_items: 1,
		gross_amount: 37500,
		created_at: '2026-04-27T09:00:00Z',
		created_by: 'Siti Aminah',
		items: [
			{
				grn_no: 'GRN/2026/0003',
				item_code: '7021129',
				batch_no: 'BATCH004',
				item_uom: 'Tablet',
				stk_qty: 50,
				stk_value: 375000,
				unit_rate: 7500,
				quantity: 5,
				value: 37500,
				remarks: 'Temuan stok opname'
			}
		]
	},
	{
		id: '3',
		adjustment_number: 'Adj/2026/0003',
		date: '2026-04-26',
		store_id: 'store-gudang',
		store_name: 'GUDANG',
		allocation_code: 'Penyesuaian Rutin',
		ref_no: 'REF-003',
		account: 'Akun Penyesuaian',
		remarks: 'Penyesuaian rutin mingguan',
		total_items: 1,
		gross_amount: -300000,
		created_at: '2026-04-26T10:00:00Z',
		created_by: 'Ahmad Fauzi',
		items: [
			{
				grn_no: 'GRN/2026/0004',
				item_code: '8011001',
				batch_no: 'BATCH005',
				item_uom: 'Sak',
				stk_qty: 20,
				stk_value: 3000000,
				unit_rate: 150000,
				quantity: -2,
				value: -300000,
				remarks: 'Barang kadaluarsa'
			}
		]
	},
	{
		id: '4',
		adjustment_number: 'Adj/2026/0004',
		date: '2026-04-25',
		store_id: 'store-gudang',
		store_name: 'GUDANG',
		allocation_code: 'Alokasi Khusus',
		ref_no: 'REF-004',
		account: 'Akun Umum',
		remarks: '',
		total_items: 2,
		gross_amount: 113922,
		created_at: '2026-04-25T11:00:00Z',
		created_by: 'Dewi Rahayu',
		items: [
			{
				grn_no: 'GRN/2026/0001',
				item_code: '7006825',
				batch_no: 'BATCH002',
				item_uom: 'Batang',
				stk_qty: 4,
				stk_value: 75948,
				unit_rate: 18987,
				quantity: 2,
				value: 37974,
				remarks: 'Penambahan stok'
			},
			{
				grn_no: 'GRN/2026/0002',
				item_code: '7011812',
				batch_no: 'BATCH003',
				item_uom: 'Caplet',
				stk_qty: 100,
				stk_value: 500000,
				unit_rate: 5000,
				quantity: 15,
				value: 75000,
				remarks: 'Koreksi penerimaan'
			}
		]
	},
	{
		id: '5',
		adjustment_number: 'Adj/2026/0005',
		date: '2026-04-24',
		store_id: 'store-gudang',
		store_name: 'GUDANG',
		allocation_code: 'Perk. Sementara/For Adjustment',
		ref_no: 'REF-005',
		account: 'Perk. Sementara/For Adjustment',
		remarks: 'Penyesuaian stok opname Q1',
		total_items: 1,
		gross_amount: -7500,
		created_at: '2026-04-24T08:30:00Z',
		created_by: 'Budi Santoso',
		items: [
			{
				grn_no: 'GRN/2026/0003',
				item_code: '7021129',
				batch_no: 'BATCH004',
				item_uom: 'Tablet',
				stk_qty: 50,
				stk_value: 375000,
				unit_rate: 7500,
				quantity: -1,
				value: -7500,
				remarks: 'Selisih stok opname'
			}
		]
	}
];

// Add new stock adjustment to mock data
export function addMockStockAdjustment(payload: StockAdjustmentCreatePayload) {
	const newAdjustment: StockAdjustment & { items: StockAdjustmentItem[] } = {
		id: `${mockStockAdjustments.length + 1}`,
		adjustment_number: `Adj/2026/${String(mockStockAdjustments.length + 1).padStart(4, '0')}`,
		date: payload.date,
		store_id: payload.store_id,
		store_name: 'GUDANG',
		allocation_code: payload.allocation_code || '',
		ref_no: payload.ref_no || '',
		account: payload.account || '',
		remarks: payload.remarks || '',
		total_items: payload.items.length,
		gross_amount: payload.items.reduce((sum, item) => sum + item.value, 0),
		created_at: new Date().toISOString(),
		created_by: 'Current User',
		items: payload.items
	};

	mockStockAdjustments.unshift(newAdjustment);
	console.log('Added new mock stock adjustment:', newAdjustment);
	return newAdjustment;
}

export function getMockStockAdjustments(
	page: number = 1,
	size: number = 10,
	search?: string
): StockAdjustmentListResponse {
	let filtered = [...mockStockAdjustments];

	if (search) {
		const searchLower = search.toLowerCase();
		filtered = filtered.filter(
			(item) =>
				item.adjustment_number.toLowerCase().includes(searchLower) ||
				item.store_name.toLowerCase().includes(searchLower) ||
				item.allocation_code.toLowerCase().includes(searchLower)
		);
	}

	// Sort by date descending
	filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

export function getMockStockAdjustmentDetail(id: string): StockAdjustmentDetailResponse {
	const adjustment = mockStockAdjustments.find((item) => item.id === id);

	if (!adjustment) {
		throw new Error('Stock adjustment not found');
	}

	return { data: adjustment };
}
