// Mock data untuk Posting Akun Harian

import type {
	DailyAccountPostingHeader,
	DailyAccountPostingItem,
	DailyAccountPostingListResponse,
	DailyAccountPostingDetailResponse,
	DailyAccountPostingCreatePayload
} from '../types/daily-account-posting.types';

// ─── Seed items per header ────────────────────────────────────────────────────

const itemsMap: Record<string, DailyAccountPostingItem[]> = {
	'1': [
		{
			voucher_type: 'GRN',
			voucher_no: 'GRN/2026/0001',
			account_name: 'Persediaan Bahan Baku',
			debit_amount: 4500000,
			credit_amount: 0,
			purpose: 'Penerimaan barang pupuk urea dari supplier'
		},
		{
			voucher_type: 'GRN',
			voucher_no: 'GRN/2026/0001',
			account_name: 'Utang Dagang',
			debit_amount: 0,
			credit_amount: 4500000,
			purpose: 'Penerimaan barang pupuk urea dari supplier'
		},
		{
			voucher_type: 'Issue',
			voucher_no: 'Issue/2026/0045',
			account_name: 'Biaya Pemeliharaan Tanaman',
			debit_amount: 1250000,
			credit_amount: 0,
			purpose: 'Pengeluaran herbisida untuk pemeliharaan Afd I'
		},
		{
			voucher_type: 'Issue',
			voucher_no: 'Issue/2026/0045',
			account_name: 'Persediaan Bahan Pembantu',
			debit_amount: 0,
			credit_amount: 1250000,
			purpose: 'Pengeluaran herbisida untuk pemeliharaan Afd I'
		}
	],
	'2': [
		{
			voucher_type: 'PR',
			voucher_no: 'PR/2026/0112',
			account_name: 'Uang Muka Pembelian',
			debit_amount: 750000,
			credit_amount: 0,
			purpose: 'Permintaan pembelian alat pertanian'
		},
		{
			voucher_type: 'PR',
			voucher_no: 'PR/2026/0112',
			account_name: 'Kas dan Setara Kas',
			debit_amount: 0,
			credit_amount: 750000,
			purpose: 'Permintaan pembelian alat pertanian'
		},
		{
			voucher_type: 'LPO',
			voucher_no: 'LPO/2026/0033',
			account_name: 'Persediaan Suku Cadang',
			debit_amount: 3200000,
			credit_amount: 0,
			purpose: 'Pembelian lokal suku cadang mesin panen'
		},
		{
			voucher_type: 'LPO',
			voucher_no: 'LPO/2026/0033',
			account_name: 'Utang Pembelian Lokal',
			debit_amount: 0,
			credit_amount: 3200000,
			purpose: 'Pembelian lokal suku cadang mesin panen'
		},
		{
			voucher_type: 'IR',
			voucher_no: 'IR/2026/0008',
			account_name: 'Persediaan Bahan Pembantu',
			debit_amount: 480000,
			credit_amount: 0,
			purpose: 'Pengembalian barang sisa pemakaian ke gudang'
		},
		{
			voucher_type: 'IR',
			voucher_no: 'IR/2026/0008',
			account_name: 'Biaya Operasional Kebun',
			debit_amount: 0,
			credit_amount: 480000,
			purpose: 'Pengembalian barang sisa pemakaian ke gudang'
		}
	],
	'3': [
		{
			voucher_type: 'GRN',
			voucher_no: 'GRN/2026/0015',
			account_name: 'Persediaan Pupuk',
			debit_amount: 6750000,
			credit_amount: 0,
			purpose: 'Penerimaan pupuk NPK dari supplier'
		},
		{
			voucher_type: 'GRN',
			voucher_no: 'GRN/2026/0015',
			account_name: 'Utang Dagang',
			debit_amount: 0,
			credit_amount: 6750000,
			purpose: 'Penerimaan pupuk NPK dari supplier'
		},
		{
			voucher_type: 'Issue',
			voucher_no: 'Issue/2026/0060',
			account_name: 'Biaya Pemupukan',
			debit_amount: 2100000,
			credit_amount: 0,
			purpose: 'Pengeluaran pupuk untuk Afd II'
		},
		{
			voucher_type: 'Issue',
			voucher_no: 'Issue/2026/0060',
			account_name: 'Persediaan Pupuk',
			debit_amount: 0,
			credit_amount: 2100000,
			purpose: 'Pengeluaran pupuk untuk Afd II'
		}
	],
	'4': [
		{
			voucher_type: 'LPO',
			voucher_no: 'LPO/2026/0041',
			account_name: 'Persediaan Bahan Bakar',
			debit_amount: 5400000,
			credit_amount: 0,
			purpose: 'Pembelian solar untuk operasional alat berat'
		},
		{
			voucher_type: 'LPO',
			voucher_no: 'LPO/2026/0041',
			account_name: 'Utang Pembelian Lokal',
			debit_amount: 0,
			credit_amount: 5400000,
			purpose: 'Pembelian solar untuk operasional alat berat'
		},
		{
			voucher_type: 'IR',
			voucher_no: 'IR/2026/0019',
			account_name: 'Persediaan Suku Cadang',
			debit_amount: 890000,
			credit_amount: 0,
			purpose: 'Pengembalian suku cadang tidak terpakai'
		},
		{
			voucher_type: 'IR',
			voucher_no: 'IR/2026/0019',
			account_name: 'Biaya Pemeliharaan Mesin',
			debit_amount: 0,
			credit_amount: 890000,
			purpose: 'Pengembalian suku cadang tidak terpakai'
		},
		{
			voucher_type: 'PR',
			voucher_no: 'PR/2026/0145',
			account_name: 'Uang Muka Pembelian',
			debit_amount: 1200000,
			credit_amount: 0,
			purpose: 'Permintaan pembelian perlengkapan kantor'
		},
		{
			voucher_type: 'PR',
			voucher_no: 'PR/2026/0145',
			account_name: 'Kas dan Setara Kas',
			debit_amount: 0,
			credit_amount: 1200000,
			purpose: 'Permintaan pembelian perlengkapan kantor'
		}
	],
	'5': [
		{
			voucher_type: 'GRN',
			voucher_no: 'GRN/2026/0022',
			account_name: 'Persediaan Pestisida',
			debit_amount: 3300000,
			credit_amount: 0,
			purpose: 'Penerimaan pestisida dari supplier'
		},
		{
			voucher_type: 'GRN',
			voucher_no: 'GRN/2026/0022',
			account_name: 'Utang Dagang',
			debit_amount: 0,
			credit_amount: 3300000,
			purpose: 'Penerimaan pestisida dari supplier'
		},
		{
			voucher_type: 'Issue',
			voucher_no: 'Issue/2026/0078',
			account_name: 'Biaya Pengendalian Hama',
			debit_amount: 1650000,
			credit_amount: 0,
			purpose: 'Pengeluaran pestisida untuk Divisi 2'
		},
		{
			voucher_type: 'Issue',
			voucher_no: 'Issue/2026/0078',
			account_name: 'Persediaan Pestisida',
			debit_amount: 0,
			credit_amount: 1650000,
			purpose: 'Pengeluaran pestisida untuk Divisi 2'
		},
		{
			voucher_type: 'LPO',
			voucher_no: 'LPO/2026/0055',
			account_name: 'Persediaan Alat Tulis',
			debit_amount: 450000,
			credit_amount: 0,
			purpose: 'Pembelian lokal alat tulis kantor'
		},
		{
			voucher_type: 'LPO',
			voucher_no: 'LPO/2026/0055',
			account_name: 'Utang Pembelian Lokal',
			debit_amount: 0,
			credit_amount: 450000,
			purpose: 'Pembelian lokal alat tulis kantor'
		}
	]
};

// ─── Header records ───────────────────────────────────────────────────────────

export const mockDailyAccountPostings: (DailyAccountPostingHeader & {
	items: DailyAccountPostingItem[];
})[] = [
	{
		id: '1',
		posting_number: 'DAP/2026/0001',
		administrative_unit: 'Aek Loba',
		store: 'GUDANG',
		store_name: 'GUDANG',
		process_date: '2026-05-15',
		remarks: 'Posting akun harian Aek Loba',
		total_items: itemsMap['1'].length,
		total_debit: itemsMap['1'].reduce((s, i) => s + i.debit_amount, 0),
		total_credit: itemsMap['1'].reduce((s, i) => s + i.credit_amount, 0),
		created_at: '2026-05-15T08:00:00Z',
		created_by: 'Budi Santoso',
		items: itemsMap['1']
	},
	{
		id: '2',
		posting_number: 'DAP/2026/0002',
		administrative_unit: 'Afd I',
		store: 'GUDANG',
		store_name: 'GUDANG',
		process_date: '2026-05-14',
		remarks: 'Posting akun harian Afd I',
		total_items: itemsMap['2'].length,
		total_debit: itemsMap['2'].reduce((s, i) => s + i.debit_amount, 0),
		total_credit: itemsMap['2'].reduce((s, i) => s + i.credit_amount, 0),
		created_at: '2026-05-14T09:00:00Z',
		created_by: 'Siti Aminah',
		items: itemsMap['2']
	},
	{
		id: '3',
		posting_number: 'DAP/2026/0003',
		administrative_unit: 'Afd II',
		store: 'GUDANG',
		store_name: 'GUDANG',
		process_date: '2026-05-13',
		remarks: '',
		total_items: itemsMap['3'].length,
		total_debit: itemsMap['3'].reduce((s, i) => s + i.debit_amount, 0),
		total_credit: itemsMap['3'].reduce((s, i) => s + i.credit_amount, 0),
		created_at: '2026-05-13T10:00:00Z',
		created_by: 'Ahmad Fauzi',
		items: itemsMap['3']
	},
	{
		id: '4',
		posting_number: 'DAP/2026/0004',
		administrative_unit: 'Divisi 1',
		store: 'GUDANG',
		store_name: 'GUDANG',
		process_date: '2026-05-12',
		remarks: 'Posting rutin Divisi 1',
		total_items: itemsMap['4'].length,
		total_debit: itemsMap['4'].reduce((s, i) => s + i.debit_amount, 0),
		total_credit: itemsMap['4'].reduce((s, i) => s + i.credit_amount, 0),
		created_at: '2026-05-12T11:00:00Z',
		created_by: 'Dewi Rahayu',
		items: itemsMap['4']
	},
	{
		id: '5',
		posting_number: 'DAP/2026/0005',
		administrative_unit: 'Divisi 2',
		store: 'GUDANG',
		store_name: 'GUDANG',
		process_date: '2026-05-11',
		remarks: 'Posting akun harian Divisi 2',
		total_items: itemsMap['5'].length,
		total_debit: itemsMap['5'].reduce((s, i) => s + i.debit_amount, 0),
		total_credit: itemsMap['5'].reduce((s, i) => s + i.credit_amount, 0),
		created_at: '2026-05-11T08:30:00Z',
		created_by: 'Budi Santoso',
		items: itemsMap['5']
	}
];

// ─── Public API functions ─────────────────────────────────────────────────────

export function getMockDailyAccountPostings(
	page: number = 1,
	size: number = 10,
	search?: string
): DailyAccountPostingListResponse {
	let filtered = [...mockDailyAccountPostings];

	if (search) {
		const q = search.toLowerCase();
		filtered = filtered.filter(
			(item) =>
				item.posting_number.toLowerCase().includes(q) ||
				item.administrative_unit.toLowerCase().includes(q) ||
				item.store_name.toLowerCase().includes(q)
		);
	}

	// Sort by date descending
	filtered.sort(
		(a, b) => new Date(b.process_date).getTime() - new Date(a.process_date).getTime()
	);

	const total = filtered.length;
	const start = (page - 1) * size;
	const paginatedData = filtered.slice(start, start + size);

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

export function getMockDailyAccountPostingDetail(id: string): DailyAccountPostingDetailResponse {
	const record = mockDailyAccountPostings.find((item) => item.id === id);
	if (!record) {
		throw new Error('Daily account posting not found');
	}
	return { data: record };
}

export function addMockDailyAccountPosting(
	payload: DailyAccountPostingCreatePayload
): DailyAccountPostingHeader {
	const newId = String(mockDailyAccountPostings.length + 1);
	const newRecord: DailyAccountPostingHeader & { items: DailyAccountPostingItem[] } = {
		id: newId,
		posting_number: `DAP/2026/${String(mockDailyAccountPostings.length + 1).padStart(4, '0')}`,
		administrative_unit: payload.administrative_unit,
		store: payload.store,
		store_name: 'GUDANG',
		process_date: payload.process_date,
		remarks: payload.remarks || '',
		total_items: payload.items.length,
		total_debit: payload.items.reduce((s, i) => s + i.debit_amount, 0),
		total_credit: payload.items.reduce((s, i) => s + i.credit_amount, 0),
		created_at: new Date().toISOString(),
		created_by: 'Current User',
		items: payload.items
	};

	mockDailyAccountPostings.unshift(newRecord);
	console.log('Added new mock daily account posting:', newRecord);
	return newRecord;
}

/**
 * Generate mock items for a given administrative unit and process date.
 * Used by the create page to simulate loading posting data.
 */
export function generateMockItems(
	administrativeUnit: string,
	processDate: string
): DailyAccountPostingItem[] {
	// Deterministic seed based on unit + date so results are stable per combination
	const seed = (administrativeUnit + processDate).length % 3;

	const sets: DailyAccountPostingItem[][] = [
		[
			{
				voucher_type: 'GRN',
				voucher_no: 'GRN/2026/0099',
				account_name: 'Persediaan Bahan Baku',
				debit_amount: 3800000,
				credit_amount: 0,
				purpose: `Penerimaan barang untuk ${administrativeUnit}`
			},
			{
				voucher_type: 'GRN',
				voucher_no: 'GRN/2026/0099',
				account_name: 'Utang Dagang',
				debit_amount: 0,
				credit_amount: 3800000,
				purpose: `Penerimaan barang untuk ${administrativeUnit}`
			},
			{
				voucher_type: 'Issue',
				voucher_no: 'Issue/2026/0101',
				account_name: 'Biaya Operasional',
				debit_amount: 1500000,
				credit_amount: 0,
				purpose: `Pengeluaran barang ${administrativeUnit} tanggal ${processDate}`
			},
			{
				voucher_type: 'Issue',
				voucher_no: 'Issue/2026/0101',
				account_name: 'Persediaan Bahan Pembantu',
				debit_amount: 0,
				credit_amount: 1500000,
				purpose: `Pengeluaran barang ${administrativeUnit} tanggal ${processDate}`
			}
		],
		[
			{
				voucher_type: 'LPO',
				voucher_no: 'LPO/2026/0077',
				account_name: 'Persediaan Suku Cadang',
				debit_amount: 2700000,
				credit_amount: 0,
				purpose: `Pembelian lokal ${administrativeUnit}`
			},
			{
				voucher_type: 'LPO',
				voucher_no: 'LPO/2026/0077',
				account_name: 'Utang Pembelian Lokal',
				debit_amount: 0,
				credit_amount: 2700000,
				purpose: `Pembelian lokal ${administrativeUnit}`
			},
			{
				voucher_type: 'IR',
				voucher_no: 'IR/2026/0031',
				account_name: 'Persediaan Bahan Pembantu',
				debit_amount: 620000,
				credit_amount: 0,
				purpose: 'Pengembalian barang sisa pemakaian'
			},
			{
				voucher_type: 'IR',
				voucher_no: 'IR/2026/0031',
				account_name: 'Biaya Operasional Kebun',
				debit_amount: 0,
				credit_amount: 620000,
				purpose: 'Pengembalian barang sisa pemakaian'
			}
		],
		[
			{
				voucher_type: 'PR',
				voucher_no: 'PR/2026/0200',
				account_name: 'Uang Muka Pembelian',
				debit_amount: 900000,
				credit_amount: 0,
				purpose: `Permintaan pembelian ${administrativeUnit}`
			},
			{
				voucher_type: 'PR',
				voucher_no: 'PR/2026/0200',
				account_name: 'Kas dan Setara Kas',
				debit_amount: 0,
				credit_amount: 900000,
				purpose: `Permintaan pembelian ${administrativeUnit}`
			},
			{
				voucher_type: 'GRN',
				voucher_no: 'GRN/2026/0110',
				account_name: 'Persediaan Pupuk',
				debit_amount: 4200000,
				credit_amount: 0,
				purpose: 'Penerimaan pupuk dari supplier'
			},
			{
				voucher_type: 'GRN',
				voucher_no: 'GRN/2026/0110',
				account_name: 'Utang Dagang',
				debit_amount: 0,
				credit_amount: 4200000,
				purpose: 'Penerimaan pupuk dari supplier'
			}
		]
	];

	return sets[seed];
}
