import type { GoodsIssueListParams } from '../types/goods-issue.types';

export const goodsIssueKeys = {
	all: ['material-management', 'goods-issue'] as const,
	summary: () => [...goodsIssueKeys.all, 'summary'] as const,
	lists: () => [...goodsIssueKeys.all, 'list'] as const,
	list: (params: GoodsIssueListParams) => [...goodsIssueKeys.lists(), params] as const,
	details: () => [...goodsIssueKeys.all, 'detail'] as const,
	detail: (id: string) => [...goodsIssueKeys.details(), id] as const
};
