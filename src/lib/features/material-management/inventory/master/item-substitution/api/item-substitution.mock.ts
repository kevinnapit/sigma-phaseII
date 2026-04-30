import type {
	ItemSubstitution,
	ItemSubstitutionListParams,
	ItemSubstitutionListResponse,
	ItemSubstitutionDetailResponse
} from '../types/item-substitution.types';

/**
 * Mock data untuk Substitusi Barang
 */
const mockItemSubstitutions: ItemSubstitution[] = [
	{
		id: 'sub-s0000',
		substitution_id: 'S0000',
		description: 'TEST SUBSTITUSI',
		status: 'Aktif',
		created_by: 'DUAONS',
		updated_by: 'DUAONS',
		created_at: '2026-04-21',
		updated_at: '2026-04-21',
		items: [
			{
				item_code: '7000000',
				item_name: 'AGRAL 250MG @1L/KLG',
				status: 'Aktif',
				created_by: 'DUAONS',
				created_at: '2026-04-21',
				updated_by: 'DUAONS',
				updated_at: '2026-04-21'
			},
			{
				item_code: '7000001',
				item_name: 'AGREPT 20 W',
				status: 'Aktif',
				created_by: 'DUAONS',
				created_at: '2026-04-21',
				updated_by: 'DUAONS',
				updated_at: '2026-04-21'
			},
			{
				item_code: '7000004',
				item_name: 'INOSITOL " MERCK-4728 "',
				status: 'Aktif',
				created_by: 'DUAONS',
				created_at: '2026-04-21',
				updated_by: 'DUAONS',
				updated_at: '2026-04-21'
			},
			{
				item_code: '7000005',
				item_name: 'LILIN PUTIH (PARAFIN WAX)',
				status: 'Aktif',
				created_by: 'DUAONS',
				created_at: '2026-04-21',
				updated_by: 'DUAONS',
				updated_at: '2026-04-21'
			},
			{
				item_code: '7000006',
				item_name: 'MAYZENA POWDER',
				status: 'Aktif',
				created_by: 'DUAONS',
				created_at: '2026-04-21',
				updated_by: 'DUAONS',
				updated_at: '2026-04-21'
			}
		]
	},
	{
		id: 'sub-sub002',
		substitution_id: 'SUB002',
		description: '',
		status: 'Aktif',
		created_by: 'DUAONS',
		updated_by: 'DUAONS',
		created_at: '2026-04-07',
		updated_at: '2026-04-07',
		items: [
			{
				item_code: '7001001',
				item_name: 'PUPUK UREA 46%',
				status: 'Aktif',
				created_by: 'DUAONS',
				created_at: '2026-04-07',
				updated_by: 'DUAONS',
				updated_at: '2026-04-07'
			},
			{
				item_code: '7001002',
				item_name: 'PUPUK NPK 15-15-15',
				status: 'Aktif',
				created_by: 'DUAONS',
				created_at: '2026-04-07',
				updated_by: 'DUAONS',
				updated_at: '2026-04-07'
			}
		]
	},
	{
		id: 'sub-sub001',
		substitution_id: 'SUB001',
		description: 'TEST SUB',
		status: 'Aktif',
		created_by: 'DUAONS',
		updated_by: 'DUAONS',
		created_at: '2026-04-07',
		updated_at: '2026-04-07',
		items: [
			{
				item_code: '7002001',
				item_name: 'OLI MESIN SAE 40',
				status: 'Aktif',
				created_by: 'DUAONS',
				created_at: '2026-04-07',
				updated_by: 'DUAONS',
				updated_at: '2026-04-07'
			},
			{
				item_code: '7002002',
				item_name: 'OLI MESIN SAE 20W-50',
				status: 'Aktif',
				created_by: 'DUAONS',
				created_at: '2026-04-07',
				updated_by: 'DUAONS',
				updated_at: '2026-04-07'
			},
			{
				item_code: '7002003',
				item_name: 'OLI MESIN SHELL HELIX 10W-40',
				status: 'Aktif',
				created_by: 'DUAONS',
				created_at: '2026-04-07',
				updated_by: 'DUAONS',
				updated_at: '2026-04-07'
			}
		]
	},
	{
		id: 'sub-sub003',
		substitution_id: 'SUB003',
		description: 'SUBSTITUSI PUPUK',
		status: 'Aktif',
		created_by: 'ADMIN',
		updated_by: 'ADMIN',
		created_at: '2026-03-15',
		updated_at: '2026-03-15',
		items: [
			{
				item_code: '7003001',
				item_name: 'PUPUK KCL STANDAR',
				status: 'Aktif',
				created_by: 'ADMIN',
				created_at: '2026-03-15',
				updated_by: 'ADMIN',
				updated_at: '2026-03-15'
			},
			{
				item_code: '7003002',
				item_name: 'PUPUK MOP GRANUL',
				status: 'Aktif',
				created_by: 'ADMIN',
				created_at: '2026-03-15',
				updated_by: 'ADMIN',
				updated_at: '2026-03-15'
			}
		]
	},
	{
		id: 'sub-sub004',
		substitution_id: 'SUB004',
		description: 'SUBSTITUSI OBAT',
		status: 'Tidak Aktif',
		created_by: 'ADMIN',
		updated_by: 'ADMIN',
		created_at: '2026-02-20',
		updated_at: '2026-02-20',
		items: [
			{
				item_code: '7004001',
				item_name: 'HERBISIDA ROUNDUP 486 SL',
				status: 'Aktif',
				created_by: 'ADMIN',
				created_at: '2026-02-20',
				updated_by: 'ADMIN',
				updated_at: '2026-02-20'
			}
		]
	}
];

/**
 * Fungsi untuk mendapatkan daftar substitusi barang dengan paginasi
 */
export function getMockItemSubstitutions(
	page: number,
	size: number,
	search?: string
): ItemSubstitutionListResponse {
	let filtered = [...mockItemSubstitutions];

	// Terapkan filter pencarian
	if (search) {
		const searchLower = search.toLowerCase();
		filtered = filtered.filter(
			(item) =>
				item.substitution_id.toLowerCase().includes(searchLower) ||
				item.description.toLowerCase().includes(searchLower)
		);
	}

	// Terapkan paginasi
	const startIndex = (page - 1) * size;
	const endIndex = startIndex + size;
	const paginatedItems = filtered.slice(startIndex, endIndex);

	return {
		data: paginatedItems,
		pagination: {
			page,
			size,
			total_item: filtered.length,
			total_page: Math.ceil(filtered.length / size)
		}
	};
}

/**
 * Fungsi untuk mendapatkan detail substitusi barang berdasarkan ID
 */
export function getMockItemSubstitutionDetail(id: string): ItemSubstitutionDetailResponse {
	const item = mockItemSubstitutions.find((s) => s.id === id);

	if (!item) {
		throw new Error(`Substitusi barang dengan id ${id} tidak ditemukan`);
	}

	return { data: item };
}
