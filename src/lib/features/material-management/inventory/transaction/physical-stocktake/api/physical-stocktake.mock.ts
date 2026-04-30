// Mock data for Physical Stocktake Entry (Entri Stok Opname Fisik)

import type {
	PhysicalStocktake,
	StocktakeItem,
	PhysicalStocktakeListResponse,
	PhysicalStocktakeDetailResponse,
	PhysicalStocktakeCreatePayload
} from '../types/physical-stocktake.types';

// Mock items per schedule — exported for use in create page
export const scheduleItems: Record<string, StocktakeItem[]> = {
	'Stok Opname Tahunan': [
		{ item_code: 'OIL SEAL 65 X 90 X 10', item_name: 'OIL SEAL 65 X 90 X 10', uom: 'Buah', physical_stock: 0, physical_value: 0 },
		{ item_code: 'COVER LINER WARMAN 6/4', item_name: 'COVER LINER WARMAN 6/4', uom: 'Buah', physical_stock: 0, physical_value: 0 },
		{ item_code: 'IMPELLER WARMAN TYPE 6/4', item_name: 'IMPELLER WARMAN TYPE 6/4', uom: 'Buah', physical_stock: 0, physical_value: 0 },
		{ item_code: 'MEMBRANE DOSING PUMP "VARIO"', item_name: 'MEMBRANE DOSING PUMP "VARIO"', uom: 'Buah', physical_stock: 0, physical_value: 0 },
		{ item_code: 'VOLUTE LINER WARMAN 6/4', item_name: 'VOLUTE LINER WARMAN 6/4', uom: 'Buah', physical_stock: 0, physical_value: 0 },
		{ item_code: 'FRAME PLATE INSERT TYPE 6/4', item_name: 'FRAME PLATE INSERT TYPE 6/4', uom: 'Buah', physical_stock: 0, physical_value: 0 },
		{ item_code: 'ELBOW SEAMLESS 3"', item_name: 'ELBOW SEAMLESS 3"', uom: 'Buah', physical_stock: 0, physical_value: 0 },
		{ item_code: 'ELBOW SEAMLESS 4"', item_name: 'ELBOW SEAMLESS 4"', uom: 'Buah', physical_stock: 0, physical_value: 0 },
		{ item_code: 'STEAM ELBOW 4" B.STEEL', item_name: 'STEAM ELBOW 4" B.STEEL', uom: 'Buah', physical_stock: 0, physical_value: 0 },
		{ item_code: 'ROLLER CHAIN NK 80-2R PITCH25.40MM', item_name: 'ROLLER CHAIN NK 80-2R PITCH25.40MM', uom: 'Meter', physical_stock: 0, physical_value: 0 },
		{ item_code: 'MAIN SHAFT AP 17 RH PN 19', item_name: 'MAIN SHAFT AP 17 RH PN 19', uom: 'Buah', physical_stock: 0, physical_value: 0 },
		{ item_code: 'OIL SEAL 140 X 170 X 14', item_name: 'OIL SEAL 140 X 170 X 14', uom: 'Buah', physical_stock: 0, physical_value: 0 }
	],
	'Stok Opname Semesteran': [
		{ item_code: '7011812', item_name: 'BECOM C', uom: 'Caplet', physical_stock: 0, physical_value: 0 },
		{ item_code: '7021129', item_name: 'MIRASECT TAB / EXTRO', uom: 'Tablet', physical_stock: 0, physical_value: 0 },
		{ item_code: '7011814', item_name: 'BIOSANBE', uom: 'Capsul', physical_stock: 0, physical_value: 0 }
	],
	'Stok Opname Kuartalan': [
		{ item_code: '8011001', item_name: 'Pupuk NPK 50kg', uom: 'Sak', physical_stock: 0, physical_value: 0 },
		{ item_code: '8011002', item_name: 'Oli Mesin SAE 40', uom: 'Liter', physical_stock: 0, physical_value: 0 }
	],
	'Stok Opname Bulanan': [
		{ item_code: '7006825', item_name: 'BATANG BESI', uom: 'Batang', physical_stock: 0, physical_value: 0 }
	]
};

export const mockPhysicalStocktakes: (PhysicalStocktake & { items: StocktakeItem[] })[] = [
	{
		id: '1',
		entry_number: 'PSE/2026/0001',
		schedule: 'Stok Opname Tahunan',
		store_id: 'store-gudang',
		store_name: 'GUDANG',
		from_date: '2026-01-01',
		to_date: '2026-01-31',
		entry_date: '2026-01-15',
		ref_no: 'REF-SO-001',
		status: 'Verifikasi Selesai',
		verified_by: 'Budi Santoso',
		remarks: 'Stok opname tahunan periode Januari 2026',
		total_items: 12,
		created_at: '2026-01-15T08:00:00Z',
		created_by: 'Budi Santoso',
		items: scheduleItems['Stok Opname Tahunan'].map((item, i) => ({
			...item,
			physical_stock: 10 + i * 2,
			physical_value: (10 + i * 2) * 50000
		}))
	},
	{
		id: '2',
		entry_number: 'PSE/2026/0002',
		schedule: 'Stok Opname Semesteran',
		store_id: 'store-gudang',
		store_name: 'GUDANG',
		from_date: '2026-01-01',
		to_date: '2026-06-30',
		entry_date: '2026-02-10',
		ref_no: '',
		status: 'Dalam Proses',
		verified_by: 'Siti Aminah',
		remarks: 'Stok opname semesteran semester 1',
		total_items: 3,
		created_at: '2026-02-10T09:00:00Z',
		created_by: 'Siti Aminah',
		items: scheduleItems['Stok Opname Semesteran'].map((item, i) => ({
			...item,
			physical_stock: 50 + i * 10,
			physical_value: (50 + i * 10) * 5000
		}))
	},
	{
		id: '3',
		entry_number: 'PSE/2026/0003',
		schedule: 'Stok Opname Kuartalan',
		store_id: 'store-gudang',
		store_name: 'GUDANG',
		from_date: '2026-01-01',
		to_date: '2026-03-31',
		entry_date: '2026-03-05',
		ref_no: 'REF-SO-003',
		status: 'Belum Dimulai',
		verified_by: 'Ahmad Fauzi',
		remarks: '',
		total_items: 2,
		created_at: '2026-03-05T10:00:00Z',
		created_by: 'Ahmad Fauzi',
		items: scheduleItems['Stok Opname Kuartalan'].map((item, i) => ({
			...item,
			physical_stock: 20 + i * 5,
			physical_value: (20 + i * 5) * 150000
		}))
	},
	{
		id: '4',
		entry_number: 'PSE/2026/0004',
		schedule: 'Stok Opname Bulanan',
		store_id: 'store-gudang',
		store_name: 'GUDANG',
		from_date: '2026-04-01',
		to_date: '2026-04-30',
		entry_date: '2026-04-20',
		ref_no: 'REF-SO-004',
		status: 'Ditangguhkan',
		verified_by: 'Dewi Rahayu',
		remarks: 'Ditangguhkan karena ada perbaikan sistem',
		total_items: 1,
		created_at: '2026-04-20T11:00:00Z',
		created_by: 'Dewi Rahayu',
		items: scheduleItems['Stok Opname Bulanan'].map((item) => ({
			...item,
			physical_stock: 79,
			physical_value: 79 * 18987
		}))
	},
	{
		id: '5',
		entry_number: 'PSE/2026/0005',
		schedule: 'Stok Opname Tahunan',
		store_id: 'store-gudang',
		store_name: 'GUDANG',
		from_date: '2025-01-01',
		to_date: '2025-12-31',
		entry_date: '2025-12-28',
		ref_no: 'REF-SO-005',
		status: 'Verifikasi Selesai',
		verified_by: 'Budi Santoso',
		remarks: 'Stok opname tahunan periode 2025',
		total_items: 12,
		created_at: '2025-12-28T08:30:00Z',
		created_by: 'Budi Santoso',
		items: scheduleItems['Stok Opname Tahunan'].map((item, i) => ({
			...item,
			physical_stock: 8 + i,
			physical_value: (8 + i) * 45000
		}))
	}
];

// Add new physical stocktake to mock data
export function addMockPhysicalStocktake(payload: PhysicalStocktakeCreatePayload) {
	const newEntry: PhysicalStocktake & { items: StocktakeItem[] } = {
		id: `${mockPhysicalStocktakes.length + 1}`,
		entry_number: `PSE/2026/${String(mockPhysicalStocktakes.length + 1).padStart(4, '0')}`,
		schedule: payload.schedule,
		store_id: payload.store_id,
		store_name: 'GUDANG',
		from_date: payload.from_date || '',
		to_date: payload.to_date || '',
		entry_date: payload.entry_date,
		ref_no: payload.ref_no || '',
		status: payload.status,
		verified_by: payload.verified_by,
		remarks: payload.remarks || '',
		total_items: payload.items.length,
		created_at: new Date().toISOString(),
		created_by: payload.verified_by,
		items: payload.items
	};

	mockPhysicalStocktakes.unshift(newEntry);
	console.log('Added new mock physical stocktake:', newEntry);
	return newEntry;
}

export function getMockPhysicalStocktakes(
	page: number = 1,
	size: number = 10,
	search?: string
): PhysicalStocktakeListResponse {
	let filtered = [...mockPhysicalStocktakes];

	if (search) {
		const searchLower = search.toLowerCase();
		filtered = filtered.filter(
			(item) =>
				item.entry_number.toLowerCase().includes(searchLower) ||
				item.schedule.toLowerCase().includes(searchLower) ||
				item.status.toLowerCase().includes(searchLower) ||
				item.verified_by.toLowerCase().includes(searchLower)
		);
	}

	// Sort by entry_date descending
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

export function getMockPhysicalStocktakeDetail(id: string): PhysicalStocktakeDetailResponse {
	const entry = mockPhysicalStocktakes.find((item) => item.id === id);

	if (!entry) {
		throw new Error('Entri stok opname tidak ditemukan');
	}

	return { data: entry };
}
