/**
 * Mock data untuk Goods Receives Notes (GRN) - Penerimaan Barang Pembelian Lokal
 */

import type {
	GRNItem,
	GRNListResponse,
	GRNListParams,
	GRNDetailData,
	GRNDetailResponse,
	ApprovedLPOItem,
	ApprovedLPOListResponse,
	ApprovedLPOListParams,
	ApprovedLPODetailData,
	ApprovedLPODetailResponse,
	GRNSummaryData,
	GRNSummaryResponse
} from '../types/goods-receives-notes.types';

/**
 * Mock GRN List Data
 */
let mockGRNList: GRNItem[] = [
	// GRN dari LPO - Gudang
	{
		id: 'grn-001',
		grn_number: 'GRN/2026/0001',
		date: '2026-04-20T00:00:00Z',
		supplier_id: 'vnd-002',
		supplier_name: 'CV Mitra Sejahtera',
		total_items: 2,
		gross_total: 1125000,
		approval_status: 'APPROVED'
	},
	// GRN dari LPO (Repeat Order) - Gudang
	{
		id: 'grn-002',
		grn_number: 'GRN/2026/0002',
		date: '2026-04-18T00:00:00Z',
		supplier_id: 'vnd-002',
		supplier_name: 'CV Mitra Sejahtera',
		total_items: 2,
		gross_total: 760000,
		approval_status: 'APPROVED'
	},
	// GRN dari LPOM (Manual) - Gudang
	{
		id: 'grn-003',
		grn_number: 'GRN/2026/0003',
		date: '2026-04-19T00:00:00Z',
		supplier_id: 'vnd-003',
		supplier_name: 'UD Berkah Abadi',
		total_items: 2,
		gross_total: 850000,
		approval_status: 'PENDING_APPROVAL'
	},
	// GRN Penerimaan di Lapangan - Material Dropping (Pasir)
	{
		id: 'grn-004',
		grn_number: 'GRN/2026/0004',
		date: '2026-04-22T00:00:00Z',
		supplier_id: 'vnd-005',
		supplier_name: 'CV Material Jaya',
		total_items: 1,
		gross_total: 11200000,
		approval_status: 'APPROVED'
	}
];

/**
 * Mock GRN Detail Data
 */
let mockGRNDetails: Record<string, GRNDetailData> = {
	'grn-001': {
		id: 'grn-001',
		grn_number: 'GRN/2026/0001',
		date: '2026-04-20T00:00:00Z',
		reference_number: 'LPO/2026/0001',
		delivery_despatch_note_number: 'DN-001/2026',
		delivery_despatch_note_date: '2026-04-20T00:00:00Z',
		vehicle_number: 'B 1234 XYZ',
		supplier_id: 'vnd-002',
		supplier_name: 'CV Mitra Sejahtera',
		store_id: 'store-001',
		store_name: 'Gudang Pusat',
		type: 1,
		approval_status: 'APPROVED',
		document_approval_id: 'appr-grn-001',
		remarks: 'Barang diterima dalam kondisi baik',
		total: 1125000,
		gross_total: 1125000,
		i_version: 1,
		items: [
			{
				id: 'grn-dtl-001',
				item_id: 'item-001',
				item_code: 'ATK-001',
				item_name: 'Tissue Kotak',
				uom_id: 'uom-box',
				uom_code: 'BOX',
				offer_quantity: 50,
				offer_quantity_in_base_unit: 50,
				grn_received_quantity: 50,
				grn_received_quantity_in_base_unit: 50,
				accepted_quantity: 50,
				accepted_quantity_in_base_unit: 50,
				unit_rate: 14000,
				value: 700000,
				value_local_currency: 700000,
				gross_total: 700000
			},
			{
				id: 'grn-dtl-002',
				item_id: 'item-002',
				item_code: 'ATK-002',
				item_name: 'Gula Pasir',
				uom_id: 'uom-kg',
				uom_code: 'KG',
				offer_quantity: 25,
				offer_quantity_in_base_unit: 25,
				grn_received_quantity: 25,
				grn_received_quantity_in_base_unit: 25,
				accepted_quantity: 25,
				accepted_quantity_in_base_unit: 25,
				unit_rate: 17000,
				value: 425000,
				value_local_currency: 425000,
				gross_total: 425000
			}
		]
	},
	'grn-002': {
		id: 'grn-002',
		grn_number: 'GRN/2026/0002',
		date: '2026-04-18T00:00:00Z',
		reference_number: 'LPO/2026/0002',
		delivery_despatch_note_number: 'DN-002/2026',
		delivery_despatch_note_date: '2026-04-18T00:00:00Z',
		vehicle_number: 'B 5678 ABC',
		supplier_id: 'vnd-002',
		supplier_name: 'CV Mitra Sejahtera',
		store_id: 'store-001',
		store_name: 'Gudang Pusat',
		type: 1,
		approval_status: 'APPROVED',
		document_approval_id: 'appr-grn-002',
		remarks: 'Repeat order - barang sesuai',
		total: 760000,
		gross_total: 760000,
		i_version: 1,
		items: [
			{
				id: 'grn-dtl-003',
				item_id: 'item-001',
				item_code: 'ATK-001',
				item_name: 'Tissue Kotak',
				uom_id: 'uom-box',
				uom_code: 'BOX',
				offer_quantity: 30,
				offer_quantity_in_base_unit: 30,
				grn_received_quantity: 30,
				grn_received_quantity_in_base_unit: 30,
				accepted_quantity: 30,
				accepted_quantity_in_base_unit: 30,
				unit_rate: 14000,
				value: 420000,
				value_local_currency: 420000,
				gross_total: 420000
			},
			{
				id: 'grn-dtl-004',
				item_id: 'item-002',
				item_code: 'ATK-002',
				item_name: 'Gula Pasir',
				uom_id: 'uom-kg',
				uom_code: 'KG',
				offer_quantity: 20,
				offer_quantity_in_base_unit: 20,
				grn_received_quantity: 20,
				grn_received_quantity_in_base_unit: 20,
				accepted_quantity: 20,
				accepted_quantity_in_base_unit: 20,
				unit_rate: 17000,
				value: 340000,
				value_local_currency: 340000,
				gross_total: 340000
			}
		]
	},
	'grn-003': {
		id: 'grn-003',
		grn_number: 'GRN/2026/0003',
		date: '2026-04-19T00:00:00Z',
		reference_number: 'LPOM/2026/0001',
		delivery_despatch_note_number: 'DN-003/2026',
		delivery_despatch_note_date: '2026-04-19T00:00:00Z',
		vehicle_number: 'B 9012 DEF',
		supplier_id: 'vnd-003',
		supplier_name: 'UD Berkah Abadi',
		store_id: 'store-001',
		store_name: 'Gudang Pusat',
		type: 1,
		approval_status: 'PENDING_APPROVAL',
		document_approval_id: 'appr-grn-003',
		remarks: 'Pembelian manual urgent',
		total: 850000,
		gross_total: 850000,
		i_version: 1,
		items: [
			{
				id: 'grn-dtl-005',
				item_id: 'item-007',
				item_code: 'CLN-001',
				item_name: 'Sabun Cuci Tangan',
				uom_id: 'uom-btl',
				uom_code: 'BTL',
				offer_quantity: 20,
				offer_quantity_in_base_unit: 20,
				grn_received_quantity: 20,
				grn_received_quantity_in_base_unit: 20,
				accepted_quantity: 20,
				accepted_quantity_in_base_unit: 20,
				unit_rate: 25000,
				value: 500000,
				value_local_currency: 500000,
				gross_total: 500000
			},
			{
				id: 'grn-dtl-006',
				item_id: 'item-008',
				item_code: 'CLN-004',
				item_name: 'Pembersih Lantai',
				uom_id: 'uom-btl',
				uom_code: 'BTL',
				offer_quantity: 10,
				offer_quantity_in_base_unit: 10,
				grn_received_quantity: 10,
				grn_received_quantity_in_base_unit: 10,
				accepted_quantity: 10,
				accepted_quantity_in_base_unit: 10,
				unit_rate: 35000,
				value: 350000,
				value_local_currency: 350000,
				gross_total: 350000
			}
		]
	},
	'grn-004': {
		id: 'grn-004',
		grn_number: 'GRN/2026/0004',
		date: '2026-04-22T00:00:00Z',
		reference_number: 'LPO/2026/0006',
		delivery_despatch_note_number: 'DN-004/2026',
		delivery_despatch_note_date: '2026-04-22T00:00:00Z',
		vehicle_number: 'B 9999 MAT',
		supplier_id: 'vnd-005',
		supplier_name: 'CV Material Jaya',
		store_id: 'store-002',
		store_name: 'Lapangan Divisi 1',
		type: 2,
		approval_status: 'APPROVED',
		document_approval_id: 'appr-grn-004',
		remarks: 'Material dropping - Pasir untuk jalan divisi',
		total: 11200000,
		gross_total: 11200000,
		i_version: 1,
		items: [
			{
				id: 'grn-dtl-007',
				item_id: 'item-009',
				item_code: 'MAT-001',
				item_name: 'Pasir Urug',
				uom_id: 'uom-m3',
				uom_code: 'M3',
				offer_quantity: 120,
				offer_quantity_in_base_unit: 120,
				grn_received_quantity: 112,
				grn_received_quantity_in_base_unit: 112,
				accepted_quantity: 112,
				accepted_quantity_in_base_unit: 112,
				unit_rate: 100000,
				value: 11200000,
				value_local_currency: 11200000,
				gross_total: 11200000,
				volume: {
					length: 8,
					width: 7,
					height: 2,
					calculated_volume: 112
				},
				weighment: {
					docket_number: 'DKT-2026-001',
					gross_weight: 168000,
					net_weight: 163000,
					tare_weight: 5000,
					vehicle_number: 'B 9999 MAT',
					weighment_date_time: '2026-04-22T08:30:00Z'
				}
			}
		]
	}
};

/**
 * Mock Approved LPO List (untuk create GRN)
 */
let mockApprovedLPOList: ApprovedLPOItem[] = [
	{
		id: 'lpo-001',
		lpo_number: 'LPO/2026/0001',
		lpo_date: '2026-04-19T00:00:00Z',
		supplier_id: 'vnd-002',
		supplier_code: 'V002',
		supplier_name: 'CV Mitra Sejahtera',
		approval_status: 'APPROVED',
		approval_date: '2026-04-19T14:00:00Z',
		approved_by: 'Manager Kebun',
		remarks: 'Disetujui untuk pembelian'
	},
	{
		id: 'lpo-002',
		lpo_number: 'LPO/2026/0002',
		lpo_date: '2026-04-17T00:00:00Z',
		supplier_id: 'vnd-002',
		supplier_code: 'V002',
		supplier_name: 'CV Mitra Sejahtera',
		approval_status: 'APPROVED',
		approval_date: '2026-04-17T15:00:00Z',
		approved_by: 'Manager Kebun',
		remarks: 'Repeat order disetujui'
	},
	{
		id: 'lpo-003',
		lpo_number: 'LPOM/2026/0001',
		lpo_date: '2026-04-18T00:00:00Z',
		supplier_id: 'vnd-003',
		supplier_code: 'V003',
		supplier_name: 'UD Berkah Abadi',
		approval_status: 'APPROVED',
		approval_date: '2026-04-18T16:00:00Z',
		approved_by: 'Manager Kebun',
		remarks: 'Pembelian manual urgent disetujui'
	},
	{
		id: 'lpo-006',
		lpo_number: 'LPO/2026/0006',
		lpo_date: '2026-04-21T00:00:00Z',
		supplier_id: 'vnd-005',
		supplier_code: 'V005',
		supplier_name: 'CV Material Jaya',
		approval_status: 'APPROVED',
		approval_date: '2026-04-21T16:00:00Z',
		approved_by: 'Manager Kebun',
		remarks: 'Material dropping untuk jalan divisi disetujui'
	}
];

/**
 * Mock Approved LPO Detail (untuk create GRN)
 */
let mockApprovedLPODetails: Record<string, ApprovedLPODetailData> = {
	'lpo-001': {
		id: 'lpo-001',
		lpo_number: 'LPO/2026/0001',
		lpo_date: '2026-04-19T00:00:00Z',
		lpo_based_on_id: 'rfq-001',
		lpo_based_on_name: 'RFQ',
		supplier_id: 'vnd-002',
		supplier_code: 'V002',
		supplier_name: 'CV Mitra Sejahtera',
		store_id: 'store-001',
		store_name: 'Gudang Pusat',
		payment_type_id: 'payment-001',
		payment_type_name: 'CREDIT',
		reference_number: 'PH/LB/2026/0001',
		remarks: 'Pengiriman ke gudang pusat',
		is_credit_settled_locally: false,
		credit_days: 30,
		required_by_date: '2026-05-01T00:00:00Z',
		requested_advance_amount: 0,
		approval_status: 'APPROVED',
		approval_date: '2026-04-19T14:00:00Z',
		approved_by: 'Manager Kebun',
		total_amount: 1125000,
		item_count: 2,
		version: 1,
		items: [
			{
				id: 'lpo-dtl-001',
				item_id: 'item-001',
				item_code: 'ATK-001',
				item_name: 'Tissue Kotak',
				uom_id: 'uom-box',
				uom_code: 'BOX',
				quantity: 50,
				quantity_in_base_unit: 50,
				rate: 14000,
				amount: 700000,
				purpose: 'Kebutuhan operasional kantor',
				received_quantity: 0,
				received_quantity_in_base_unit: 0,
				outstanding_quantity: 50,
				outstanding_qty_in_base_unit: 50,
				receiving_status: 'PENDING'
			},
			{
				id: 'lpo-dtl-002',
				item_id: 'item-002',
				item_code: 'ATK-002',
				item_name: 'Gula Pasir',
				uom_id: 'uom-kg',
				uom_code: 'KG',
				quantity: 25,
				quantity_in_base_unit: 25,
				rate: 17000,
				amount: 425000,
				purpose: 'Kebutuhan pantry',
				received_quantity: 0,
				received_quantity_in_base_unit: 0,
				outstanding_quantity: 25,
				outstanding_qty_in_base_unit: 25,
				receiving_status: 'PENDING'
			}
		]
	},
	'lpo-002': {
		id: 'lpo-002',
		lpo_number: 'LPO/2026/0002',
		lpo_date: '2026-04-17T00:00:00Z',
		lpo_based_on_id: 'ro-001',
		lpo_based_on_name: 'RO',
		supplier_id: 'vnd-002',
		supplier_code: 'V002',
		supplier_name: 'CV Mitra Sejahtera',
		store_id: 'store-001',
		store_name: 'Gudang Pusat',
		payment_type_id: 'payment-001',
		payment_type_name: 'CREDIT',
		reference_number: 'RO/2026/0001',
		remarks: 'Repeat order',
		is_credit_settled_locally: false,
		credit_days: 30,
		required_by_date: '2026-04-28T00:00:00Z',
		requested_advance_amount: 0,
		approval_status: 'APPROVED',
		approval_date: '2026-04-17T15:00:00Z',
		approved_by: 'Manager Kebun',
		total_amount: 760000,
		item_count: 2,
		version: 1,
		items: [
			{
				id: 'lpo-dtl-003',
				item_id: 'item-001',
				item_code: 'ATK-001',
				item_name: 'Tissue Kotak',
				uom_id: 'uom-box',
				uom_code: 'BOX',
				quantity: 30,
				quantity_in_base_unit: 30,
				rate: 14000,
				amount: 420000,
				purpose: 'Repeat order',
				received_quantity: 0,
				received_quantity_in_base_unit: 0,
				outstanding_quantity: 30,
				outstanding_qty_in_base_unit: 30,
				receiving_status: 'PENDING'
			},
			{
				id: 'lpo-dtl-004',
				item_id: 'item-002',
				item_code: 'ATK-002',
				item_name: 'Gula Pasir',
				uom_id: 'uom-kg',
				uom_code: 'KG',
				quantity: 20,
				quantity_in_base_unit: 20,
				rate: 17000,
				amount: 340000,
				purpose: 'Repeat order',
				received_quantity: 0,
				received_quantity_in_base_unit: 0,
				outstanding_quantity: 20,
				outstanding_qty_in_base_unit: 20,
				receiving_status: 'PENDING'
			}
		]
	},
	'lpo-003': {
		id: 'lpo-003',
		lpo_number: 'LPOM/2026/0001',
		lpo_date: '2026-04-18T00:00:00Z',
		lpo_based_on_id: '',
		lpo_based_on_name: 'LPOM',
		supplier_id: 'vnd-003',
		supplier_code: 'V003',
		supplier_name: 'UD Berkah Abadi',
		store_id: 'store-001',
		store_name: 'Gudang Pusat',
		payment_type_id: 'payment-002',
		payment_type_name: 'CASH',
		reference_number: '',
		remarks: 'Pembelian manual urgent',
		is_credit_settled_locally: false,
		credit_days: 0,
		required_by_date: '2026-04-30T00:00:00Z',
		requested_advance_amount: 0,
		approval_status: 'APPROVED',
		approval_date: '2026-04-18T16:00:00Z',
		approved_by: 'Manager Kebun',
		total_amount: 850000,
		item_count: 2,
		version: 1,
		items: [
			{
				id: 'lpo-dtl-005',
				item_id: 'item-007',
				item_code: 'CLN-001',
				item_name: 'Sabun Cuci Tangan',
				uom_id: 'uom-btl',
				uom_code: 'BTL',
				quantity: 20,
				quantity_in_base_unit: 20,
				rate: 25000,
				amount: 500000,
				purpose: 'Kebutuhan kebersihan',
				received_quantity: 0,
				received_quantity_in_base_unit: 0,
				outstanding_quantity: 20,
				outstanding_qty_in_base_unit: 20,
				receiving_status: 'PENDING'
			},
			{
				id: 'lpo-dtl-006',
				item_id: 'item-008',
				item_code: 'CLN-004',
				item_name: 'Pembersih Lantai',
				uom_id: 'uom-btl',
				uom_code: 'BTL',
				quantity: 10,
				quantity_in_base_unit: 10,
				rate: 35000,
				amount: 350000,
				purpose: 'Kebutuhan kebersihan',
				received_quantity: 0,
				received_quantity_in_base_unit: 0,
				outstanding_quantity: 10,
				outstanding_qty_in_base_unit: 10,
				receiving_status: 'PENDING'
			}
		]
	},
	'lpo-006': {
		id: 'lpo-006',
		lpo_number: 'LPO/2026/0006',
		lpo_date: '2026-04-21T00:00:00Z',
		lpo_based_on_id: 'rfq-006',
		lpo_based_on_name: 'RFQ',
		supplier_id: 'vnd-005',
		supplier_code: 'V005',
		supplier_name: 'CV Material Jaya',
		store_id: 'store-002',
		store_name: 'Lapangan Divisi 1',
		payment_type_id: 'payment-001',
		payment_type_name: 'CREDIT',
		reference_number: 'PH/LB/2026/0006',
		remarks: 'Material dropping untuk perbaikan jalan divisi',
		is_credit_settled_locally: false,
		credit_days: 30,
		required_by_date: '2026-05-05T00:00:00Z',
		requested_advance_amount: 0,
		approval_status: 'APPROVED',
		approval_date: '2026-04-21T16:00:00Z',
		approved_by: 'Manager Kebun',
		total_amount: 12000000,
		item_count: 1,
		version: 1,
		items: [
			{
				id: 'lpo-dtl-007',
				item_id: 'item-009',
				item_code: 'MAT-001',
				item_name: 'Pasir Urug',
				uom_id: 'uom-m3',
				uom_code: 'M3',
				quantity: 120,
				quantity_in_base_unit: 120,
				rate: 100000,
				amount: 12000000,
				purpose: 'Perbaikan jalan divisi 1',
				received_quantity: 112,
				received_quantity_in_base_unit: 112,
				outstanding_quantity: 8,
				outstanding_qty_in_base_unit: 8,
				receiving_status: 'PARTIAL'
			}
		]
	}
};

/**
 * Mock GRN Summary
 */
const mockGRNSummary: GRNSummaryData = {
	total_grn: 4,
	draft: 0,
	pending_approval: 1,
	approved: 3,
	rejected: 0,
	cancelled: 0
};

/**
 * Mock Store/Warehouse Data
 */
export const mockStores = [
	{
		id: 'store-001',
		code: 'GD-01',
		name: 'Gudang Pusat',
		type: 'WAREHOUSE', // Gudang
		location: 'Lae Butar Estate',
		is_active: true
	},
	{
		id: 'store-002',
		code: 'LP-01',
		name: 'Lapangan Divisi 1',
		type: 'FIELD', // Lapangan
		location: 'Divisi 1 - Lae Butar',
		is_active: true
	},
	{
		id: 'store-003',
		code: 'LP-02',
		name: 'Lapangan Divisi 2',
		type: 'FIELD', // Lapangan
		location: 'Divisi 2 - Lae Butar',
		is_active: true
	}
];

/**
 * Mock API Functions
 */
export const goodsReceivesNotesMockApi = {
	/**
	 * Get GRN Summary
	 */
	getGRNSummary: async (): Promise<GRNSummaryResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 300));

		return {
			code: 200,
			status: 'success',
			data: mockGRNSummary
		};
	},

	/**
	 * Get All GRNs
	 */
	getAllGRNs: async (params: GRNListParams): Promise<GRNListResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		let filteredData = [...mockGRNList];

		if (params.search) {
			const searchLower = params.search.toLowerCase();
			filteredData = filteredData.filter(
				(grn) =>
					grn.grn_number.toLowerCase().includes(searchLower) ||
					grn.supplier_name.toLowerCase().includes(searchLower)
			);
		}

		if (params.approval_status) {
			filteredData = filteredData.filter((grn) => grn.approval_status === params.approval_status);
		}

		const startIndex = (params.page - 1) * params.size;
		const endIndex = startIndex + params.size;
		const paginatedData = filteredData.slice(startIndex, endIndex);

		return {
			code: 200,
			status: 'success',
			data: paginatedData,
			pagination: {
				current_page: params.page,
				page_size: params.size,
				total_items: filteredData.length,
				total_pages: Math.ceil(filteredData.length / params.size)
			}
		};
	},

	/**
	 * Get GRN Detail
	 */
	getGRNDetail: async (grnId: string): Promise<GRNDetailResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		const detail = mockGRNDetails[grnId];
		if (!detail) {
			throw new Error(`GRN with ID ${grnId} not found`);
		}

		return {
			code: 200,
			status: 'success',
			data: detail
		};
	},

	/**
	 * Get Approved LPOs
	 */
	getApprovedLPOs: async (params: ApprovedLPOListParams): Promise<ApprovedLPOListResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		let filteredData = [...mockApprovedLPOList];

		if (params.search) {
			const searchLower = params.search.toLowerCase();
			filteredData = filteredData.filter(
				(lpo) =>
					lpo.lpo_number.toLowerCase().includes(searchLower) ||
					lpo.supplier_name.toLowerCase().includes(searchLower)
			);
		}

		const startIndex = (params.page - 1) * params.size;
		const endIndex = startIndex + params.size;
		const paginatedData = filteredData.slice(startIndex, endIndex);

		return {
			code: 200,
			status: 'success',
			data: paginatedData,
			pagination: {
				current_page: params.page,
				page_size: params.size,
				total_items: filteredData.length,
				total_pages: Math.ceil(filteredData.length / params.size)
			}
		};
	},

	/**
	 * Get Approved LPO Detail
	 */
	getApprovedLPODetail: async (lpoId: string): Promise<ApprovedLPODetailResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		const detail = mockApprovedLPODetails[lpoId];
		if (!detail) {
			throw new Error(`Approved LPO with ID ${lpoId} not found`);
		}

		return {
			code: 200,
			status: 'success',
			data: detail
		};
	},

	/**
	 * Create GRN (Gudang atau Lapangan)
	 */
	createGRN: async (payload: any): Promise<any> => {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Generate new GRN ID
		const newGRNId = `grn-${Date.now()}`;
		const newGRNNumber = `GRN/2026/${String(mockGRNList.length + 1).padStart(4, '0')}`;

		// Get LPO detail to populate supplier info
		const lpoDetail = mockApprovedLPODetails[payload.grn_base_id];
		if (!lpoDetail) {
			throw new Error(`LPO with ID ${payload.grn_base_id} not found`);
		}

		// Get store info
		const store = mockStores.find((s) => s.id === payload.store_id);
		const storeName = store?.name || 'Unknown Store';
		const storeType = store?.type === 'WAREHOUSE' ? 1 : 2; // 1 = Gudang, 2 = Lapangan

		// Create new GRN detail
		const newGRN: GRNDetailData = {
			id: newGRNId,
			grn_number: newGRNNumber,
			date: payload.date,
			reference_number: lpoDetail.lpo_number,
			delivery_despatch_note_number: payload.delivery_despatch_note_number,
			delivery_despatch_note_date: payload.delivery_despatch_note_date,
			vehicle_number: payload.vehicle_number || '',
			supplier_id: lpoDetail.supplier_id,
			supplier_name: lpoDetail.supplier_name,
			store_id: payload.store_id,
			store_name: storeName,
			type: storeType,
			approval_status: 'DRAFT',
			document_approval_id: undefined,
			remarks: payload.remarks || '',
			total: 0,
			gross_total: 0,
			i_version: 1,
			items: payload.items.map((item: any) => {
				// Find matching LPO item for details
				const lpoItem = lpoDetail.items.find((li) => li.id === item.lpo_item_id);
				const itemTotal = item.accepted_quantity * item.unit_rate;

				return {
					id: `grn-dtl-${newGRNId}-${item.item_id}`,
					item_id: item.item_id,
					item_code: lpoItem?.item_code || 'UNKNOWN',
					item_name: lpoItem?.item_name || 'Unknown Item',
					uom_id: item.uom_id,
					uom_code: lpoItem?.uom_code || 'UNIT',
					offer_quantity: item.offer_quantity,
					offer_quantity_in_base_unit: item.offer_quantity_in_base_unit,
					grn_received_quantity: item.grn_received_quantity,
					grn_received_quantity_in_base_unit: item.grn_received_quantity_in_base_unit,
					accepted_quantity: item.accepted_quantity,
					accepted_quantity_in_base_unit: item.accepted_quantity_in_base_unit,
					unit_rate: item.unit_rate,
					value: itemTotal,
					value_local_currency: itemTotal,
					gross_total: itemTotal,
					volume: item.volume,
					weighment: item.weighment
				};
			})
		};

		// Calculate totals
		newGRN.total = newGRN.items.reduce((sum, item) => sum + item.value, 0);
		newGRN.gross_total = newGRN.total;

		// Add to mock data
		mockGRNDetails[newGRNId] = newGRN;
		mockGRNList.push({
			id: newGRNId,
			grn_number: newGRNNumber,
			date: payload.date,
			supplier_id: lpoDetail.supplier_id,
			supplier_name: lpoDetail.supplier_name,
			total_items: newGRN.items.length,
			gross_total: newGRN.gross_total,
			approval_status: 'DRAFT'
		});

		// Update summary
		mockGRNSummary.total_grn++;
		mockGRNSummary.draft++;

		return {
			$schema: 'grn-create-response',
			data: newGRN
		};
	},

	/**
	 * Check Material - determine if item is dropping material
	 */
	checkMaterial: async (materialCode: string): Promise<any> => {
		await new Promise((resolve) => setTimeout(resolve, 300));

		// Material codes that are dropping materials (M3 satuan, received at field)
		const droppingMaterialCodes = ['MAT-001', 'MAT-002', 'MAT-003'];

		const isDroppingMaterial = droppingMaterialCodes.includes(materialCode);

		return {
			code: 200,
			status: 'success',
			data: {
				exists: true,
				is_dropping_material: isDroppingMaterial,
				is_sack: false,
				material_code: materialCode
			}
		};
	},

	/**
	 * Get Available Dockets for dropping material
	 */
	getAvailableDockets: async (): Promise<any> => {
		await new Promise((resolve) => setTimeout(resolve, 300));

		return {
			code: 200,
			status: 'success',
			data: [
				{
					id: 'docket-001',
					docket_number: 'DKT-2026-001',
					vehicle_registration_number: 'B 9999 MAT',
					gross_weight: 168000,
					net_weight: 163000,
					tare_weight: 5000,
					weighment_date_time: '2026-04-22T08:30:00Z',
					is_used: false
				},
				{
					id: 'docket-002',
					docket_number: 'DKT-2026-002',
					vehicle_registration_number: 'B 8888 TRK',
					gross_weight: 150000,
					net_weight: 145000,
					tare_weight: 5000,
					weighment_date_time: '2026-04-22T09:15:00Z',
					is_used: false
				},
				{
					id: 'docket-003',
					docket_number: 'DKT-2026-003',
					vehicle_registration_number: 'B 7777 DMP',
					gross_weight: 180000,
					net_weight: 175000,
					tare_weight: 5000,
					weighment_date_time: '2026-04-22T10:00:00Z',
					is_used: false
				}
			]
		};
	},

	/**
	 * Submit GRN for approval (DRAFT → PENDING_APPROVAL)
	 */
	submitGRN: async (grnId: string): Promise<void> => {
		await new Promise((resolve) => setTimeout(resolve, 800));

		// Find GRN in mock data
		const grn = mockGRNDetails[grnId];
		if (!grn) {
			throw new Error(`GRN with ID ${grnId} not found`);
		}

		// Update approval status
		grn.approval_status = 'PENDING_APPROVAL_ASKEP';
		grn.document_approval_id = `approval-${Date.now()}`;

		// Update in list
		const listItem = mockGRNList.find((g) => g.id === grnId);
		if (listItem) {
			listItem.approval_status = 'PENDING_APPROVAL_ASKEP';
		}

		// Update summary
		mockGRNSummary.draft--;
		mockGRNSummary.pending_approval++;

		console.log(`[MOCK] GRN ${grn.grn_number} submitted for approval`);
	}
};
