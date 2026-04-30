// Mock data for Issue Return

import type {
	IssueReturn,
	IssueReturnListResponse,
	IssueReturnDetailResponse,
	IssueReturnStats
} from '../types/issue-return.types';

export const mockIssueReturns: IssueReturn[] = [
	{
		id: '1',
		return_number: 'IR/2026/0001',
		return_date: '2026-04-28',
		store_id: 'store-001',
		store_name: 'Gudang Poliklinik A',
		return_by_id: 'user-001',
		return_by_name: 'Budi Santoso',
		remarks: 'Pengembalian barang yang tidak terpakai',
		status: 'processed',
		status_label: 'Diproses',
		total_items: 2,
		items: [
			{
				id: 'item-1',
				item_code: 'BRG-001',
				item_name: 'Pupuk NPK 50kg',
				issue_number: 'Issue/2026/0001',
				geographical_unit: 'Divisi 1',
				allocation_code: 'ALLOC-001',
				batch_no: 'BATCH-2026-001',
				storage_location: 'JAC-2',
				uom: 'Sak',
				issue_quantity: 50,
				unit_rate: 150000,
				quantity_returned: 10,
				remarks: 'Sisa stok'
			},
			{
				id: 'item-2',
				item_code: 'BRG-002',
				item_name: 'Oli Mesin SAE 40',
				issue_number: 'Issue/2026/0002',
				geographical_unit: 'Divisi 2',
				allocation_code: 'ALLOC-002',
				batch_no: 'BATCH-2026-002',
				storage_location: 'RAK-A-01',
				uom: 'Liter',
				issue_quantity: 20,
				unit_rate: 85000,
				quantity_returned: 5,
				remarks: 'Tidak terpakai'
			}
		],
		created_at: '2026-04-28T08:00:00Z',
		updated_at: '2026-04-28T08:00:00Z'
	},
	{
		id: '2',
		return_number: 'IR/2026/0002',
		return_date: '2026-04-27',
		store_id: 'store-003',
		store_name: 'Gudang',
		return_by_id: 'user-002',
		return_by_name: 'Siti Aminah',
		remarks: 'Pengembalian barang rusak',
		status: 'processed',
		status_label: 'Diproses',
		total_items: 1,
		items: [
			{
				id: 'item-3',
				item_code: 'BRG-003',
				item_name: 'Filter Udara',
				issue_number: 'Issue/2026/0003',
				geographical_unit: 'Divisi 3',
				allocation_code: 'ALLOC-003',
				batch_no: 'BATCH-2026-003',
				storage_location: 'RAK-B-05',
				uom: 'Pcs',
				issue_quantity: 10,
				unit_rate: 45000,
				quantity_returned: 3,
				remarks: 'Barang rusak'
			}
		],
		created_at: '2026-04-27T09:00:00Z',
		updated_at: '2026-04-27T14:30:00Z'
	}
];

// Function to add new issue return to mock data
export function addMockIssueReturn(payload: any) {
	const newReturn: IssueReturn = {
		id: `${mockIssueReturns.length + 1}`,
		return_number: `IR/2026/${String(mockIssueReturns.length + 1).padStart(4, '0')}`,
		return_date: payload.return_date,
		store_id: payload.store_id,
		store_name: payload.store_name,
		return_by_id: payload.return_by_id,
		return_by_name: payload.return_by_name,
		remarks: payload.remarks,
		status: 'processed',
		status_label: 'Diproses',
		total_items: payload.items.length,
		items: payload.items.map((item: any, index: number) => ({
			id: `item-${Date.now()}-${index}`,
			...item
		})),
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	};

	mockIssueReturns.unshift(newReturn);
	console.log('Added new mock issue return:', newReturn);
	return newReturn;
}

export function getMockIssueReturns(
	page: number = 1,
	size: number = 10,
	search?: string,
	status?: string
): IssueReturnListResponse {
	let filtered = [...mockIssueReturns];

	// Filter by search
	if (search) {
		const searchLower = search.toLowerCase();
		filtered = filtered.filter(
			(item) =>
				item.return_number.toLowerCase().includes(searchLower) ||
				item.store_name.toLowerCase().includes(searchLower) ||
				item.return_by_name.toLowerCase().includes(searchLower)
		);
	}

	// Filter by status
	if (status && status !== 'all') {
		filtered = filtered.filter((item) => item.status === status);
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

export function getMockIssueReturnDetail(id: string): IssueReturnDetailResponse {
	const issueReturn = mockIssueReturns.find((item) => item.id === id);

	if (!issueReturn) {
		throw new Error('Issue return not found');
	}

	return {
		data: issueReturn
	};
}

export function getMockIssueReturnStats(): IssueReturnStats {
	return {
		total: mockIssueReturns.length
	};
}
