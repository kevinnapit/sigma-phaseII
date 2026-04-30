import { createQuery } from '@tanstack/svelte-query';

// Placeholder types until API is available
export type CurrencyItem = {
	id: string;
	code: string;
	name: string;
	symbol?: string;
};

export type RoundingItem = {
	id: string;
	code: string;
	name: string;
	value: number;
};

export type UnitCurrencyItem = {
	id: string;
	code: string;
	name: string;
};

export const useCurrencyListQuery = (params: () => unknown) => {
	return createQuery(() => ({
		queryKey: ['currency', 'list', params()],
		queryFn: async () => {
			// Placeholder
			return {
				data: [] as CurrencyItem[],
				meta: { total_items: 0 }
			};
		},
		placeholderData: (prev) => prev
	}));
};

export const useRoundingListQuery = (params: () => unknown) => {
	return createQuery(() => ({
		queryKey: ['currency', 'rounding', 'list', params()],
		queryFn: async () => {
			// Placeholder
			return {
				data: [] as RoundingItem[],
				meta: { total_items: 0 }
			};
		},
		placeholderData: (prev) => prev
	}));
};

export const useUnitCurrencyListQuery = (params: () => unknown) => {
	return createQuery(() => ({
		queryKey: ['currency', 'unit', 'list', params()],
		queryFn: async () => {
			// Placeholder
			return {
				data: [] as UnitCurrencyItem[],
				meta: { total_items: 0 }
			};
		},
		placeholderData: (prev) => prev
	}));
};
