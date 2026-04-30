// Permission constants for Physical Stocktake Entry (Entri Stok Opname Fisik)

export const PHYSICAL_STOCKTAKE_PERMISSIONS = {
	VIEW: 'material-management.inventaris.transaksi.entri-stok-opname.view',
	CREATE: 'material-management.inventaris.transaksi.entri-stok-opname.create',
	UPDATE: 'material-management.inventaris.transaksi.entri-stok-opname.update',
	DELETE: 'material-management.inventaris.transaksi.entri-stok-opname.delete'
} as const;

export type PhysicalStocktakePermission =
	(typeof PHYSICAL_STOCKTAKE_PERMISSIONS)[keyof typeof PHYSICAL_STOCKTAKE_PERMISSIONS];
