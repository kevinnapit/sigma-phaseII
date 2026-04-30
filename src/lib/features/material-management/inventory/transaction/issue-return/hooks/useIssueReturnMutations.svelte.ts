// Mutation hooks for Issue Return

import { toast } from 'svelte-sonner';
import { addMockIssueReturn } from '../api/issue-return.mock';
import type { IssueReturnCreatePayload } from '../types/issue-return.types';

/**
 * Simple mutation hook for create issue return
 */
export const useCreateIssueReturn = () => {
	let isPending = $state(false);
	let error = $state<Error | null>(null);

	const mutateAsync = async (payload: IssueReturnCreatePayload) => {
		isPending = true;
		error = null;
		
		try {
			// Mock implementation - simulate API call
			console.log('Creating issue return:', payload);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			
			// Add to mock data
			const newReturn = addMockIssueReturn(payload);
			
			// Mock success response
			const response = { 
				success: true, 
				id: newReturn.id,
				return_number: newReturn.return_number,
				data: newReturn
			};
			
			toast.success('Pengembalian pengeluaran berhasil dibuat');
			return response;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Unknown error';
			error = new Error(errorMessage);
			toast.error(`Gagal membuat pengembalian: ${errorMessage}`);
			throw error;
		} finally {
			isPending = false;
		}
	};

	return {
		mutateAsync,
		isPending,
		error
	};
};
