import type { GoodsIssuesListParams } from '../types/goods-issues.types';

export const goodsIssuesKeys = {
	all: ['material-management', 'goods-issues'] as const,
	list: (params: GoodsIssuesListParams) => [...goodsIssuesKeys.all, 'list', params] as const,
	detail: (id: string) => [...goodsIssuesKeys.all, 'detail', id] as const
};
