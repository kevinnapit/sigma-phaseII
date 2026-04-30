import { goto } from '$app/navigation';

interface UseTabPaginationOptions {
	getCurrentPage: () => number;
	getPageSize: () => number;
	getSearchQuery?: () => string;
	basePath?: string;
	onTabChange?: (newTab: string) => void;
}

export function useTabPagination(options: UseTabPaginationOptions) {
	const { getCurrentPage, getPageSize, getSearchQuery, basePath, onTabChange } = options;

	function updateUrlParams(newPage: number, newSize: number, tab?: string, includeSearch: boolean = true) {
		const params = new URLSearchParams();
		params.set('page', String(newPage));
		params.set('size', String(newSize));
		
		if (includeSearch) {
			const searchQuery = getSearchQuery?.();
			if (searchQuery && searchQuery.trim()) {
				params.set('search', searchQuery.trim());
			}
		}
		
		if (tab) {
			params.set('tab', tab);
		}

		const path = basePath || '';
		goto(`${path}?${params.toString()}`, { replaceState: true, noScroll: true });
	}

	function handlePageChange(pageNum: number, tab?: string) {
		updateUrlParams(pageNum, getPageSize(), tab);
	}

	function handlePageSizeChange(newSize: number, tab?: string) {
		updateUrlParams(1, newSize, tab);
	}

	function handleTabChange(newTab: string) {
		onTabChange?.(newTab);
		updateUrlParams(1, getPageSize(), newTab, false);
	}

	return {
		updateUrlParams,
		handlePageChange,
		handlePageSizeChange,
		handleTabChange
	};
}
