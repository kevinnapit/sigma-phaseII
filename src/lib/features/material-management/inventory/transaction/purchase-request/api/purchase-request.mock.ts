import type {
	PurchaseRequestListResponse,
	PurchaseRequestListParams,
	PurchaseRequestListItem,
	PurchaseRequestListItemExtended,
	PurchaseRequestDetailResponse,
	PurchaseRequestDetail,
	PurchaseRequestDetailItem,
	PurchaseRequestSummaryResponse,
	PurchaseRequestSummary,
	ApprovalHistoryResponse,
	ProcurementSourceResponse,
	PurchasingGroupResponse,
	PurchaseRequestPayload,
	PurchaseRequestCreateResponse,
	PurchaseRequestSubmitResponse,
	TrackingHistoryResponse,
	UOM,
	MasterValue
} from '../types/purchase-request.types';

/**
 * Mock UOMs
 */
const mockUOMs: UOM[] = [
	{ id: 'uom-1', code: 'KG', name: 'Kilogram' },
	{ id: 'uom-2', code: 'LTR', name: 'Liter' },
	{ id: 'uom-3', code: 'PCS', name: 'Pieces' },
	{ id: 'uom-4', code: 'BOX', name: 'Box' },
	{ id: 'uom-5', code: 'UNIT', name: 'Unit' }
];

/**
 * Mock Master Values
 */
const mockPRTypes: MasterValue[] = [
	{ id: 'pr-type-1', value: 'Regular Purchase', code: 1 },
	{ id: 'pr-type-2', value: 'Emergency Purchase', code: 2 },
	{ id: 'pr-type-3', value: 'Stock Replenishment', code: 3 }
];

const mockRequestSources: MasterValue[] = [
	{ id: 'source-1', value: 'Estate Request', code: 1 },
	{ id: 'source-2', value: 'Maintenance Request', code: 2 },
	{ id: 'source-3', value: 'Production Request', code: 3 }
];

/**
 * Mock Purchase Request List Data (Simplified - 1 per status)
 */
const mockPurchaseRequests: PurchaseRequestListItemExtended[] = [
	// 1. APPROVED - Complete (GRN Approved)
	{
		id: 'pr-001',
		purchase_request_number: 'LB/LPO/MR/2026/00142',
		purchase_request_date: '2026-04-20T08:00:00Z',
		reference_number: '',
		remarks: 'Permintaan alat tulis kantor',
		requested_by: 'Bambang Suryanto',
		approval_status: 'APPROVED',
		total_items: 3,
		total_estimated_price: 0,
		is_processed: false,
		source_type: 'Lokal',
		follow_up_status: 'Proses Selesai - Barang Diterima',
		follow_up_module: 'GOODS_RECEIPT'
	},
	// 2. APPROVED - In Progress (LPO Pending)
	{
		id: 'pr-002',
		purchase_request_number: 'LB/LPO/MR/2026/00141',
		purchase_request_date: '2026-04-21T08:00:00Z',
		reference_number: '',
		remarks: 'Permintaan peralatan kebun',
		requested_by: 'Siti Aminah',
		approval_status: 'APPROVED',
		total_items: 2,
		total_estimated_price: 0,
		is_processed: false,
		source_type: 'Lokal',
		follow_up_status: 'Menunggu Persetujuan LPO oleh Manager Kebun',
		follow_up_module: 'LOCAL_PURCHASE_ORDER'
	},
	// 3. APPROVED - With Rejection
	{
		id: 'pr-007',
		purchase_request_number: 'LB/LPO/MR/2026/00147',
		purchase_request_date: '2026-04-22T08:00:00Z',
		reference_number: '',
		remarks: 'Permintaan laptop dan printer',
		requested_by: 'Ahmad Hidayat',
		approval_status: 'APPROVED',
		total_items: 2,
		total_estimated_price: 0,
		is_processed: false,
		source_type: 'Lokal',
		follow_up_status: 'LPO Ditolak - Sedang Revisi',
		follow_up_module: 'LOCAL_PURCHASE_ORDER'
	},
	// 4. PENDING_APPROVAL_LEVEL_2
	{
		id: 'pr-003',
		purchase_request_number: 'LB/SG/MR/2026/00003',
		purchase_request_date: '2026-04-23T08:00:00Z',
		reference_number: '',
		remarks: 'Permintaan ke kebun sepupu',
		requested_by: 'Riyanto',
		approval_status: 'PENDING_APPROVAL_LEVEL_2',
		total_items: 2,
		total_estimated_price: 0,
		is_processed: false,
		source_type: 'Sepupu',
		follow_up_status: undefined,
		follow_up_module: undefined
	},
	// 5. PENDING_APPROVAL_LEVEL_1
	{
		id: 'pr-017',
		purchase_request_number: 'LB/LPO/MR/2026/00143',
		purchase_request_date: '2026-04-24T08:00:00Z',
		reference_number: '',
		remarks: 'Permintaan kebutuhan kantor',
		requested_by: 'Dewi Lestari',
		approval_status: 'PENDING_APPROVAL_LEVEL_1',
		total_items: 3,
		total_estimated_price: 0,
		is_processed: false,
		source_type: 'HO',
		follow_up_status: undefined,
		follow_up_module: undefined
	},
	// 6. DRAFT
	{
		id: 'pr-008',
		purchase_request_number: 'LB/IT/MR/2026/00015',
		purchase_request_date: '2026-04-25T08:00:00Z',
		reference_number: '',
		remarks: 'Draft - menunggu pengajuan',
		requested_by: 'Erik Obaza Barus',
		approval_status: 'DRAFT',
		total_items: 2,
		total_estimated_price: 0,
		is_processed: false,
		source_type: 'HO',
		follow_up_status: undefined,
		follow_up_module: undefined
	},
	// 7. REJECTED
	{
		id: 'pr-011',
		purchase_request_number: 'LB/BB/MR/2026/00004',
		purchase_request_date: '2026-04-17T08:00:00Z',
		reference_number: '',
		remarks: 'Ditolak karena tidak sesuai budget',
		requested_by: 'Siti Nurhaliza',
		approval_status: 'REJECTED',
		total_items: 2,
		total_estimated_price: 0,
		is_processed: false,
		source_type: 'Lokal',
		follow_up_status: undefined,
		follow_up_module: undefined
	},
	// 8. CANCELLED
	{
		id: 'pr-016',
		purchase_request_number: 'LB/LPO/MR/2026/00138',
		purchase_request_date: '2026-04-15T08:00:00Z',
		reference_number: '',
		remarks: 'Dibatalkan karena tidak jadi',
		requested_by: 'Ahmad Fauzi',
		approval_status: 'CANCELLED',
		total_items: 2,
		total_estimated_price: 0,
		is_processed: false,
		source_type: 'Lokal',
		follow_up_status: undefined,
		follow_up_module: undefined
	}
];

/**
 * Mock Purchase Request Detail Items (Simplified)
 */
const mockDetailItems: Record<string, PurchaseRequestDetailItem[]> = {
	'pr-001': [
		{
			id: 'item-1',
			item_id: 'item-001',
			item_code: 'ATK-001',
			item_name: 'Kertas HVS A4',
			uom: mockUOMs[3],
			quantity: 20,
			purpose: 'Kebutuhan cetak dokumen'
		},
		{
			id: 'item-2',
			item_id: 'item-002',
			item_code: 'ATK-002',
			item_name: 'Pulpen Hitam',
			uom: mockUOMs[2],
			quantity: 50,
			purpose: 'Kebutuhan administrasi'
		},
		{
			id: 'item-3',
			item_id: 'item-003',
			item_code: 'ATK-003',
			item_name: 'Stapler',
			uom: mockUOMs[2],
			quantity: 10,
			purpose: 'Kebutuhan administrasi'
		}
	],
	'pr-002': [
		{
			id: 'item-4',
			item_id: 'item-004',
			item_code: 'KBN-001',
			item_name: 'Cangkul',
			uom: mockUOMs[2],
			quantity: 15,
			purpose: 'Kebutuhan perawatan kebun'
		},
		{
			id: 'item-5',
			item_id: 'item-005',
			item_code: 'KBN-002',
			item_name: 'Parang',
			uom: mockUOMs[2],
			quantity: 20,
			purpose: 'Kebutuhan pemangkasan'
		}
	],
	'pr-003': [
		{
			id: 'item-6',
			item_id: 'item-006',
			item_code: 'STA-001',
			item_name: 'Kertas A4 80 gram',
			uom: mockUOMs[3],
			quantity: 50,
			purpose: 'Kebutuhan cetak dokumen'
		},
		{
			id: 'item-7',
			item_id: 'item-007',
			item_code: 'STA-002',
			item_name: 'Spidol Whiteboard',
			uom: mockUOMs[3],
			quantity: 30,
			purpose: 'Kebutuhan ruang meeting'
		}
	],
	'pr-007': [
		{
			id: 'item-8',
			item_id: 'item-008',
			item_code: 'OFF-020',
			item_name: 'Laptop Dell Latitude 5420',
			uom: mockUOMs[4],
			quantity: 2,
			purpose: 'Kebutuhan staff administrasi'
		},
		{
			id: 'item-9',
			item_id: 'item-009',
			item_code: 'OFF-021',
			item_name: 'Printer HP LaserJet Pro',
			uom: mockUOMs[4],
			quantity: 1,
			purpose: 'Kebutuhan kantor'
		}
	],
	'pr-008': [
		{
			id: 'item-10',
			item_id: 'item-010',
			item_code: 'IT-001',
			item_name: 'Mouse Wireless',
			uom: mockUOMs[2],
			quantity: 10,
			purpose: 'Kebutuhan staff IT'
		},
		{
			id: 'item-11',
			item_id: 'item-011',
			item_code: 'IT-002',
			item_name: 'Keyboard Mechanical',
			uom: mockUOMs[2],
			quantity: 5,
			purpose: 'Kebutuhan staff IT'
		}
	],
	'pr-011': [
		{
			id: 'item-12',
			item_id: 'item-012',
			item_code: 'CLN-001',
			item_name: 'Sabun Cuci Tangan',
			uom: mockUOMs[2],
			quantity: 20,
			purpose: 'Kebutuhan toilet kantor'
		},
		{
			id: 'item-13',
			item_id: 'item-013',
			item_code: 'CLN-002',
			item_name: 'Pembersih Lantai',
			uom: mockUOMs[1],
			quantity: 10,
			purpose: 'Kebutuhan kebersihan kantor'
		}
	],
	'pr-016': [
		{
			id: 'item-14',
			item_id: 'item-014',
			item_code: 'OFF-030',
			item_name: 'Tinta Printer',
			uom: mockUOMs[2],
			quantity: 10,
			purpose: 'Kebutuhan printer kantor'
		},
		{
			id: 'item-15',
			item_id: 'item-015',
			item_code: 'OFF-031',
			item_name: 'Baterai AA',
			uom: mockUOMs[3],
			quantity: 20,
			purpose: 'Kebutuhan remote AC'
		}
	],
	'pr-017': [
		{
			id: 'item-16',
			item_id: 'item-016',
			item_code: 'OFF-001',
			item_name: 'Tinta Printer Hitam',
			uom: mockUOMs[2],
			quantity: 10,
			purpose: 'Kebutuhan printer kantor'
		},
		{
			id: 'item-17',
			item_id: 'item-017',
			item_code: 'OFF-002',
			item_name: 'Tinta Printer Warna',
			uom: mockUOMs[2],
			quantity: 8,
			purpose: 'Kebutuhan printer kantor'
		},
		{
			id: 'item-18',
			item_id: 'item-018',
			item_code: 'OFF-003',
			item_name: 'Lakban Coklat',
			uom: mockUOMs[2],
			quantity: 15,
			purpose: 'Kebutuhan packing barang'
		}
	]
};

/**
 * Mock Purchase Request Details (Simplified)
 */
const mockPurchaseRequestDetails: Record<string, PurchaseRequestDetail> = {
	'pr-001': {
		id: 'pr-001',
		purchase_request_number: 'LB/LPO/MR/2026/00142',
		purchase_request_date: '2026-04-20T08:00:00Z',
		purchase_request_type_id: 'pr-type-1',
		purchase_request_type: mockPRTypes[0],
		request_source_id: 'source-1',
		RequestSource: mockRequestSources[0],
		reference_number: '',
		remarks: 'Permintaan alat tulis kantor',
		requested_by: 'Bambang Suryanto',
		i_version: 1,
		approval_status: 'APPROVED',
		approval_id: 'appr-001',
		status_changed_by: 'Manager Kebun',
		status_change_date: '2026-04-20T10:00:00Z',
		status_change_remarks: 'Disetujui',
		items: mockDetailItems['pr-001'],
		is_processed: false
	},
	'pr-002': {
		id: 'pr-002',
		purchase_request_number: 'LB/LPO/MR/2026/00141',
		purchase_request_date: '2026-04-21T08:00:00Z',
		purchase_request_type_id: 'pr-type-1',
		purchase_request_type: mockPRTypes[0],
		request_source_id: 'source-1',
		RequestSource: mockRequestSources[0],
		reference_number: '',
		remarks: 'Permintaan peralatan kebun',
		requested_by: 'Siti Aminah',
		i_version: 1,
		approval_status: 'APPROVED',
		approval_id: 'appr-002',
		items: mockDetailItems['pr-002'],
		is_processed: false
	},
	'pr-003': {
		id: 'pr-003',
		purchase_request_number: 'LB/SG/MR/2026/00003',
		purchase_request_date: '2026-04-23T08:00:00Z',
		purchase_request_type_id: 'pr-type-3',
		purchase_request_type: mockPRTypes[2],
		request_source_id: 'source-1',
		RequestSource: mockRequestSources[0],
		reference_number: '',
		remarks: 'Permintaan ke kebun sepupu',
		requested_by: 'Riyanto',
		i_version: 1,
		approval_status: 'PENDING_APPROVAL_LEVEL_2',
		approval_id: 'appr-003',
		items: mockDetailItems['pr-003'],
		is_processed: false
	},
	'pr-007': {
		id: 'pr-007',
		purchase_request_number: 'LB/LPO/MR/2026/00147',
		purchase_request_date: '2026-04-22T08:00:00Z',
		purchase_request_type_id: 'pr-type-1',
		purchase_request_type: mockPRTypes[0],
		request_source_id: 'source-1',
		RequestSource: mockRequestSources[0],
		reference_number: '',
		remarks: 'Permintaan laptop dan printer',
		requested_by: 'Ahmad Hidayat',
		i_version: 1,
		approval_status: 'APPROVED',
		approval_id: 'appr-007',
		status_changed_by: 'Manager Kebun',
		status_change_date: '2026-04-22T14:00:00Z',
		status_change_remarks: 'Disetujui',
		items: mockDetailItems['pr-007'],
		is_processed: false
	},
	'pr-008': {
		id: 'pr-008',
		purchase_request_number: 'LB/IT/MR/2026/00015',
		purchase_request_date: '2026-04-25T08:00:00Z',
		purchase_request_type_id: 'pr-type-1',
		purchase_request_type: mockPRTypes[0],
		request_source_id: 'source-1',
		RequestSource: mockRequestSources[0],
		reference_number: '',
		remarks: 'Draft - menunggu pengajuan',
		requested_by: 'Erik Obaza Barus',
		i_version: 1,
		approval_status: 'DRAFT',
		items: mockDetailItems['pr-008'],
		is_processed: false
	},
	'pr-011': {
		id: 'pr-011',
		purchase_request_number: 'LB/BB/MR/2026/00004',
		purchase_request_date: '2026-04-17T08:00:00Z',
		purchase_request_type_id: 'pr-type-1',
		purchase_request_type: mockPRTypes[0],
		request_source_id: 'source-1',
		RequestSource: mockRequestSources[0],
		reference_number: '',
		remarks: 'Ditolak karena tidak sesuai budget',
		requested_by: 'Siti Nurhaliza',
		i_version: 1,
		approval_status: 'REJECTED',
		approval_id: 'appr-011',
		status_changed_by: 'Manager Kebun',
		status_change_date: '2026-04-17T14:00:00Z',
		status_change_remarks: 'Ditolak karena tidak sesuai budget',
		items: mockDetailItems['pr-011'],
		is_processed: false
	},
	'pr-016': {
		id: 'pr-016',
		purchase_request_number: 'LB/LPO/MR/2026/00138',
		purchase_request_date: '2026-04-15T08:00:00Z',
		purchase_request_type_id: 'pr-type-1',
		purchase_request_type: mockPRTypes[0],
		request_source_id: 'source-1',
		RequestSource: mockRequestSources[0],
		reference_number: '',
		remarks: 'Dibatalkan karena tidak jadi',
		requested_by: 'Ahmad Fauzi',
		i_version: 1,
		approval_status: 'CANCELLED',
		items: mockDetailItems['pr-016'],
		is_processed: false,
		cancelled_reason: 'Tidak jadi beli karena sudah ada stok',
		cancelled_by: 'Ahmad Fauzi',
		cancelled_at: '2026-04-15T10:00:00Z'
	},
	'pr-017': {
		id: 'pr-017',
		purchase_request_number: 'LB/LPO/MR/2026/00143',
		purchase_request_date: '2026-04-24T08:00:00Z',
		purchase_request_type_id: 'pr-type-1',
		purchase_request_type: mockPRTypes[0],
		request_source_id: 'source-1',
		RequestSource: mockRequestSources[0],
		reference_number: '',
		remarks: 'Permintaan kebutuhan kantor',
		requested_by: 'Dewi Lestari',
		i_version: 1,
		approval_status: 'PENDING_APPROVAL_LEVEL_1',
		approval_id: 'appr-017',
		items: mockDetailItems['pr-017'],
		is_processed: false
	}
};

/**
 * Mock Summary Statistics
 */
const mockSummary: PurchaseRequestSummary = {
	total_requests: 1660,
	total_purchase_order: 1632,
	total_local_purchase_order: 25
};

/**
 * Mock Approval History
 */
const mockApprovalHistory: Record<string, ApprovalHistoryResponse> = {
	'appr-001': {
		$schema: 'approval-history-response',
		data: {
			uoid: 'appr-001',
			document_type: 'PURCHASE_REQUEST',
			document_id: 'pr-001',
			document_number: 'LB/LPO/MR/2026/00142',
			current_level: 2,
			status: 'APPROVED',
			submitted_by: 'socfin~d\\farhank',
			submitted_at: 1745136000000,
			business_location_id: 'estate-1',
			actions: [
				{
					uoid: 'action-1',
					level: 1,
					level_name: 'Supervisor',
					action: 'APPROVED',
					approver_id: 'user-001',
					approver_name: 'Supervisor Kebun',
					action_date: 1745139600000,
					remarks: 'Disetujui'
				},
				{
					uoid: 'action-2',
					level: 2,
					level_name: 'Manager',
					action: 'APPROVED',
					approver_id: 'user-002',
					approver_name: 'Manager Kebun',
					action_date: 1745143200000,
					remarks: 'Disetujui'
				}
			]
		}
	},
	'appr-002': {
		$schema: 'approval-history-response',
		data: {
			uoid: 'appr-002',
			document_type: 'PURCHASE_REQUEST',
			document_id: 'pr-002',
			document_number: 'LB/LPO/MR/2026/00141',
			current_level: 1,
			status: 'PENDING',
			submitted_by: 'socfin~d\\farhank',
			submitted_at: 1745136000000,
			business_location_id: 'estate-1',
			actions: [
				{
					uoid: 'action-3',
					level: 1,
					level_name: 'Manager Kebun',
					action: 'PENDING',
					approver_id: 'user-002',
					approver_name: 'Manager Kebun',
					action_date: 1745136000000,
					remarks: 'Menunggu Approval Manajer Kebun'
				}
			]
		}
	},
	'appr-003': {
		$schema: 'approval-history-response',
		data: {
			uoid: 'appr-003',
			document_type: 'PURCHASE_REQUEST',
			document_id: 'pr-003',
			document_number: 'LB/SG/MR/2026/00003',
			current_level: 2,
			status: 'APPROVED',
			submitted_by: 'Riyanto',
			submitted_at: 1745049600000,
			business_location_id: 'estate-1',
			actions: [
				{
					uoid: 'action-4',
					level: 1,
					level_name: 'Supervisor',
					action: 'APPROVED',
					approver_id: 'user-001',
					approver_name: 'Supervisor Kebun',
					action_date: 1745053200000,
					remarks: 'Disetujui'
				},
				{
					uoid: 'action-5',
					level: 2,
					level_name: 'Manager',
					action: 'APPROVED',
					approver_id: 'user-002',
					approver_name: 'Manager Kebun',
					action_date: 1745056800000,
					remarks: 'Disetujui'
				}
			]
		}
	}
};

/**
 * Mock Procurement Sources - Multiple items
 */
const mockProcurementSourcesMap: Record<string, ProcurementSourceResponse> = {
	'FRT-001': {
		$schema: 'procurement-source-response',
		data: {
			item: {
				id: 'item-001',
				code: 'FRT-001',
				name: 'Pupuk Urea',
				short_name: 'Urea',
				uom: mockUOMs[0],
				minimum_stock: '500',
				maximum_stock: '2000',
				reorder_level: '800',
				stock_total: {
					total_current_stock: '650',
					total_reserved_stock: '100',
					total_available_stock: '550',
					total_value: '9750000',
					last_recalc_at: '2024-04-20T08:00:00Z'
				}
			},
			procurement_sources: [
				{
					master_value: {
						id: 'proc-1',
						value: 'Local Purchase Order',
						code: 1
					},
					status: {
						label: 'Available',
						severity: 'info'
					},
					detail: {
						text: 'Can be purchased locally',
						type: 'LOCAL_RULE'
					},
					local: {
						decision: 'APPROVED',
						remarks: 'Available from local vendors'
					},
					approval_status: {
						is_approved: true
					},
					latest_lpo: {
						lpo_number: 'LPO/2024/03/015',
						lpo_date: '2024-03-15',
						purpose: 'Pemupukan rutin',
						quantity: 1000,
						uom: 'KG',
						rate: 15000,
						amount: 15000000,
						sanctioned_qty: 1000,
						received_qty: 1000
					},
					price_comparison: {
						lpo_price: 15000,
						budget_price: 14500,
						budget_diff_percent: 3.45
					}
				},
				{
					master_value: {
						id: 'proc-2',
						value: 'Purchase Order',
						code: 2
					},
					status: {
						label: 'Available',
						severity: 'info'
					},
					detail: {
						text: 'Can be purchased through HO',
						type: null
					},
					ho_budget_price: {
						budget_price: 14500,
						currency: 'IDR',
						fiscal_year: 2024,
						uom: 'KG'
					},
					latest_po: {
						po_number: 'PO/2024/02/025',
						document_date: '2024-02-20',
						estate_code: 'EST-001',
						item_code: 'FRT-001',
						material_short_text: 'Pupuk Urea',
						quantity: 2000,
						uom: 'KG',
						net_price: 14500,
						net_order_value: 29000000,
						currency: 'IDR',
						synced_at: '2024-02-20T10:00:00Z'
					},
					price_comparison: {
						ho_price: 14500,
						budget_price: 14500,
						ho_price_diff_percent: 0
					}
				},
				{
					master_value: {
						id: 'proc-3',
						value: 'Other Estate',
						code: 3
					},
					status: {
						label: 'Available',
						severity: 'info'
					},
					detail: {
						text: 'Available from cousin estates',
						type: 'ESTATE_LIST',
						endpoint: '/api/items/FRT-001/cousin-garden-stock'
					},
					sepupu: {
						snapshot_time: '2024-04-20T08:00:00Z',
						availability: [
							{
								estate_id: 'estate-2',
								estate_code: 'EST-002',
								estate_name: 'Kebun Sejahtera',
								current_stock: 1500,
								price: 14000,
								currency: 'IDR',
								uom: mockUOMs[0]
							},
							{
								estate_id: 'estate-3',
								estate_code: 'EST-003',
								estate_name: 'Kebun Makmur',
								current_stock: 800,
								price: 14200,
								currency: 'IDR',
								uom: mockUOMs[0]
							}
						]
					}
				}
			]
		}
	},
	'ATK-001': {
		$schema: 'procurement-source-response',
		data: {
			item: {
				id: 'item-002',
				code: 'ATK-001',
				name: 'Tissue Kotak',
				short_name: 'Tissue',
				uom: mockUOMs[3], // BOX
				minimum_stock: '20',
				maximum_stock: '100',
				reorder_level: '30',
				stock_total: {
					total_current_stock: '25',
					total_reserved_stock: '5',
					total_available_stock: '20',
					total_value: '375000',
					last_recalc_at: '2024-04-20T08:00:00Z'
				}
			},
			procurement_sources: [
				{
					master_value: {
						id: 'proc-1',
						value: 'Local Purchase Order',
						code: 1
					},
					status: {
						label: 'Available',
						severity: 'info'
					},
					detail: {
						text: 'Can be purchased locally',
						type: 'LOCAL_RULE'
					},
					local: {
						decision: 'APPROVED',
						remarks: 'Available from local vendors'
					},
					approval_status: {
						is_approved: true
					},
					latest_lpo: {
						lpo_number: 'LPO/2024/03/001',
						lpo_date: '2024-03-15',
						purpose: 'Kebutuhan kantor',
						quantity: 50,
						uom: 'BOX',
						rate: 14500,
						amount: 725000,
						sanctioned_qty: 50,
						received_qty: 50
					},
					price_comparison: {
						lpo_price: 14500,
						budget_price: 15000,
						budget_diff_percent: -3.33
					}
				},
				{
					master_value: {
						id: 'proc-2',
						value: 'Purchase Order',
						code: 2
					},
					status: {
						label: 'Available',
						severity: 'info'
					},
					detail: {
						text: 'Can be purchased through HO',
						type: null
					},
					ho_budget_price: {
						budget_price: 14800,
						currency: 'IDR',
						fiscal_year: 2024,
						uom: 'BOX'
					},
					latest_po: {
						po_number: 'PO/2024/02/028',
						document_date: '2024-02-18',
						estate_code: 'EST-001',
						item_code: 'ATK-001',
						material_short_text: 'Tissue Kotak',
						quantity: 100,
						uom: 'BOX',
						net_price: 14800,
						net_order_value: 1480000,
						currency: 'IDR',
						synced_at: '2024-02-18T10:00:00Z'
					},
					price_comparison: {
						ho_price: 14800,
						budget_price: 15000,
						ho_price_diff_percent: -1.33
					}
				},
				{
					master_value: {
						id: 'proc-3',
						value: 'Other Estate',
						code: 3
					},
					status: {
						label: 'Available',
						severity: 'info'
					},
					detail: {
						text: 'Available from cousin estates',
						type: 'ESTATE_LIST',
						endpoint: '/api/items/ATK-001/cousin-garden-stock'
					},
					sepupu: {
						snapshot_time: '2024-04-20T08:00:00Z',
						availability: [
							{
								estate_id: 'estate-2',
								estate_code: 'EST-002',
								estate_name: 'Kebun Sejahtera',
								current_stock: 80,
								price: 14200,
								currency: 'IDR',
								uom: mockUOMs[3]
							},
							{
								estate_id: 'estate-3',
								estate_code: 'EST-003',
								estate_name: 'Kebun Makmur',
								current_stock: 60,
								price: 14300,
								currency: 'IDR',
								uom: mockUOMs[3]
							}
						]
					}
				}
			]
		}
	},
	'ATK-002': {
		$schema: 'procurement-source-response',
		data: {
			item: {
				id: 'item-003',
				code: 'ATK-002',
				name: 'Gula Pasir',
				short_name: 'Gula',
				uom: mockUOMs[0], // KG
				minimum_stock: '10',
				maximum_stock: '50',
				reorder_level: '15',
				stock_total: {
					total_current_stock: '12',
					total_reserved_stock: '2',
					total_available_stock: '10',
					total_value: '210000',
					last_recalc_at: '2024-04-20T08:00:00Z'
				}
			},
			procurement_sources: [
				{
					master_value: {
						id: 'proc-1',
						value: 'Local Purchase Order',
						code: 1
					},
					status: {
						label: 'Perlu Izin',
						severity: 'warning'
					},
					detail: {
						text: 'Requires department approval for local purchase',
						type: 'LOCAL_RULE'
					},
					local: {
						decision: 'NEEDS_APPROVAL',
						remarks: 'Requires department approval'
					},
					approval_status: {
						is_approved: false
					},
					latest_lpo: {
						lpo_number: 'LPO/2024/03/002',
						lpo_date: '2024-03-15',
						purpose: 'Kebutuhan pantry',
						quantity: 25,
						uom: 'KG',
						rate: 17500,
						amount: 437500,
						sanctioned_qty: 25,
						received_qty: 25
					},
					price_comparison: {
						lpo_price: 17500,
						budget_price: 18000,
						budget_diff_percent: -2.78
					}
				},
				{
					master_value: {
						id: 'proc-2',
						value: 'Purchase Order',
						code: 2
					},
					status: {
						label: 'Available',
						severity: 'info'
					},
					detail: {
						text: 'Can be purchased through HO',
						type: null
					},
					ho_budget_price: {
						budget_price: 17800,
						currency: 'IDR',
						fiscal_year: 2024,
						uom: 'KG'
					},
					latest_po: {
						po_number: 'PO/2024/02/029',
						document_date: '2024-02-19',
						estate_code: 'EST-001',
						item_code: 'ATK-002',
						material_short_text: 'Gula Pasir',
						quantity: 100,
						uom: 'KG',
						net_price: 17800,
						net_order_value: 1780000,
						currency: 'IDR',
						synced_at: '2024-02-19T10:00:00Z'
					},
					price_comparison: {
						ho_price: 17800,
						budget_price: 18000,
						ho_price_diff_percent: -1.11
					}
				},
				{
					master_value: {
						id: 'proc-3',
						value: 'Other Estate',
						code: 3
					},
					status: {
						label: 'Available',
						severity: 'info'
					},
					detail: {
						text: 'Available from cousin estates',
						type: 'ESTATE_LIST',
						endpoint: '/api/items/ATK-002/cousin-garden-stock'
					},
					sepupu: {
						snapshot_time: '2024-04-20T08:00:00Z',
						availability: [
							{
								estate_id: 'estate-2',
								estate_code: 'EST-002',
								estate_name: 'Kebun Sejahtera',
								current_stock: 50,
								price: 17000,
								currency: 'IDR',
								uom: mockUOMs[0]
							},
							{
								estate_id: 'estate-3',
								estate_code: 'EST-003',
								estate_name: 'Kebun Makmur',
								current_stock: 35,
								price: 17200,
								currency: 'IDR',
								uom: mockUOMs[0]
							}
						]
					}
				}
			]
		}
	},
	'CLN-001': {
		$schema: 'procurement-source-response',
		data: {
			item: {
				id: 'item-004',
				code: 'CLN-001',
				name: 'Sabun Cuci Tangan',
				short_name: 'Sabun',
				uom: mockUOMs[2], // PCS
				minimum_stock: '10',
				maximum_stock: '50',
				reorder_level: '15',
				stock_total: {
					total_current_stock: '8',
					total_reserved_stock: '2',
					total_available_stock: '6',
					total_value: '200000',
					last_recalc_at: '2024-04-20T08:00:00Z'
				}
			},
			procurement_sources: [
				{
					master_value: {
						id: 'proc-1',
						value: 'Local Purchase Order',
						code: 1
					},
					status: {
						label: 'Available',
						severity: 'info'
					},
					detail: {
						text: 'Can be purchased locally',
						type: 'LOCAL_RULE'
					},
					local: {
						decision: 'APPROVED',
						remarks: 'Available from local vendors'
					},
					approval_status: {
						is_approved: true
					},
					latest_lpo: {
						lpo_number: 'LPO/2024/03/005',
						lpo_date: '2024-03-10',
						purpose: 'Kebutuhan toilet',
						quantity: 20,
						uom: 'PCS',
						rate: 25000,
						amount: 500000,
						sanctioned_qty: 20,
						received_qty: 20
					},
					price_comparison: {
						lpo_price: 25000,
						budget_price: 25000,
						budget_diff_percent: 0
					}
				},
				{
					master_value: {
						id: 'proc-2',
						value: 'Purchase Order',
						code: 2
					},
					status: {
						label: 'Available',
						severity: 'info'
					},
					detail: {
						text: 'Can be purchased through HO',
						type: null
					},
					ho_budget_price: {
						budget_price: 24000,
						currency: 'IDR',
						fiscal_year: 2024,
						uom: 'PCS'
					},
					latest_po: {
						po_number: 'PO/2024/02/030',
						document_date: '2024-02-15',
						estate_code: 'EST-001',
						item_code: 'CLN-001',
						material_short_text: 'Sabun Cuci Tangan',
						quantity: 100,
						uom: 'PCS',
						net_price: 24000,
						net_order_value: 2400000,
						currency: 'IDR',
						synced_at: '2024-02-15T10:00:00Z'
					},
					price_comparison: {
						ho_price: 24000,
						budget_price: 25000,
						ho_price_diff_percent: -4.0
					}
				},
				{
					master_value: {
						id: 'proc-3',
						value: 'Other Estate',
						code: 3
					},
					status: {
						label: 'Available',
						severity: 'info'
					},
					detail: {
						text: 'Available from cousin estates',
						type: 'ESTATE_LIST',
						endpoint: '/api/items/CLN-001/cousin-garden-stock'
					},
					sepupu: {
						snapshot_time: '2024-04-20T08:00:00Z',
						availability: [
							{
								estate_id: 'estate-2',
								estate_code: 'EST-002',
								estate_name: 'Kebun Sejahtera',
								current_stock: 45,
								price: 24500,
								currency: 'IDR',
								uom: mockUOMs[2]
							},
							{
								estate_id: 'estate-3',
								estate_code: 'EST-003',
								estate_name: 'Kebun Makmur',
								current_stock: 30,
								price: 24800,
								currency: 'IDR',
								uom: mockUOMs[2]
							}
						]
					}
				}
			]
		}
	},
	// Test item with "Perlu Izin" status for local purchase
	'TEST-001': {
		$schema: 'procurement-source-response',
		data: {
			item: {
				id: 'item-test-001',
				code: 'TEST-001',
				name: 'Barang Test Perlu Izin',
				short_name: 'Test Izin',
				uom: mockUOMs[2], // PCS
				minimum_stock: '5',
				maximum_stock: '50',
				reorder_level: '10',
				stock_total: {
					total_current_stock: '3',
					total_reserved_stock: '1',
					total_available_stock: '2',
					total_value: '100000',
					last_recalc_at: '2024-04-20T08:00:00Z'
				}
			},
			procurement_sources: [
				{
					master_value: {
						id: 'proc-1',
						value: 'Local Purchase Order',
						code: 1
					},
					status: {
						label: 'Perlu Izin',
						severity: 'warning'
					},
					detail: {
						text: 'Requires department approval for local purchase',
						type: 'LOCAL_RULE'
					},
					local: {
						decision: 'NEEDS_APPROVAL',
						remarks: 'Requires department approval'
					},
					approval_status: {
						is_approved: false
					},
					latest_lpo: {
						lpo_number: 'LPO/2024/03/099',
						lpo_date: '2024-03-20',
						purpose: 'Kebutuhan khusus',
						quantity: 5,
						uom: 'PCS',
						rate: 50000,
						amount: 250000,
						sanctioned_qty: 5,
						received_qty: 5
					},
					price_comparison: {
						lpo_price: 50000,
						budget_price: 52000,
						budget_diff_percent: -3.85
					}
				},
				{
					master_value: {
						id: 'proc-2',
						value: 'Purchase Order',
						code: 2
					},
					status: {
						label: 'Available',
						severity: 'info'
					},
					detail: {
						text: 'Can be purchased through HO',
						type: null
					},
					ho_budget_price: {
						budget_price: 51000,
						currency: 'IDR',
						fiscal_year: 2024,
						uom: 'PCS'
					},
					latest_po: {
						po_number: 'PO/2024/02/099',
						document_date: '2024-02-25',
						estate_code: 'EST-001',
						item_code: 'TEST-001',
						material_short_text: 'Barang Test Perlu Izin',
						quantity: 20,
						uom: 'PCS',
						net_price: 51000,
						net_order_value: 1020000,
						currency: 'IDR',
						synced_at: '2024-02-25T10:00:00Z'
					},
					price_comparison: {
						ho_price: 51000,
						budget_price: 52000,
						ho_price_diff_percent: -1.92
					}
				},
				{
					master_value: {
						id: 'proc-3',
						value: 'Other Estate',
						code: 3
					},
					status: {
						label: 'Available',
						severity: 'info'
					},
					detail: {
						text: 'Available from cousin estates',
						type: 'ESTATE_LIST',
						endpoint: '/api/items/TEST-001/cousin-garden-stock'
					},
					sepupu: {
						snapshot_time: '2024-04-20T08:00:00Z',
						availability: [
							{
								estate_id: 'estate-2',
								estate_code: 'EST-002',
								estate_name: 'Kebun Sejahtera',
								current_stock: 15,
								price: 49000,
								currency: 'IDR',
								uom: mockUOMs[2]
							},
							{
								estate_id: 'estate-3',
								estate_code: 'EST-003',
								estate_name: 'Kebun Makmur',
								current_stock: 10,
								price: 49500,
								currency: 'IDR',
								uom: mockUOMs[2]
							}
						]
					}
				}
			]
		}
	},
	// Default fallback for any other item
	'DEFAULT': {
		$schema: 'procurement-source-response',
		data: {
			item: {
				id: 'item-default',
				code: 'ITEM-DEFAULT',
				name: 'Item Default',
				short_name: 'Default',
				uom: mockUOMs[2], // PCS
				minimum_stock: '10',
				maximum_stock: '100',
				reorder_level: '20',
				stock_total: {
					total_current_stock: '15',
					total_reserved_stock: '5',
					total_available_stock: '10',
					total_value: '150000',
					last_recalc_at: '2024-04-20T08:00:00Z'
				}
			},
			procurement_sources: [
				{
					master_value: {
						id: 'proc-1',
						value: 'Local Purchase Order',
						code: 1
					},
					status: {
						label: 'Available',
						severity: 'info'
					},
					detail: {
						text: 'Can be purchased locally',
						type: 'LOCAL_RULE'
					},
					local: {
						decision: 'APPROVED',
						remarks: 'Available from local vendors'
					},
					approval_status: {
						is_approved: true
					},
					latest_lpo: {
						lpo_number: 'LPO/2024/03/099',
						lpo_date: '2024-03-20',
						purpose: 'Kebutuhan operasional',
						quantity: 10,
						uom: 'PCS',
						rate: 15000,
						amount: 150000,
						sanctioned_qty: 10,
						received_qty: 10
					},
					price_comparison: {
						lpo_price: 15000,
						budget_price: 15500,
						budget_diff_percent: -3.23
					}
				},
				{
					master_value: {
						id: 'proc-2',
						value: 'Purchase Order',
						code: 2
					},
					status: {
						label: 'Available',
						severity: 'info'
					},
					detail: {
						text: 'Can be purchased through HO',
						type: null
					},
					ho_budget_price: {
						budget_price: 15200,
						currency: 'IDR',
						fiscal_year: 2024,
						uom: 'PCS'
					},
					latest_po: {
						po_number: 'PO/2024/02/099',
						document_date: '2024-02-25',
						estate_code: 'EST-001',
						item_code: 'ITEM-DEFAULT',
						material_short_text: 'Item Default',
						quantity: 50,
						uom: 'PCS',
						net_price: 15200,
						net_order_value: 760000,
						currency: 'IDR',
						synced_at: '2024-02-25T10:00:00Z'
					},
					price_comparison: {
						ho_price: 15200,
						budget_price: 15500,
						ho_price_diff_percent: -1.94
					}
				},
				{
					master_value: {
						id: 'proc-3',
						value: 'Other Estate',
						code: 3
					},
					status: {
						label: 'Available',
						severity: 'info'
					},
					detail: {
						text: 'Available from cousin estates',
						type: 'ESTATE_LIST',
						endpoint: '/api/items/DEFAULT/cousin-garden-stock'
					},
					sepupu: {
						snapshot_time: '2024-04-20T08:00:00Z',
						availability: [
							{
								estate_id: 'estate-2',
								estate_code: 'EST-002',
								estate_name: 'Kebun Sejahtera',
								current_stock: 25,
								price: 15000,
								currency: 'IDR',
								uom: mockUOMs[2]
							},
							{
								estate_id: 'estate-3',
								estate_code: 'EST-003',
								estate_name: 'Kebun Makmur',
								current_stock: 18,
								price: 15100,
								currency: 'IDR',
								uom: mockUOMs[2]
							}
						]
					}
				}
			]
		}
	}
};

/**
 * Mock Purchasing Groups
 */
const mockPurchasingGroups: PurchasingGroupResponse = {
	$schema: 'purchasing-group-response',
	data: [
		{
			uoid: 'pg-001',
			code: 'DEPT-001',
			name: 'Departemen Pembelian'
		},
		{
			uoid: 'pg-002',
			code: 'DEPT-002',
			name: 'Departemen Maintenance'
		},
		{
			uoid: 'pg-003',
			code: 'DEPT-003',
			name: 'Departemen Produksi'
		}
	],
	paging: {
		page: 1,
		size: 10,
		total_item: 3,
		total_page: 1
	}
};

let nextId = 16;

/**
 * Mock Simplified Tracking Data for PR-006 (Opsi C - Hybrid Approach)
 * 5 Milestones instead of 15 steps
 */
const mockSimplifiedTracking: Record<string, any> = {
	'pr-006': [
		// Item 1: Cangkul - COMPLETED (100%)
		{
			item_code: 'TOOL-001',
			item_name: 'Cangkul',
			quantity: 10,
			uom: 'pcs',
			current_milestone: 'GOODS_ISSUED',
			current_milestone_label: 'Pengeluaran Barang',
			progress_percentage: 100,
			related_documents: {
				rfq: 'RFQ/2026/0030',
				lpo: 'LPO/2026/0030',
				lpo_id: 'lpo-030',
				grn: 'GRN/2026/0030',
				gi: 'GI/2026/0030'
			},
			milestones: [
				{
					milestone: 'MR_APPROVED',
					label: '1. MR Disetujui',
					status: 'completed',
					timestamp: '2026-04-20T14:00:00Z',
					document_number: 'MR/2026/006'
				},
				{
					milestone: 'PURCHASE_PROCESS',
					label: '2. Proses Pembelian (RFQ/LPO)',
					status: 'completed',
					timestamp: '2026-04-24T14:00:00Z',
					document_number: 'LPO/2026/0030'
				},
				{
					milestone: 'WAITING_DELIVERY',
					label: '3. Menunggu Pengiriman',
					status: 'completed',
					timestamp: '2026-04-25T09:00:00Z',
					document_number: 'LPO/2026/0030'
				},
				{
					milestone: 'GOODS_RECEIVED',
					label: '4. Penerimaan Barang',
					status: 'completed',
					timestamp: '2026-04-25T14:00:00Z',
					document_number: 'GRN/2026/0030'
				},
				{
					milestone: 'GOODS_ISSUED',
					label: '5. Pengeluaran Barang',
					status: 'completed',
					timestamp: '2026-04-26T14:00:00Z',
					document_number: 'GI/2026/0030'
				}
			]
		},
		// Item 2: Parang - IN PROGRESS at Step 3 (60%)
		{
			item_code: 'TOOL-002',
			item_name: 'Parang',
			quantity: 15,
			uom: 'pcs',
			current_milestone: 'WAITING_DELIVERY',
			current_milestone_label: 'Menunggu Pengiriman',
			progress_percentage: 60,
			related_documents: {
				rfq: 'RFQ/2026/0031',
				lpo: 'LPO/2026/0031',
				lpo_id: 'lpo-031',
				grn: undefined,
				gi: undefined
			},
			milestones: [
				{
					milestone: 'MR_APPROVED',
					label: '1. MR Disetujui',
					status: 'completed',
					timestamp: '2026-04-20T14:00:00Z',
					document_number: 'MR/2026/006'
				},
				{
					milestone: 'PURCHASE_PROCESS',
					label: '2. Proses Pembelian (RFQ/LPO)',
					status: 'completed',
					timestamp: '2026-04-23T14:00:00Z',
					document_number: 'LPO/2026/0031'
				},
				{
					milestone: 'WAITING_DELIVERY',
					label: '3. Menunggu Pengiriman',
					status: 'in_progress',
					timestamp: '2026-04-23T17:00:00Z',
					document_number: 'LPO/2026/0031'
				},
				{
					milestone: 'GOODS_RECEIVED',
					label: '4. Penerimaan Barang',
					status: 'pending'
				},
				{
					milestone: 'GOODS_ISSUED',
					label: '5. Pengeluaran Barang',
					status: 'pending'
				}
			]
		},
		// Item 3: Sarung Tangan - IN PROGRESS at Step 2 (40%)
		{
			item_code: 'TOOL-003',
			item_name: 'Sarung Tangan',
			quantity: 50,
			uom: 'pasang',
			current_milestone: 'PURCHASE_PROCESS',
			current_milestone_label: 'Proses Pembelian (RFQ/LPO)',
			progress_percentage: 40,
			related_documents: {
				rfq: 'RFQ/2026/0032',
				lpo: undefined,
				lpo_id: undefined,
				grn: undefined,
				gi: undefined
			},
			milestones: [
				{
					milestone: 'MR_APPROVED',
					label: '1. MR Disetujui',
					status: 'completed',
					timestamp: '2026-04-20T14:00:00Z',
					document_number: 'MR/2026/006'
				},
				{
					milestone: 'PURCHASE_PROCESS',
					label: '2. Proses Pembelian (RFQ/LPO)',
					status: 'in_progress',
					timestamp: '2026-04-24T16:00:00Z',
					document_number: 'RFQ/2026/0032'
				},
				{
					milestone: 'WAITING_DELIVERY',
					label: '3. Menunggu Pengiriman',
					status: 'pending'
				},
				{
					milestone: 'GOODS_RECEIVED',
					label: '4. Penerimaan Barang',
					status: 'pending'
				},
				{
					milestone: 'GOODS_ISSUED',
					label: '5. Pengeluaran Barang',
					status: 'pending'
				}
			]
		},
		// Item 4: Sepatu Boot - IN PROGRESS at Step 1 (20%)
		{
			item_code: 'TOOL-004',
			item_name: 'Sepatu Boot',
			quantity: 20,
			uom: 'pasang',
			current_milestone: 'MR_APPROVED',
			current_milestone_label: 'MR Disetujui',
			progress_percentage: 20,
			related_documents: {
				rfq: undefined,
				lpo: undefined,
				lpo_id: undefined,
				grn: undefined,
				gi: undefined
			},
			milestones: [
				{
					milestone: 'MR_APPROVED',
					label: '1. MR Disetujui',
					status: 'in_progress',
					timestamp: '2026-04-20T14:00:00Z',
					document_number: 'MR/2026/006'
				},
				{
					milestone: 'PURCHASE_PROCESS',
					label: '2. Proses Pembelian (RFQ/LPO)',
					status: 'pending'
				},
				{
					milestone: 'WAITING_DELIVERY',
					label: '3. Menunggu Pengiriman',
					status: 'pending'
				},
				{
					milestone: 'GOODS_RECEIVED',
					label: '4. Penerimaan Barang',
					status: 'pending'
				},
				{
					milestone: 'GOODS_ISSUED',
					label: '5. Pengeluaran Barang',
					status: 'pending'
				}
			]
		}
	]
};

/**
 * Mock LPO Tracking Data (Opsi C - Hybrid Approach)
 */
const mockLPOTracking: Record<string, any> = {
	'lpo-030': {
		lpo_id: 'lpo-030',
		lpo_number: 'LPO/2026/0030',
		vendor_name: 'Toko Pertanian Makmur',
		total_items: 1,
		total_amount: 5000000,
		items: [
			{
				item_code: 'TOOL-001',
				item_name: 'Cangkul',
				quantity: 10,
				uom: 'pcs',
				source_mr: 'MR/2026/006',
				source_mr_id: 'pr-006'
			}
		],
		current_status: 'COMPLETED',
		current_status_label: 'Proses Selesai',
		progress_percentage: 100,
		timeline: [
			{
				id: 'lpo-030-1',
				step: 1,
				status: 'LPO_CREATED',
				status_label: 'LPO Dibuat oleh KTU',
				timestamp: '2026-04-22T08:00:00Z',
				performed_by: 'user-001',
				performed_by_name: 'KTU',
				remarks: 'LPO dibuat untuk 1 item dari MR-006',
				is_current: false
			},
			{
				id: 'lpo-030-2',
				step: 2,
				status: 'LPO_SUBMITTED',
				status_label: 'LPO Diajukan untuk Approval',
				timestamp: '2026-04-22T09:00:00Z',
				performed_by: 'user-001',
				performed_by_name: 'KTU',
				is_current: false
			},
			{
				id: 'lpo-030-3',
				step: 3,
				status: 'LPO_APPROVED',
				status_label: 'LPO Disetujui Manager Kebun',
				timestamp: '2026-04-24T14:00:00Z',
				performed_by: 'user-002',
				performed_by_name: 'Manager Kebun',
				is_current: false
			},
			{
				id: 'lpo-030-4',
				step: 4,
				status: 'GOODS_DELIVERED',
				status_label: 'Barang Diterima dari Vendor',
				timestamp: '2026-04-25T09:00:00Z',
				performed_by: 'user-006',
				performed_by_name: 'Kepala Gudang',
				remarks: 'Barang diterima lengkap sesuai PO',
				is_current: false
			},
			{
				id: 'lpo-030-5',
				step: 5,
				status: 'GRN_APPROVED',
				status_label: 'Penerimaan Barang Disetujui',
				timestamp: '2026-04-25T14:00:00Z',
				performed_by: 'user-003',
				performed_by_name: 'Askep/Tekniker I',
				is_current: false
			},
			{
				id: 'lpo-030-6',
				step: 6,
				status: 'COMPLETED',
				status_label: 'Proses Selesai - Barang Dikeluarkan',
				timestamp: '2026-04-26T14:00:00Z',
				performed_by: 'user-003',
				performed_by_name: 'Askep/Tekniker I',
				remarks: 'Barang dikeluarkan untuk divisi produksi',
				is_current: true
			}
		]
	},
	'lpo-031': {
		lpo_id: 'lpo-031',
		lpo_number: 'LPO/2026/0031',
		vendor_name: 'Toko Pertanian Makmur',
		total_items: 2,
		total_amount: 8500000,
		items: [
			{
				item_code: 'TOOL-002',
				item_name: 'Parang',
				quantity: 15,
				uom: 'pcs',
				source_mr: 'MR/2026/006',
				source_mr_id: 'pr-006'
			},
			{
				item_code: 'TOOL-003',
				item_name: 'Sarung Tangan',
				quantity: 50,
				uom: 'pasang',
				source_mr: 'MR/2026/006',
				source_mr_id: 'pr-006'
			}
		],
		current_status: 'WAITING_DELIVERY',
		current_status_label: 'Menunggu Pengiriman dari Vendor',
		progress_percentage: 50,
		timeline: [
			{
				id: 'lpo-031-1',
				step: 1,
				status: 'LPO_CREATED',
				status_label: 'LPO Dibuat oleh KTU',
				timestamp: '2026-04-23T08:00:00Z',
				performed_by: 'user-001',
				performed_by_name: 'KTU',
				remarks: 'LPO dibuat untuk 2 items dari MR-006',
				is_current: false
			},
			{
				id: 'lpo-031-2',
				step: 2,
				status: 'LPO_SUBMITTED',
				status_label: 'LPO Diajukan untuk Approval',
				timestamp: '2026-04-23T09:00:00Z',
				performed_by: 'user-001',
				performed_by_name: 'KTU',
				is_current: false
			},
			{
				id: 'lpo-031-3',
				step: 3,
				status: 'LPO_APPROVED',
				status_label: 'LPO Disetujui Manager Kebun',
				timestamp: '2026-04-23T14:00:00Z',
				performed_by: 'user-002',
				performed_by_name: 'Manager Kebun',
				is_current: false
			},
			{
				id: 'lpo-031-4',
				step: 4,
				status: 'WAITING_DELIVERY',
				status_label: 'Menunggu Pengiriman dari Vendor',
				timestamp: '2026-04-23T17:00:00Z',
				performed_by: 'user-002',
				performed_by_name: 'Manager Kebun',
				remarks: 'Estimasi pengiriman 3-5 hari kerja',
				is_current: true
			},
			{
				id: 'lpo-031-5',
				step: 5,
				status: 'GRN_PENDING',
				status_label: 'Penerimaan Barang',
				is_current: false
			},
			{
				id: 'lpo-031-6',
				step: 6,
				status: 'PENDING_COMPLETION',
				status_label: 'Proses Selesai',
				is_current: false
			}
		]
	}
};

/**
 * Mock Purchase Request API
 */
export const purchaseRequestMockApi = {
	/**
	 * Get all purchase requests with pagination
	 */
	getPurchaseRequests: async (
		params: PurchaseRequestListParams
	): Promise<PurchaseRequestListResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		console.log('[MOCK API] getPurchaseRequests called with params:', params);
		console.log('[MOCK API] Total mockPurchaseRequests:', mockPurchaseRequests.length);
		console.log('[MOCK API] mockPurchaseRequests:', mockPurchaseRequests);

		let filteredRequests = [...mockPurchaseRequests];

		// Filter by search
		if (params.search) {
			const searchLower = params.search.toLowerCase();
			filteredRequests = filteredRequests.filter(
				(req) =>
					req.purchase_request_number.toLowerCase().includes(searchLower) ||
					(req.reference_number || '').toLowerCase().includes(searchLower) ||
					req.requested_by.toLowerCase().includes(searchLower) ||
					(req.remarks || '').toLowerCase().includes(searchLower)
			);
		}

		// Filter by source type
		if (params.source_type) {
			filteredRequests = filteredRequests.filter(
				(req) => req.source_type === params.source_type
			);
		}

		// Filter by approval status
		if (params.approval_status) {
			filteredRequests = filteredRequests.filter(
				(req) => req.approval_status === params.approval_status
			);
		}

		// Filter by follow-up status
		if (params.follow_up_status) {
			filteredRequests = filteredRequests.filter(
				(req) => req.follow_up_status === params.follow_up_status
			);
		}

		console.log('[MOCK API] After filtering:', filteredRequests.length, 'items');

		// Pagination
		const startIndex = (params.page - 1) * params.size;
		const endIndex = startIndex + params.size;
		const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

		console.log('[MOCK API] Paginated:', paginatedRequests.length, 'items');
		console.log('[MOCK API] Returning data:', paginatedRequests);

		return {
			$schema: 'purchase-request-list-response',
			data: paginatedRequests,
			paging: {
				page: params.page,
				size: params.size,
				total_item: filteredRequests.length,
				total_page: Math.ceil(filteredRequests.length / params.size)
			}
		};
	},

	/**
	 * Get purchase request detail by ID
	 */
	getPurchaseRequestDetail: async (requestId: string): Promise<PurchaseRequestDetailResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 300));

		const detail = mockPurchaseRequestDetails[requestId];

		if (!detail) {
			throw new Error(`Purchase request with id ${requestId} not found`);
		}

		return {
			$schema: 'purchase-request-detail-response',
			data: detail
		};
	},

	/**
	 * Get purchase request summary statistics
	 */
	getPurchaseRequestSummary: async (): Promise<PurchaseRequestSummaryResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 300));

		return {
			$schema: 'purchase-request-summary-response',
			data: mockSummary
		};
	},

	/**
	 * Get approval history for a purchase request
	 */
	getApprovalHistory: async (approvalId: string): Promise<ApprovalHistoryResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 300));

		const history = mockApprovalHistory[approvalId];

		if (!history) {
			throw new Error(`Approval history for ${approvalId} not found`);
		}

		return history;
	},

	/**
	 * Get procurement sources for an item
	 */
	getProcurementSources: async (itemCode: string): Promise<ProcurementSourceResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 400));

		// Return specific mock data for known items, or default for unknown items
		return mockProcurementSourcesMap[itemCode] || mockProcurementSourcesMap['DEFAULT'];
	},

	/**
	 * Get purchasing groups (departments)
	 */
	getPurchasingGroups: async (): Promise<PurchasingGroupResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 300));

		return mockPurchasingGroups;
	},

	/**
	 * Create a new purchase request
	 */
	createPurchaseRequest: async (
		payload: PurchaseRequestPayload
	): Promise<PurchaseRequestCreateResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 800));

		const newId = `pr-${String(nextId).padStart(3, '0')}`;
		
		// Generate PR number based on type
		// LB/LPO/MR/2026/00XXX for local purchase
		// LB/SG/MR/2026/00XXX for cousin garden
		// LB/IT/MR/2026/00XXX for head office
		// LB/BB/MR/2026/00XXX for other
		let prType = 'LPO';
		if (payload.sepupu_estate_code) {
			prType = 'SG';
		} else if (payload.purchasing_group_id) {
			prType = 'IT';
		}
		
		const prNumber = `LB/${prType}/MR/2026/${String(nextId + 100).padStart(5, '0')}`;

		nextId++;

		return {
			$schema: 'purchase-request-create-response',
			data: {
				parent_request_id: newId,
				group_count: 1,
				total_items: payload.items.length,
				groups: [
					{
						hdr_uoid: newId,
						pr_number: prNumber,
						pr_type: 'Regular',
						sepupu_estate_code: payload.sepupu_estate_code,
						purchasing_group_id: payload.purchasing_group_id,
						is_emergency: payload.is_emergency,
						doc_type: 'PURCHASE_REQUEST',
						item_count: payload.items.length,
						items: payload.items.map((item, index) => ({
							id: `item-${nextId}-${index}`,
							item_id: item.item_id,
							item_code: `ITEM-${item.item_id}`,
							item_name: `Item ${item.item_id}`,
							quantity: item.quantity,
							purpose: item.purpose,
							uom: mockUOMs[0]
						}))
					}
				],
				created_at: new Date().toISOString()
			}
		};
	},

	/**
	 * Submit a purchase request for approval
	 */
	submitPurchaseRequest: async (requestId: string): Promise<PurchaseRequestSubmitResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Update status to PENDING
		const request = mockPurchaseRequests.find((r) => r.id === requestId);
		if (request) {
			request.approval_status = 'PENDING';
		}

		return {
			$schema: 'purchase-request-submit-response',
			data: {
				message: 'Purchase request submitted successfully'
			}
		};
	},

	/**
	 * Approve purchase request
	 */
	approvePurchaseRequest: async (approvalId: string): Promise<any> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		return {
			$schema: 'approval-response',
			data: {
				message: 'Purchase request approved successfully'
			}
		};
	},

	/**
	 * Reject purchase request
	 */
	rejectPurchaseRequest: async (approvalId: string): Promise<any> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		return {
			$schema: 'approval-response',
			data: {
				message: 'Purchase request rejected successfully'
			}
		};
	},

	/**
	 * Cancel purchase request
	 */
	cancelPurchaseRequest: async (
		requestId: string,
		payload: { reason: string }
	): Promise<any> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Update status to CANCELLED
		const request = mockPurchaseRequests.find((r) => r.id === requestId);
		if (request) {
			request.approval_status = 'CANCELLED';
			request.remarks = payload.reason;
		}

		// Update detail
		const detail = mockPurchaseRequestDetails[requestId];
		if (detail) {
			detail.approval_status = 'CANCELLED';
			detail.cancelled_reason = payload.reason;
			detail.cancelled_by = 'Current User';
			detail.cancelled_at = new Date().toISOString();
		}

		return {
			$schema: 'cancel-purchase-request-response',
			data: {
				message: 'Purchase request cancelled successfully'
			}
		};
	},

	/**
	 * Update purchase request
	 */
	updatePurchaseRequest: async (
		requestId: string,
		payload: PurchaseRequestPayload
	): Promise<any> => {
		await new Promise((resolve) => setTimeout(resolve, 800));

		// Update the request
		const request = mockPurchaseRequests.find((r) => r.id === requestId);
		if (request) {
			request.remarks = payload.remarks || '';
			request.i_version = (request.i_version || 1) + 1;
		}
		return {
			$schema: 'purchase-request-update-response',
			data: {
				message: 'Purchase request updated successfully'
			}
		};
	},

	/**
	 * Get tracking history for purchase request (REQ-028)
	 */
	getTrackingHistory: async (requestId: string): Promise<TrackingHistoryResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Mock tracking data based on request ID
		const trackingData: Record<string, any> = {
			'pr-001': [
				// Step 12: GRN Approved (FINAL STEP - Procurement Cycle Complete)
				{
					id: 'track-001-12',
					module: 'GOODS_RECEIPT',
					module_name: 'Penerimaan Barang',
					document_number: 'GRN/2026/0001',
					status: 'APPROVED',
					status_label: 'Penerimaan Barang Disetujui - Proses Selesai',
					timestamp: '2026-04-22T14:00:00Z',
					performed_by: 'user-003',
					performed_by_name: 'Askep/Tekniker I',
					remarks: 'Items: Kertas HVS A4 (20 box), Pulpen Hitam (50 pcs), Stapler (10 pcs)',
					related_items: ['ATK-001', 'ATK-002', 'ATK-003']
				},
				// Step 11: GRN Pending Approval
				{
					id: 'track-001-11',
					module: 'GOODS_RECEIPT',
					module_name: 'Penerimaan Barang',
					document_number: 'GRN/2026/0001',
					status: 'PENDING_APPROVAL',
					status_label: 'Menunggu Persetujuan Penerimaan Barang oleh Askep/Tekniker I',
					timestamp: '2026-04-22T10:00:00Z',
					performed_by: 'user-006',
					performed_by_name: 'Kepala Gudang',
					remarks: 'Items: Kertas HVS A4 (20 box), Pulpen Hitam (50 pcs), Stapler (10 pcs)',
					related_items: ['ATK-001', 'ATK-002', 'ATK-003']
				},
				// Step 10: GRN Draft
				{
					id: 'track-001-10',
					module: 'GOODS_RECEIPT',
					module_name: 'Penerimaan Barang',
					document_number: 'GRN/2026/0001',
					status: 'DRAFT',
					status_label: 'Barang Diterima - Menunggu Pengajuan oleh Kepala Gudang',
					timestamp: '2026-04-22T09:00:00Z',
					performed_by: 'user-006',
					performed_by_name: 'Kepala Gudang',
					remarks: 'Items: Kertas HVS A4 (20 box), Pulpen Hitam (50 pcs), Stapler (10 pcs)',
					related_items: ['ATK-001', 'ATK-002', 'ATK-003']
				},
				// Step 9: Waiting Delivery
				{
					id: 'track-001-9',
					module: 'GOODS_RECEIPT',
					module_name: 'Penerimaan Barang',
					document_number: 'LPO/2026/0001',
					status: 'WAITING_DELIVERY',
					status_label: 'Menunggu Pengiriman dari Vendor',
					timestamp: '2026-04-19T17:00:00Z',
					performed_by: 'user-002',
					performed_by_name: 'Manager Kebun',
					remarks: 'Items: Kertas HVS A4 (20 box), Pulpen Hitam (50 pcs), Stapler (10 pcs)',
					related_items: ['ATK-001', 'ATK-002', 'ATK-003']
				},
				// Step 8: LPO Approved
				{
					id: 'track-001-8',
					module: 'LOCAL_PURCHASE_ORDER',
					module_name: 'Order Pembelian Lokal',
					document_number: 'LPO/2026/0001',
					status: 'APPROVED',
					status_label: 'LPO Disetujui oleh Manager Kebun',
					timestamp: '2026-04-19T14:00:00Z',
					performed_by: 'user-002',
					performed_by_name: 'Manager Kebun',
					remarks: 'Items: Kertas HVS A4 (20 box), Pulpen Hitam (50 pcs), Stapler (10 pcs)',
					related_items: ['ATK-001', 'ATK-002', 'ATK-003']
				},
				// Step 7: LPO Pending Approval
				{
					id: 'track-001-7',
					module: 'LOCAL_PURCHASE_ORDER',
					module_name: 'Order Pembelian Lokal',
					document_number: 'LPO/2026/0001',
					status: 'PENDING_APPROVAL',
					status_label: 'Menunggu Persetujuan LPO oleh Manager Kebun',
					timestamp: '2026-04-19T09:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Items: Kertas HVS A4 (20 box), Pulpen Hitam (50 pcs), Stapler (10 pcs)',
					related_items: ['ATK-001', 'ATK-002', 'ATK-003']
				},
				// Step 6: LPO Draft
				{
					id: 'track-001-6',
					module: 'LOCAL_PURCHASE_ORDER',
					module_name: 'Order Pembelian Lokal',
					document_number: 'LPO/2026/0001',
					status: 'DRAFT',
					status_label: 'LPO Telah Dibuat, Menunggu Pengajuan oleh KTU',
					timestamp: '2026-04-19T08:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Items: Kertas HVS A4 (20 box), Pulpen Hitam (50 pcs), Stapler (10 pcs)',
					related_items: ['ATK-001', 'ATK-002', 'ATK-003']
				},
				// Step 5: Waiting LPO
				{
					id: 'track-001-5',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0001',
					status: 'WAITING_LPO',
					status_label: 'Menunggu Pembuatan LPO oleh KTU',
					timestamp: '2026-04-18T15:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Items: Kertas HVS A4 (20 box), Pulpen Hitam (50 pcs), Stapler (10 pcs)',
					related_items: ['ATK-001', 'ATK-002', 'ATK-003']
				},
				// Step 4: Quotation Compared
				{
					id: 'track-001-4',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0001',
					status: 'QUOTATION_COMPARED',
					status_label: 'Perbandingan Harga Vendor oleh KTU',
					timestamp: '2026-04-18T14:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Items: Kertas HVS A4 (20 box), Pulpen Hitam (50 pcs), Stapler (10 pcs)',
					related_items: ['ATK-001', 'ATK-002', 'ATK-003']
				},
				// Step 3: Quotation Sent
				{
					id: 'track-001-3',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0001',
					status: 'QUOTATION_SENT',
					status_label: 'Permintaan Harga Terkirim ke Vendor oleh KTU',
					timestamp: '2026-04-17T10:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Items: Kertas HVS A4 (20 box), Pulpen Hitam (50 pcs), Stapler (10 pcs)',
					related_items: ['ATK-001', 'ATK-002', 'ATK-003']
				},
				// Step 2: Processing
				{
					id: 'track-001-2',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0001',
					status: 'PROCESSING',
					status_label: 'Menunggu Proses Pembelian oleh KTU',
					timestamp: '2026-04-15T15:00:00Z',
					performed_by: 'user-002',
					performed_by_name: 'Manager Kebun',
					remarks: 'Items: Kertas HVS A4 (20 box), Pulpen Hitam (50 pcs), Stapler (10 pcs)',
					related_items: ['ATK-001', 'ATK-002', 'ATK-003']
				},
				// Step 1: MR Approved (All levels)
				{
					id: 'track-001-1',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'PR/LB/2026/0001',
					status: 'APPROVED',
					status_label: 'MR Disetujui oleh Manager Kebun',
					timestamp: '2026-04-15T14:00:00Z',
					performed_by: 'user-002',
					performed_by_name: 'Manager Kebun',
					remarks: 'Items: Kertas HVS A4 (20 box), Pulpen Hitam (50 pcs), Stapler (10 pcs)',
					related_items: ['ATK-001', 'ATK-002', 'ATK-003']
				}
			],
			'pr-002': [
				{
					id: 'track-002-9',
					module: 'LOCAL_PURCHASE_ORDER',
					module_name: 'Order Pembelian Lokal',
					document_number: 'LPO/2026/0002',
					status: 'PENDING_APPROVAL',
					status_label: 'Menunggu Persetujuan LPO oleh Manager Kebun',
					timestamp: '2026-04-18T09:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU'
				},
				{
					id: 'track-002-8',
					module: 'LOCAL_PURCHASE_ORDER',
					module_name: 'Order Pembelian Lokal',
					document_number: 'LPO/2026/0002',
					status: 'DRAFT',
					status_label: 'LPO Telah Dibuat, Menunggu Pengajuan oleh KTU',
					timestamp: '2026-04-18T08:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU'
				},
				{
					id: 'track-002-7',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0002',
					status: 'WAITING_LPO',
					status_label: 'Menunggu Pembuatan LPO oleh KTU',
					timestamp: '2026-04-17T16:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU'
				},
				{
					id: 'track-002-6',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0002',
					status: 'QUOTATION_COMPARED',
					status_label: 'Perbandingan Harga Vendor oleh KTU',
					timestamp: '2026-04-17T15:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU'
				},
				{
					id: 'track-002-5',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0002',
					status: 'QUOTATION_SENT',
					status_label: 'Permintaan Harga Terkirim ke Vendor oleh KTU',
					timestamp: '2026-04-17T10:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU'
				},
				{
					id: 'track-002-4',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0002',
					status: 'PROCESSING',
					status_label: 'Menunggu Proses Pembelian oleh KTU',
					timestamp: '2026-04-16T15:00:00Z',
					performed_by: 'user-002',
					performed_by_name: 'Manager Kebun'
				},
				{
					id: 'track-002-3',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'PR/LB/2026/0002',
					status: 'PENDING_APPROVAL_LEVEL_2',
					status_label: 'Menunggu Persetujuan MR oleh Manager Kebun',
					timestamp: '2026-04-16T11:00:00Z',
					performed_by: 'user-003',
					performed_by_name: 'Askep/Tekniker I'
				},
				{
					id: 'track-002-2',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'PR/LB/2026/0002',
					status: 'PENDING_APPROVAL_LEVEL_1',
					status_label: 'Menunggu Persetujuan MR oleh Askep/Tekniker I',
					timestamp: '2026-04-16T09:00:00Z',
					performed_by: 'user-005',
					performed_by_name: 'Asisten/Tekniker II'
				},
				{
					id: 'track-002-1',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'PR/LB/2026/0002',
					status: 'DRAFT',
					status_label: 'MR Telah Dibuat, Menunggu Pengajuan oleh Asisten/Tekniker II',
					timestamp: '2026-04-16T08:00:00Z',
					performed_by: 'user-005',
					performed_by_name: 'Asisten/Tekniker II'
				}
			],
			'pr-003': [
				{
					id: 'track-003-3',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'PR/LB/2026/0003',
					status: 'PENDING_APPROVAL_LEVEL_2',
					status_label: 'Menunggu Persetujuan MR oleh Manager Kebun',
					timestamp: '2026-04-20T10:00:00Z',
					performed_by: 'user-003',
					performed_by_name: 'Askep/Tekniker I'
				},
				{
					id: 'track-003-2',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'PR/LB/2026/0003',
					status: 'PENDING_APPROVAL_LEVEL_1',
					status_label: 'Menunggu Persetujuan MR oleh Askep/Tekniker I',
					timestamp: '2026-04-20T09:00:00Z',
					performed_by: 'user-005',
					performed_by_name: 'Asisten/Tekniker II'
				},
				{
					id: 'track-003-1',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'PR/LB/2026/0003',
					status: 'DRAFT',
					status_label: 'MR Telah Dibuat, Menunggu Pengajuan oleh Asisten/Tekniker II',
					timestamp: '2026-04-20T08:00:00Z',
					performed_by: 'user-005',
					performed_by_name: 'Asisten/Tekniker II'
				}
			],
			'pr-008': [
				{
					id: 'track-008-1',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'LB/IT/MR/2026/00015',
					status: 'DRAFT',
					status_label: 'MR Telah Dibuat, Menunggu Pengajuan oleh Erik Obaza Barus',
					timestamp: '2026-04-19T08:00:00Z',
					performed_by: 'user-006',
					performed_by_name: 'Erik Obaza Barus'
				}
			],
			'pr-005': [
				// This will use milestone-based tracking (simplified)
				// Item 1: Kertas HVS - SELESAI
				{
					id: 'track-005-1',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'MR/2026/005',
					status: 'APPROVED',
					status_label: 'MR Disetujui',
					timestamp: '2026-04-19T14:00:00Z',
					performed_by: 'user-002',
					performed_by_name: 'Manager Kebun',
					remarks: 'Semua items disetujui'
				},
				{
					id: 'track-005-2',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0020',
					status: 'COMPLETED',
					status_label: 'RFQ Dibuat',
					timestamp: '2026-04-20T10:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Kertas HVS A4 80gr (20 box)'
				},
				{
					id: 'track-005-3',
					module: 'LOCAL_PURCHASE_ORDER',
					module_name: 'Order Pembelian Lokal',
					document_number: 'LPO/2026/0020',
					status: 'APPROVED',
					status_label: 'LPO Disetujui',
					timestamp: '2026-04-21T14:00:00Z',
					performed_by: 'user-002',
					performed_by_name: 'Manager Kebun',
					remarks: 'Item: Kertas HVS A4 80gr (20 box) - Vendor: PT Kertas Jaya'
				},
				{
					id: 'track-005-4',
					module: 'GOODS_RECEIPT',
					module_name: 'Penerimaan Barang',
					document_number: 'GRN/2026/0020',
					status: 'APPROVED',
					status_label: 'Barang Diterima',
					timestamp: '2026-04-23T10:00:00Z',
					performed_by: 'user-003',
					performed_by_name: 'Askep/Tekniker I',
					remarks: 'Item: Kertas HVS A4 80gr (20 box) - Diterima lengkap'
				},
				{
					id: 'track-005-5',
					module: 'GOODS_ISSUE',
					module_name: 'Pengeluaran Barang',
					document_number: 'GI/2026/0020',
					status: 'COMPLETED',
					status_label: 'Proses Selesai',
					timestamp: '2026-04-24T14:00:00Z',
					performed_by: 'user-003',
					performed_by_name: 'Askep/Tekniker I',
					remarks: 'Item: Kertas HVS A4 80gr (20 box) - Dikeluarkan untuk divisi administrasi'
				},
				// Item 2: Tinta Printer - DALAM PROSES (Menunggu Pengiriman)
				{
					id: 'track-005-6',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0021',
					status: 'COMPLETED',
					status_label: 'RFQ Dibuat',
					timestamp: '2026-04-20T10:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Tinta Printer Canon (10 pcs)'
				},
				{
					id: 'track-005-7',
					module: 'LOCAL_PURCHASE_ORDER',
					module_name: 'Order Pembelian Lokal',
					document_number: 'LPO/2026/0021',
					status: 'APPROVED',
					status_label: 'LPO Disetujui',
					timestamp: '2026-04-22T14:00:00Z',
					performed_by: 'user-002',
					performed_by_name: 'Manager Kebun',
					remarks: 'Item: Tinta Printer Canon (10 pcs) - Vendor: PT Printer Sejahtera'
				},
				{
					id: 'track-005-8',
					module: 'GOODS_RECEIPT',
					module_name: 'Penerimaan Barang',
					document_number: 'GRN/2026/0021',
					status: 'WAITING_DELIVERY',
					status_label: 'Menunggu Pengiriman dari Vendor',
					timestamp: '2026-04-22T17:00:00Z',
					performed_by: 'user-002',
					performed_by_name: 'Manager Kebun',
					remarks: 'Item: Tinta Printer Canon (10 pcs) - Vendor: PT Printer Sejahtera'
				},
				// Item 3: Stapler - DALAM PROSES (Menunggu Persetujuan LPO)
				{
					id: 'track-005-9',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0022',
					status: 'COMPLETED',
					status_label: 'RFQ Dibuat',
					timestamp: '2026-04-21T10:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Stapler Besar + Isi (5 unit)'
				},
				{
					id: 'track-005-10',
					module: 'LOCAL_PURCHASE_ORDER',
					module_name: 'Order Pembelian Lokal',
					document_number: 'LPO/2026/0022',
					status: 'PENDING_APPROVAL',
					status_label: 'Menunggu Persetujuan LPO oleh Manager Kebun',
					timestamp: '2026-04-23T09:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Stapler Besar + Isi (5 unit) - Vendor: PT Alat Tulis Makmur'
				}
			],
			'pr-004': [
				// Item 1: Laptop - SELESAI (Full Journey)
				{
					id: 'track-004-45',
					module: 'GOODS_ISSUE',
					module_name: 'Pengeluaran Barang',
					document_number: 'GI/2026/0010',
					status: 'COMPLETED',
					status_label: 'Proses Selesai',
					timestamp: '2026-04-26T14:00:00Z',
					performed_by: 'user-003',
					performed_by_name: 'Askep/Tekniker I',
					remarks: 'Item: Laptop Dell Latitude (1 unit)',
					related_items: ['OFF-010']
				},
				{
					id: 'track-004-44',
					module: 'GOODS_ISSUE',
					module_name: 'Pengeluaran Barang',
					document_number: 'GI/2026/0010',
					status: 'PENDING_APPROVAL',
					status_label: 'Menunggu Persetujuan Pengeluaran Barang oleh Askep/Tekniker I',
					timestamp: '2026-04-26T09:00:00Z',
					performed_by: 'user-005',
					performed_by_name: 'Asisten/Tekniker II',
					remarks: 'Item: Laptop Dell Latitude (1 unit)',
					related_items: ['OFF-010']
				},
				{
					id: 'track-004-43',
					module: 'GOODS_ISSUE',
					module_name: 'Pengeluaran Barang',
					document_number: 'GI/2026/0010',
					status: 'WAITING_PROCESS',
					status_label: 'Menunggu Proses Pengeluaran Barang oleh Asisten/Tekniker II',
					timestamp: '2026-04-25T15:00:00Z',
					performed_by: 'user-003',
					performed_by_name: 'Askep/Tekniker I',
					remarks: 'Item: Laptop Dell Latitude (1 unit)',
					related_items: ['OFF-010']
				},
				{
					id: 'track-004-42',
					module: 'GOODS_RECEIPT',
					module_name: 'Penerimaan Barang',
					document_number: 'GRN/2026/0010',
					status: 'PENDING_APPROVAL',
					status_label: 'Menunggu Persetujuan Penerimaan Barang oleh Askep/Tekniker I',
					timestamp: '2026-04-25T10:00:00Z',
					performed_by: 'user-006',
					performed_by_name: 'Kepala Gudang',
					remarks: 'Item: Laptop Dell Latitude (1 unit) - Barang diterima lengkap',
					related_items: ['OFF-010']
				},
				{
					id: 'track-004-41',
					module: 'GOODS_RECEIPT',
					module_name: 'Penerimaan Barang',
					document_number: 'GRN/2026/0010',
					status: 'DRAFT',
					status_label: 'Barang Diterima - Menunggu Pengajuan oleh Kepala Gudang',
					timestamp: '2026-04-25T09:00:00Z',
					performed_by: 'user-006',
					performed_by_name: 'Kepala Gudang',
					remarks: 'Item: Laptop Dell Latitude (1 unit)',
					related_items: ['OFF-010']
				},
				{
					id: 'track-004-40',
					module: 'GOODS_RECEIPT',
					module_name: 'Penerimaan Barang',
					document_number: 'GRN/2026/0010',
					status: 'WAITING_DELIVERY',
					status_label: 'Menunggu Pengiriman dari Vendor',
					timestamp: '2026-04-22T17:00:00Z',
					performed_by: 'user-002',
					performed_by_name: 'Manager Kebun',
					remarks: 'Item: Laptop Dell Latitude (1 unit) - Vendor: PT Teknologi Maju',
					related_items: ['OFF-010']
				},
				{
					id: 'track-004-39',
					module: 'LOCAL_PURCHASE_ORDER',
					module_name: 'Order Pembelian Lokal',
					document_number: 'LPO/2026/0010',
					status: 'PENDING_APPROVAL',
					status_label: 'Menunggu Persetujuan LPO oleh Manager Kebun',
					timestamp: '2026-04-22T09:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Laptop Dell Latitude (1 unit) - Vendor: PT Teknologi Maju',
					related_items: ['OFF-010']
				},
				{
					id: 'track-004-38',
					module: 'LOCAL_PURCHASE_ORDER',
					module_name: 'Order Pembelian Lokal',
					document_number: 'LPO/2026/0010',
					status: 'DRAFT',
					status_label: 'LPO Telah Dibuat, Menunggu Pengajuan oleh KTU',
					timestamp: '2026-04-22T08:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Laptop Dell Latitude (1 unit) - Vendor: PT Teknologi Maju',
					related_items: ['OFF-010']
				},
				{
					id: 'track-004-37',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0010',
					status: 'WAITING_LPO',
					status_label: 'Menunggu Pembuatan LPO oleh KTU',
					timestamp: '2026-04-21T15:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Laptop Dell Latitude (1 unit)',
					related_items: ['OFF-010']
				},
				{
					id: 'track-004-36',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0010',
					status: 'QUOTATION_COMPARED',
					status_label: 'Perbandingan Harga Vendor oleh KTU',
					timestamp: '2026-04-21T14:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Laptop Dell Latitude (1 unit) - Winner: PT Teknologi Maju',
					related_items: ['OFF-010']
				},
				{
					id: 'track-004-35',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0010',
					status: 'QUOTATION_SENT',
					status_label: 'Permintaan Harga Terkirim ke Vendor oleh KTU',
					timestamp: '2026-04-20T10:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Laptop Dell Latitude (1 unit)',
					related_items: ['OFF-010']
				},
				{
					id: 'track-004-34',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0010',
					status: 'PROCESSING',
					status_label: 'Menunggu Proses Pembelian oleh KTU',
					timestamp: '2026-04-18T15:00:00Z',
					performed_by: 'user-002',
					performed_by_name: 'Manager Kebun',
					remarks: 'Item: Laptop Dell Latitude (1 unit)',
					related_items: ['OFF-010']
				},
				
				// Item 2: Mouse - DALAM PROSES (Menunggu Pengiriman)
				{
					id: 'track-004-33',
					module: 'GOODS_RECEIPT',
					module_name: 'Penerimaan Barang',
					document_number: 'GRN/2026/0011',
					status: 'WAITING_DELIVERY',
					status_label: 'Menunggu Pengiriman dari Vendor',
					timestamp: '2026-04-23T17:00:00Z',
					performed_by: 'user-002',
					performed_by_name: 'Manager Kebun',
					remarks: 'Item: Mouse Wireless Logitech (5 pcs) - Vendor: PT Komputer Sejahtera',
					related_items: ['OFF-011']
				},
				{
					id: 'track-004-32',
					module: 'LOCAL_PURCHASE_ORDER',
					module_name: 'Order Pembelian Lokal',
					document_number: 'LPO/2026/0011',
					status: 'PENDING_APPROVAL',
					status_label: 'Menunggu Persetujuan LPO oleh Manager Kebun',
					timestamp: '2026-04-23T09:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Mouse Wireless Logitech (5 pcs) - Vendor: PT Komputer Sejahtera',
					related_items: ['OFF-011']
				},
				{
					id: 'track-004-31',
					module: 'LOCAL_PURCHASE_ORDER',
					module_name: 'Order Pembelian Lokal',
					document_number: 'LPO/2026/0011',
					status: 'DRAFT',
					status_label: 'LPO Telah Dibuat, Menunggu Pengajuan oleh KTU',
					timestamp: '2026-04-23T08:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Mouse Wireless Logitech (5 pcs) - Vendor: PT Komputer Sejahtera',
					related_items: ['OFF-011']
				},
				{
					id: 'track-004-30',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0011',
					status: 'WAITING_LPO',
					status_label: 'Menunggu Pembuatan LPO oleh KTU',
					timestamp: '2026-04-22T15:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Mouse Wireless Logitech (5 pcs)',
					related_items: ['OFF-011']
				},
				{
					id: 'track-004-29',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0011',
					status: 'QUOTATION_COMPARED',
					status_label: 'Perbandingan Harga Vendor oleh KTU',
					timestamp: '2026-04-22T14:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Mouse Wireless Logitech (5 pcs) - Winner: PT Komputer Sejahtera',
					related_items: ['OFF-011']
				},
				{
					id: 'track-004-28',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0011',
					status: 'QUOTATION_SENT',
					status_label: 'Permintaan Harga Terkirim ke Vendor oleh KTU',
					timestamp: '2026-04-21T10:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Mouse Wireless Logitech (5 pcs)',
					related_items: ['OFF-011']
				},
				{
					id: 'track-004-27',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0011',
					status: 'PROCESSING',
					status_label: 'Menunggu Proses Pembelian oleh KTU',
					timestamp: '2026-04-18T15:00:00Z',
					performed_by: 'user-002',
					performed_by_name: 'Manager Kebun',
					remarks: 'Item: Mouse Wireless Logitech (5 pcs)',
					related_items: ['OFF-011']
				},
				
				// Item 3: Keyboard - DALAM PROSES (Menunggu Persetujuan LPO)
				{
					id: 'track-004-26',
					module: 'LOCAL_PURCHASE_ORDER',
					module_name: 'Order Pembelian Lokal',
					document_number: 'LPO/2026/0012',
					status: 'PENDING_APPROVAL',
					status_label: 'Menunggu Persetujuan LPO oleh Manager Kebun',
					timestamp: '2026-04-24T09:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Keyboard Mechanical (3 pcs) - Vendor: PT Aksesoris Komputer',
					related_items: ['OFF-012']
				},
				{
					id: 'track-004-25',
					module: 'LOCAL_PURCHASE_ORDER',
					module_name: 'Order Pembelian Lokal',
					document_number: 'LPO/2026/0012',
					status: 'DRAFT',
					status_label: 'LPO Telah Dibuat, Menunggu Pengajuan oleh KTU',
					timestamp: '2026-04-24T08:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Keyboard Mechanical (3 pcs) - Vendor: PT Aksesoris Komputer',
					related_items: ['OFF-012']
				},
				{
					id: 'track-004-24',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0012',
					status: 'WAITING_LPO',
					status_label: 'Menunggu Pembuatan LPO oleh KTU',
					timestamp: '2026-04-23T15:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Keyboard Mechanical (3 pcs)',
					related_items: ['OFF-012']
				},
				{
					id: 'track-004-23',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0012',
					status: 'QUOTATION_COMPARED',
					status_label: 'Perbandingan Harga Vendor oleh KTU',
					timestamp: '2026-04-23T14:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Keyboard Mechanical (3 pcs) - Winner: PT Aksesoris Komputer',
					related_items: ['OFF-012']
				},
				{
					id: 'track-004-22',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0012',
					status: 'QUOTATION_SENT',
					status_label: 'Permintaan Harga Terkirim ke Vendor oleh KTU',
					timestamp: '2026-04-22T10:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Keyboard Mechanical (3 pcs)',
					related_items: ['OFF-012']
				},
				{
					id: 'track-004-21',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0012',
					status: 'PROCESSING',
					status_label: 'Menunggu Proses Pembelian oleh KTU',
					timestamp: '2026-04-18T15:00:00Z',
					performed_by: 'user-002',
					performed_by_name: 'Manager Kebun',
					remarks: 'Item: Keyboard Mechanical (3 pcs)',
					related_items: ['OFF-012']
				},
				
				// MR Steps (Common untuk semua items)
				{
					id: 'track-004-3',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'MR/2026/004',
					status: 'PENDING_APPROVAL_LEVEL_2',
					status_label: 'Menunggu Persetujuan MR oleh Manager Kebun',
					timestamp: '2026-04-18T10:00:00Z',
					performed_by: 'user-003',
					performed_by_name: 'Askep/Tekniker I',
					remarks: 'Items: Laptop, Mouse, Keyboard (3 items)'
				},
				{
					id: 'track-004-2',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'MR/2026/004',
					status: 'PENDING_APPROVAL_LEVEL_1',
					status_label: 'Menunggu Persetujuan MR oleh Askep/Tekniker I',
					timestamp: '2026-04-18T09:00:00Z',
					performed_by: 'user-005',
					performed_by_name: 'Asisten/Tekniker II',
					remarks: 'Items: Laptop, Mouse, Keyboard (3 items)'
				},
				{
					id: 'track-004-1',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'MR/2026/004',
					status: 'DRAFT',
					status_label: 'MR Telah Dibuat, Menunggu Pengajuan oleh Asisten/Tekniker II',
					timestamp: '2026-04-18T08:00:00Z',
					performed_by: 'user-005',
					performed_by_name: 'Asisten/Tekniker II',
					remarks: 'Items: Laptop, Mouse, Keyboard (3 items)'
				}
			],
			'pr-006': [
				// Item 1: Cangkul - Step 15 (SELESAI)
				{
					id: 'track-006-60',
					module: 'GOODS_ISSUE',
					module_name: 'Pengeluaran Barang',
					document_number: 'GI/2026/0030',
					status: 'COMPLETED',
					status_label: 'Proses Selesai',
					timestamp: '2026-04-26T14:00:00Z',
					performed_by: 'user-003',
					performed_by_name: 'Askep/Tekniker I',
					remarks: 'Item: Cangkul (10 pcs) - Dikeluarkan untuk divisi produksi',
					related_items: ['TOOL-001']
				},
				// Item 1: Cangkul - Step 14
				{
					id: 'track-006-59',
					module: 'GOODS_ISSUE',
					module_name: 'Pengeluaran Barang',
					document_number: 'GI/2026/0030',
					status: 'PENDING_APPROVAL',
					status_label: 'Menunggu Persetujuan Pengeluaran Barang oleh Askep/Tekniker I',
					timestamp: '2026-04-26T09:00:00Z',
					performed_by: 'user-005',
					performed_by_name: 'Asisten/Tekniker II',
					remarks: 'Item: Cangkul (10 pcs)',
					related_items: ['TOOL-001']
				},
				// Item 1: Cangkul - Step 13
				{
					id: 'track-006-58',
					module: 'GOODS_ISSUE',
					module_name: 'Pengeluaran Barang',
					document_number: 'GI/2026/0030',
					status: 'WAITING_PROCESS',
					status_label: 'Menunggu Proses Pengeluaran Barang oleh Asisten/Tekniker II',
					timestamp: '2026-04-25T15:00:00Z',
					performed_by: 'user-003',
					performed_by_name: 'Askep/Tekniker I',
					remarks: 'Item: Cangkul (10 pcs)',
					related_items: ['TOOL-001']
				},
				// Item 1: Cangkul - Step 12
				{
					id: 'track-006-57',
					module: 'GOODS_RECEIPT',
					module_name: 'Penerimaan Barang',
					document_number: 'GRN/2026/0030',
					status: 'PENDING_APPROVAL',
					status_label: 'Menunggu Persetujuan Penerimaan Barang oleh Askep/Tekniker I',
					timestamp: '2026-04-25T10:00:00Z',
					performed_by: 'user-006',
					performed_by_name: 'Kepala Gudang',
					remarks: 'Item: Cangkul (10 pcs) - Barang diterima lengkap',
					related_items: ['TOOL-001']
				},
				// Item 1: Cangkul - Step 11
				{
					id: 'track-006-56',
					module: 'GOODS_RECEIPT',
					module_name: 'Penerimaan Barang',
					document_number: 'GRN/2026/0030',
					status: 'DRAFT',
					status_label: 'Barang Diterima - Menunggu Pengajuan oleh Kepala Gudang',
					timestamp: '2026-04-25T09:00:00Z',
					performed_by: 'user-006',
					performed_by_name: 'Kepala Gudang',
					remarks: 'Item: Cangkul (10 pcs)',
					related_items: ['TOOL-001']
				},
				// Item 1: Cangkul - Step 10
				{
					id: 'track-006-55',
					module: 'GOODS_RECEIPT',
					module_name: 'Penerimaan Barang',
					document_number: 'GRN/2026/0030',
					status: 'WAITING_DELIVERY',
					status_label: 'Menunggu Pengiriman dari Vendor',
					timestamp: '2026-04-22T17:00:00Z',
					performed_by: 'user-002',
					performed_by_name: 'Manager Kebun',
					remarks: 'Item: Cangkul (10 pcs) - Vendor: Toko Pertanian Makmur',
					related_items: ['TOOL-001']
				},
				// Item 1: Cangkul - Step 9
				{
					id: 'track-006-54',
					module: 'LOCAL_PURCHASE_ORDER',
					module_name: 'Order Pembelian Lokal',
					document_number: 'LPO/2026/0030',
					status: 'PENDING_APPROVAL',
					status_label: 'Menunggu Persetujuan LPO oleh Manager Kebun',
					timestamp: '2026-04-22T09:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Cangkul (10 pcs) - Vendor: Toko Pertanian Makmur',
					related_items: ['TOOL-001']
				},
				// Item 1: Cangkul - Step 8
				{
					id: 'track-006-53',
					module: 'LOCAL_PURCHASE_ORDER',
					module_name: 'Order Pembelian Lokal',
					document_number: 'LPO/2026/0030',
					status: 'DRAFT',
					status_label: 'LPO Telah Dibuat, Menunggu Pengajuan oleh KTU',
					timestamp: '2026-04-22T08:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Cangkul (10 pcs) - Vendor: Toko Pertanian Makmur',
					related_items: ['TOOL-001']
				},
				// Item 1: Cangkul - Step 7
				{
					id: 'track-006-52',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0030',
					status: 'WAITING_LPO',
					status_label: 'Menunggu Pembuatan LPO oleh KTU',
					timestamp: '2026-04-21T16:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Cangkul (10 pcs)',
					related_items: ['TOOL-001']
				},
				// Item 1: Cangkul - Step 6
				{
					id: 'track-006-51',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0030',
					status: 'QUOTATION_COMPARED',
					status_label: 'Perbandingan Harga Vendor oleh KTU',
					timestamp: '2026-04-21T15:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Cangkul (10 pcs)',
					related_items: ['TOOL-001']
				},
				// Item 1: Cangkul - Step 5
				{
					id: 'track-006-50',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0030',
					status: 'QUOTATION_SENT',
					status_label: 'Permintaan Harga Terkirim ke Vendor oleh KTU',
					timestamp: '2026-04-21T10:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Cangkul (10 pcs)',
					related_items: ['TOOL-001']
				},
				// Item 1: Cangkul - Step 4
				{
					id: 'track-006-49',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0030',
					status: 'PROCESSING',
					status_label: 'Menunggu Proses Pembelian oleh KTU',
					timestamp: '2026-04-20T15:00:00Z',
					performed_by: 'user-002',
					performed_by_name: 'Manager Kebun',
					remarks: 'Item: Cangkul (10 pcs)',
					related_items: ['TOOL-001']
				},
				// Item 1: Cangkul - Step 3
				{
					id: 'track-006-48',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'MR/2026/006',
					status: 'PENDING_APPROVAL_LEVEL_2',
					status_label: 'Menunggu Persetujuan MR oleh Manager Kebun',
					timestamp: '2026-04-20T11:00:00Z',
					performed_by: 'user-003',
					performed_by_name: 'Askep/Tekniker I',
					remarks: 'Item: Cangkul (10 pcs)',
					related_items: ['TOOL-001']
				},
				// Item 1: Cangkul - Step 2
				{
					id: 'track-006-47',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'MR/2026/006',
					status: 'PENDING_APPROVAL_LEVEL_1',
					status_label: 'Menunggu Persetujuan MR oleh Askep/Tekniker I',
					timestamp: '2026-04-20T09:00:00Z',
					performed_by: 'user-005',
					performed_by_name: 'Asisten/Tekniker II',
					remarks: 'Item: Cangkul (10 pcs)',
					related_items: ['TOOL-001']
				},
				// Item 1: Cangkul - Step 1
				{
					id: 'track-006-46',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'MR/2026/006',
					status: 'DRAFT',
					status_label: 'MR Telah Dibuat, Menunggu Pengajuan oleh Asisten/Tekniker II',
					timestamp: '2026-04-20T08:00:00Z',
					performed_by: 'user-005',
					performed_by_name: 'Asisten/Tekniker II',
					remarks: 'Item: Cangkul (10 pcs)',
					related_items: ['TOOL-001']
				},

				// Item 2: Parang - Step 10 (DALAM PROSES - Menunggu Pengiriman)
				{
					id: 'track-006-45',
					module: 'GOODS_RECEIPT',
					module_name: 'Penerimaan Barang',
					document_number: 'GRN/2026/0031',
					status: 'WAITING_DELIVERY',
					status_label: 'Menunggu Pengiriman dari Vendor',
					timestamp: '2026-04-23T17:00:00Z',
					performed_by: 'user-002',
					performed_by_name: 'Manager Kebun',
					remarks: 'Item: Parang (15 pcs) - Vendor: Toko Pertanian Makmur',
					related_items: ['TOOL-002']
				},
				// Item 2: Parang - Step 9
				{
					id: 'track-006-44',
					module: 'LOCAL_PURCHASE_ORDER',
					module_name: 'Order Pembelian Lokal',
					document_number: 'LPO/2026/0031',
					status: 'PENDING_APPROVAL',
					status_label: 'Menunggu Persetujuan LPO oleh Manager Kebun',
					timestamp: '2026-04-23T09:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Parang (15 pcs) - Vendor: Toko Pertanian Makmur',
					related_items: ['TOOL-002']
				},
				// Item 2: Parang - Step 8
				{
					id: 'track-006-43',
					module: 'LOCAL_PURCHASE_ORDER',
					module_name: 'Order Pembelian Lokal',
					document_number: 'LPO/2026/0031',
					status: 'DRAFT',
					status_label: 'LPO Telah Dibuat, Menunggu Pengajuan oleh KTU',
					timestamp: '2026-04-23T08:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Parang (15 pcs) - Vendor: Toko Pertanian Makmur',
					related_items: ['TOOL-002']
				},
				// Item 2: Parang - Step 7
				{
					id: 'track-006-42',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0032',
					status: 'WAITING_LPO',
					status_label: 'Menunggu Pembuatan LPO oleh KTU',
					timestamp: '2026-04-22T16:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Parang (15 pcs)',
					related_items: ['TOOL-002']
				},
				// Item 2: Parang - Step 6
				{
					id: 'track-006-41',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0031',
					status: 'QUOTATION_COMPARED',
					status_label: 'Perbandingan Harga Vendor oleh KTU',
					timestamp: '2026-04-22T15:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Parang (15 pcs)',
					related_items: ['TOOL-002']
				},
				// Item 2: Parang - Step 5
				{
					id: 'track-006-40',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0031',
					status: 'QUOTATION_SENT',
					status_label: 'Permintaan Harga Terkirim ke Vendor oleh KTU',
					timestamp: '2026-04-22T10:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Parang (15 pcs)',
					related_items: ['TOOL-002']
				},
				// Item 2: Parang - Step 4
				{
					id: 'track-006-39',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0031',
					status: 'PROCESSING',
					status_label: 'Menunggu Proses Pembelian oleh KTU',
					timestamp: '2026-04-21T15:00:00Z',
					performed_by: 'user-002',
					performed_by_name: 'Manager Kebun',
					remarks: 'Item: Parang (15 pcs)',
					related_items: ['TOOL-002']
				},
				// Item 2: Parang - Step 3
				{
					id: 'track-006-38',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'MR/2026/006',
					status: 'PENDING_APPROVAL_LEVEL_2',
					status_label: 'Menunggu Persetujuan MR oleh Manager Kebun',
					timestamp: '2026-04-21T11:00:00Z',
					performed_by: 'user-003',
					performed_by_name: 'Askep/Tekniker I',
					remarks: 'Item: Parang (15 pcs)',
					related_items: ['TOOL-002']
				},
				// Item 2: Parang - Step 2
				{
					id: 'track-006-37',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'MR/2026/006',
					status: 'PENDING_APPROVAL_LEVEL_1',
					status_label: 'Menunggu Persetujuan MR oleh Askep/Tekniker I',
					timestamp: '2026-04-21T09:00:00Z',
					performed_by: 'user-005',
					performed_by_name: 'Asisten/Tekniker II',
					remarks: 'Item: Parang (15 pcs)',
					related_items: ['TOOL-002']
				},
				// Item 2: Parang - Step 1
				{
					id: 'track-006-36',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'MR/2026/006',
					status: 'DRAFT',
					status_label: 'MR Telah Dibuat, Menunggu Pengajuan oleh Asisten/Tekniker II',
					timestamp: '2026-04-21T08:00:00Z',
					performed_by: 'user-005',
					performed_by_name: 'Asisten/Tekniker II',
					remarks: 'Item: Parang (15 pcs)',
					related_items: ['TOOL-002']
				},

				// Item 3: Sarung Tangan - Step 7 (DALAM PROSES - Menunggu Pembuatan LPO)
				{
					id: 'track-006-35',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0032',
					status: 'WAITING_LPO',
					status_label: 'Menunggu Pembuatan LPO oleh KTU',
					timestamp: '2026-04-24T16:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Sarung Tangan (50 pasang)',
					related_items: ['TOOL-003']
				},
				// Item 3: Sarung Tangan - Step 6
				{
					id: 'track-006-34',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0032',
					status: 'QUOTATION_COMPARED',
					status_label: 'Perbandingan Harga Vendor oleh KTU',
					timestamp: '2026-04-24T15:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Sarung Tangan (50 pasang)',
					related_items: ['TOOL-003']
				},
				// Item 3: Sarung Tangan - Step 5
				{
					id: 'track-006-33',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0032',
					status: 'QUOTATION_SENT',
					status_label: 'Permintaan Harga Terkirim ke Vendor oleh KTU',
					timestamp: '2026-04-24T10:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Sarung Tangan (50 pasang)',
					related_items: ['TOOL-003']
				},
				// Item 3: Sarung Tangan - Step 4
				{
					id: 'track-006-32',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0032',
					status: 'PROCESSING',
					status_label: 'Menunggu Proses Pembelian oleh KTU',
					timestamp: '2026-04-23T15:00:00Z',
					performed_by: 'user-002',
					performed_by_name: 'Manager Kebun',
					remarks: 'Item: Sarung Tangan (50 pasang)',
					related_items: ['TOOL-003']
				},
				// Item 3: Sarung Tangan - Step 3
				{
					id: 'track-006-31',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'MR/2026/006',
					status: 'PENDING_APPROVAL_LEVEL_2',
					status_label: 'Menunggu Persetujuan MR oleh Manager Kebun',
					timestamp: '2026-04-23T11:00:00Z',
					performed_by: 'user-003',
					performed_by_name: 'Askep/Tekniker I',
					remarks: 'Item: Sarung Tangan (50 pasang)',
					related_items: ['TOOL-003']
				},
				// Item 3: Sarung Tangan - Step 2
				{
					id: 'track-006-30',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'MR/2026/006',
					status: 'PENDING_APPROVAL_LEVEL_1',
					status_label: 'Menunggu Persetujuan MR oleh Askep/Tekniker I',
					timestamp: '2026-04-23T09:00:00Z',
					performed_by: 'user-005',
					performed_by_name: 'Asisten/Tekniker II',
					remarks: 'Item: Sarung Tangan (50 pasang)',
					related_items: ['TOOL-003']
				},
				// Item 3: Sarung Tangan - Step 1
				{
					id: 'track-006-29',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'MR/2026/006',
					status: 'DRAFT',
					status_label: 'MR Telah Dibuat, Menunggu Pengajuan oleh Asisten/Tekniker II',
					timestamp: '2026-04-23T08:00:00Z',
					performed_by: 'user-005',
					performed_by_name: 'Asisten/Tekniker II',
					remarks: 'Item: Sarung Tangan (50 pasang)',
					related_items: ['TOOL-003']
				},

				// Item 4: Sepatu Boot - Step 3 (BARU MULAI - Menunggu Persetujuan MR Level 2)
				{
					id: 'track-006-28',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'MR/2026/006',
					status: 'PENDING_APPROVAL_LEVEL_2',
					status_label: 'Menunggu Persetujuan MR oleh Manager Kebun',
					timestamp: '2026-04-24T11:00:00Z',
					performed_by: 'user-003',
					performed_by_name: 'Askep/Tekniker I',
					remarks: 'Item: Sepatu Boot (20 pasang)',
					related_items: ['TOOL-004']
				},
				// Item 4: Sepatu Boot - Step 2
				{
					id: 'track-006-27',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'MR/2026/006',
					status: 'PENDING_APPROVAL_LEVEL_1',
					status_label: 'Menunggu Persetujuan MR oleh Askep/Tekniker I',
					timestamp: '2026-04-24T09:00:00Z',
					performed_by: 'user-005',
					performed_by_name: 'Asisten/Tekniker II',
					remarks: 'Item: Sepatu Boot (20 pasang)',
					related_items: ['TOOL-004']
				},
				// Item 4: Sepatu Boot - Step 1
				{
					id: 'track-006-26',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'MR/2026/006',
					status: 'DRAFT',
					status_label: 'MR Telah Dibuat, Menunggu Pengajuan oleh Asisten/Tekniker II',
					timestamp: '2026-04-24T08:00:00Z',
					performed_by: 'user-005',
					performed_by_name: 'Asisten/Tekniker II',
					remarks: 'Item: Sepatu Boot (20 pasang)',
					related_items: ['TOOL-004']
				}
			],
			'pr-007': [
				// Item 1: Laptop - WITH REJECTION SCENARIO
				// Step 9: LPO Rejected (Current)
				{
					id: 'track-007-09',
					module: 'LOCAL_PURCHASE_ORDER',
					module_name: 'Order Pembelian Lokal',
					document_number: 'LPO/2026/0040',
					status: 'REJECTED',
					status_label: 'LPO Ditolak oleh Manager Kebun',
					timestamp: '2026-04-25T10:00:00Z',
					performed_by: 'user-002',
					performed_by_name: 'Manager Kebun',
					remarks: 'Harga terlalu tinggi. Cari vendor lain atau nego ulang. Item: Laptop Dell Latitude 5420 (2 unit)',
					related_items: ['OFF-020']
				},
				// Step 8: LPO Submitted
				{
					id: 'track-007-08',
					module: 'LOCAL_PURCHASE_ORDER',
					module_name: 'Order Pembelian Lokal',
					document_number: 'LPO/2026/0040',
					status: 'DRAFT',
					status_label: 'LPO Telah Dibuat, Menunggu Pengajuan oleh KTU',
					timestamp: '2026-04-25T08:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Laptop Dell Latitude 5420 (2 unit)',
					related_items: ['OFF-020']
				},
				// Step 7: Waiting LPO
				{
					id: 'track-007-07',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0040',
					status: 'WAITING_LPO',
					status_label: 'Menunggu Pembuatan LPO oleh KTU',
					timestamp: '2026-04-24T16:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Laptop Dell Latitude 5420 (2 unit)',
					related_items: ['OFF-020']
				},
				// Step 6: Quotation Compared
				{
					id: 'track-007-06',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0040',
					status: 'QUOTATION_COMPARED',
					status_label: 'Perbandingan Harga Vendor oleh KTU',
					timestamp: '2026-04-24T15:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Laptop Dell Latitude 5420 (2 unit)',
					related_items: ['OFF-020']
				},
				// Step 5: Quotation Sent
				{
					id: 'track-007-05',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0040',
					status: 'QUOTATION_SENT',
					status_label: 'Permintaan Harga Terkirim ke Vendor oleh KTU',
					timestamp: '2026-04-24T10:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Laptop Dell Latitude 5420 (2 unit)',
					related_items: ['OFF-020']
				},
				// Step 4: Processing
				{
					id: 'track-007-04',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0040',
					status: 'PROCESSING',
					status_label: 'Menunggu Proses Pembelian oleh KTU',
					timestamp: '2026-04-23T15:00:00Z',
					performed_by: 'user-002',
					performed_by_name: 'Manager Kebun',
					remarks: 'Item: Laptop Dell Latitude 5420 (2 unit)',
					related_items: ['OFF-020']
				},
				// Step 3: MR Approved Level 2
				{
					id: 'track-007-03',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'MR/2026/007',
					status: 'PENDING_APPROVAL_LEVEL_2',
					status_label: 'Menunggu Persetujuan MR oleh Manager Kebun',
					timestamp: '2026-04-22T11:00:00Z',
					performed_by: 'user-003',
					performed_by_name: 'Askep/Tekniker I',
					remarks: 'Item: Laptop Dell Latitude 5420 (2 unit)',
					related_items: ['OFF-020']
				},
				// Step 2: MR Approved Level 1
				{
					id: 'track-007-02',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'MR/2026/007',
					status: 'PENDING_APPROVAL_LEVEL_1',
					status_label: 'Menunggu Persetujuan MR oleh Askep/Tekniker I',
					timestamp: '2026-04-22T09:00:00Z',
					performed_by: 'user-005',
					performed_by_name: 'Asisten/Tekniker II',
					remarks: 'Item: Laptop Dell Latitude 5420 (2 unit)',
					related_items: ['OFF-020']
				},
				// Step 1: MR Draft
				{
					id: 'track-007-01',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'MR/2026/007',
					status: 'DRAFT',
					status_label: 'MR Telah Dibuat, Menunggu Pengajuan oleh Asisten/Tekniker II',
					timestamp: '2026-04-22T08:00:00Z',
					performed_by: 'user-005',
					performed_by_name: 'Asisten/Tekniker II',
					remarks: 'Item: Laptop Dell Latitude 5420 (2 unit)',
					related_items: ['OFF-020']
				},

				// Item 2: Printer - NORMAL FLOW (for comparison)
				// Step 6: Quotation Compared (Current)
				{
					id: 'track-007-16',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0041',
					status: 'QUOTATION_COMPARED',
					status_label: 'Perbandingan Harga Vendor oleh KTU',
					timestamp: '2026-04-25T15:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Printer HP LaserJet Pro (1 unit)',
					related_items: ['OFF-021']
				},
				// Step 5: Quotation Sent
				{
					id: 'track-007-15',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0041',
					status: 'QUOTATION_SENT',
					status_label: 'Permintaan Harga Terkirim ke Vendor oleh KTU',
					timestamp: '2026-04-25T10:00:00Z',
					performed_by: 'user-001',
					performed_by_name: 'KTU',
					remarks: 'Item: Printer HP LaserJet Pro (1 unit)',
					related_items: ['OFF-021']
				},
				// Step 4: Processing
				{
					id: 'track-007-14',
					module: 'LOCAL_PURCHASE_PROCESS',
					module_name: 'Proses Pembelian Lokal',
					document_number: 'RFQ/2026/0041',
					status: 'PROCESSING',
					status_label: 'Menunggu Proses Pembelian oleh KTU',
					timestamp: '2026-04-24T15:00:00Z',
					performed_by: 'user-002',
					performed_by_name: 'Manager Kebun',
					remarks: 'Item: Printer HP LaserJet Pro (1 unit)',
					related_items: ['OFF-021']
				},
				// Step 3: MR Approved Level 2
				{
					id: 'track-007-13',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'MR/2026/007',
					status: 'PENDING_APPROVAL_LEVEL_2',
					status_label: 'Menunggu Persetujuan MR oleh Manager Kebun',
					timestamp: '2026-04-23T11:00:00Z',
					performed_by: 'user-003',
					performed_by_name: 'Askep/Tekniker I',
					remarks: 'Item: Printer HP LaserJet Pro (1 unit)',
					related_items: ['OFF-021']
				},
				// Step 2: MR Approved Level 1
				{
					id: 'track-007-12',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'MR/2026/007',
					status: 'PENDING_APPROVAL_LEVEL_1',
					status_label: 'Menunggu Persetujuan MR oleh Askep/Tekniker I',
					timestamp: '2026-04-23T09:00:00Z',
					performed_by: 'user-005',
					performed_by_name: 'Asisten/Tekniker II',
					remarks: 'Item: Printer HP LaserJet Pro (1 unit)',
					related_items: ['OFF-021']
				},
				// Step 1: MR Draft
				{
					id: 'track-007-11',
					module: 'PURCHASE_REQUEST',
					module_name: 'Permintaan Barang',
					document_number: 'MR/2026/007',
					status: 'DRAFT',
					status_label: 'MR Telah Dibuat, Menunggu Pengajuan oleh Asisten/Tekniker II',
					timestamp: '2026-04-23T08:00:00Z',
					performed_by: 'user-005',
					performed_by_name: 'Asisten/Tekniker II',
					remarks: 'Item: Printer HP LaserJet Pro (1 unit)',
					related_items: ['OFF-021']
				}
			]
		};

		// Determine next action based on latest status (12-step scope: MR → GRN Approved)
		const getNextAction = (data: any[], reqId: string) => {
			if (!data || data.length === 0) return null;
			
			const latest = data[0];
			
			// Proses Selesai - GRN Approved (Final Step)
			if (latest.status === 'APPROVED' && latest.module === 'GOODS_RECEIPT') {
				return {
					action: 'Proses Selesai',
					waiting_for: null,
					waiting_for_role: null,
					description: 'Procurement cycle selesai. Barang sudah diterima dan disetujui.'
				};
			}
			
			// Menunggu Persetujuan Penerimaan Barang oleh Askep/Tekniker I
			if (latest.status === 'PENDING_APPROVAL' && latest.module === 'GOODS_RECEIPT') {
				return {
					action: 'Menunggu Persetujuan Penerimaan Barang',
					waiting_for: 'Askep/Tekniker I',
					waiting_for_role: 'Supervisor',
					description: 'Barang sudah diterima dari vendor. Menunggu persetujuan penerimaan dari Askep/Tekniker I.'
				};
			}
			
			// Barang Diterima - Menunggu Pengajuan oleh Kepala Gudang
			if (latest.status === 'DRAFT' && latest.module === 'GOODS_RECEIPT') {
				return {
					action: 'Barang Diterima - Menunggu Pengajuan',
					waiting_for: 'Kepala Gudang',
					waiting_for_role: 'Kepala Gudang',
					description: 'Barang sudah diterima dari vendor. Menunggu Kepala Gudang mengajukan GRN untuk persetujuan.'
				};
			}
			
			// Menunggu Pengiriman dari Vendor
			if (latest.status === 'WAITING_DELIVERY' && latest.module === 'GOODS_RECEIPT') {
				return {
					action: 'Menunggu Pengiriman dari Vendor',
					waiting_for: 'Vendor',
					waiting_for_role: 'Supplier',
					description: 'LPO sudah disetujui. Menunggu vendor mengirimkan barang.'
				};
			}
			
			// LPO Approved
			if (latest.status === 'APPROVED' && latest.module === 'LOCAL_PURCHASE_ORDER') {
				return {
					action: 'LPO Disetujui - Menunggu Pengiriman',
					waiting_for: 'Vendor',
					waiting_for_role: 'Supplier',
					description: 'LPO sudah disetujui. Menunggu vendor mengirimkan barang.'
				};
			}
			
			// Menunggu Persetujuan LPO oleh Manager Kebun
			if (latest.status === 'PENDING_APPROVAL' && latest.module === 'LOCAL_PURCHASE_ORDER') {
				return {
					action: 'Menunggu Persetujuan LPO',
					waiting_for: 'Manager Kebun',
					waiting_for_role: 'Manager',
					description: 'Order Pembelian Lokal menunggu persetujuan dari Manager Kebun.'
				};
			}
			
			// LPO Ditolak
			if (latest.status === 'REJECTED' && latest.module === 'LOCAL_PURCHASE_ORDER') {
				return {
					action: 'LPO Ditolak - Perlu Revisi',
					waiting_for: 'KTU (Kepala Tata Usaha)',
					waiting_for_role: 'KTU',
					description: 'LPO ditolak oleh Manager Kebun. Perlu revisi atau cari vendor lain.'
				};
			}
			
			// LPO Telah Dibuat, Menunggu Pengajuan oleh KTU
			if (latest.status === 'DRAFT' && latest.module === 'LOCAL_PURCHASE_ORDER') {
				return {
					action: 'LPO Telah Dibuat, Menunggu Pengajuan',
					waiting_for: 'KTU (Kepala Tata Usaha)',
					waiting_for_role: 'KTU',
					description: 'LPO sudah dibuat. Menunggu KTU mengajukan LPO untuk persetujuan Manager Kebun.'
				};
			}
			
			// Menunggu Pembuatan LPO oleh KTU
			if (latest.status === 'WAITING_LPO' && latest.module === 'LOCAL_PURCHASE_PROCESS') {
				return {
					action: 'Menunggu Pembuatan LPO',
					waiting_for: 'KTU (Kepala Tata Usaha)',
					waiting_for_role: 'KTU',
					description: 'Perbandingan harga sudah selesai. Menunggu KTU membuat LPO.'
				};
			}
			
			// Perbandingan Harga Vendor oleh KTU
			if (latest.status === 'QUOTATION_COMPARED' && latest.module === 'LOCAL_PURCHASE_PROCESS') {
				return {
					action: 'Perbandingan Harga Vendor',
					waiting_for: 'KTU (Kepala Tata Usaha)',
					waiting_for_role: 'KTU',
					description: 'KTU sedang membandingkan harga penawaran dari vendor.'
				};
			}
			
			// Permintaan Harga Terkirim ke Vendor oleh KTU
			if (latest.status === 'QUOTATION_SENT' && latest.module === 'LOCAL_PURCHASE_PROCESS') {
				return {
					action: 'Menunggu Penawaran dari Vendor',
					waiting_for: 'Vendor',
					waiting_for_role: 'Supplier',
					description: 'Permintaan harga sudah terkirim ke vendor. Menunggu penawaran harga dari vendor.'
				};
			}
			
			// Menunggu Proses Pembelian oleh KTU
			if (latest.status === 'PROCESSING' && latest.module === 'LOCAL_PURCHASE_PROCESS') {
				return {
					action: 'Menunggu Proses Pembelian',
					waiting_for: 'KTU (Kepala Tata Usaha)',
					waiting_for_role: 'KTU',
					description: 'Permintaan barang sudah disetujui. Menunggu KTU memproses pembelian (RFQ).'
				};
			}
			
			// MR Approved
			if (latest.status === 'APPROVED' && latest.module === 'PURCHASE_REQUEST') {
				return {
					action: 'MR Disetujui - Menunggu Proses Pembelian',
					waiting_for: 'KTU (Kepala Tata Usaha)',
					waiting_for_role: 'KTU',
					description: 'Permintaan barang sudah disetujui. Menunggu KTU memproses pembelian.'
				};
			}
			
			// Menunggu Persetujuan MR oleh Manager Kebun
			if (latest.status === 'PENDING_APPROVAL_LEVEL_2' && latest.module === 'PURCHASE_REQUEST') {
				return {
					action: 'Menunggu Persetujuan MR oleh Manager Kebun',
					waiting_for: 'Manager Kebun',
					waiting_for_role: 'Manager',
					description: 'Permintaan barang menunggu persetujuan dari Manager Kebun.'
				};
			}
			
			// Menunggu Persetujuan MR oleh Askep/Tekniker I
			if (latest.status === 'PENDING_APPROVAL_LEVEL_1' && latest.module === 'PURCHASE_REQUEST') {
				return {
					action: 'Menunggu Persetujuan MR oleh Askep/Tekniker I',
					waiting_for: 'Askep/Tekniker I',
					waiting_for_role: 'Supervisor',
					description: 'Permintaan barang menunggu persetujuan dari Askep/Tekniker I.'
				};
			}
			
			// MR Telah Dibuat, Menunggu Pengajuan
			if (latest.status === 'DRAFT' && latest.module === 'PURCHASE_REQUEST') {
				return {
					action: 'MR Telah Dibuat, Menunggu Pengajuan',
					waiting_for: 'Asisten/Tekniker II',
					waiting_for_role: 'Pembuat Permintaan',
					description: 'Permintaan barang telah dibuat. Menunggu Asisten/Tekniker II untuk mengajukan permintaan.'
				};
			}
			
			return null;
		};

		const historyData = trackingData[requestId] || [];
		const nextAction = getNextAction(historyData, requestId);

		// Generate milestone-based data for PR-005
		let itemsProgress = undefined;
		let overallProgress = undefined;

		if (requestId === 'pr-005') {
			itemsProgress = [
				{
					item_code: 'ATK-010',
					item_name: 'Kertas HVS A4 80gr',
					quantity: 20,
					uom: 'BOX',
					current_status: 'COMPLETED',
					current_status_label: 'Proses Selesai',
					progress_percentage: 100,
					is_completed: true,
					documents: {
						rfq: 'RFQ/2026/0020',
						lpo: 'LPO/2026/0020',
						grn: 'GRN/2026/0020',
						gi: 'GI/2026/0020'
					},
					milestones: [
						{
							id: 'ms-1',
							milestone_type: 'MR_APPROVED',
							label: 'MR Disetujui',
							status: 'completed',
							timestamp: '2026-04-19T14:00:00Z',
							performed_by: 'Manager Kebun'
						},
						{
							id: 'ms-2',
							milestone_type: 'RFQ_CREATED',
							label: 'RFQ Dibuat',
							status: 'completed',
							timestamp: '2026-04-20T10:00:00Z',
							document_number: 'RFQ/2026/0020',
							performed_by: 'KTU'
						},
						{
							id: 'ms-3',
							milestone_type: 'LPO_APPROVED',
							label: 'LPO Disetujui',
							status: 'completed',
							timestamp: '2026-04-21T14:00:00Z',
							document_number: 'LPO/2026/0020',
							performed_by: 'Manager Kebun',
							remarks: 'Vendor: PT Kertas Jaya'
						},
						{
							id: 'ms-4',
							milestone_type: 'GOODS_RECEIVED',
							label: 'Barang Diterima',
							status: 'completed',
							timestamp: '2026-04-23T10:00:00Z',
							document_number: 'GRN/2026/0020',
							performed_by: 'Askep/Tekniker I'
						},
						{
							id: 'ms-5',
							milestone_type: 'COMPLETED',
							label: 'Proses Selesai',
							status: 'completed',
							timestamp: '2026-04-24T14:00:00Z',
							document_number: 'GI/2026/0020',
							performed_by: 'Askep/Tekniker I'
						}
					]
				},
				{
					item_code: 'ATK-011',
					item_name: 'Tinta Printer Canon',
					quantity: 10,
					uom: 'PCS',
					current_status: 'WAITING_DELIVERY',
					current_status_label: 'Menunggu Pengiriman dari Vendor',
					progress_percentage: 60,
					is_completed: false,
					documents: {
						rfq: 'RFQ/2026/0021',
						lpo: 'LPO/2026/0021',
						grn: 'GRN/2026/0021'
					},
					milestones: [
						{
							id: 'ms-6',
							milestone_type: 'MR_APPROVED',
							label: 'MR Disetujui',
							status: 'completed',
							timestamp: '2026-04-19T14:00:00Z',
							performed_by: 'Manager Kebun'
						},
						{
							id: 'ms-7',
							milestone_type: 'RFQ_CREATED',
							label: 'RFQ Dibuat',
							status: 'completed',
							timestamp: '2026-04-20T10:00:00Z',
							document_number: 'RFQ/2026/0021',
							performed_by: 'KTU'
						},
						{
							id: 'ms-8',
							milestone_type: 'LPO_APPROVED',
							label: 'LPO Disetujui',
							status: 'completed',
							timestamp: '2026-04-22T14:00:00Z',
							document_number: 'LPO/2026/0021',
							performed_by: 'Manager Kebun',
							remarks: 'Vendor: PT Printer Sejahtera'
						},
						{
							id: 'ms-9',
							milestone_type: 'GOODS_RECEIVED',
							label: 'Menunggu Pengiriman',
							status: 'in_progress',
							timestamp: '2026-04-22T17:00:00Z',
							remarks: 'Menunggu vendor mengirim barang'
						},
						{
							id: 'ms-10',
							milestone_type: 'COMPLETED',
							label: 'Proses Selesai',
							status: 'pending'
						}
					]
				},
				{
					item_code: 'ATK-012',
					item_name: 'Stapler Besar + Isi',
					quantity: 5,
					uom: 'UNIT',
					current_status: 'PENDING_APPROVAL',
					current_status_label: 'Menunggu Persetujuan LPO',
					progress_percentage: 40,
					is_completed: false,
					documents: {
						rfq: 'RFQ/2026/0022',
						lpo: 'LPO/2026/0022'
					},
					milestones: [
						{
							id: 'ms-11',
							milestone_type: 'MR_APPROVED',
							label: 'MR Disetujui',
							status: 'completed',
							timestamp: '2026-04-19T14:00:00Z',
							performed_by: 'Manager Kebun'
						},
						{
							id: 'ms-12',
							milestone_type: 'RFQ_CREATED',
							label: 'RFQ Dibuat',
							status: 'completed',
							timestamp: '2026-04-21T10:00:00Z',
							document_number: 'RFQ/2026/0022',
							performed_by: 'KTU'
						},
						{
							id: 'ms-13',
							milestone_type: 'LPO_APPROVED',
							label: 'Menunggu Persetujuan LPO',
							status: 'in_progress',
							timestamp: '2026-04-23T09:00:00Z',
							document_number: 'LPO/2026/0022',
							remarks: 'Vendor: PT Alat Tulis Makmur'
						},
						{
							id: 'ms-14',
							milestone_type: 'GOODS_RECEIVED',
							label: 'Barang Diterima',
							status: 'pending'
						},
						{
							id: 'ms-15',
							milestone_type: 'COMPLETED',
							label: 'Proses Selesai',
							status: 'pending'
						}
					]
				}
			];

			overallProgress = {
				completed_items: 1,
				total_items: 3,
				percentage: 33
			};
		}

		return {
			$schema: 'tracking-history-response',
			data: historyData,
			next_action: nextAction,
			items_progress: itemsProgress,
			overall_progress: overallProgress
		};
	},

	/**
	 * Get simplified tracking for purchase request (Opsi C - Hybrid Approach)
	 * Returns 5 milestones instead of 15 steps
	 */
	getSimplifiedTracking: async (requestId: string): Promise<any> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		const simplifiedData = mockSimplifiedTracking[requestId] || [];

		return {
			$schema: 'simplified-tracking-response',
			data: simplifiedData
		};
	},

	/**
	 * Get LPO tracking detail (Opsi C - Hybrid Approach)
	 * Returns detailed timeline for specific LPO
	 */
	getLPOTracking: async (lpoId: string): Promise<any> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		const lpoData = mockLPOTracking[lpoId] || null;

		if (!lpoData) {
			throw new Error(`LPO with ID ${lpoId} not found`);
		}

		return {
			$schema: 'lpo-tracking-response',
			data: lpoData
		};
	}
};

