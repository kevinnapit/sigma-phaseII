import type {
	ItemStorageLayout,
	ItemStorageLayoutListResponse,
	ItemStorageLayoutDetailResponse,
	ItemStorageLayoutListParams,
	ItemStorageLayoutStatsResponse,
	ItemStorageLayoutCreateRequest,
	ItemStorageLayoutUpdateRequest,
	ItemStorageLayoutCreateResponse,
	ItemStorageLayoutUpdateResponse,
	ItemStorageLayoutDeleteResponse,
	StorageLayoutCell
} from '../types/item-storage-layout.types';

/**
 * Helper function to generate cells based on rows and columns
 */
function generateCells(rows: number, columns: number): StorageLayoutCell[] {
	const cells: StorageLayoutCell[] = [];
	for (let r = 1; r <= rows; r++) {
		for (let c = 1; c <= columns; c++) {
			cells.push({
				row: r,
				column: c,
				cell_code: `R${r}C${c}`,
				is_occupied: false
			});
		}
	}
	return cells;
}

/**
 * Mock data for Item Storage Layouts
 */
const mockItemStorageLayouts: ItemStorageLayout[] = [
	{
		id: '1',
		uoid: 'isl-001',
		code: 'RAK001',
		name: 'RAK A 001',
		store: {
			id: 'store-1',
			uoid: 'store-001',
			code: 'GDG-01',
			name: 'GUDANG'
		},
		number_of_columns: 3,
		number_of_rows: 4,
		is_active: true,
		cells: generateCells(4, 3),
		created_at: '2024-01-15T10:00:00Z',
		updated_at: '2024-01-15T10:00:00Z',
		i_version: 1
	},
	{
		id: '2',
		uoid: 'isl-002',
		code: 'RAK002',
		name: 'RAK B 001',
		store: {
			id: 'store-1',
			uoid: 'store-001',
			code: 'GDG-01',
			name: 'GUDANG'
		},
		number_of_columns: 5,
		number_of_rows: 3,
		is_active: true,
		cells: generateCells(3, 5),
		created_at: '2024-01-16T10:00:00Z',
		updated_at: '2024-01-16T10:00:00Z',
		i_version: 1
	},
	{
		id: '3',
		uoid: 'isl-003',
		code: 'RAK003',
		name: 'RAK C 001',
		store: {
			id: 'store-2',
			uoid: 'store-002',
			code: 'GDG-02',
			name: 'GUDANG SPARE PART'
		},
		number_of_columns: 4,
		number_of_rows: 5,
		is_active: true,
		cells: generateCells(5, 4),
		created_at: '2024-01-17T10:00:00Z',
		updated_at: '2024-01-17T10:00:00Z',
		i_version: 1
	},
	{
		id: '4',
		uoid: 'isl-004',
		code: 'RAK004',
		name: 'RAK A 002',
		store: {
			id: 'store-1',
			uoid: 'store-001',
			code: 'GDG-01',
			name: 'GUDANG'
		},
		parent: {
			id: '1',
			uoid: 'isl-001',
			code: 'RAK001',
			name: 'RAK A 001'
		},
		number_of_columns: 3,
		number_of_rows: 4,
		is_active: true,
		cells: generateCells(4, 3),
		created_at: '2024-01-18T10:00:00Z',
		updated_at: '2024-01-18T10:00:00Z',
		i_version: 1
	},
	{
		id: '5',
		uoid: 'isl-005',
		code: 'RAK005',
		name: 'RAK D 001',
		store: {
			id: 'store-3',
			uoid: 'store-003',
			code: 'GDG-03',
			name: 'GUDANG BAHAN KIMIA'
		},
		number_of_columns: 2,
		number_of_rows: 6,
		is_active: false,
		cells: generateCells(6, 2),
		created_at: '2024-01-19T10:00:00Z',
		updated_at: '2024-01-19T10:00:00Z',
		i_version: 1
	}
];

let nextId = 6;

/**
 * Mock API for Item Storage Layouts
 */
export const itemStorageLayoutMockApi = {
	/**
	 * Get all item storage layouts with pagination
	 */
	getItemStorageLayouts: async (
		params: ItemStorageLayoutListParams
	): Promise<ItemStorageLayoutListResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		let filteredLayouts = [...mockItemStorageLayouts];

		if (params.search) {
			const searchLower = params.search.toLowerCase();
			filteredLayouts = filteredLayouts.filter(
				(layout) =>
					layout.code.toLowerCase().includes(searchLower) ||
					layout.name.toLowerCase().includes(searchLower) ||
					layout.store.name.toLowerCase().includes(searchLower)
			);
		}

		if (params.store_id) {
			filteredLayouts = filteredLayouts.filter((layout) => layout.store.id === params.store_id);
		}

		if (params.is_active !== undefined) {
			filteredLayouts = filteredLayouts.filter((layout) => layout.is_active === params.is_active);
		}

		if (params.order_by) {
			filteredLayouts.sort((a, b) => {
				const aValue = a[params.order_by!];
				const bValue = b[params.order_by!];
				const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
				return params.sort === 'desc' ? -comparison : comparison;
			});
		}

		const startIndex = (params.page - 1) * params.size;
		const endIndex = startIndex + params.size;
		const paginatedLayouts = filteredLayouts.slice(startIndex, endIndex);

		return {
			$schema: 'item-storage-layout-list-response',
			data: paginatedLayouts,
			pagination: {
				page: params.page,
				size: params.size,
				total_item: filteredLayouts.length,
				total_page: Math.ceil(filteredLayouts.length / params.size)
			}
		};
	},

	/**
	 * Get item storage layout detail by ID
	 */
	getItemStorageLayoutDetail: async (uoid: string): Promise<ItemStorageLayoutDetailResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 300));

		const layout = mockItemStorageLayouts.find((layout) => layout.uoid === uoid);

		if (!layout) {
			throw new Error(`Item storage layout with uoid ${uoid} not found`);
		}

		return {
			$schema: 'item-storage-layout-detail-response',
			data: layout
		};
	},

	/**
	 * Create new item storage layout
	 */
	createItemStorageLayout: async (
		payload: ItemStorageLayoutCreateRequest
	): Promise<ItemStorageLayoutCreateResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		const newLayout: ItemStorageLayout = {
			id: nextId.toString(),
			uoid: `isl-${String(nextId).padStart(3, '0')}`,
			code: payload.code,
			name: payload.name,
			store: {
				id: payload.store_id,
				uoid: `store-${payload.store_id}`,
				code: 'GDG-01',
				name: 'GUDANG'
			},
			parent: payload.parent_id
				? mockItemStorageLayouts.find((l) => l.id === payload.parent_id)
					? {
							id: payload.parent_id,
							uoid: mockItemStorageLayouts.find((l) => l.id === payload.parent_id)!.uoid,
							code: mockItemStorageLayouts.find((l) => l.id === payload.parent_id)!.code,
							name: mockItemStorageLayouts.find((l) => l.id === payload.parent_id)!.name
						}
					: undefined
				: undefined,
			number_of_columns: payload.number_of_columns,
			number_of_rows: payload.number_of_rows,
			is_active: payload.is_active,
			cells: generateCells(payload.number_of_rows, payload.number_of_columns),
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			i_version: 1
		};

		mockItemStorageLayouts.push(newLayout);
		nextId++;

		return {
			$schema: 'item-storage-layout-create-response',
			data: newLayout
		};
	},

	/**
	 * Update item storage layout
	 */
	updateItemStorageLayout: async (
		uoid: string,
		payload: ItemStorageLayoutUpdateRequest
	): Promise<ItemStorageLayoutUpdateResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		const index = mockItemStorageLayouts.findIndex((layout) => layout.uoid === uoid);

		if (index === -1) {
			throw new Error(`Item storage layout with uoid ${uoid} not found`);
		}

		const updatedLayout: ItemStorageLayout = {
			...mockItemStorageLayouts[index],
			code: payload.code,
			name: payload.name,
			store: {
				id: payload.store_id,
				uoid: `store-${payload.store_id}`,
				code: 'GDG-01',
				name: 'GUDANG'
			},
			parent: payload.parent_id
				? mockItemStorageLayouts.find((l) => l.id === payload.parent_id)
					? {
							id: payload.parent_id,
							uoid: mockItemStorageLayouts.find((l) => l.id === payload.parent_id)!.uoid,
							code: mockItemStorageLayouts.find((l) => l.id === payload.parent_id)!.code,
							name: mockItemStorageLayouts.find((l) => l.id === payload.parent_id)!.name
						}
					: undefined
				: undefined,
			number_of_columns: payload.number_of_columns,
			number_of_rows: payload.number_of_rows,
			is_active: payload.is_active,
			cells: generateCells(payload.number_of_rows, payload.number_of_columns),
			updated_at: new Date().toISOString(),
			i_version: payload.i_version + 1
		};

		mockItemStorageLayouts[index] = updatedLayout;

		return {
			$schema: 'item-storage-layout-update-response',
			data: updatedLayout
		};
	},

	/**
	 * Delete item storage layout
	 */
	deleteItemStorageLayout: async (uoid: string): Promise<ItemStorageLayoutDeleteResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 300));

		const index = mockItemStorageLayouts.findIndex((layout) => layout.uoid === uoid);

		if (index === -1) {
			throw new Error(`Item storage layout with uoid ${uoid} not found`);
		}

		mockItemStorageLayouts.splice(index, 1);

		return {
			$schema: 'item-storage-layout-delete-response',
			data: {
				message: 'Item storage layout deleted successfully'
			}
		};
	},

	/**
	 * Get item storage layout statistics
	 */
	getItemStorageLayoutStats: async (): Promise<ItemStorageLayoutStatsResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 300));

		const totalCells = mockItemStorageLayouts.reduce(
			(sum, layout) => sum + layout.cells.length,
			0
		);
		const occupiedCells = mockItemStorageLayouts.reduce(
			(sum, layout) => sum + layout.cells.filter((cell) => cell.is_occupied).length,
			0
		);

		const stats = {
			total_layouts: mockItemStorageLayouts.length,
			active_layouts: mockItemStorageLayouts.filter((layout) => layout.is_active).length,
			total_cells: totalCells,
			occupied_cells: occupiedCells
		};

		return {
			$schema: 'item-storage-layout-stats-response',
			data: stats
		};
	}
};
