// Mutation hooks for Purchase Return (Pengembalian Pembelian)

import { toast } from 'svelte-sonner';
import { addMockPurchaseReturn } from '../api/purchase-return.mock';
import type { PurchaseReturnCreatePayload } from '../types/purchase-return.types';

/**
 * Hook for creating a new purchase return
 */
export const useCreatePurchaseReturn = () => {
	let isPending = $state(false);
	let error = $state<Error | null>(null);

	const mutateAsync = async (payload: PurchaseReturnCreatePayload) => {
		isPending = true;
		error = null;

		try {
			console.log('Creating purchase return:', payload);
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Add to mock data
			const newReturn = addMockPurchaseReturn(payload);

			const response = {
				success: true,
				id: newReturn.id,
				return_number: newReturn.return_number,
				data: newReturn
			};

			toast.success('Pengembalian pembelian berhasil disimpan');
			return response;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Unknown error';
			error = new Error(errorMessage);
			toast.error(`Gagal menyimpan pengembalian: ${errorMessage}`);
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
