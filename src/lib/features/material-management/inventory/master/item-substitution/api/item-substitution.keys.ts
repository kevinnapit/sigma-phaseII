import type { ItemSubstitutionListParams } from '../types/item-substitution.types';

/**
 * Query keys untuk Substitusi Barang
 * Menyediakan pembuatan key yang konsisten untuk caching TanStack Query
 */
export const itemSubstitutionKeys = {
	// Key dasar untuk semua query substitusi barang
	all: ['material-management', 'item-substitutions'] as const,

	// Query daftar substitusi barang dengan parameter
	list: (params: ItemSubstitutionListParams) =>
		[...itemSubstitutionKeys.all, 'list', params] as const,

	// Query detail substitusi barang
	detail: (id: string) => [...itemSubstitutionKeys.all, 'detail', id] as const
};
