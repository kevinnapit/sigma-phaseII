/**
 * Mock data untuk Item Code Request
 */

import type {
	ItemCodeRequest,
	ItemCodeRequestListResponse,
	ItemCodeRequestDetailResponse,
	ItemCodeRequestSummary,
	ItemCodeRequestSummaryResponse,
	CreateItemCodeRequestPayload,
	ReviewItemCodeRequestPayload
} from '../types/item-code-request.types';

/**
 * Mock Item Code Requests Data
 */
let mockItemCodeRequests: ItemCodeRequest[] = [
	{
		uoid: 'icr-001',
		request_number: 'ICR/2026/00001',
		item_name: 'Laptop Dell Latitude 5420',
		description:
			'Laptop untuk karyawan baru dengan spesifikasi: Intel Core i5 Gen 11, RAM 16GB, SSD 512GB, Windows 11 Pro',
		uom: 'UNIT',
		department_destination: 'Departemen IT',
		status: 'APPROVED',
		requested_by: 'user-001',
		requested_by_name: 'Ahmad Fauzi',
		requested_at: '2026-04-15T10:00:00Z',
		reviewed_by: 'admin-001',
		reviewed_by_name: 'Siti Nurhaliza',
		reviewed_at: '2026-04-16T14:30:00Z',
		review_notes: 'Permintaan disetujui, kode barang telah dibuat',
		approved_item_code: 'IT-LAP-001',
		approved_item_id: 'item-lap-001',
		i_version: 1
	},
	{
		uoid: 'icr-002',
		request_number: 'ICR/2026/00002',
		item_name: 'Printer Canon Pixma G3010',
		description: 'Printer multifungsi untuk kebutuhan administrasi dengan sistem ink tank',
		uom: 'UNIT',
		department_destination: 'Departemen Finance',
		status: 'PENDING',
		requested_by: 'user-002',
		requested_by_name: 'Bambang Suryanto',
		requested_at: '2026-04-20T09:00:00Z',
		i_version: 1
	},
	{
		uoid: 'icr-003',
		request_number: 'ICR/2026/00003',
		item_name: 'Kursi Kantor Ergonomis',
		description: 'Kursi kantor dengan sandaran punggung ergonomis dan adjustable height',
		uom: 'UNIT',
		department_destination: 'Departemen HR',
		status: 'IN_REVIEW',
		requested_by: 'user-003',
		requested_by_name: 'Dewi Lestari',
		requested_at: '2026-04-21T11:00:00Z',
		reviewed_by: 'admin-001',
		reviewed_by_name: 'Siti Nurhaliza',
		reviewed_at: null,
		i_version: 1
	},
	{
		uoid: 'icr-004',
		request_number: 'ICR/2026/00004',
		item_name: 'Kabel HDMI 10 Meter',
		description: 'Kabel HDMI panjang 10 meter untuk koneksi proyektor',
		uom: 'PCS',
		department_destination: 'Departemen IT',
		status: 'REJECTED',
		requested_by: 'user-004',
		requested_by_name: 'Rudi Hartono',
		requested_at: '2026-04-18T14:00:00Z',
		reviewed_by: 'admin-001',
		reviewed_by_name: 'Siti Nurhaliza',
		reviewed_at: '2026-04-19T10:00:00Z',
		rejection_reason: 'Barang sudah tersedia dengan kode CBL-HDMI-10M',
		i_version: 1
	}
];

/**
 * Mock API Functions
 */
export const itemCodeRequestMockApi = {
	/**
	 * Get Item Code Request List
	 */
	getItemCodeRequests: async (params: {
		page: number;
		limit: number;
		search?: string;
		status?: string;
	}): Promise<ItemCodeRequestListResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		let filteredData = [...mockItemCodeRequests];

		// Filter by search
		if (params.search) {
			const searchLower = params.search.toLowerCase();
			filteredData = filteredData.filter(
				(req) =>
					req.request_number.toLowerCase().includes(searchLower) ||
					req.item_name.toLowerCase().includes(searchLower) ||
					req.description.toLowerCase().includes(searchLower) ||
					req.requested_by_name.toLowerCase().includes(searchLower)
			);
		}

		// Filter by status
		if (params.status) {
			filteredData = filteredData.filter((req) => req.status === params.status);
		}

		// Sort by requested_at desc
		filteredData.sort(
			(a, b) => new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime()
		);

		// Pagination
		const startIndex = (params.page - 1) * params.limit;
		const endIndex = startIndex + params.limit;
		const paginatedData = filteredData.slice(startIndex, endIndex);

		return {
			$schema: 'item-code-request-list-response',
			data: paginatedData,
			pagination: {
				page: params.page,
				limit: params.limit,
				total_records: filteredData.length,
				total_pages: Math.ceil(filteredData.length / params.limit)
			}
		};
	},

	/**
	 * Get Item Code Request Detail
	 */
	getItemCodeRequestDetail: async (id: string): Promise<ItemCodeRequestDetailResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 300));

		const request = mockItemCodeRequests.find((req) => req.uoid === id);
		if (!request) {
			throw new Error(`Item Code Request with ID ${id} not found`);
		}

		return {
			$schema: 'item-code-request-detail-response',
			data: request
		};
	},

	/**
	 * Create Item Code Request
	 */
	createItemCodeRequest: async (
		payload: CreateItemCodeRequestPayload
	): Promise<ItemCodeRequestDetailResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 800));

		const newRequest: ItemCodeRequest = {
			uoid: `icr-${Date.now()}`,
			request_number: `ICR/2026/${String(mockItemCodeRequests.length + 1).padStart(5, '0')}`,
			item_name: payload.item_name,
			description: payload.description,
			uom: payload.uom,
			department_destination: payload.department_destination,
			status: 'PENDING',
			requested_by: 'current-user-id',
			requested_by_name: 'Current User',
			requested_at: new Date().toISOString(),
			i_version: 1
		};

		mockItemCodeRequests.push(newRequest);

		return {
			$schema: 'item-code-request-detail-response',
			data: newRequest
		};
	},

	/**
	 * Review Item Code Request (Approve/Reject)
	 */
	reviewItemCodeRequest: async (
		id: string,
		payload: ReviewItemCodeRequestPayload
	): Promise<ItemCodeRequestDetailResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 800));

		const index = mockItemCodeRequests.findIndex((req) => req.uoid === id);
		if (index === -1) {
			throw new Error(`Item Code Request with ID ${id} not found`);
		}

		const updatedRequest: ItemCodeRequest = {
			...mockItemCodeRequests[index],
			status: payload.status,
			reviewed_by: 'admin-001',
			reviewed_by_name: 'Admin User',
			reviewed_at: new Date().toISOString(),
			review_notes: payload.review_notes,
			approved_item_code: payload.approved_item_code,
			approved_item_id: payload.approved_item_id,
			rejection_reason: payload.rejection_reason,
			i_version: mockItemCodeRequests[index].i_version + 1
		};

		mockItemCodeRequests[index] = updatedRequest;

		return {
			$schema: 'item-code-request-detail-response',
			data: updatedRequest
		};
	},

	/**
	 * Get Summary Stats
	 */
	getSummary: async (): Promise<ItemCodeRequestSummaryResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 300));

		const summary: ItemCodeRequestSummary = {
			total_requests: mockItemCodeRequests.length,
			pending_requests: mockItemCodeRequests.filter((req) => req.status === 'PENDING').length,
			approved_requests: mockItemCodeRequests.filter((req) => req.status === 'APPROVED').length,
			rejected_requests: mockItemCodeRequests.filter((req) => req.status === 'REJECTED').length,
			in_review_requests: mockItemCodeRequests.filter((req) => req.status === 'IN_REVIEW').length
		};

		return {
			$schema: 'item-code-request-summary-response',
			data: summary
		};
	}
};
