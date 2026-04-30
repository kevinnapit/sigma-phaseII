export const PURCHASE_REQUEST_PERMISSIONS = {
	VIEW: 'material-management.inventaris.transaksi.purchase-request.view',
	CREATE: 'material-management.inventaris.transaksi.purchase-request.create',
	UPDATE: 'material-management.inventaris.transaksi.purchase-request.update',
	EDIT: 'material-management.inventaris.transaksi.purchase-request.edit',
	CANCEL: 'material-management.inventaris.transaksi.purchase-request.cancel',
	DETAIL_VIEW: 'material-management.inventaris.transaksi.purchase-request.detail.view',
	APPROVAL_ASISTEN_UPDATE:
		'material-management.inventaris.transaksi.purchase-request.approval.asisten.update',
	APPROVAL_MANAGER_UPDATE:
		'material-management.inventaris.transaksi.purchase-request.approval.manager.update',
	APPROVAL_ADMIN_UPDATE:
		'material-management.inventaris.transaksi.purchase-request.approval.admin.update',
	// REQ-001: Asisten/Tekniker 2 can edit
	EDIT_ASISTEN_TEKNIKER_2: 'material-management.inventaris.transaksi.purchase-request.edit.asisten-tekniker-2',
	// REQ-002: Asisten/Tekniker 2 can cancel (Draft only)
	CANCEL_ASISTEN_TEKNIKER_2: 'material-management.inventaris.transaksi.purchase-request.cancel.asisten-tekniker-2',
	// REQ-003: Askep/Tekniker 1 can edit after reject
	EDIT_ASKEP_TEKNIKER_1: 'material-management.inventaris.transaksi.purchase-request.edit.askep-tekniker-1',
	// REQ-004: Manager Kebun can edit after reject
	EDIT_MANAGER_KEBUN: 'material-management.inventaris.transaksi.purchase-request.edit.manager-kebun',
	// REQ-005: Askep/Tekniker 1 and Manager Kebun can cancel anytime
	CANCEL_ASKEP_TEKNIKER_1: 'material-management.inventaris.transaksi.purchase-request.cancel.askep-tekniker-1',
	CANCEL_MANAGER_KEBUN: 'material-management.inventaris.transaksi.purchase-request.cancel.manager-kebun'
} as const;
