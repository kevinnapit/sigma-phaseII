// Query hooks for Purchase Return (Pengembalian Pembelian)

import { getMockPurchaseReturns, getMockPurchaseReturnDetail } from '../api/purchase-return.mock';
import type { PurchaseReturnListParams } from '../types/purchase-return.types';

/**
 * Hook for reading all purchase returns with pagination and search
 */
export const useReadAllPurchaseReturns = (params: () => PurchaseReturnListParams) => {
	let data = $state<ReturnType<typeof getMockPurchaseReturns> | null>(null);
	let isLoading = $state(true);
	let isError = $state(false);
	let error = $state<Error | null>(null);

	$effect(() => {
		const currentParams = params();
		isLoading = true;
		isError = false;
		error = null;

		const timer = setTimeout(() => {
			try {
				const result = getMockPurchaseReturns(
					currentParams.page,
					currentParams.size,
					currentParams.search
				);
				data = result;
			} catch (err) {
				isError = true;
				error = err instanceof Error ? err : new Error('Unknown error');
			} finally {
				isLoading = false;
			}
		}, 300);

		return () => clearTimeout(timer);
	});

	return {
		get data() {
			return data;
		},
		get isLoading() {
			return isLoading;
		},
		get isError() {
			return isError;
		},
		get error() {
			return error;
		}
	};
};

/**
 * Hook for reading purchase return detail by ID
 */
export const useReadPurchaseReturnDetail = (id: () => string) => {
	let data = $state<ReturnType<typeof getMockPurchaseReturnDetail> | null>(null);
	let isLoading = $state(true);
	let isError = $state(false);
	let error = $state<Error | null>(null);

	$effect(() => {
		const currentId = id();
		if (!currentId) return;

		isLoading = true;
		isError = false;
		error = null;

		const timer = setTimeout(() => {
			try {
				const result = getMockPurchaseReturnDetail(currentId);
				data = result;
			} catch (err) {
				isError = true;
				error = err instanceof Error ? err : new Error('Unknown error');
			} finally {
				isLoading = false;
			}
		}, 300);

		return () => clearTimeout(timer);
	});

	return {
		get data() {
			return data;
		},
		get isLoading() {
			return isLoading;
		},
		get isError() {
			return isError;
		},
		get error() {
			return error;
		}
	};
};
