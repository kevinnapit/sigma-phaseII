import type { GRNListParams, ApprovedLPOListParams } from '../types/goods-receives-notes.types';

export const goodsReceivesNotesKeys = {
	all: ['material-management', 'goods-receives-notes'] as const,
	list: (params: GRNListParams) => [...goodsReceivesNotesKeys.all, 'list', params] as const,
	detail: (id: string) => [...goodsReceivesNotesKeys.all, 'detail', id] as const,
	summary: () => [...goodsReceivesNotesKeys.all, 'summary'] as const,
	approvedLpo: (params: ApprovedLPOListParams) =>
		[...goodsReceivesNotesKeys.all, 'approved-lpo', params] as const,
	approvedLpoDetail: (id: string) =>
		[...goodsReceivesNotesKeys.all, 'approved-lpo-detail', id] as const,
	approvalHistory: (id: string) => [...goodsReceivesNotesKeys.all, 'approval-history', id] as const,
	materialCheck: (code: string) => [...goodsReceivesNotesKeys.all, 'material-check', code] as const,
	availableDockets: () => [...goodsReceivesNotesKeys.all, 'available-dockets'] as const,
	lpoByQr: (lpoNumber: string) => [...goodsReceivesNotesKeys.all, 'lpo-by-qr', lpoNumber] as const,
	lpoItemByQr: (lpoNumber: string, itemCode: string) =>
		[...goodsReceivesNotesKeys.all, 'lpo-item-by-qr', lpoNumber, itemCode] as const,
	itemStorageLayouts: (search: string) =>
		[...goodsReceivesNotesKeys.all, 'item-storage-layouts', search] as const
};
