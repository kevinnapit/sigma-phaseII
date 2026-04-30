// Inter Estate Transfer Permissions

export const INTER_ESTATE_TRANSFER_PERMISSIONS = {
	VIEW: 'material-management.inventory.transaction.inter-estate-transfer.view',
	APPROVE: 'material-management.inventory.transaction.inter-estate-transfer.approve',
	REJECT: 'material-management.inventory.transaction.inter-estate-transfer.reject',
	PRINT: 'material-management.inventory.transaction.inter-estate-transfer.print'
} as const;

export type InterEstateTransferPermission =
	(typeof INTER_ESTATE_TRANSFER_PERMISSIONS)[keyof typeof INTER_ESTATE_TRANSFER_PERMISSIONS];
