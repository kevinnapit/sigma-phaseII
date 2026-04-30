// Permission constants for Stock Adjustment (Penyesuaian Stok)

export const STOCK_ADJUSTMENT_PERMISSIONS = {
	VIEW: 'material-management.inventaris.transaksi.penyesuaian-stok.view',
	CREATE: 'material-management.inventaris.transaksi.penyesuaian-stok.create',
	UPDATE: 'material-management.inventaris.transaksi.penyesuaian-stok.update',
	DELETE: 'material-management.inventaris.transaksi.penyesuaian-stok.delete'
} as const;

export type StockAdjustmentPermission =
	(typeof STOCK_ADJUSTMENT_PERMISSIONS)[keyof typeof STOCK_ADJUSTMENT_PERMISSIONS];
