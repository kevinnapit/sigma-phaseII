// Mutation hooks for Stock Adjustment (Penyesuaian Stok)

import { toast } from 'svelte-sonner';
import { addMockStockAdjustment } from '../api/stock-adjustment.mock';
import type { StockAdjustmentCreatePayload } from '../types/stock-adjustment.types';

/**
 * Hook for creating a new stock adjustment
 */
export const useCreateStockAdjustment = () => {
	let isPending = $state(false);
	let error = $state<Error | null>(null);

	const mutateAsync = async (payload: StockAdjustmentCreatePayload) => {
		isPending = true;
		error = null;

		try {
			console.log('Creating stock adjustment:', payload);
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const newAdjustment = addMockStockAdjustment(payload);

			const response = {
				success: true,
				id: newAdjustment.id,
				adjustment_number: newAdjustment.adjustment_number,
				data: newAdjustment
			};

			toast.success('Penyesuaian stok berhasil disimpan');
			return response;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Unknown error';
			error = new Error(errorMessage);
			toast.error(`Gagal menyimpan penyesuaian stok: ${errorMessage}`);
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
