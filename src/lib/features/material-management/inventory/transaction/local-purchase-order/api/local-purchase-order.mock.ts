/**
 * Mock data untuk Local Purchase Order (LPO)
 * Status: DRAFT → PENDING_APPROVAL → APPROVED → REJECTED → CANCELLED
 */

import type {
	LPOWinnerVendor,
	LPOWinnerVendorListResponse,
	LPOWinnerVendorParams,
	LPOListItem,
	LPOListResponse,
	LPOListParams,
	LPOSummary,
	LPOSummaryResponse,
	LPODetail,
	LPODetailResponse,
	LPOWinnerItem,
	LPOWinnerRFQ,
	LPOCancelParams,
	LPOCancelResponse,
	LPOUpdateParams,
	LPOUpdateResponse,
	LPOResubmitResponse,
	LPOActivityLog,
	LPOActivityLogResponse,
	LPOTrackingStatusItem,
	LPOTrackingHistoryResponse
} from '../types/local-purchase-order.types';

/**
 * Mock Winner Vendors Data (untuk create LPO dari RFQ)
 */
let mockWinnerVendors: LPOWinnerVendor[] = [
	{
		vendor_id: 'vnd-002',
		vendor_code: 'V002',
		vendor_name: 'CV Mitra Sejahtera',
		item_count: 4,
		rfqs: [
			{
				rfq_id: 'rfq-001',
				rfq_number: 'PH/LB/2026/0001',
				rfq_title: 'Pembelian ATK Kantor',
				item_count: 2,
				total_amount: 1125000
			},
			{
				rfq_id: 'rfq-003',
				rfq_number: 'PH/LB/2026/0003',
				rfq_title: 'Pembelian Kopi dan Teh',
				item_count: 2,
				total_amount: 1575000
			}
		],
		items: [
			{
				rfq_id: 'rfq-001',
				rfq_number: 'PH/LB/2026/0001',
				rfq_detail_id: 'rfq-dtl-001',
				item_id: 'item-001',
				pr_number: 'LB/LPO/MR/2026/00142',
				pr_barang_number: 'LB/LPO/MR/2026/00142-001',
				pr_purpose: 'Kebutuhan operasional kantor',
				pr_remarks: 'Urgent',
				item_code: 'ATK-001',
				item_name: 'Tissue Kotak',
				qty: 50,
				uom: 'BOX',
				uom_id: 'uom-box',
				unit_price: 14000,
				total_price: 700000,
				quotation_detail_id: 'quot-dtl-003',
				is_equivalent: false,
				purchase_request_dtl_id: 'pr-dtl-001'
			},
			{
				rfq_id: 'rfq-001',
				rfq_number: 'PH/LB/2026/0001',
				rfq_detail_id: 'rfq-dtl-002',
				item_id: 'item-002',
				pr_number: 'LB/LPO/MR/2026/00142',
				pr_barang_number: 'LB/LPO/MR/2026/00142-002',
				pr_purpose: 'Kebutuhan pantry',
				pr_remarks: '',
				item_code: 'ATK-002',
				item_name: 'Gula Pasir',
				qty: 25,
				uom: 'KG',
				uom_id: 'uom-kg',
				unit_price: 17000,
				total_price: 425000,
				quotation_detail_id: 'quot-dtl-004',
				is_equivalent: false,
				purchase_request_dtl_id: 'pr-dtl-002'
			},
			{
				rfq_id: 'rfq-003',
				rfq_number: 'PH/LB/2026/0003',
				rfq_detail_id: 'rfq-dtl-004',
				item_id: 'item-003',
				pr_number: 'LB/LPO/MR/2026/00140',
				pr_barang_number: 'LB/LPO/MR/2026/00140-001',
				pr_purpose: 'Kebutuhan pantry',
				pr_remarks: '',
				item_code: 'BEV-001',
				item_name: 'Kopi Bubuk',
				qty: 10,
				uom: 'KG',
				uom_id: 'uom-kg',
				unit_price: 82000,
				total_price: 820000,
				quotation_detail_id: 'quot-dtl-013',
				is_equivalent: false,
				purchase_request_dtl_id: 'pr-dtl-004'
			},
			{
				rfq_id: 'rfq-003',
				rfq_number: 'PH/LB/2026/0003',
				rfq_detail_id: 'rfq-dtl-005',
				item_id: 'item-004',
				pr_number: 'LB/LPO/MR/2026/00140',
				pr_barang_number: 'LB/LPO/MR/2026/00140-002',
				pr_purpose: 'Kebutuhan pantry',
				pr_remarks: '',
				item_code: 'BEV-002',
				item_name: 'Teh Celup',
				qty: 50,
				uom: 'BOX',
				uom_id: 'uom-box',
				unit_price: 15100,
				total_price: 755000,
				quotation_detail_id: 'quot-dtl-014',
				is_equivalent: false,
				purchase_request_dtl_id: 'pr-dtl-005'
			}
		]
	},
	{
		vendor_id: 'vnd-001',
		vendor_code: 'V001',
		vendor_name: 'PT Sumber Jaya',
		item_count: 2,
		rfqs: [
			{
				rfq_id: 'rfq-005',
				rfq_number: 'PH/LB/2026/0004',
				rfq_title: 'Pembelian Alat Kebersihan',
				item_count: 2,
				total_amount: 640000
			}
		],
		items: [
			{
				rfq_id: 'rfq-005',
				rfq_number: 'PH/LB/2026/0004',
				rfq_detail_id: 'rfq-dtl-008',
				item_id: 'item-005',
				pr_number: 'LB/LPO/MR/2026/00138',
				pr_barang_number: 'LB/LPO/MR/2026/00138-001',
				pr_purpose: 'Kebutuhan kebersihan',
				pr_remarks: '',
				item_code: 'CLN-002',
				item_name: 'Sapu Lidi',
				qty: 20,
				uom: 'PCS',
				uom_id: 'uom-pcs',
				unit_price: 14000,
				total_price: 280000,
				quotation_detail_id: 'quot-dtl-017',
				is_equivalent: false,
				purchase_request_dtl_id: 'pr-dtl-008'
			},
			{
				rfq_id: 'rfq-005',
				rfq_number: 'PH/LB/2026/0004',
				rfq_detail_id: 'rfq-dtl-009',
				item_id: 'item-006',
				pr_number: 'LB/LPO/MR/2026/00138',
				pr_barang_number: 'LB/LPO/MR/2026/00138-002',
				pr_purpose: 'Kebutuhan kebersihan',
				pr_remarks: '',
				item_code: 'CLN-003',
				item_name: 'Pel Lantai',
				qty: 10,
				uom: 'PCS',
				uom_id: 'uom-pcs',
				unit_price: 36000,
				total_price: 360000,
				quotation_detail_id: 'quot-dtl-018',
				is_equivalent: false,
				purchase_request_dtl_id: 'pr-dtl-009'
			}
		]
	}
];

/**
 * Mock LPO List Data
 */
let mockLPOList: LPOListItem[] = [
	// LPO APPROVED
	{
		id: 'lpo-001',
		lpo_number: 'LPO/2026/0001',
		lpo_date: '2026-04-19T00:00:00Z',
		lpo_based_on: 'RFQ',
		reference_number: 'PH/LB/2026/0001',
		supplier_code: 'V002',
		supplier_name: 'CV Mitra Sejahtera',
		item_count: 2,
		total_amount: 1125000,
		required_by_date: '2026-05-01T00:00:00Z',
		approval_status: 'APPROVED',
		version: 1,
		lpo_type: 'RFQ'
	},
	// LPO APPROVED (Repeat Order)
	{
		id: 'lpo-002',
		lpo_number: 'LPO/2026/0002',
		lpo_date: '2026-04-17T00:00:00Z',
		lpo_based_on: 'RO',
		reference_number: 'RO/2026/0001',
		supplier_code: 'V002',
		supplier_name: 'CV Mitra Sejahtera',
		item_count: 2,
		total_amount: 760000,
		required_by_date: '2026-04-28T00:00:00Z',
		approval_status: 'APPROVED',
		version: 1,
		lpo_type: 'RO'
	},
	// LPO PENDING_APPROVAL
	{
		id: 'lpo-003',
		lpo_number: 'LPOM/2026/0001',
		lpo_date: '2026-04-18T00:00:00Z',
		lpo_based_on: 'LPOM',
		reference_number: '',
		supplier_code: 'V003',
		supplier_name: 'UD Berkah Abadi',
		item_count: 2,
		total_amount: 850000,
		required_by_date: '2026-04-30T00:00:00Z',
		approval_status: 'PENDING_APPROVAL',
		version: 1,
		lpo_type: 'LPOM'
	},
	// LPO DRAFT
	{
		id: 'lpo-004',
		lpo_number: 'LPO/2026/0004',
		lpo_date: '2026-04-20T00:00:00Z',
		lpo_based_on: 'RFQ',
		reference_number: 'PH/LB/2026/0005',
		supplier_code: 'V001',
		supplier_name: 'PT Sumber Jaya',
		item_count: 3,
		total_amount: 1450000,
		required_by_date: '2026-05-05T00:00:00Z',
		approval_status: 'DRAFT',
		version: 1,
		lpo_type: 'RFQ'
	},
	// LPO REJECTED
	{
		id: 'lpo-005',
		lpo_number: 'LPO/2026/0005',
		lpo_date: '2026-04-16T00:00:00Z',
		lpo_based_on: 'RFQ',
		reference_number: 'PH/LB/2026/0003',
		supplier_code: 'V004',
		supplier_name: 'CV Sejahtera Makmur',
		item_count: 2,
		total_amount: 980000,
		required_by_date: '2026-04-29T00:00:00Z',
		approval_status: 'REJECTED',
		version: 1,
		lpo_type: 'RFQ'
	},
	// LPO CANCELLED
	{
		id: 'lpo-006',
		lpo_number: 'LPO/2026/0006',
		lpo_date: '2026-04-15T00:00:00Z',
		lpo_based_on: 'LPOM',
		reference_number: '',
		supplier_code: 'V005',
		supplier_name: 'UD Maju Jaya',
		item_count: 1,
		total_amount: 500000,
		required_by_date: '2026-04-27T00:00:00Z',
		approval_status: 'CANCELLED',
		version: 1,
		lpo_type: 'LPOM'
	}
];

/**
 * Mock LPO Detail Data
 */
let mockLPODetails: Record<string, LPODetail> = {
	// LPO-001: APPROVED
	'lpo-001': {
		id: 'lpo-001',
		lpo_number: 'LPO/2026/0001',
		lpo_date: '2026-04-19T00:00:00Z',
		lpo_based_on: 'RFQ',
		lpo_based_on_id: 'rfq-001',
		reference_number: 'PH/LB/2026/0001',
		supplier_code: 'V002',
		supplier_name: 'CV Mitra Sejahtera',
		store_code: 'GD-01',
		store_name: 'Gudang Pusat',
		payment_type: 'CREDIT',
		credit_days: 30,
		required_by_date: '2026-05-01T00:00:00Z',
		remarks: 'Pengiriman ke gudang pusat',
		approval_status: 'APPROVED',
		approval_id: 'appr-001',
		version: 1,
		items: [
			{
				id: 'lpo-dtl-001',
				item_code: 'ATK-001',
				item_name: 'Tissue Kotak',
				quantity: 50,
				uom_code: 'BOX',
				rate: 14000,
				amount: 700000,
				purpose: 'Kebutuhan operasional kantor'
			},
			{
				id: 'lpo-dtl-002',
				item_code: 'ATK-002',
				item_name: 'Gula Pasir',
				quantity: 25,
				uom_code: 'KG',
				rate: 17000,
				amount: 425000,
				purpose: 'Kebutuhan pantry'
			}
		]
	},
	// LPO-002: APPROVED (Repeat Order)
	'lpo-002': {
		id: 'lpo-002',
		lpo_number: 'LPO/2026/0002',
		lpo_date: '2026-04-17T00:00:00Z',
		lpo_based_on: 'RO',
		lpo_based_on_id: 'rfq-001',
		lpo_based_on_number: 'PH/LB/2026/0001',
		reference_number: 'RO/2026/0001',
		supplier_code: 'V002',
		supplier_name: 'CV Mitra Sejahtera',
		store_code: 'GD-01',
		store_name: 'Gudang Pusat',
		payment_type: 'CREDIT',
		credit_days: 30,
		required_by_date: '2026-04-28T00:00:00Z',
		remarks: 'Repeat order',
		approval_status: 'APPROVED',
		approval_id: 'appr-002',
		version: 1,
		items: [
			{
				id: 'lpo-dtl-003',
				item_code: 'ATK-001',
				item_name: 'Tissue Kotak',
				quantity: 30,
				uom_code: 'BOX',
				rate: 14000,
				amount: 420000,
				purpose: 'Repeat order'
			},
			{
				id: 'lpo-dtl-004',
				item_code: 'ATK-002',
				item_name: 'Gula Pasir',
				quantity: 20,
				uom_code: 'KG',
				rate: 17000,
				amount: 340000,
				purpose: 'Repeat order'
			}
		]
	},
	// LPO-003: PENDING_APPROVAL
	'lpo-003': {
		id: 'lpo-003',
		lpo_number: 'LPOM/2026/0001',
		lpo_date: '2026-04-18T00:00:00Z',
		lpo_based_on: 'LPOM',
		reference_number: '',
		supplier_code: 'V003',
		supplier_name: 'UD Berkah Abadi',
		store_code: 'GD-01',
		store_name: 'Gudang Pusat',
		payment_type: 'CASH',
		credit_days: 0,
		required_by_date: '2026-04-30T00:00:00Z',
		remarks: 'Pembelian manual urgent',
		approval_status: 'PENDING_APPROVAL',
		approval_id: 'appr-003',
		version: 1,
		items: [
			{
				id: 'lpo-dtl-005',
				item_code: 'CLN-001',
				item_name: 'Sabun Cuci Tangan',
				quantity: 20,
				uom_code: 'BTL',
				rate: 25000,
				amount: 500000,
				purpose: 'Kebutuhan kebersihan'
			},
			{
				id: 'lpo-dtl-006',
				item_code: 'CLN-004',
				item_name: 'Pembersih Lantai',
				quantity: 10,
				uom_code: 'BTL',
				rate: 35000,
				amount: 350000,
				purpose: 'Kebutuhan kebersihan'
			}
		]
	},
	// LPO-004: DRAFT
	'lpo-004': {
		id: 'lpo-004',
		lpo_number: 'LPO/2026/0004',
		lpo_date: '2026-04-20T00:00:00Z',
		lpo_based_on: 'RFQ',
		reference_number: 'PH/LB/2026/0005',
		supplier_code: 'V001',
		supplier_name: 'PT Sumber Jaya',
		store_code: 'GD-02',
		store_name: 'Gudang Cabang',
		payment_type: 'CREDIT',
		credit_days: 45,
		required_by_date: '2026-05-05T00:00:00Z',
		remarks: 'Untuk kebutuhan cabang',
		approval_status: 'DRAFT',
		approval_id: undefined,
		version: 1,
		items: [
			{
				id: 'lpo-dtl-007',
				item_code: 'BEV-001',
				item_name: 'Kopi Bubuk',
				quantity: 15,
				uom_code: 'KG',
				rate: 82000,
				amount: 1230000,
				purpose: 'Kebutuhan pantry cabang'
			},
			{
				id: 'lpo-dtl-008',
				item_code: 'BEV-002',
				item_name: 'Teh Celup',
				quantity: 10,
				uom_code: 'BOX',
				rate: 15000,
				amount: 150000,
				purpose: 'Kebutuhan pantry cabang'
			},
			{
				id: 'lpo-dtl-009',
				item_code: 'ATK-003',
				item_name: 'Kertas A4',
				quantity: 5,
				uom_code: 'RIM',
				rate: 14000,
				amount: 70000,
				purpose: 'Kebutuhan administrasi'
			}
		]
	},
	// LPO-005: REJECTED
	'lpo-005': {
		id: 'lpo-005',
		lpo_number: 'LPO/2026/0005',
		lpo_date: '2026-04-16T00:00:00Z',
		lpo_based_on: 'RFQ',
		reference_number: 'PH/LB/2026/0003',
		supplier_code: 'V004',
		supplier_name: 'CV Sejahtera Makmur',
		store_code: 'GD-01',
		store_name: 'Gudang Pusat',
		payment_type: 'CREDIT',
		credit_days: 30,
		required_by_date: '2026-04-29T00:00:00Z',
		remarks: 'Pembelian alat tulis',
		approval_status: 'REJECTED',
		approval_id: 'appr-005',
		version: 1,
		items: [
			{
				id: 'lpo-dtl-010',
				item_code: 'ATK-004',
				item_name: 'Pulpen',
				quantity: 100,
				uom_code: 'PCS',
				rate: 3000,
				amount: 300000,
				purpose: 'Kebutuhan kantor'
			},
			{
				id: 'lpo-dtl-011',
				item_code: 'ATK-005',
				item_name: 'Spidol Whiteboard',
				quantity: 50,
				uom_code: 'PCS',
				rate: 13600,
				amount: 680000,
				purpose: 'Kebutuhan ruang meeting'
			}
		]
	},
	// LPO-006: CANCELLED
	'lpo-006': {
		id: 'lpo-006',
		lpo_number: 'LPO/2026/0006',
		lpo_date: '2026-04-15T00:00:00Z',
		lpo_based_on: 'LPOM',
		reference_number: '',
		supplier_code: 'V005',
		supplier_name: 'UD Maju Jaya',
		store_code: 'GD-01',
		store_name: 'Gudang Pusat',
		payment_type: 'CASH',
		credit_days: 0,
		required_by_date: '2026-04-27T00:00:00Z',
		remarks: 'Pembelian urgent - DIBATALKAN',
		approval_status: 'CANCELLED',
		approval_id: undefined,
		version: 1,
		items: [
			{
				id: 'lpo-dtl-012',
				item_code: 'CLN-005',
				item_name: 'Lap Microfiber',
				quantity: 50,
				uom_code: 'PCS',
				rate: 10000,
				amount: 500000,
				purpose: 'Kebutuhan kebersihan'
			}
		]
	}
};

/**
 * Mock LPO Summary
 */
const mockLPOSummary: LPOSummary = {
	total_lpo: 6,
	draft: 1,
	pending_approval: 1,
	approved: 2,
	rejected: 1,
	cancelled: 1
};

/**
 * Mock Activity Logs
 */
let mockActivityLogs: Record<string, LPOActivityLog[]> = {
	// LPO-001: APPROVED
	'lpo-001': [
		{
			id: 'log-001',
			lpo_id: 'lpo-001',
			action: 'CREATED',
			status_to: 'DRAFT',
			performed_by: 'user-001',
			performed_by_name: 'John Doe (KTU)',
			performed_at: '2026-04-19T08:00:00Z'
		},
		{
			id: 'log-002',
			lpo_id: 'lpo-001',
			action: 'SUBMITTED',
			status_from: 'DRAFT',
			status_to: 'PENDING_APPROVAL',
			performed_by: 'user-001',
			performed_by_name: 'John Doe (KTU)',
			performed_at: '2026-04-19T09:00:00Z'
		},
		{
			id: 'log-003',
			lpo_id: 'lpo-001',
			action: 'APPROVED',
			status_from: 'PENDING_APPROVAL',
			status_to: 'APPROVED',
			performed_by: 'user-002',
			performed_by_name: 'Manager Kebun',
			performed_at: '2026-04-19T10:00:00Z'
		}
	],
	// LPO-002: APPROVED (Repeat Order)
	'lpo-002': [
		{
			id: 'log-004',
			lpo_id: 'lpo-002',
			action: 'CREATED',
			status_to: 'DRAFT',
			performed_by: 'user-001',
			performed_by_name: 'John Doe (KTU)',
			performed_at: '2026-04-17T08:00:00Z'
		},
		{
			id: 'log-005',
			lpo_id: 'lpo-002',
			action: 'SUBMITTED',
			status_from: 'DRAFT',
			status_to: 'PENDING_APPROVAL',
			performed_by: 'user-001',
			performed_by_name: 'John Doe (KTU)',
			performed_at: '2026-04-17T09:00:00Z'
		},
		{
			id: 'log-006',
			lpo_id: 'lpo-002',
			action: 'APPROVED',
			status_from: 'PENDING_APPROVAL',
			status_to: 'APPROVED',
			performed_by: 'user-002',
			performed_by_name: 'Manager Kebun',
			performed_at: '2026-04-17T10:00:00Z'
		}
	],
	// LPO-003: PENDING_APPROVAL
	'lpo-003': [
		{
			id: 'log-007',
			lpo_id: 'lpo-003',
			action: 'CREATED',
			status_to: 'DRAFT',
			performed_by: 'user-001',
			performed_by_name: 'John Doe (KTU)',
			performed_at: '2026-04-18T08:00:00Z'
		},
		{
			id: 'log-008',
			lpo_id: 'lpo-003',
			action: 'SUBMITTED',
			status_from: 'DRAFT',
			status_to: 'PENDING_APPROVAL',
			performed_by: 'user-001',
			performed_by_name: 'John Doe (KTU)',
			performed_at: '2026-04-18T09:00:00Z'
		}
	],
	// LPO-004: DRAFT
	'lpo-004': [
		{
			id: 'log-009',
			lpo_id: 'lpo-004',
			action: 'CREATED',
			status_to: 'DRAFT',
			performed_by: 'user-001',
			performed_by_name: 'John Doe (KTU)',
			performed_at: '2026-04-20T08:00:00Z'
		}
	],
	// LPO-005: REJECTED
	'lpo-005': [
		{
			id: 'log-010',
			lpo_id: 'lpo-005',
			action: 'CREATED',
			status_to: 'DRAFT',
			performed_by: 'user-001',
			performed_by_name: 'John Doe (KTU)',
			performed_at: '2026-04-16T08:00:00Z'
		},
		{
			id: 'log-011',
			lpo_id: 'lpo-005',
			action: 'SUBMITTED',
			status_from: 'DRAFT',
			status_to: 'PENDING_APPROVAL',
			performed_by: 'user-001',
			performed_by_name: 'John Doe (KTU)',
			performed_at: '2026-04-16T09:00:00Z'
		},
		{
			id: 'log-012',
			lpo_id: 'lpo-005',
			action: 'REJECTED',
			status_from: 'PENDING_APPROVAL',
			status_to: 'REJECTED',
			reason: 'Harga terlalu tinggi, mohon negosiasi ulang dengan vendor',
			performed_by: 'user-002',
			performed_by_name: 'Manager Kebun',
			performed_at: '2026-04-16T14:00:00Z'
		}
	],
	// LPO-006: CANCELLED
	'lpo-006': [
		{
			id: 'log-013',
			lpo_id: 'lpo-006',
			action: 'CREATED',
			status_to: 'DRAFT',
			performed_by: 'user-001',
			performed_by_name: 'John Doe (KTU)',
			performed_at: '2026-04-15T08:00:00Z'
		},
		{
			id: 'log-014',
			lpo_id: 'lpo-006',
			action: 'CANCELLED',
			status_from: 'DRAFT',
			status_to: 'CANCELLED',
			reason: 'Barang sudah tidak dibutuhkan lagi, anggaran dialihkan ke kebutuhan lain',
			performed_by: 'user-001',
			performed_by_name: 'John Doe (KTU)',
			performed_at: '2026-04-15T11:00:00Z'
		}
	]
};

/**
 * Mock LPO Tracking Data - 7 Steps: LPO Draft → GRN Approved
 */
const mockLPOTrackingData: Record<string, LPOTrackingStatusItem[]> = {
	// LPO-001: APPROVED (Complete 7-step tracking)
	'lpo-001': [
		// Step 7: GRN Approved (FINAL STEP)
		{
			id: 'track-lpo-001-7',
			module: 'GOODS_RECEIPT',
			module_name: 'Penerimaan Barang',
			document_number: 'GRN/2026/0001',
			status: 'APPROVED',
			status_label: 'Penerimaan Barang Disetujui - Proses Selesai',
			timestamp: '2026-04-20T14:00:00Z',
			performed_by: 'user-003',
			performed_by_name: 'Askep/Tekniker I',
			remarks: 'Items: Tissue Kotak (50 box), Gula Pasir (25 kg)',
			related_items: ['ATK-001', 'ATK-002']
		},
		// Step 6: GRN Pending Approval
		{
			id: 'track-lpo-001-6',
			module: 'GOODS_RECEIPT',
			module_name: 'Penerimaan Barang',
			document_number: 'GRN/2026/0001',
			status: 'PENDING_APPROVAL',
			status_label: 'Menunggu Persetujuan Penerimaan Barang oleh Askep/Tekniker I',
			timestamp: '2026-04-20T10:00:00Z',
			performed_by: 'user-006',
			performed_by_name: 'Kepala Gudang',
			remarks: 'Items: Tissue Kotak (50 box), Gula Pasir (25 kg)',
			related_items: ['ATK-001', 'ATK-002']
		},
		// Step 5: GRN Draft
		{
			id: 'track-lpo-001-5',
			module: 'GOODS_RECEIPT',
			module_name: 'Penerimaan Barang',
			document_number: 'GRN/2026/0001',
			status: 'DRAFT',
			status_label: 'Barang Diterima - Menunggu Pengajuan oleh Kepala Gudang',
			timestamp: '2026-04-20T09:00:00Z',
			performed_by: 'user-006',
			performed_by_name: 'Kepala Gudang',
			remarks: 'Items: Tissue Kotak (50 box), Gula Pasir (25 kg)',
			related_items: ['ATK-001', 'ATK-002']
		},
		// Step 4: Waiting Delivery
		{
			id: 'track-lpo-001-4',
			module: 'GOODS_RECEIPT',
			module_name: 'Penerimaan Barang',
			document_number: 'LPO/2026/0001',
			status: 'WAITING_DELIVERY',
			status_label: 'Menunggu Pengiriman dari Vendor',
			timestamp: '2026-04-19T17:00:00Z',
			performed_by: 'user-002',
			performed_by_name: 'Manager Kebun',
			remarks: 'Items: Tissue Kotak (50 box), Gula Pasir (25 kg)',
			related_items: ['ATK-001', 'ATK-002']
		},
		// Step 3: LPO Approved
		{
			id: 'track-lpo-001-3',
			module: 'LOCAL_PURCHASE_ORDER',
			module_name: 'Order Pembelian Lokal',
			document_number: 'LPO/2026/0001',
			status: 'APPROVED',
			status_label: 'LPO Disetujui oleh Manager Kebun',
			timestamp: '2026-04-19T14:00:00Z',
			performed_by: 'user-002',
			performed_by_name: 'Manager Kebun',
			remarks: 'Items: Tissue Kotak (50 box), Gula Pasir (25 kg)',
			related_items: ['ATK-001', 'ATK-002']
		},
		// Step 2: LPO Pending Approval
		{
			id: 'track-lpo-001-2',
			module: 'LOCAL_PURCHASE_ORDER',
			module_name: 'Order Pembelian Lokal',
			document_number: 'LPO/2026/0001',
			status: 'PENDING_APPROVAL',
			status_label: 'Menunggu Persetujuan LPO oleh Manager Kebun',
			timestamp: '2026-04-19T09:00:00Z',
			performed_by: 'user-001',
			performed_by_name: 'KTU',
			remarks: 'Items: Tissue Kotak (50 box), Gula Pasir (25 kg)',
			related_items: ['ATK-001', 'ATK-002']
		},
		// Step 1: LPO Draft (FIRST STEP)
		{
			id: 'track-lpo-001-1',
			module: 'LOCAL_PURCHASE_ORDER',
			module_name: 'Order Pembelian Lokal',
			document_number: 'LPO/2026/0001',
			status: 'DRAFT',
			status_label: 'LPO Telah Dibuat, Menunggu Pengajuan oleh KTU',
			timestamp: '2026-04-18T08:00:00Z',
			performed_by: 'user-001',
			performed_by_name: 'KTU',
			remarks: 'Items: Tissue Kotak (50 box), Gula Pasir (25 kg)',
			related_items: ['ATK-001', 'ATK-002']
		}
	],

	// LPO-002: DRAFT (Early stage)
	'lpo-002': [
		// Step 1: LPO Draft (CURRENT STEP)
		{
			id: 'track-lpo-002-1',
			module: 'LOCAL_PURCHASE_ORDER',
			module_name: 'Order Pembelian Lokal',
			document_number: 'LPO/2026/0002',
			status: 'DRAFT',
			status_label: 'LPO Telah Dibuat, Menunggu Pengajuan oleh KTU',
			timestamp: '2026-04-21T08:00:00Z',
			performed_by: 'user-001',
			performed_by_name: 'KTU',
			remarks: 'Items: Kopi Bubuk (10 kg), Teh Celup (50 box)',
			related_items: ['BEV-001', 'BEV-002']
		}
	],

	// LPO-003: PENDING_APPROVAL (Mid stage)
	'lpo-003': [
		// Step 2: LPO Pending Approval (CURRENT STEP)
		{
			id: 'track-lpo-003-2',
			module: 'LOCAL_PURCHASE_ORDER',
			module_name: 'Order Pembelian Lokal',
			document_number: 'LPO/2026/0003',
			status: 'PENDING_APPROVAL',
			status_label: 'Menunggu Persetujuan LPO oleh Manager Kebun',
			timestamp: '2026-04-22T09:00:00Z',
			performed_by: 'user-001',
			performed_by_name: 'KTU',
			remarks: 'Items: Sabun Cuci Tangan (20 btl), Pembersih Lantai (15 btl)',
			related_items: ['CLN-001', 'CLN-004']
		},
		// Step 1: LPO Draft
		{
			id: 'track-lpo-003-1',
			module: 'LOCAL_PURCHASE_ORDER',
			module_name: 'Order Pembelian Lokal',
			document_number: 'LPO/2026/0003',
			status: 'DRAFT',
			status_label: 'LPO Telah Dibuat, Menunggu Pengajuan oleh KTU',
			timestamp: '2026-04-22T08:00:00Z',
			performed_by: 'user-001',
			performed_by_name: 'KTU',
			remarks: 'Items: Sabun Cuci Tangan (20 btl), Pembersih Lantai (15 btl)',
			related_items: ['CLN-001', 'CLN-004']
		}
	],

	// LPO-005: REJECTED (Rejected status)
	'lpo-005': [
		// Step 2: LPO Rejected (CURRENT STEP)
		{
			id: 'track-lpo-005-2',
			module: 'LOCAL_PURCHASE_ORDER',
			module_name: 'Order Pembelian Lokal',
			document_number: 'LPO/2026/0005',
			status: 'REJECTED',
			status_label: 'LPO Ditolak oleh Manager Kebun',
			timestamp: '2026-04-23T14:00:00Z',
			performed_by: 'user-002',
			performed_by_name: 'Manager Kebun',
			remarks: 'Budget tidak mencukupi untuk periode ini, mohon revisi atau tunda ke bulan depan',
			related_items: ['OFF-010', 'OFF-011']
		},
		// Step 1: LPO Draft
		{
			id: 'track-lpo-005-1',
			module: 'LOCAL_PURCHASE_ORDER',
			module_name: 'Order Pembelian Lokal',
			document_number: 'LPO/2026/0005',
			status: 'DRAFT',
			status_label: 'LPO Telah Dibuat, Menunggu Pengajuan oleh KTU',
			timestamp: '2026-04-23T08:00:00Z',
			performed_by: 'user-001',
			performed_by_name: 'KTU',
			remarks: 'Items: Laptop Dell Latitude (1 unit), Mouse Wireless Logitech (5 pcs)',
			related_items: ['OFF-010', 'OFF-011']
		}
	]
};

/**
 * Mock API Functions
 */
export const localPurchaseOrderMockApi = {
	/**
	 * Get Winner Vendors
	 */
	getWinnerVendors: async (params: LPOWinnerVendorParams): Promise<LPOWinnerVendorListResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		let filteredData = [...mockWinnerVendors];

		if (params.search) {
			const searchLower = params.search.toLowerCase();
			filteredData = filteredData.filter(
				(vendor) =>
					vendor.vendor_name.toLowerCase().includes(searchLower) ||
					vendor.vendor_code.toLowerCase().includes(searchLower)
			);
		}

		const startIndex = (params.page - 1) * params.size;
		const endIndex = startIndex + params.size;
		const paginatedData = filteredData.slice(startIndex, endIndex);

		return {
			$schema: 'winner-vendor-list-response',
			data: paginatedData,
			paging: {
				page: params.page,
				size: params.size,
				total_item: filteredData.length,
				total_page: Math.ceil(filteredData.length / params.size)
			}
		};
	},

	/**
	 * Get All LPOs
	 */
	getAllLPOs: async (params: LPOListParams): Promise<LPOListResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		let filteredData = [...mockLPOList];

		if (params.search) {
			const searchLower = params.search.toLowerCase();
			filteredData = filteredData.filter(
				(lpo) =>
					lpo.lpo_number.toLowerCase().includes(searchLower) ||
					lpo.supplier_name.toLowerCase().includes(searchLower) ||
					lpo.reference_number.toLowerCase().includes(searchLower)
			);
		}

		if (params.approval_status) {
			filteredData = filteredData.filter((lpo) => lpo.approval_status === params.approval_status);
		}

		const startIndex = (params.page - 1) * params.size;
		const endIndex = startIndex + params.size;
		const paginatedData = filteredData.slice(startIndex, endIndex);

		return {
			$schema: 'lpo-list-response',
			data: paginatedData,
			paging: {
				page: params.page,
				size: params.size,
				total_item: filteredData.length,
				total_page: Math.ceil(filteredData.length / params.size)
			}
		};
	},

	/**
	 * Get LPO Summary
	 */
	getSummary: async (): Promise<LPOSummaryResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 300));

		return {
			$schema: 'lpo-summary-response',
			data: mockLPOSummary
		};
	},

	/**
	 * Get LPO Detail
	 */
	getLPODetail: async (lpoId: string): Promise<LPODetailResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		const detail = mockLPODetails[lpoId];
		if (!detail) {
			throw new Error(`LPO with ID ${lpoId} not found`);
		}

		return {
			$schema: 'lpo-detail-response',
			data: detail
		};
	},

	/**
	 * Cancel LPO
	 */
	cancelLPO: async (lpoId: string, params: LPOCancelParams): Promise<LPOCancelResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		const detail = mockLPODetails[lpoId];
		if (!detail) {
			throw new Error(`LPO with ID ${lpoId} not found`);
		}

		// Update status to CANCELLED
		detail.approval_status = 'CANCELLED';

		// Update in list
		const listItem = mockLPOList.find((item) => item.id === lpoId);
		if (listItem) {
			listItem.approval_status = 'CANCELLED';
		}

		// Add activity log
		const newLog: LPOActivityLog = {
			id: `log-${Date.now()}`,
			lpo_id: lpoId,
			action: 'CANCELLED',
			status_from: detail.approval_status,
			status_to: 'CANCELLED',
			reason: params.reason,
			performed_by: 'user-001',
			performed_by_name: 'Current User',
			performed_at: new Date().toISOString()
		};

		if (!mockActivityLogs[lpoId]) {
			mockActivityLogs[lpoId] = [];
		}
		mockActivityLogs[lpoId].push(newLog);

		// Update summary
		mockLPOSummary.cancelled++;
		if (detail.approval_status === 'DRAFT') mockLPOSummary.draft--;
		else if (detail.approval_status === 'PENDING_APPROVAL') mockLPOSummary.pending_approval--;
		else if (detail.approval_status === 'APPROVED') mockLPOSummary.approved--;

		return {
			$schema: 'lpo-cancel-response',
			data: {
				id: lpoId,
				lpo_number: detail.lpo_number,
				approval_status: 'CANCELLED',
				cancelled_at: new Date().toISOString(),
				cancelled_by: 'Current User',
				cancellation_reason: params.reason
			}
		};
	},

	/**
	 * Update LPO
	 */
	updateLPO: async (lpoId: string, params: LPOUpdateParams): Promise<LPOUpdateResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		const detail = mockLPODetails[lpoId];
		if (!detail) {
			throw new Error(`LPO with ID ${lpoId} not found`);
		}

		// Update fields
		if (params.lpo_date) detail.lpo_date = params.lpo_date;
		if (params.required_by_date) detail.required_by_date = params.required_by_date;
		if (params.remarks !== undefined) detail.remarks = params.remarks;
		if (params.credit_days !== undefined) detail.credit_days = params.credit_days;
		if (params.reference_number !== undefined) detail.reference_number = params.reference_number;

		// If status was REJECTED, change to DRAFT
		if (detail.approval_status === 'REJECTED') {
			detail.approval_status = 'DRAFT';

			// Update in list
			const listItem = mockLPOList.find((item) => item.id === lpoId);
			if (listItem) {
				listItem.approval_status = 'DRAFT';
			}

			// Update summary
			mockLPOSummary.rejected--;
			mockLPOSummary.draft++;
		}

		// Add activity log
		const newLog: LPOActivityLog = {
			id: `log-${Date.now()}`,
			lpo_id: lpoId,
			action: 'EDITED',
			status_from: detail.approval_status,
			status_to: detail.approval_status,
			performed_by: 'user-001',
			performed_by_name: 'Current User',
			performed_at: new Date().toISOString(),
			changes: params
		};

		if (!mockActivityLogs[lpoId]) {
			mockActivityLogs[lpoId] = [];
		}
		mockActivityLogs[lpoId].push(newLog);

		return {
			$schema: 'lpo-update-response',
			data: detail
		};
	},

	/**
	 * Resubmit LPO
	 */
	resubmitLPO: async (lpoId: string): Promise<LPOResubmitResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		const detail = mockLPODetails[lpoId];
		if (!detail) {
			throw new Error(`LPO with ID ${lpoId} not found`);
		}

		// Update status to PENDING_APPROVAL
		detail.approval_status = 'PENDING_APPROVAL';

		// Update in list
		const listItem = mockLPOList.find((item) => item.id === lpoId);
		if (listItem) {
			listItem.approval_status = 'PENDING_APPROVAL';
		}

		// Add activity log
		const newLog: LPOActivityLog = {
			id: `log-${Date.now()}`,
			lpo_id: lpoId,
			action: 'RESUBMITTED',
			status_from: 'DRAFT',
			status_to: 'PENDING_APPROVAL',
			performed_by: 'user-001',
			performed_by_name: 'Current User',
			performed_at: new Date().toISOString()
		};

		if (!mockActivityLogs[lpoId]) {
			mockActivityLogs[lpoId] = [];
		}
		mockActivityLogs[lpoId].push(newLog);

		// Update summary
		mockLPOSummary.draft--;
		mockLPOSummary.pending_approval++;

		return {
			$schema: 'lpo-resubmit-response',
			data: {
				id: lpoId,
				lpo_number: detail.lpo_number,
				approval_status: 'PENDING_APPROVAL',
				approval_id: detail.approval_id || 'appr-new'
			}
		};
	},

	/**
	 * Get Activity Logs
	 */
	getActivityLogs: async (lpoId: string): Promise<LPOActivityLogResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 300));

		const logs = mockActivityLogs[lpoId] || [];

		return {
			$schema: 'lpo-activity-log-response',
			data: logs
		};
	},

	/**
	 * Get tracking history for LPO
	 */
	getTrackingHistory: async (lpoId: string): Promise<LPOTrackingHistoryResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		const trackingData = mockLPOTrackingData[lpoId];
		if (!trackingData) {
			throw new Error(`Tracking data for LPO ${lpoId} not found`);
		}

		return {
			$schema: 'lpo-tracking-history-response',
			data: trackingData
		};
	}
};
