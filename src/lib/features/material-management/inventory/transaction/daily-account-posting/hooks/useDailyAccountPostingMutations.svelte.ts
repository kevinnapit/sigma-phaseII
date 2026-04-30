// Mutation hooks for Daily Account Posting (Posting Akun Harian)

import { toast } from 'svelte-sonner';
import { addMockDailyAccountPosting } from '../api/daily-account-posting.mock';
import type { DailyAccountPostingCreatePayload } from '../types/daily-account-posting.types';

/**
 * Hook for creating a new daily account posting
 */
export const useCreateDailyAccountPosting = () => {
	let isPending = $state(false);
	let error = $state<Error | null>(null);

	const mutateAsync = async (payload: DailyAccountPostingCreatePayload) => {
		isPending = true;
		error = null;

		try {
			console.log('Creating daily account posting:', payload);
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const newPosting = addMockDailyAccountPosting(payload);

			const response = {
				success: true,
				id: newPosting.id,
				posting_number: newPosting.posting_number,
				data: newPosting
			};

			toast.success('Posting akun harian berhasil disimpan');
			return response;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Unknown error';
			error = new Error(errorMessage);
			toast.error(`Gagal menyimpan posting akun: ${errorMessage}`);
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
