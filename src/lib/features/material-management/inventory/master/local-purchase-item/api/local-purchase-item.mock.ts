import type {
	LocalPurchaseItem,
	LocalPurchaseItemListResponse,
	LocalPurchaseItemDetailResponse,
	LocalPurchaseItemListParams,
	LocalPurchaseItemStatsResponse
} from '../types/local-purchase-item.types';

/**
 * Mock data for Local Purchase Items (from screenshot)
 */
const mockLocalPurchaseItems: LocalPurchaseItem[] = [
	{
		id: '1',
		uoid: 'lpi-001',
		code: '7073789',
		name: "KUNCI TANAM L. 3/8\"",
		short_name: "KUNCI TANAM L. 3/8\"",
		is_field_item: true,
		decision: 'Diizinkan',
		status: 'Aktif',
		item_class: {
			code: 'IC001',
			name: 'Tools',
			uoid: 'ic-001'
		},
		base_uom: {
			code: 'PCS',
			name: 'Pieces',
			uoid: 'uom-001'
		},
		synced_at: '2024-01-20T10:30:00Z',
		last_modified_time: '2024-01-20T10:30:00Z'
	},
	{
		id: '2',
		uoid: 'lpi-002',
		code: '7073787',
		name: 'DRUM AIR WARNA BIRU CAPNOD LTR',
		short_name: 'DRUM AIR WARNA BIRU',
		is_field_item: true,
		decision: 'Diizinkan',
		status: 'Aktif',
		item_class: {
			code: 'IC002',
			name: 'Container',
			uoid: 'ic-002'
		},
		base_uom: {
			code: 'PCS',
			name: 'Pieces',
			uoid: 'uom-001'
		},
		synced_at: '2024-01-20T10:30:00Z',
		last_modified_time: '2024-01-20T10:30:00Z'
	},
	{
		id: '3',
		uoid: 'lpi-003',
		code: '7073786',
		name: 'TANGKI AIR STAINLESS STEEL CAP 1000 LTR',
		short_name: 'TANGKI AIR SS 1000L',
		is_field_item: true,
		decision: 'Diizinkan',
		status: 'Aktif',
		item_class: {
			code: 'IC002',
			name: 'Container',
			uoid: 'ic-002'
		},
		base_uom: {
			code: 'PCS',
			name: 'Pieces',
			uoid: 'uom-001'
		},
		synced_at: '2024-01-20T10:30:00Z',
		last_modified_time: '2024-01-20T10:30:00Z'
	},
	{
		id: '4',
		uoid: 'lpi-004',
		code: '7070398',
		name: 'SLIDE STOP PVC 1"',
		short_name: 'SLIDE STOP PVC 1"',
		is_field_item: true,
		decision: 'Diizinkan',
		status: 'Aktif',
		item_class: {
			code: 'IC003',
			name: 'Plumbing',
			uoid: 'ic-003'
		},
		base_uom: {
			code: 'PCS',
			name: 'Pieces',
			uoid: 'uom-001'
		},
		synced_at: '2024-01-20T10:30:00Z',
		last_modified_time: '2024-01-20T10:30:00Z'
	},
	{
		id: '5',
		uoid: 'lpi-005',
		code: '7062740',
		name: 'POMPA AIR SHIMIZU SEMI JET 400BIT',
		short_name: 'POMPA AIR SHIMIZU 400BIT',
		is_field_item: true,
		decision: 'Diizinkan',
		status: 'Aktif',
		item_class: {
			code: 'IC004',
			name: 'Machinery',
			uoid: 'ic-004'
		},
		base_uom: {
			code: 'UNIT',
			name: 'Unit',
			uoid: 'uom-002'
		},
		synced_at: '2024-01-20T10:30:00Z',
		last_modified_time: '2024-01-20T10:30:00Z'
	},
	{
		id: '6',
		uoid: 'lpi-006',
		code: '7050332',
		name: 'ELBOW PVC 1" RUCIKA',
		short_name: 'ELBOW PVC 1" RUCIKA',
		is_field_item: true,
		decision: 'Diizinkan',
		status: 'Aktif',
		item_class: {
			code: 'IC003',
			name: 'Plumbing',
			uoid: 'ic-003'
		},
		base_uom: {
			code: 'PCS',
			name: 'Pieces',
			uoid: 'uom-001'
		},
		synced_at: '2024-01-20T10:30:00Z',
		last_modified_time: '2024-01-20T10:30:00Z'
	},
	{
		id: '7',
		uoid: 'lpi-007',
		code: '7049711',
		name: 'CORONG PLASTIC 12"',
		short_name: 'CORONG PLASTIC 12"',
		is_field_item: true,
		decision: 'Diizinkan',
		status: 'Aktif',
		item_class: {
			code: 'IC005',
			name: 'General Supplies',
			uoid: 'ic-005'
		},
		base_uom: {
			code: 'PCS',
			name: 'Pieces',
			uoid: 'uom-001'
		},
		synced_at: '2024-01-20T10:30:00Z',
		last_modified_time: '2024-01-20T10:30:00Z'
	},
	{
		id: '8',
		uoid: 'lpi-008',
		code: '7049660',
		name: 'BAHAN BAKAR MINYAK PERTALITE',
		short_name: 'BBM PERTALITE',
		is_field_item: true,
		decision: 'Diizinkan',
		status: 'Aktif',
		item_class: {
			code: 'IC006',
			name: 'Fuel',
			uoid: 'ic-006'
		},
		base_uom: {
			code: 'LTR',
			name: 'Liter',
			uoid: 'uom-003'
		},
		synced_at: '2024-01-20T10:30:00Z',
		last_modified_time: '2024-01-20T10:30:00Z'
	},
	{
		id: '9',
		uoid: 'lpi-009',
		code: '7049489',
		name: 'VAPE ONE PUSH 10ML',
		short_name: 'VAPE ONE PUSH 10ML',
		is_field_item: false,
		decision: 'Diizinkan',
		status: 'Aktif',
		item_class: {
			code: 'IC005',
			name: 'General Supplies',
			uoid: 'ic-005'
		},
		base_uom: {
			code: 'PCS',
			name: 'Pieces',
			uoid: 'uom-001'
		},
		synced_at: '2024-01-20T10:30:00Z',
		last_modified_time: '2024-01-20T10:30:00Z'
	},
	{
		id: '10',
		uoid: 'lpi-010',
		code: '7048610',
		name: 'TINTA PRINTER EPSON M100 HITAM T7741',
		short_name: 'TINTA EPSON M100 T7741',
		is_field_item: false,
		decision: 'Diizinkan',
		status: 'Aktif',
		item_class: {
			code: 'IC007',
			name: 'Office Supplies',
			uoid: 'ic-007'
		},
		base_uom: {
			code: 'PCS',
			name: 'Pieces',
			uoid: 'uom-001'
		},
		synced_at: '2024-01-20T10:30:00Z',
		last_modified_time: '2024-01-20T10:30:00Z'
	}
];

/**
 * Mock API for Local Purchase Items
 */
export const localPurchaseItemMockApi = {
	/**
	 * Get all local purchase items with pagination
	 */
	getLocalPurchaseItems: async (
		params: LocalPurchaseItemListParams
	): Promise<LocalPurchaseItemListResponse> => {
		// Simulate network delay
		await new Promise((resolve) => setTimeout(resolve, 500));

		let filteredItems = [...mockLocalPurchaseItems];

		// Apply search filter
		if (params.search) {
			const searchLower = params.search.toLowerCase();
			filteredItems = filteredItems.filter(
				(item) =>
					item.code.toLowerCase().includes(searchLower) ||
					item.name.toLowerCase().includes(searchLower)
			);
		}

		// Apply field item filter
		if (params.is_field_item !== undefined) {
			filteredItems = filteredItems.filter((item) => item.is_field_item === params.is_field_item);
		}

		// Apply decision filter
		if (params.decision) {
			filteredItems = filteredItems.filter((item) => item.decision === params.decision);
		}

		// Apply sorting
		if (params.order_by) {
			filteredItems.sort((a, b) => {
				const aValue = a[params.order_by!];
				const bValue = b[params.order_by!];
				const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
				return params.sort === 'desc' ? -comparison : comparison;
			});
		}

		// Apply pagination
		const startIndex = (params.page - 1) * params.size;
		const endIndex = startIndex + params.size;
		const paginatedItems = filteredItems.slice(startIndex, endIndex);

		return {
			$schema: 'local-purchase-item-list-response',
			data: paginatedItems,
			pagination: {
				page: params.page,
				size: params.size,
				total_item: filteredItems.length,
				total_page: Math.ceil(filteredItems.length / params.size)
			}
		};
	},

	/**
	 * Get local purchase item detail by ID
	 */
	getLocalPurchaseItemDetail: async (uoid: string): Promise<LocalPurchaseItemDetailResponse> => {
		// Simulate network delay
		await new Promise((resolve) => setTimeout(resolve, 300));

		const item = mockLocalPurchaseItems.find((item) => item.uoid === uoid);

		if (!item) {
			throw new Error(`Local purchase item with uoid ${uoid} not found`);
		}

		return {
			$schema: 'local-purchase-item-detail-response',
			data: item
		};
	},

	/**
	 * Get local purchase item statistics
	 */
	getLocalPurchaseItemStats: async (): Promise<LocalPurchaseItemStatsResponse> => {
		// Simulate network delay
		await new Promise((resolve) => setTimeout(resolve, 300));

		const stats = {
			total_items: mockLocalPurchaseItems.length,
			approved_items: mockLocalPurchaseItems.filter((item) => item.decision === 'Diizinkan')
				.length,
			field_items: mockLocalPurchaseItems.filter((item) => item.is_field_item).length,
			non_field_items: mockLocalPurchaseItems.filter((item) => !item.is_field_item).length
		};

		return {
			$schema: 'local-purchase-item-stats-response',
			data: stats
		};
	}
};
