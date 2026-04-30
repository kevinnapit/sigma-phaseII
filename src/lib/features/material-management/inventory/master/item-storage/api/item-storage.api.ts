import type {
	ItemStorageAssignmentListParams,
	ItemStorageAssignmentListResponse,
	ItemStorageAssignmentDetailResponse,
	ItemStorageAssignmentCreatePayload
} from '../types/item-storage.types';
import {
	getMockItemStorageAssignments,
	getMockItemStorageAssignmentDetail,
	addMockItemStorageAssignment
} from './item-storage.mock';

interface ApiContext {
	token: string;
	estateId: string;
	contextId?: string;
}

const USE_MOCK = true;

export const itemStorageApi = {
	/**
	 * Mendapatkan semua penugasan penyimpanan barang dengan paginasi
	 */
	getItemStorageAssignments: async (
		params: ItemStorageAssignmentListParams,
		_context: ApiContext
	): Promise<ItemStorageAssignmentListResponse> => {
		if (USE_MOCK) {
			await new Promise((resolve) => setTimeout(resolve, 400));
			return getMockItemStorageAssignments(params.page, params.size, params.search);
		}
		throw new Error('Real API not implemented yet');
	},

	/**
	 * Mendapatkan detail penugasan penyimpanan barang berdasarkan ID
	 */
	getItemStorageAssignmentDetail: async (
		id: string,
		_context: ApiContext
	): Promise<ItemStorageAssignmentDetailResponse> => {
		if (USE_MOCK) {
			await new Promise((resolve) => setTimeout(resolve, 300));
			return getMockItemStorageAssignmentDetail(id);
		}
		throw new Error('Real API not implemented yet');
	},

	/**
	 * Membuat penugasan penyimpanan barang baru
	 */
	createItemStorageAssignment: async (
		payload: ItemStorageAssignmentCreatePayload,
		_context: ApiContext
	): Promise<{ data: ReturnType<typeof addMockItemStorageAssignment> }> => {
		if (USE_MOCK) {
			await new Promise((resolve) => setTimeout(resolve, 500));
			const data = addMockItemStorageAssignment(payload);
			return { data };
		}
		throw new Error('Real API not implemented yet');
	}
};
