// Permission constants for Transfer Receipt

export const TRANSFER_RECEIPT_PERMISSIONS = {
	VIEW: 'material-management.inventaris.transaksi.penerimaan-barang-transfer.view',
	CREATE: 'material-management.inventaris.transaksi.penerimaan-barang-transfer.create',
	UPDATE: 'material-management.inventaris.transaksi.penerimaan-barang-transfer.update',
	DELETE: 'material-management.inventaris.transaksi.penerimaan-barang-transfer.delete',
	SUBMIT: 'material-management.inventaris.transaksi.penerimaan-barang-transfer.submit',
	APPROVE: 'material-management.inventaris.transaksi.penerimaan-barang-transfer.approve',
	REJECT: 'material-management.inventaris.transaksi.penerimaan-barang-transfer.reject'
} as const;

export type TransferReceiptPermission = typeof TRANSFER_RECEIPT_PERMISSIONS[keyof typeof TRANSFER_RECEIPT_PERMISSIONS];