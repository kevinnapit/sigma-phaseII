// Mutation hooks untuk Rekonsiliasi Stok

import { toast } from 'svelte-sonner';
import { addMockStockReconciliation } from '../api/stock-reconciliation.mock';
import type { StockReconciliationCreatePayload } from '../types/stock-reconciliation.types';

/**
 * Hook untuk membuat rekonsiliasi stok baru
 */
export const useCreateStockReconciliation = () => {
	let isPending = $state(false);
	let error = $state<Error | null>(null);

	const mutateAsync = async (payload: StockReconciliationCreatePayload) => {
		isPending = true;
		error = null;

		try {
			console.log('Membuat rekonsiliasi stok:', payload);
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const newEntry = addMockStockReconciliation(payload);

			const response = {
				success: true,
				id: newEntry.id,
				reconciliation_number: newEntry.reconciliation_number,
				data: newEntry
			};

			toast.success('Rekonsiliasi stok berhasil disimpan');
			return response;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan tidak diketahui';
			error = new Error(errorMessage);
			toast.error(`Gagal menyimpan rekonsiliasi stok: ${errorMessage}`);
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
