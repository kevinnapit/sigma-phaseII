import type {
	ItemSubstitutionListParams,
	ItemSubstitutionListResponse,
	ItemSubstitutionDetailResponse
} from '../types/item-substitution.types';
import { getMockItemSubstitutions, getMockItemSubstitutionDetail } from './item-substitution.mock';

interface ApiContext {
	token: string;
	estateId: string;
	contextId?: string;
}

const USE_MOCK = true; // Selalu gunakan mock untuk modul ini

export const itemSubstitutionApi = {
	/**
	 * Mendapatkan semua substitusi barang dengan paginasi
	 */
	getItemSubstitutions: async (
		params: ItemSubstitutionListParams,
		_context: ApiContext
	): Promise<ItemSubstitutionListResponse> => {
		if (USE_MOCK) {
			// Simulasi jeda jaringan
			await new Promise((resolve) => setTimeout(resolve, 400));
			return getMockItemSubstitutions(params.page, params.size, params.search);
		}

		// Implementasi API nyata (untuk penggunaan mendatang)
		throw new Error('Real API not implemented yet');
	},

	/**
	 * Mendapatkan detail substitusi barang berdasarkan ID
	 */
	getItemSubstitutionDetail: async (
		id: string,
		_context: ApiContext
	): Promise<ItemSubstitutionDetailResponse> => {
		if (USE_MOCK) {
			// Simulasi jeda jaringan
			await new Promise((resolve) => setTimeout(resolve, 300));
			return getMockItemSubstitutionDetail(id);
		}

		// Implementasi API nyata (untuk penggunaan mendatang)
		throw new Error('Real API not implemented yet');
	}
};
