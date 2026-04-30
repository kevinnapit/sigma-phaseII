// Permission constants for Stock Reconciliation (Rekonsiliasi Stok)

export const STOCK_RECONCILIATION_PERMISSIONS = {
	VIEW: 'material-management.inventaris.transaksi.rekonsiliasi-stok.view',
	CREATE: 'material-management.inventaris.transaksi.rekonsiliasi-stok.create',
	UPDATE: 'material-management.inventaris.transaksi.rekonsiliasi-stok.update',
	DELETE: 'material-management.inventaris.transaksi.rekonsiliasi-stok.delete'
} as const;

export type StockReconciliationPermission =
	(typeof STOCK_RECONCILIATION_PERMISSIONS)[keyof typeof STOCK_RECONCILIATION_PERMISSIONS];
