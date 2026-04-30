import type {
	ItemComprehensiveData,
	ItemComprehensiveListResponse,
	ItemListParams,
	UOM,
	ItemClass,
	ItemClassVRL,
	ItemVRL
} from '../types/item.types';

/**
 * Mock UOMs
 */
const mockUOMs: UOM[] = [
	{ uoid: 'uom-1', code: 'KG', name: 'Kilogram' },
	{ uoid: 'uom-2', code: 'LTR', name: 'Liter' },
	{ uoid: 'uom-3', code: 'PCS', name: 'Pieces' },
	{ uoid: 'uom-4', code: 'BOX', name: 'Box' },
	{ uoid: 'uom-5', code: 'UNIT', name: 'Unit' },
	{ uoid: 'uom-6', code: 'BTL', name: 'Bottle' },
	{ uoid: 'uom-7', code: 'PACK', name: 'Pack' },
	{ uoid: 'uom-8', code: 'ROLL', name: 'Roll' }
];

/**
 * Mock Item Classes
 */
const mockItemClasses: ItemClass[] = [
	{ uoid: 'ic-1', code: 'FRT', name: 'Fertilizer', short_name: 'Fertilizer' },
	{ uoid: 'ic-2', code: 'ATK', name: 'Office Supplies', short_name: 'ATK' },
	{ uoid: 'ic-3', code: 'CLN', name: 'Cleaning Supplies', short_name: 'Cleaning' },
	{ uoid: 'ic-4', code: 'STA', name: 'Stationery', short_name: 'Stationery' },
	{ uoid: 'ic-5', code: 'OFF', name: 'Office Equipment', short_name: 'Office' },
	{ uoid: 'ic-6', code: 'BEV', name: 'Beverage', short_name: 'Beverage' }
];

/**
 * Mock Item Class VRL
 */
const mockItemClassVRL: ItemClassVRL = {
	is_expiry_info_required: false,
	is_stock_storage_location_wise: true,
	is_technical_specification_required: false,
	movement_criteria: 'FIFO',
	sanctioned_by: 'Manager',
	stock_issue_general_allocation: 'General',
	uoid: 'vrl-1'
};

/**
 * Mock Item VRL
 */
const mockItemVRL: ItemVRL = {
	is_batch_required: false,
	is_expiry_date_required: false,
	is_manufacturing_date_required: false,
	is_non_stock_item: false,
	is_purchase_limit_required: false,
	is_stock_storage_location_wise: true,
	lead_time_external: 7,
	lead_time_internal: 3,
	uoid: 'vrl-item-1'
};

/**
 * Mock Items Data
 */
const mockItems: ItemComprehensiveData[] = [
	// Fertilizer
	{
		uoid: 'item-001',
		id: 'item-001',
		code: 'FRT-001',
		name: 'Pupuk Urea',
		short_name: 'Urea',
		base_uom: mockUOMs[0], // KG
		business_location_id: 'estate-1',
		conversion_uom_count: 0,
		conversions: [],
		i_version: 1,
		issue_rate: 15000,
		item_class: mockItemClasses[0],
		item_class_vrl: mockItemClassVRL,
		item_vrl: mockItemVRL,
		item_usage_count: 0,
		last_modified_time: '2024-04-20T08:00:00Z',
		manufactures: [],
		substitute_item_count: 0,
		substitutes: [],
		uom_links: [],
		usages: [],
		last_transaction: {
			transaction_date: '2024-04-15',
			days_since_transaction: '5'
		},
		item_stock: {
			store_count: 2,
			total_current_stock: 650,
			total_reserved_stock: 100,
			total_value: 9750000
		}
	},
	// Office Supplies - Tissue
	{
		uoid: 'item-002',
		id: 'item-002',
		code: 'ATK-001',
		name: 'Tissue Kotak',
		short_name: 'Tissue',
		base_uom: mockUOMs[3], // BOX
		business_location_id: 'estate-1',
		conversion_uom_count: 0,
		conversions: [],
		i_version: 1,
		issue_rate: 14500,
		item_class: mockItemClasses[1],
		item_class_vrl: mockItemClassVRL,
		item_vrl: mockItemVRL,
		item_usage_count: 0,
		last_modified_time: '2024-04-20T08:00:00Z',
		manufactures: [],
		substitute_item_count: 0,
		substitutes: [],
		uom_links: [],
		usages: [],
		last_transaction: {
			transaction_date: '2024-04-18',
			days_since_transaction: '2'
		},
		item_stock: {
			store_count: 1,
			total_current_stock: 25,
			total_reserved_stock: 5,
			total_value: 375000
		}
	},
	// Office Supplies - Sugar
	{
		uoid: 'item-003',
		id: 'item-003',
		code: 'ATK-002',
		name: 'Gula Pasir',
		short_name: 'Gula',
		base_uom: mockUOMs[0], // KG
		business_location_id: 'estate-1',
		conversion_uom_count: 0,
		conversions: [],
		i_version: 1,
		issue_rate: 17500,
		item_class: mockItemClasses[1],
		item_class_vrl: mockItemClassVRL,
		item_vrl: mockItemVRL,
		item_usage_count: 0,
		last_modified_time: '2024-04-20T08:00:00Z',
		manufactures: [],
		substitute_item_count: 0,
		substitutes: [],
		uom_links: [],
		usages: [],
		last_transaction: {
			transaction_date: '2024-04-17',
			days_since_transaction: '3'
		},
		item_stock: {
			store_count: 1,
			total_current_stock: 12,
			total_reserved_stock: 2,
			total_value: 210000
		}
	},
	// Office Supplies - Coffee
	{
		uoid: 'item-004',
		id: 'item-004',
		code: 'ATK-003',
		name: 'Kopi Sachet',
		short_name: 'Kopi',
		base_uom: mockUOMs[3], // BOX
		business_location_id: 'estate-1',
		conversion_uom_count: 0,
		conversions: [],
		i_version: 1,
		issue_rate: 45000,
		item_class: mockItemClasses[1],
		item_class_vrl: mockItemClassVRL,
		item_vrl: mockItemVRL,
		item_usage_count: 0,
		last_modified_time: '2024-04-20T08:00:00Z',
		manufactures: [],
		substitute_item_count: 0,
		substitutes: [],
		uom_links: [],
		usages: [],
		last_transaction: {
			transaction_date: '2024-04-16',
			days_since_transaction: '4'
		},
		item_stock: {
			store_count: 1,
			total_current_stock: 8,
			total_reserved_stock: 2,
			total_value: 360000
		}
	},
	// Office Supplies - Tea
	{
		uoid: 'item-005',
		id: 'item-005',
		code: 'ATK-004',
		name: 'Teh Celup',
		short_name: 'Teh',
		base_uom: mockUOMs[3], // BOX
		business_location_id: 'estate-1',
		conversion_uom_count: 0,
		conversions: [],
		i_version: 1,
		issue_rate: 15000,
		item_class: mockItemClasses[1],
		item_class_vrl: mockItemClassVRL,
		item_vrl: mockItemVRL,
		item_usage_count: 0,
		last_modified_time: '2024-04-20T08:00:00Z',
		manufactures: [],
		substitute_item_count: 0,
		substitutes: [],
		uom_links: [],
		usages: [],
		last_transaction: {
			transaction_date: '2024-04-19',
			days_since_transaction: '1'
		},
		item_stock: {
			store_count: 1,
			total_current_stock: 15,
			total_reserved_stock: 3,
			total_value: 225000
		}
	},
	// Office Supplies - Water
	{
		uoid: 'item-006',
		id: 'item-006',
		code: 'ATK-005',
		name: 'Air Mineral Galon',
		short_name: 'Air Galon',
		base_uom: mockUOMs[4], // UNIT
		business_location_id: 'estate-1',
		conversion_uom_count: 0,
		conversions: [],
		i_version: 1,
		issue_rate: 18000,
		item_class: mockItemClasses[1],
		item_class_vrl: mockItemClassVRL,
		item_vrl: mockItemVRL,
		item_usage_count: 0,
		last_modified_time: '2024-04-20T08:00:00Z',
		manufactures: [],
		substitute_item_count: 0,
		substitutes: [],
		uom_links: [],
		usages: [],
		last_transaction: {
			transaction_date: '2024-04-18',
			days_since_transaction: '2'
		},
		item_stock: {
			store_count: 1,
			total_current_stock: 20,
			total_reserved_stock: 5,
			total_value: 360000
		}
	},
	// Cleaning Supplies - Hand Soap
	{
		uoid: 'item-007',
		id: 'item-007',
		code: 'CLN-001',
		name: 'Sabun Cuci Tangan',
		short_name: 'Sabun',
		base_uom: mockUOMs[2], // PCS
		business_location_id: 'estate-1',
		conversion_uom_count: 0,
		conversions: [],
		i_version: 1,
		issue_rate: 25000,
		item_class: mockItemClasses[2],
		item_class_vrl: mockItemClassVRL,
		item_vrl: mockItemVRL,
		item_usage_count: 0,
		last_modified_time: '2024-04-20T08:00:00Z',
		manufactures: [],
		substitute_item_count: 0,
		substitutes: [],
		uom_links: [],
		usages: [],
		last_transaction: {
			transaction_date: '2024-04-15',
			days_since_transaction: '5'
		},
		item_stock: {
			store_count: 1,
			total_current_stock: 8,
			total_reserved_stock: 2,
			total_value: 200000
		}
	},
	// Cleaning Supplies - Floor Cleaner
	{
		uoid: 'item-008',
		id: 'item-008',
		code: 'CLN-002',
		name: 'Pembersih Lantai',
		short_name: 'Pembersih',
		base_uom: mockUOMs[1], // LTR
		business_location_id: 'estate-1',
		conversion_uom_count: 0,
		conversions: [],
		i_version: 1,
		issue_rate: 35000,
		item_class: mockItemClasses[2],
		item_class_vrl: mockItemClassVRL,
		item_vrl: mockItemVRL,
		item_usage_count: 0,
		last_modified_time: '2024-04-20T08:00:00Z',
		manufactures: [],
		substitute_item_count: 0,
		substitutes: [],
		uom_links: [],
		usages: [],
		last_transaction: {
			transaction_date: '2024-04-16',
			days_since_transaction: '4'
		},
		item_stock: {
			store_count: 1,
			total_current_stock: 10,
			total_reserved_stock: 2,
			total_value: 350000
		}
	},
	// Cleaning Supplies - Air Freshener
	{
		uoid: 'item-009',
		id: 'item-009',
		code: 'CLN-003',
		name: 'Pengharum Ruangan',
		short_name: 'Pengharum',
		base_uom: mockUOMs[2], // PCS
		business_location_id: 'estate-1',
		conversion_uom_count: 0,
		conversions: [],
		i_version: 1,
		issue_rate: 45000,
		item_class: mockItemClasses[2],
		item_class_vrl: mockItemClassVRL,
		item_vrl: mockItemVRL,
		item_usage_count: 0,
		last_modified_time: '2024-04-20T08:00:00Z',
		manufactures: [],
		substitute_item_count: 0,
		substitutes: [],
		uom_links: [],
		usages: [],
		last_transaction: {
			transaction_date: '2024-04-17',
			days_since_transaction: '3'
		},
		item_stock: {
			store_count: 1,
			total_current_stock: 12,
			total_reserved_stock: 3,
			total_value: 540000
		}
	},
	// Stationery - A4 Paper
	{
		uoid: 'item-010',
		id: 'item-010',
		code: 'STA-001',
		name: 'Kertas A4 80 gram',
		short_name: 'Kertas A4',
		base_uom: mockUOMs[3], // BOX
		business_location_id: 'estate-1',
		conversion_uom_count: 0,
		conversions: [],
		i_version: 1,
		issue_rate: 45000,
		item_class: mockItemClasses[3],
		item_class_vrl: mockItemClassVRL,
		item_vrl: mockItemVRL,
		item_usage_count: 0,
		last_modified_time: '2024-04-20T08:00:00Z',
		manufactures: [],
		substitute_item_count: 0,
		substitutes: [],
		uom_links: [],
		usages: [],
		last_transaction: {
			transaction_date: '2024-04-18',
			days_since_transaction: '2'
		},
		item_stock: {
			store_count: 1,
			total_current_stock: 30,
			total_reserved_stock: 5,
			total_value: 1350000
		}
	},
	// Stationery - Pen
	{
		uoid: 'item-011',
		id: 'item-011',
		code: 'STA-002',
		name: 'Pulpen Hitam',
		short_name: 'Pulpen',
		base_uom: mockUOMs[3], // BOX
		business_location_id: 'estate-1',
		conversion_uom_count: 0,
		conversions: [],
		i_version: 1,
		issue_rate: 25000,
		item_class: mockItemClasses[3],
		item_class_vrl: mockItemClassVRL,
		item_vrl: mockItemVRL,
		item_usage_count: 0,
		last_modified_time: '2024-04-20T08:00:00Z',
		manufactures: [],
		substitute_item_count: 0,
		substitutes: [],
		uom_links: [],
		usages: [],
		last_transaction: {
			transaction_date: '2024-04-19',
			days_since_transaction: '1'
		},
		item_stock: {
			store_count: 1,
			total_current_stock: 50,
			total_reserved_stock: 10,
			total_value: 1250000
		}
	},
	// Beverage - Coffee Powder
	{
		uoid: 'item-012',
		id: 'item-012',
		code: 'BEV-001',
		name: 'Kopi Bubuk',
		short_name: 'Kopi Bubuk',
		base_uom: mockUOMs[0], // KG
		business_location_id: 'estate-1',
		conversion_uom_count: 0,
		conversions: [],
		i_version: 1,
		issue_rate: 85000,
		item_class: mockItemClasses[5],
		item_class_vrl: mockItemClassVRL,
		item_vrl: mockItemVRL,
		item_usage_count: 0,
		last_modified_time: '2024-04-20T08:00:00Z',
		manufactures: [],
		substitute_item_count: 0,
		substitutes: [],
		uom_links: [],
		usages: [],
		last_transaction: {
			transaction_date: '2024-04-16',
			days_since_transaction: '4'
		},
		item_stock: {
			store_count: 1,
			total_current_stock: 5,
			total_reserved_stock: 1,
			total_value: 425000
		}
	}
];

/**
 * Mock Item API
 */
export const itemMockApi = {
	/**
	 * Get all items with pagination and search
	 */
	getAllItems: async (params: ItemListParams): Promise<ItemComprehensiveListResponse> => {
		console.log('🔍 Mock API getAllItems called with params:', JSON.stringify(params, null, 2));
		await new Promise((resolve) => setTimeout(resolve, 500));

		let filteredItems = [...mockItems];
		console.log('📦 Total mock items:', mockItems.length);

		// Filter by search
		if (params.search) {
			const searchLower = params.search.toLowerCase();
			filteredItems = filteredItems.filter(
				(item) =>
					item.code.toLowerCase().includes(searchLower) ||
					item.name.toLowerCase().includes(searchLower) ||
					item.short_name.toLowerCase().includes(searchLower) ||
					item.item_class.code.toLowerCase().includes(searchLower)
			);
			console.log('🔎 After search filter:', filteredItems.length, 'items (search:', params.search, ')');
		}

		// Filter by item class
		if (params.item_class_id) {
			filteredItems = filteredItems.filter((item) => item.item_class.uoid === params.item_class_id);
			console.log('📂 After item_class filter:', filteredItems.length, 'items (class_id:', params.item_class_id, ')');
		}

		// Note: Other filters (is_active, is_critical, etc.) are ignored in mock
		// All mock items are considered active and available
		console.log('ℹ️ Ignoring filters:', {
			is_active: params.is_active,
			is_critical: params.is_critical,
			has_expiry: params.has_expiry,
			movement_status: params.movement_status,
			is_non_stock: params.is_non_stock,
			has_conversion: params.has_conversion
		});

		// Pagination
		const startIndex = (params.page - 1) * params.size;
		const endIndex = startIndex + params.size;
		const paginatedItems = filteredItems.slice(startIndex, endIndex);

		console.log('✅ Returning', paginatedItems.length, 'items (page', params.page, 'of', Math.ceil(filteredItems.length / params.size), ')');

		return {
			$schema: 'item-comprehensive-list-response',
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
	 * Get item statistics
	 */
	getItemStats: async () => {
		await new Promise((resolve) => setTimeout(resolve, 300));

		return {
			$schema: 'item-stats-response',
			data: {
				total_items: mockItems.length,
				items_with_expiry: 0,
				critical_items: 3, // Items with low stock
				fast_moving_items: 5, // Items with recent transactions
				slow_moving_items: 2 // Items with old transactions
			}
		};
	}
};
