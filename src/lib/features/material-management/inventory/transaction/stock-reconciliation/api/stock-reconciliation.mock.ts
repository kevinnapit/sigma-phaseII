// Mock data untuk Rekonsiliasi Stok

import type {
	StockReconciliation,
	ReconciliationItem,
	StockReconciliationListResponse,
	StockReconciliationDetailResponse,
	StockReconciliationCreatePayload
} from '../types/stock-reconciliation.types';

// Item per jadwal — diekspor untuk digunakan di halaman buat
export const reconciliationScheduleItems: Record<string, ReconciliationItem[]> = {
	'Stok Opname Tahunan': [
		{
			item_name: 'OIL SEAL 65 X 90 X 10',
			uom: 'Buah',
			system_quantity: 24,
			system_value: 1200000,
			physical_stock: 0,
			physical_value: 0,
			variations: 0,
			batchwise_entries: [],
			adjusted_quantity: 0,
			adjusted_value: 0,
			approved: false,
			remarks: ''
		},
		{
			item_name: 'COVER LINER WARMAN 6/4',
			uom: 'Buah',
			system_quantity: 6,
			system_value: 3600000,
			physical_stock: 0,
			physical_value: 0,
			variations: 0,
			batchwise_entries: [],
			adjusted_quantity: 0,
			adjusted_value: 0,
			approved: false,
			remarks: ''
		},
		{
			item_name: 'IMPELLER WARMAN TYPE 6/4',
			uom: 'Buah',
			system_quantity: 4,
			system_value: 5200000,
			physical_stock: 0,
			physical_value: 0,
			variations: 0,
			batchwise_entries: [],
			adjusted_quantity: 0,
			adjusted_value: 0,
			approved: false,
			remarks: ''
		},
		{
			item_name: 'MEMBRANE DOSING PUMP "VARIO"',
			uom: 'Buah',
			system_quantity: 10,
			system_value: 2500000,
			physical_stock: 0,
			physical_value: 0,
			variations: 0,
			batchwise_entries: [],
			adjusted_quantity: 0,
			adjusted_value: 0,
			approved: false,
			remarks: ''
		},
		{
			item_name: 'VOLUTE LINER WARMAN 6/4',
			uom: 'Buah',
			system_quantity: 3,
			system_value: 4500000,
			physical_stock: 0,
			physical_value: 0,
			variations: 0,
			batchwise_entries: [],
			adjusted_quantity: 0,
			adjusted_value: 0,
			approved: false,
			remarks: ''
		},
		{
			item_name: 'FRAME PLATE INSERT TYPE 6/4',
			uom: 'Buah',
			system_quantity: 5,
			system_value: 3750000,
			physical_stock: 0,
			physical_value: 0,
			variations: 0,
			batchwise_entries: [],
			adjusted_quantity: 0,
			adjusted_value: 0,
			approved: false,
			remarks: ''
		}
	],
	'Stok Opname Semesteran': [
		{
			item_name: 'BECOM C',
			uom: 'Caplet',
			system_quantity: 500,
			system_value: 2500000,
			physical_stock: 0,
			physical_value: 0,
			variations: 0,
			batchwise_entries: [],
			adjusted_quantity: 0,
			adjusted_value: 0,
			approved: false,
			remarks: ''
		},
		{
			item_name: 'MIRASECT TAB / EXTRO',
			uom: 'Tablet',
			system_quantity: 300,
			system_value: 1800000,
			physical_stock: 0,
			physical_value: 0,
			variations: 0,
			batchwise_entries: [],
			adjusted_quantity: 0,
			adjusted_value: 0,
			approved: false,
			remarks: ''
		},
		{
			item_name: 'BIOSANBE',
			uom: 'Capsul',
			system_quantity: 200,
			system_value: 1200000,
			physical_stock: 0,
			physical_value: 0,
			variations: 0,
			batchwise_entries: [],
			adjusted_quantity: 0,
			adjusted_value: 0,
			approved: false,
			remarks: ''
		}
	],
	'Stok Opname Kuartalan': [
		{
			item_name: 'Pupuk NPK 50kg',
			uom: 'Sak',
			system_quantity: 80,
			system_value: 12000000,
			physical_stock: 0,
			physical_value: 0,
			variations: 0,
			batchwise_entries: [],
			adjusted_quantity: 0,
			adjusted_value: 0,
			approved: false,
			remarks: ''
		},
		{
			item_name: 'Oli Mesin SAE 40',
			uom: 'Liter',
			system_quantity: 150,
			system_value: 3750000,
			physical_stock: 0,
			physical_value: 0,
			variations: 0,
			batchwise_entries: [],
			adjusted_quantity: 0,
			adjusted_value: 0,
			approved: false,
			remarks: ''
		}
	],
	'Stok Opname Bulanan': [
		{
			item_name: 'BATANG BESI',
			uom: 'Batang',
			system_quantity: 79,
			system_value: 1500100,
			physical_stock: 0,
			physical_value: 0,
			variations: 0,
			batchwise_entries: [],
			adjusted_quantity: 0,
			adjusted_value: 0,
			approved: false,
			remarks: ''
		}
	]
};

export const mockStockReconciliations: (StockReconciliation & { items: ReconciliationItem[] })[] = [
	{
		id: '1',
		reconciliation_number: 'SR/2026/0001',
		store_id: 'store-gudang',
		store_name: 'GUDANG',
		from_date: '2026-01-01',
		to_date: '2026-01-31',
		entry_date: '2026-01-15',
		approved_date: '2026-01-16',
		verification_schedule_no: 'Stok Opname Tahunan',
		status: 'Disetujui',
		approved_by: 'Budi Santoso',
		remarks: 'Rekonsiliasi stok tahunan periode Januari 2026',
		total_items: 6,
		created_at: '2026-01-15T08:00:00Z',
		created_by: 'Budi Santoso',
		items: reconciliationScheduleItems['Stok Opname Tahunan'].map((item, i) => ({
			...item,
			physical_stock: item.system_quantity + (i % 2 === 0 ? 2 : -1),
			physical_value: (item.system_quantity + (i % 2 === 0 ? 2 : -1)) * (item.system_value / item.system_quantity),
			variations: i % 2 === 0 ? 2 : -1,
			adjusted_quantity: item.system_quantity + (i % 2 === 0 ? 2 : -1),
			adjusted_value: (item.system_quantity + (i % 2 === 0 ? 2 : -1)) * (item.system_value / item.system_quantity),
			approved: true
		}))
	},
	{
		id: '2',
		reconciliation_number: 'SR/2026/0002',
		store_id: 'store-gudang',
		store_name: 'GUDANG',
		from_date: '2026-01-01',
		to_date: '2026-06-30',
		entry_date: '2026-02-10',
		approved_date: '2026-02-11',
		verification_schedule_no: 'Stok Opname Semesteran',
		status: 'Disetujui',
		approved_by: 'Siti Aminah',
		remarks: 'Rekonsiliasi stok semesteran semester 1',
		total_items: 3,
		created_at: '2026-02-10T09:00:00Z',
		created_by: 'Siti Aminah',
		items: reconciliationScheduleItems['Stok Opname Semesteran'].map((item, i) => ({
			...item,
			physical_stock: item.system_quantity - i,
			physical_value: (item.system_quantity - i) * (item.system_value / item.system_quantity),
			variations: -i,
			adjusted_quantity: item.system_quantity - i,
			adjusted_value: (item.system_quantity - i) * (item.system_value / item.system_quantity),
			approved: i < 2
		}))
	},
	{
		id: '3',
		reconciliation_number: 'SR/2026/0003',
		store_id: 'store-gudang',
		store_name: 'GUDANG',
		from_date: '2026-01-01',
		to_date: '2026-03-31',
		entry_date: '2026-03-05',
		approved_date: '2026-03-06',
		verification_schedule_no: 'Stok Opname Kuartalan',
		status: 'Disetujui',
		approved_by: 'Ahmad Fauzi',
		remarks: '',
		total_items: 2,
		created_at: '2026-03-05T10:00:00Z',
		created_by: 'Ahmad Fauzi',
		items: reconciliationScheduleItems['Stok Opname Kuartalan'].map((item) => ({
			...item,
			physical_stock: item.system_quantity + 5,
			physical_value: (item.system_quantity + 5) * (item.system_value / item.system_quantity),
			variations: 5,
			adjusted_quantity: item.system_quantity + 5,
			adjusted_value: (item.system_quantity + 5) * (item.system_value / item.system_quantity),
			approved: true
		}))
	},
	{
		id: '4',
		reconciliation_number: 'SR/2026/0004',
		store_id: 'store-gudang',
		store_name: 'GUDANG',
		from_date: '2026-04-01',
		to_date: '2026-04-30',
		entry_date: '2026-04-20',
		approved_date: '2026-04-21',
		verification_schedule_no: 'Stok Opname Bulanan',
		status: 'Disetujui',
		approved_by: 'Dewi Rahayu',
		remarks: 'Rekonsiliasi bulanan April 2026',
		total_items: 1,
		created_at: '2026-04-20T11:00:00Z',
		created_by: 'Dewi Rahayu',
		items: reconciliationScheduleItems['Stok Opname Bulanan'].map((item) => ({
			...item,
			physical_stock: 77,
			physical_value: 77 * (item.system_value / item.system_quantity),
			variations: 77 - item.system_quantity,
			adjusted_quantity: 77,
			adjusted_value: 77 * (item.system_value / item.system_quantity),
			approved: true
		}))
	},
	{
		id: '5',
		reconciliation_number: 'SR/2025/0001',
		store_id: 'store-gudang',
		store_name: 'GUDANG',
		from_date: '2025-01-01',
		to_date: '2025-12-31',
		entry_date: '2025-12-28',
		approved_date: '2025-12-29',
		verification_schedule_no: 'Stok Opname Tahunan',
		status: 'Disetujui',
		approved_by: 'Budi Santoso',
		remarks: 'Rekonsiliasi stok tahunan periode 2025',
		total_items: 6,
		created_at: '2025-12-28T08:30:00Z',
		created_by: 'Budi Santoso',
		items: reconciliationScheduleItems['Stok Opname Tahunan'].map((item, i) => ({
			...item,
			physical_stock: item.system_quantity,
			physical_value: item.system_value,
			variations: 0,
			adjusted_quantity: item.system_quantity,
			adjusted_value: item.system_value,
			approved: true
		}))
	}
];

// Tambah rekonsiliasi stok baru ke mock data
export function addMockStockReconciliation(payload: StockReconciliationCreatePayload) {
	const year = new Date(payload.entry_date).getFullYear();
	const count = mockStockReconciliations.filter((r) =>
		r.reconciliation_number.includes(`SR/${year}/`)
	).length;

	const newEntry: StockReconciliation & { items: ReconciliationItem[] } = {
		id: `${mockStockReconciliations.length + 1}`,
		reconciliation_number: `SR/${year}/${String(count + 1).padStart(4, '0')}`,
		store_id: payload.store_id,
		store_name: 'GUDANG',
		from_date: payload.from_date || '',
		to_date: payload.to_date || '',
		entry_date: payload.entry_date,
		approved_date: payload.approved_date,
		verification_schedule_no: payload.verification_schedule_no,
		status: 'Disetujui',
		approved_by: payload.approved_by,
		remarks: payload.remarks || '',
		total_items: payload.items.length,
		created_at: new Date().toISOString(),
		created_by: payload.approved_by,
		items: payload.items
	};

	mockStockReconciliations.unshift(newEntry);
	return newEntry;
}

export function getMockStockReconciliations(
	page: number = 1,
	size: number = 10,
	search?: string
): StockReconciliationListResponse {
	let filtered = [...mockStockReconciliations];

	if (search) {
		const searchLower = search.toLowerCase();
		filtered = filtered.filter(
			(item) =>
				item.reconciliation_number.toLowerCase().includes(searchLower) ||
				item.verification_schedule_no.toLowerCase().includes(searchLower) ||
				item.approved_by.toLowerCase().includes(searchLower)
		);
	}

	// Urutkan berdasarkan entry_date terbaru
	filtered.sort((a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime());

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

export function getMockStockReconciliationDetail(id: string): StockReconciliationDetailResponse {
	const entry = mockStockReconciliations.find((item) => item.id === id);

	if (!entry) {
		throw new Error('Data rekonsiliasi stok tidak ditemukan');
	}

	return { data: entry };
}
