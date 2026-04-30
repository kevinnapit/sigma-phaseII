// Mutation hooks for Physical Stocktake Entry (Entri Stok Opname Fisik)

import { toast } from 'svelte-sonner';
import { addMockPhysicalStocktake } from '../api/physical-stocktake.mock';
import type { PhysicalStocktakeCreatePayload } from '../types/physical-stocktake.types';

/**
 * Hook untuk membuat entri stok opname baru
 */
export const useCreatePhysicalStocktake = () => {
	let isPending = $state(false);
	let error = $state<Error | null>(null);

	const mutateAsync = async (payload: PhysicalStocktakeCreatePayload) => {
		isPending = true;
		error = null;

		try {
			console.log('Membuat entri stok opname:', payload);
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const newEntry = addMockPhysicalStocktake(payload);

			const response = {
				success: true,
				id: newEntry.id,
				entry_number: newEntry.entry_number,
				data: newEntry
			};

			toast.success('Entri stok opname berhasil disimpan');
			return response;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan tidak diketahui';
			error = new Error(errorMessage);
			toast.error(`Gagal menyimpan entri stok opname: ${errorMessage}`);
			throw error;
		} finally {
			isPending = false;
		}
	};

	return {
		mutateAsync,
		get isPending() {
			return isPending;
		},
		get error() {
			return error;
		}
	};
};
