/**
 * Mock data untuk Local Purchase Analysis (Proses Pembelian Lokal)
 * Status: TERKIRIM → PERBANDINGAN_HARGA → BUAT_LPO → LPO_DIBUAT
 */

import type {
	RFQItem,
	RFQListResponse,
	RFQDetailData,
	RFQDetailResponse,
	RFQDetailItem,
	RFQDetailVendor,
	RFQQuotation,
	RFQQuotationItem,
	RFQEquivalentItem,
	QuotationComparisonData,
	QuotationComparisonResponse,
	ComparisonItem,
	PendingVendor,
	RFQSummary,
	RFQSummaryResponse,
	RFQVendorUser,
	RFQVendorUsersResponse,
	EligiblePRItem,
	EligiblePRsResponse,
	TrackingStatusItem,
	TrackingHistoryResponse
} from '../types/local-purchase-analysis.types';

/**
 * Mock RFQ List Data
 */
let mockRFQList: RFQItem[] = [
	// Status: Perbandingan Harga
	{
		uoid: 'rfq-001',
		rfq_number: 'PH/LB/2026/0001',
		title: 'Pembelian ATK Kantor',
		description: 'Pembelian alat tulis kantor untuk kebutuhan operasional',
		process_type: 'RFQ',
		status: 'PERBANDINGAN_HARGA',
		deadline_date: '2026-04-25T23:59:59Z',
		published_at: '2026-04-17T10:00:00Z',
		completed_at: null,
		cancelled_at: null,
		cancellation_reason: null,
		item_count: 2,
		vendor_count: 3,
		contact_person: 'Farhan Kurniawan',
		contact_email: 'farhan@sigma.com',
		contact_phone: '081234567890',
		delivery_location: 'Gudang Pusat',
		approval_status_summary: 'APPROVED', // Semua item diizinkan
		i_version: 1
	},
	// Status: Terkirim
	{
		uoid: 'rfq-002',
		rfq_number: 'PH/LB/2026/0002',
		title: 'Pembelian Bahan Pembersih',
		description: 'Pembelian bahan pembersih untuk kebersihan kantor',
		process_type: 'RFQ',
		status: 'TERKIRIM',
		deadline_date: '2026-04-28T23:59:59Z',
		published_at: '2026-04-20T09:00:00Z',
		completed_at: null,
		cancelled_at: null,
		cancellation_reason: null,
		item_count: 3,
		vendor_count: 3,
		contact_person: 'Farhan Kurniawan',
		contact_email: 'farhan@sigma.com',
		contact_phone: '081234567890',
		delivery_location: 'Gudang Pusat',
		approval_status_summary: 'NEEDS_APPROVAL', // Ada item yang perlu izin
		i_version: 1
	},
	// Status: Buat LPO (RFQ)
	{
		uoid: 'rfq-003',
		rfq_number: 'PH/LB/2026/0003',
		title: 'Pembelian Kopi dan Teh',
		description: 'Pembelian kopi dan teh untuk pantry kantor',
		process_type: 'RFQ',
		status: 'BUAT_LPO',
		deadline_date: '2026-04-19T23:59:59Z',
		published_at: '2026-04-14T10:00:00Z',
		completed_at: null,
		cancelled_at: null,
		cancellation_reason: null,
		item_count: 2,
		vendor_count: 3,
		contact_person: 'Farhan Kurniawan',
		contact_email: 'farhan@sigma.com',
		contact_phone: '081234567890',
		delivery_location: 'Gudang Pusat',
		approval_status_summary: 'APPROVED', // Semua item diizinkan
		i_version: 1
	},
	// Status: LPO Dibuat (RO - Repeat Order)
	{
		uoid: 'rfq-004',
		rfq_number: 'RO/2026/0001',
		title: 'Repeat Order - Tissue dan Gula',
		description: 'Repeat order untuk tissue dan gula pasir',
		process_type: 'RO',
		status: 'LPO_DIBUAT',
		deadline_date: '2026-04-18T23:59:59Z',
		published_at: '2026-04-16T08:00:00Z',
		completed_at: '2026-04-18T15:30:00Z',
		cancelled_at: null,
		cancellation_reason: null,
		item_count: 2,
		vendor_count: 1,
		contact_person: 'Farhan Kurniawan',
		contact_email: 'farhan@sigma.com',
		contact_phone: '081234567890',
		delivery_location: 'Gudang Pusat',
		approval_status_summary: 'APPROVED', // Repeat Order hanya untuk yang diizinkan
		i_version: 1
	},
	// Status: Perbandingan Harga (contoh kedua)
	{
		uoid: 'rfq-005',
		rfq_number: 'PH/LB/2026/0004',
		title: 'Pembelian Alat Kebersihan',
		description: 'Pembelian alat kebersihan untuk operasional',
		process_type: 'RFQ',
		status: 'PERBANDINGAN_HARGA',
		deadline_date: '2026-04-22T23:59:59Z',
		published_at: '2026-04-15T10:00:00Z',
		completed_at: null,
		cancelled_at: null,
		cancellation_reason: null,
		item_count: 3,
		vendor_count: 3,
		contact_person: 'Farhan Kurniawan',
		contact_email: 'farhan@sigma.com',
		contact_phone: '081234567890',
		delivery_location: 'Gudang Pusat',
		approval_status_summary: 'NEEDS_APPROVAL', // Semua item perlu izin
		i_version: 1
	},
	// Status: Buat LPO (RFQ dengan item Perlu Izin)
	{
		uoid: 'rfq-006',
		rfq_number: 'PH/LB/2026/0005',
		title: 'Pembelian Barang Khusus Departemen',
		description: 'Pembelian barang khusus yang memerlukan persetujuan departemen',
		process_type: 'RFQ',
		status: 'MENUNGGU_PERSETUJUAN_HO',
		deadline_date: '2026-04-20T23:59:59Z',
		published_at: '2026-04-12T10:00:00Z',
		completed_at: null,
		cancelled_at: null,
		cancellation_reason: null,
		item_count: 2,
		vendor_count: 2,
		contact_person: 'Farhan Kurniawan',
		contact_email: 'farhan@sigma.com',
		contact_phone: '081234567890',
		delivery_location: 'Gudang Pusat',
		approval_status_summary: 'NEEDS_APPROVAL',
		i_version: 1
	},
	// Status: Telah Diverifikasi (contoh RFQ yang sudah ada feedback HO)
	{
		uoid: 'rfq-007',
		rfq_number: 'PH/LB/2026/0006',
		title: 'Pembelian Peralatan IT Khusus',
		description: 'Pembelian peralatan IT yang memerlukan persetujuan Head Office',
		process_type: 'RFQ',
		status: 'TELAH_DIVERIFIKASI',
		deadline_date: '2026-04-15T23:59:59Z',
		published_at: '2026-04-08T10:00:00Z',
		completed_at: '2026-04-20T16:30:00Z',
		cancelled_at: null,
		cancellation_reason: null,
		item_count: 3,
		vendor_count: 2,
		contact_person: 'Farhan Kurniawan',
		contact_email: 'farhan@sigma.com',
		contact_phone: '081234567890',
		delivery_location: 'Gudang Pusat',
		approval_status_summary: 'NEEDS_APPROVAL',
		i_version: 1
	}
];

/**
 * Mock RFQ Detail Data
 */
let mockRFQDetails: Record<string, RFQDetailData> = {
	'rfq-001': {
		uoid: 'rfq-001',
		rfq_number: 'PH/LB/2026/0001',
		transaction_number: 'PH/LB/2026/0001',
		title: 'Pembelian ATK Kantor',
		description: 'Pembelian alat tulis kantor untuk kebutuhan operasional',
		process_type: 'RFQ',
		status: 'PERBANDINGAN_HARGA',
		deadline_date: '2026-04-25T23:59:59Z',
		published_at: '2026-04-17T10:00:00Z',
		completed_at: null,
		cancelled_at: null,
		cancellation_reason: null,
		item_count: 2,
		vendor_count: 3,
		contact_person: 'Farhan Kurniawan',
		contact_email: 'farhan@sigma.com',
		contact_phone: '081234567890',
		delivery_location: 'Gudang Pusat',
		approval_document_id: 'doc-001',
		winner_quotation_id: null,
		winner_justification: null,
		winner_selected_at: null,
		items: [
			{
				uoid: 'rfq-dtl-001',
				purchase_request_dtl_id: 'pr-dtl-001',
				purchase_request_number: 'LB/LPO/MR/2026/00142',
				item_code: 'ATK-001',
				item_name: 'Tissue Kotak',
				qty: 50,
				uom: 'BOX',
				specifications: 'Tissue kotak 2 ply, isi 250 lembar',
				estimated_price: 15000,
				budget_price: 15000,
				budget_currency: 'IDR',
				budget_fiscal_year: '2026',
				last_lpo_price: 14500,
				last_lpo_number: 'LPO/2026/03/001',
				last_lpo_date: '2026-03-15'
			},
			{
				uoid: 'rfq-dtl-002',
				purchase_request_dtl_id: 'pr-dtl-002',
				purchase_request_number: 'LB/LPO/MR/2026/00142',
				item_code: 'ATK-002',
				item_name: 'Gula Pasir',
				qty: 25,
				uom: 'KG',
				specifications: 'Gula pasir putih premium',
				estimated_price: 18000,
				budget_price: 18000,
				budget_currency: 'IDR',
				budget_fiscal_year: '2026',
				last_lpo_price: 17500,
				last_lpo_number: 'LPO/2026/03/002',
				last_lpo_date: '2026-03-15'
			}
		],
		vendors: [
			{
				uoid: 'rfq-vnd-001',
				vendor_id: 'vnd-001',
				vendor_code: 'V001',
				vendor_name: 'PT Sumber Jaya',
				vendor_email: 'vendor1@sumberjaya.com',
				status: 'SUBMITTED',
				vendor_rfq_number: 'V001-RFQ-001',
				invited_at: '2026-04-17T10:00:00Z',
				viewed_at: '2026-04-17T14:30:00Z',
				declined_at: null,
				decline_reason: null
			},
			{
				uoid: 'rfq-vnd-002',
				vendor_id: 'vnd-002',
				vendor_code: 'V002',
				vendor_name: 'CV Mitra Sejahtera',
				vendor_email: 'vendor2@mitrasejahtera.com',
				status: 'SUBMITTED',
				vendor_rfq_number: 'V002-RFQ-001',
				invited_at: '2026-04-17T10:00:00Z',
				viewed_at: '2026-04-17T15:00:00Z',
				declined_at: null,
				decline_reason: null
			},
			{
				uoid: 'rfq-vnd-003',
				vendor_id: 'vnd-003',
				vendor_code: 'V003',
				vendor_name: 'UD Berkah Abadi',
				vendor_email: 'vendor3@berkah.com',
				status: 'SUBMITTED',
				vendor_rfq_number: 'V003-RFQ-001',
				invited_at: '2026-04-17T10:00:00Z',
				viewed_at: '2026-04-18T09:00:00Z',
				declined_at: null,
				decline_reason: null
			}
		],
		quotations: [
			{
				uoid: 'quot-001',
				rfq_vendor_id: 'rfq-vnd-001',
				vendor_code: 'V001',
				vendor_name: 'PT Sumber Jaya',
				quotation_number: 'QT-001/2026',
				status: 'SUBMITTED',
				total_amount: 1162500,
				payment_terms: 'NET 30',
				delivery_time_days: 7,
				warranty: '3 bulan',
				terms_conditions: 'Harga sudah termasuk PPN',
				valid_until: '2026-05-17T23:59:59Z',
				submitted_at: '2026-04-18T10:00:00Z',
				withdrawn_at: null,
				withdraw_reason: null,
				evaluation_score: 85,
				evaluation_notes: 'Harga kompetitif, pengiriman cepat',
				is_winner: false,
				vendor_rfq_number: 'V001-RFQ-001',
				items: [
					{
						uoid: 'quot-dtl-001',
						rfq_detail_id: 'rfq-dtl-001',
						item_code: 'ATK-001',
						item_name: 'Tissue Kotak',
						qty: 50,
						unit_price: 14500,
						total_price: 725000,
						brand: 'Paseo',
						origin: 'Indonesia',
						lead_time_days: 7,
						notes: 'Stok tersedia',
						is_winner: false,
						selection_reason: '',
						equivalents: [],
						budget_price: 15000,
						budget_price_comparison_percent: -3.33,
						last_lpo_price: 14500,
						price_comparison_percent: 0
					},
					{
						uoid: 'quot-dtl-002',
						rfq_detail_id: 'rfq-dtl-002',
						item_code: 'ATK-002',
						item_name: 'Gula Pasir',
						qty: 25,
						unit_price: 17500,
						total_price: 437500,
						brand: 'Gulaku',
						origin: 'Indonesia',
						lead_time_days: 5,
						notes: 'Stok tersedia',
						is_winner: false,
						selection_reason: '',
						equivalents: [],
						budget_price: 18000,
						budget_price_comparison_percent: -2.78,
						last_lpo_price: 17500,
						price_comparison_percent: 0
					}
				],
				i_version: 1
			},
			{
				uoid: 'quot-002',
				rfq_vendor_id: 'rfq-vnd-002',
				vendor_code: 'V002',
				vendor_name: 'CV Mitra Sejahtera',
				quotation_number: 'QT-002/2026',
				status: 'SUBMITTED',
				total_amount: 1125000,
				payment_terms: 'NET 30',
				delivery_time_days: 5,
				warranty: '6 bulan',
				terms_conditions: 'Harga sudah termasuk PPN',
				valid_until: '2026-05-17T23:59:59Z',
				submitted_at: '2026-04-18T11:30:00Z',
				withdrawn_at: null,
				withdraw_reason: null,
				evaluation_score: 90,
				evaluation_notes: 'Harga terbaik, garansi lebih lama',
				is_winner: false,
				vendor_rfq_number: 'V002-RFQ-001',
				items: [
					{
						uoid: 'quot-dtl-003',
						rfq_detail_id: 'rfq-dtl-001',
						item_code: 'ATK-001',
						item_name: 'Tissue Kotak',
						qty: 50,
						unit_price: 14000,
						total_price: 700000,
						brand: 'Tessa',
						origin: 'Indonesia',
						lead_time_days: 5,
						notes: 'Stok tersedia',
						is_winner: false,
						selection_reason: '',
						equivalents: [],
						budget_price: 15000,
						budget_price_comparison_percent: -6.67,
						last_lpo_price: 14500,
						price_comparison_percent: -3.45
					},
					{
						uoid: 'quot-dtl-004',
						rfq_detail_id: 'rfq-dtl-002',
						item_code: 'ATK-002',
						item_name: 'Gula Pasir',
						qty: 25,
						unit_price: 17000,
						total_price: 425000,
						brand: 'Gulaku',
						origin: 'Indonesia',
						lead_time_days: 3,
						notes: 'Stok tersedia',
						is_winner: false,
						selection_reason: '',
						equivalents: [],
						budget_price: 18000,
						budget_price_comparison_percent: -5.56,
						last_lpo_price: 17500,
						price_comparison_percent: -2.86
					}
				],
				i_version: 1
			},
			{
				uoid: 'quot-003',
				rfq_vendor_id: 'rfq-vnd-003',
				vendor_code: 'V003',
				vendor_name: 'UD Berkah Abadi',
				quotation_number: 'QT-003/2026',
				status: 'SUBMITTED',
				total_amount: 1200000,
				payment_terms: 'NET 45',
				delivery_time_days: 10,
				warranty: '3 bulan',
				terms_conditions: 'Harga sudah termasuk PPN',
				valid_until: '2026-05-17T23:59:59Z',
				submitted_at: '2026-04-18T14:00:00Z',
				withdrawn_at: null,
				withdraw_reason: null,
				evaluation_score: 75,
				evaluation_notes: 'Harga lebih tinggi, pengiriman lebih lama',
				is_winner: false,
				vendor_rfq_number: 'V003-RFQ-001',
				items: [
					{
						uoid: 'quot-dtl-005',
						rfq_detail_id: 'rfq-dtl-001',
						item_code: 'ATK-001',
						item_name: 'Tissue Kotak',
						qty: 50,
						unit_price: 15000,
						total_price: 750000,
						brand: 'Nice',
						origin: 'Indonesia',
						lead_time_days: 10,
						notes: 'Stok tersedia',
						is_winner: false,
						selection_reason: '',
						equivalents: [],
						budget_price: 15000,
						budget_price_comparison_percent: 0,
						last_lpo_price: 14500,
						price_comparison_percent: 3.45
					},
					{
						uoid: 'quot-dtl-006',
						rfq_detail_id: 'rfq-dtl-002',
						item_code: 'ATK-002',
						item_name: 'Gula Pasir',
						qty: 25,
						unit_price: 18000,
						total_price: 450000,
						brand: 'Gulaku',
						origin: 'Indonesia',
						lead_time_days: 7,
						notes: 'Stok tersedia',
						is_winner: false,
						selection_reason: '',
						equivalents: [],
						budget_price: 18000,
						budget_price_comparison_percent: 0,
						last_lpo_price: 17500,
						price_comparison_percent: 2.86
					}
				],
				i_version: 1
			}
		],
		i_version: 1
	},
	'rfq-002': {
		uoid: 'rfq-002',
		rfq_number: 'PH/LB/2026/0002',
		transaction_number: 'PH/LB/2026/0002',
		title: 'Pembelian Bahan Pembersih',
		description: 'Pembelian bahan pembersih untuk kebersihan kantor',
		process_type: 'RFQ',
		status: 'TERKIRIM',
		deadline_date: '2026-04-28T23:59:59Z',
		published_at: '2026-04-20T09:00:00Z',
		completed_at: null,
		cancelled_at: null,
		cancellation_reason: null,
		item_count: 3,
		vendor_count: 3,
		contact_person: 'Farhan Kurniawan',
		contact_email: 'farhan@sigma.com',
		contact_phone: '081234567890',
		delivery_location: 'Gudang Pusat',
		approval_document_id: 'doc-002',
		winner_quotation_id: null,
		winner_justification: null,
		winner_selected_at: null,
		items: [
			{
				uoid: 'rfq-dtl-003',
				purchase_request_dtl_id: 'pr-dtl-003',
				purchase_request_number: 'LB/LPO/MR/2026/00141',
				item_code: 'CLN-001',
				item_name: 'Sabun Cuci Tangan',
				qty: 20,
				uom: 'BTL',
				specifications: 'Sabun cuci tangan cair 500ml',
				estimated_price: 25000,
				budget_price: 25000,
				budget_currency: 'IDR',
				budget_fiscal_year: '2026',
				last_lpo_price: 24000,
				last_lpo_number: 'LPO/2026/03/005',
				last_lpo_date: '2026-03-10'
			},
			{
				uoid: 'rfq-dtl-010',
				purchase_request_dtl_id: 'pr-dtl-010',
				purchase_request_number: 'LB/LPO/MR/2026/00141',
				item_code: 'CLN-004',
				item_name: 'Pembersih Lantai',
				qty: 15,
				uom: 'BTL',
				specifications: 'Pembersih lantai cair 1 liter',
				estimated_price: 35000,
				budget_price: 35000,
				budget_currency: 'IDR',
				budget_fiscal_year: '2026',
				last_lpo_price: 33000,
				last_lpo_number: 'LPO/2026/03/006',
				last_lpo_date: '2026-03-10'
			},
			{
				uoid: 'rfq-dtl-020',
				purchase_request_dtl_id: 'pr-dtl-020',
				purchase_request_number: 'LB/IT/MR/2026/00073',
				item_code: 'ATK-002',
				item_name: 'Gula Pasir',
				qty: 25,
				uom: 'KG',
				specifications: 'Gula pasir putih premium',
				estimated_price: 18000,
				budget_price: 18000,
				budget_currency: 'IDR',
				budget_fiscal_year: '2026',
				last_lpo_price: null,
				last_lpo_number: null,
				last_lpo_date: null
			}
		],
		vendors: [
			{
				uoid: 'rfq-vnd-004',
				vendor_id: 'vnd-001',
				vendor_code: 'V001',
				vendor_name: 'PT Sumber Jaya',
				vendor_email: 'vendor1@sumberjaya.com',
				status: 'INVITED',
				vendor_rfq_number: 'V001-RFQ-002',
				invited_at: '2026-04-20T09:00:00Z',
				viewed_at: null,
				declined_at: null,
				decline_reason: null
			},
			{
				uoid: 'rfq-vnd-005',
				vendor_id: 'vnd-002',
				vendor_code: 'V002',
				vendor_name: 'CV Mitra Sejahtera',
				vendor_email: 'vendor2@mitrasejahtera.com',
				status: 'INVITED',
				vendor_rfq_number: 'V002-RFQ-002',
				invited_at: '2026-04-20T09:00:00Z',
				viewed_at: null,
				declined_at: null,
				decline_reason: null
			},
			{
				uoid: 'rfq-vnd-006',
				vendor_id: 'vnd-003',
				vendor_code: 'V003',
				vendor_name: 'UD Berkah Abadi',
				vendor_email: 'vendor3@berkah.com',
				status: 'INVITED',
				vendor_rfq_number: 'V003-RFQ-002',
				invited_at: '2026-04-20T09:00:00Z',
				viewed_at: null,
				declined_at: null,
				decline_reason: null
			}
		],
		quotations: [],
		i_version: 1
	},
	'rfq-003': {
		uoid: 'rfq-003',
		rfq_number: 'PH/LB/2026/0003',
		transaction_number: 'PH/LB/2026/0003',
		title: 'Pembelian Kopi dan Teh',
		description: 'Pembelian kopi dan teh untuk pantry kantor',
		process_type: 'RFQ',
		status: 'BUAT_LPO',
		deadline_date: '2026-04-19T23:59:59Z',
		published_at: '2026-04-14T10:00:00Z',
		completed_at: null,
		cancelled_at: null,
		cancellation_reason: null,
		item_count: 2,
		vendor_count: 3,
		contact_person: 'Farhan Kurniawan',
		contact_email: 'farhan@sigma.com',
		contact_phone: '081234567890',
		delivery_location: 'Gudang Pusat',
		approval_document_id: 'doc-003',
		winner_quotation_id: 'quot-007',
		winner_justification: 'Harga terbaik dengan kualitas bagus',
		winner_selected_at: '2026-04-18T14:00:00Z',
		items: [
			{
				uoid: 'rfq-dtl-004',
				purchase_request_dtl_id: 'pr-dtl-004',
				purchase_request_number: 'LB/LPO/MR/2026/00140',
				item_code: 'BEV-001',
				item_name: 'Kopi Bubuk',
				qty: 10,
				uom: 'KG',
				specifications: 'Kopi bubuk premium arabica',
				estimated_price: 85000,
				budget_price: 85000,
				budget_currency: 'IDR',
				budget_fiscal_year: '2026',
				last_lpo_price: 82000,
				last_lpo_number: 'LPO/2026/02/015',
				last_lpo_date: '2026-02-20'
			},
			{
				uoid: 'rfq-dtl-005',
				purchase_request_dtl_id: 'pr-dtl-005',
				purchase_request_number: 'LB/LPO/MR/2026/00140',
				item_code: 'BEV-002',
				item_name: 'Teh Celup',
				qty: 50,
				uom: 'BOX',
				specifications: 'Teh celup isi 25 sachet per box',
				estimated_price: 15000,
				budget_price: 15000,
				budget_currency: 'IDR',
				budget_fiscal_year: '2026',
				last_lpo_price: 14500,
				last_lpo_number: 'LPO/2026/02/016',
				last_lpo_date: '2026-02-20'
			}
		],
		vendors: [
			{
				uoid: 'rfq-vnd-007',
				vendor_id: 'vnd-001',
				vendor_code: 'V001',
				vendor_name: 'PT Sumber Jaya',
				vendor_email: 'vendor1@sumberjaya.com',
				status: 'SUBMITTED',
				vendor_rfq_number: 'V001-RFQ-003',
				invited_at: '2026-04-14T10:00:00Z',
				viewed_at: '2026-04-14T15:00:00Z',
				declined_at: null,
				decline_reason: null
			}
		],
		quotations: [
			{
				uoid: 'quot-007',
				rfq_vendor_id: 'rfq-vnd-007',
				vendor_code: 'V001',
				vendor_name: 'PT Sumber Jaya',
				quotation_number: 'QT-007/2026',
				status: 'WINNER',
				total_amount: 1575000,
				payment_terms: 'NET 30',
				delivery_time_days: 5,
				warranty: '3 bulan',
				terms_conditions: 'Harga sudah termasuk PPN',
				valid_until: '2026-05-14T23:59:59Z',
				submitted_at: '2026-04-15T10:00:00Z',
				withdrawn_at: null,
				withdraw_reason: null,
				evaluation_score: 95,
				evaluation_notes: 'Harga terbaik, kualitas bagus',
				is_winner: true,
				vendor_rfq_number: 'V001-RFQ-003',
				items: [
					{
						uoid: 'quot-dtl-013',
						rfq_detail_id: 'rfq-dtl-004',
						item_code: 'BEV-001',
						item_name: 'Kopi Bubuk',
						qty: 10,
						unit_price: 82000,
						total_price: 820000,
						brand: 'Kapal Api',
						origin: 'Indonesia',
						lead_time_days: 5,
						notes: 'Stok tersedia',
						is_winner: true,
						selection_reason: 'Harga terbaik',
						equivalents: [],
						budget_price: 85000,
						budget_price_comparison_percent: -3.53,
						last_lpo_price: 82000,
						price_comparison_percent: 0
					},
					{
						uoid: 'quot-dtl-014',
						rfq_detail_id: 'rfq-dtl-005',
						item_code: 'BEV-002',
						item_name: 'Teh Celup',
						qty: 50,
						unit_price: 15100,
						total_price: 755000,
						brand: 'Sariwangi',
						origin: 'Indonesia',
						lead_time_days: 5,
						notes: 'Stok tersedia',
						is_winner: true,
						selection_reason: 'Harga kompetitif',
						equivalents: [],
						budget_price: 15000,
						budget_price_comparison_percent: 0.67,
						last_lpo_price: 14500,
						price_comparison_percent: 4.14
					}
				],
				i_version: 1
			}
		],
		i_version: 1
	},
	'rfq-004': {
		uoid: 'rfq-004',
		rfq_number: 'RO/2026/0001',
		transaction_number: 'RO/2026/0001',
		title: 'Repeat Order - Tissue dan Gula',
		description: 'Repeat order untuk tissue dan gula pasir',
		process_type: 'RO',
		status: 'LPO_DIBUAT',
		deadline_date: '2026-04-18T23:59:59Z',
		published_at: '2026-04-16T08:00:00Z',
		completed_at: '2026-04-18T15:30:00Z',
		cancelled_at: null,
		cancellation_reason: null,
		item_count: 2,
		vendor_count: 1,
		contact_person: 'Farhan Kurniawan',
		contact_email: 'farhan@sigma.com',
		contact_phone: '081234567890',
		delivery_location: 'Gudang Pusat',
		approval_document_id: 'doc-004',
		winner_quotation_id: 'quot-008',
		winner_justification: 'Repeat order dari vendor terpercaya',
		winner_selected_at: '2026-04-16T08:00:00Z',
		items: [
			{
				uoid: 'rfq-dtl-006',
				purchase_request_dtl_id: 'pr-dtl-006',
				purchase_request_number: 'LB/LPO/MR/2026/00139',
				item_code: 'ATK-001',
				item_name: 'Tissue Kotak',
				qty: 30,
				uom: 'BOX',
				specifications: 'Tissue kotak 2 ply, isi 250 lembar',
				estimated_price: 14000,
				budget_price: 14000,
				budget_currency: 'IDR',
				budget_fiscal_year: '2026',
				last_lpo_price: 14000,
				last_lpo_number: 'LPO/2026/03/020',
				last_lpo_date: '2026-03-25'
			},
			{
				uoid: 'rfq-dtl-007',
				purchase_request_dtl_id: 'pr-dtl-007',
				purchase_request_number: 'LB/LPO/MR/2026/00139',
				item_code: 'ATK-002',
				item_name: 'Gula Pasir',
				qty: 20,
				uom: 'KG',
				specifications: 'Gula pasir putih premium',
				estimated_price: 17000,
				budget_price: 17000,
				budget_currency: 'IDR',
				budget_fiscal_year: '2026',
				last_lpo_price: 17000,
				last_lpo_number: 'LPO/2026/03/021',
				last_lpo_date: '2026-03-25'
			}
		],
		vendors: [
			{
				uoid: 'rfq-vnd-008',
				vendor_id: 'vnd-002',
				vendor_code: 'V002',
				vendor_name: 'CV Mitra Sejahtera',
				vendor_email: 'vendor2@mitrasejahtera.com',
				status: 'SUBMITTED',
				vendor_rfq_number: 'V002-RO-001',
				invited_at: '2026-04-16T08:00:00Z',
				viewed_at: '2026-04-16T08:00:00Z',
				declined_at: null,
				decline_reason: null
			}
		],
		quotations: [
			{
				uoid: 'quot-008',
				rfq_vendor_id: 'rfq-vnd-008',
				vendor_code: 'V002',
				vendor_name: 'CV Mitra Sejahtera',
				quotation_number: 'QT-008/2026',
				status: 'WINNER',
				total_amount: 760000,
				payment_terms: 'NET 30',
				delivery_time_days: 3,
				warranty: '6 bulan',
				terms_conditions: 'Harga sudah termasuk PPN',
				valid_until: '2026-05-16T23:59:59Z',
				submitted_at: '2026-04-16T09:00:00Z',
				withdrawn_at: null,
				withdraw_reason: null,
				evaluation_score: 95,
				evaluation_notes: 'Vendor terpercaya, repeat order',
				is_winner: true,
				vendor_rfq_number: 'V002-RO-001',
				items: [
					{
						uoid: 'quot-dtl-015',
						rfq_detail_id: 'rfq-dtl-006',
						item_code: 'ATK-001',
						item_name: 'Tissue Kotak',
						qty: 30,
						unit_price: 14000,
						total_price: 420000,
						brand: 'Tessa',
						origin: 'Indonesia',
						lead_time_days: 3,
						notes: 'Stok tersedia',
						is_winner: true,
						selection_reason: 'Repeat order',
						equivalents: [],
						budget_price: 14000,
						budget_price_comparison_percent: 0,
						last_lpo_price: 14000,
						price_comparison_percent: 0
					},
					{
						uoid: 'quot-dtl-016',
						rfq_detail_id: 'rfq-dtl-007',
						item_code: 'ATK-002',
						item_name: 'Gula Pasir',
						qty: 20,
						unit_price: 17000,
						total_price: 340000,
						brand: 'Gulaku',
						origin: 'Indonesia',
						lead_time_days: 3,
						notes: 'Stok tersedia',
						is_winner: true,
						selection_reason: 'Repeat order',
						equivalents: [],
						budget_price: 17000,
						budget_price_comparison_percent: 0,
						last_lpo_price: 17000,
						price_comparison_percent: 0
					}
				],
				i_version: 1
			}
		],
		i_version: 1
	},
	'rfq-005': {
		uoid: 'rfq-005',
		rfq_number: 'PH/LB/2026/0004',
		transaction_number: 'PH/LB/2026/0004',
		title: 'Pembelian Alat Kebersihan',
		description: 'Pembelian alat kebersihan untuk operasional',
		process_type: 'RFQ',
		status: 'PERBANDINGAN_HARGA',
		deadline_date: '2026-04-22T23:59:59Z',
		published_at: '2026-04-15T10:00:00Z',
		completed_at: null,
		cancelled_at: null,
		cancellation_reason: null,
		item_count: 3,
		vendor_count: 3,
		contact_person: 'Farhan Kurniawan',
		contact_email: 'farhan@sigma.com',
		contact_phone: '081234567890',
		delivery_location: 'Gudang Pusat',
		approval_document_id: 'doc-005',
		winner_quotation_id: null,
		winner_justification: null,
		winner_selected_at: null,
		items: [
			{
				uoid: 'rfq-dtl-008',
				purchase_request_dtl_id: 'pr-dtl-008',
				purchase_request_number: 'LB/LPO/MR/2026/00138',
				item_code: 'CLN-002',
				item_name: 'Sapu Lidi',
				qty: 20,
				uom: 'PCS',
				specifications: 'Sapu lidi panjang 120cm',
				estimated_price: 15000,
				budget_price: 15000,
				budget_currency: 'IDR',
				budget_fiscal_year: '2026',
				last_lpo_price: 14000,
				last_lpo_number: 'LPO/2026/03/010',
				last_lpo_date: '2026-03-10'
			},
			{
				uoid: 'rfq-dtl-009',
				purchase_request_dtl_id: 'pr-dtl-009',
				purchase_request_number: 'LB/LPO/MR/2026/00138',
				item_code: 'CLN-003',
				item_name: 'Pel Lantai',
				qty: 10,
				uom: 'PCS',
				specifications: 'Pel lantai microfiber',
				estimated_price: 35000,
				budget_price: 35000,
				budget_currency: 'IDR',
				budget_fiscal_year: '2026',
				last_lpo_price: 33000,
				last_lpo_number: 'LPO/2026/03/011',
				last_lpo_date: '2026-03-10'
			},
			{
				uoid: 'rfq-dtl-021',
				purchase_request_dtl_id: 'pr-dtl-021',
				purchase_request_number: 'LB/IT/MR/2026/00074',
				item_code: 'TEST-001',
				item_name: 'Barang Test Perlu Izin',
				qty: 5,
				uom: 'PCS',
				specifications: 'Barang khusus yang memerlukan persetujuan departemen',
				estimated_price: 50000,
				budget_price: 50000,
				budget_currency: 'IDR',
				budget_fiscal_year: '2026',
				last_lpo_price: null,
				last_lpo_number: null,
				last_lpo_date: null
			}
		],
		vendors: [
			{
				uoid: 'rfq-vnd-009',
				vendor_id: 'vnd-001',
				vendor_code: 'V001',
				vendor_name: 'PT Sumber Jaya',
				vendor_email: 'vendor1@sumberjaya.com',
				status: 'SUBMITTED',
				vendor_rfq_number: 'V001-RFQ-005',
				invited_at: '2026-04-15T10:00:00Z',
				viewed_at: '2026-04-15T14:00:00Z',
				declined_at: null,
				decline_reason: null
			},
			{
				uoid: 'rfq-vnd-010',
				vendor_id: 'vnd-002',
				vendor_code: 'V002',
				vendor_name: 'CV Mitra Sejahtera',
				vendor_email: 'vendor2@mitrasejahtera.com',
				status: 'SUBMITTED',
				vendor_rfq_number: 'V002-RFQ-005',
				invited_at: '2026-04-15T10:00:00Z',
				viewed_at: '2026-04-15T15:30:00Z',
				declined_at: null,
				decline_reason: null
			},
			{
				uoid: 'rfq-vnd-011',
				vendor_id: 'vnd-004',
				vendor_code: 'V004',
				vendor_name: 'PT Cahaya Terang',
				vendor_email: 'vendor4@cahayaterang.com',
				status: 'SUBMITTED',
				vendor_rfq_number: 'V004-RFQ-005',
				invited_at: '2026-04-15T10:00:00Z',
				viewed_at: '2026-04-15T16:00:00Z',
				declined_at: null,
				decline_reason: null
			}
		],
		quotations: [
			{
				uoid: 'quot-009',
				rfq_vendor_id: 'rfq-vnd-009',
				vendor_code: 'V001',
				vendor_name: 'PT Sumber Jaya',
				quotation_number: 'QT-009/2026',
				status: 'SUBMITTED',
				total_amount: 890000,
				payment_terms: 'NET 30',
				delivery_time_days: 7,
				warranty: '3 bulan',
				terms_conditions: 'Harga sudah termasuk PPN, barang khusus memerlukan surat izin',
				valid_until: '2026-05-15T23:59:59Z',
				submitted_at: '2026-04-16T10:00:00Z',
				withdrawn_at: null,
				withdraw_reason: null,
				evaluation_score: 85,
				evaluation_notes: 'Harga kompetitif, berpengalaman dengan barang khusus',
				is_winner: false,
				vendor_rfq_number: 'V001-RFQ-005',
				items: [
					{
						uoid: 'quot-dtl-017',
						rfq_detail_id: 'rfq-dtl-008',
						item_code: 'CLN-002',
						item_name: 'Sapu Lidi',
						qty: 20,
						unit_price: 14000,
						total_price: 280000,
						brand: 'Lokal',
						origin: 'Indonesia',
						lead_time_days: 7,
						notes: 'Stok tersedia',
						is_winner: false,
						selection_reason: '',
						equivalents: [],
						budget_price: 15000,
						budget_price_comparison_percent: -6.67,
						last_lpo_price: 14000,
						price_comparison_percent: 0
					},
					{
						uoid: 'quot-dtl-018',
						rfq_detail_id: 'rfq-dtl-009',
						item_code: 'CLN-003',
						item_name: 'Pel Lantai',
						qty: 10,
						unit_price: 36000,
						total_price: 360000,
						brand: 'Bolde',
						origin: 'Indonesia',
						lead_time_days: 7,
						notes: 'Stok tersedia',
						is_winner: false,
						selection_reason: '',
						equivalents: [],
						budget_price: 35000,
						budget_price_comparison_percent: 2.86,
						last_lpo_price: 33000,
						price_comparison_percent: 9.09
					},
					{
						uoid: 'quot-dtl-025',
						rfq_detail_id: 'rfq-dtl-021',
						item_code: 'TEST-001',
						item_name: 'Barang Test Perlu Izin',
						qty: 5,
						unit_price: 50000,
						total_price: 250000,
						brand: 'Special',
						origin: 'Indonesia',
						lead_time_days: 14,
						notes: 'Memerlukan surat izin khusus dari departemen',
						is_winner: false,
						selection_reason: '',
						equivalents: [],
						budget_price: 50000,
						budget_price_comparison_percent: 0,
						last_lpo_price: null,
						price_comparison_percent: 0
					}
				],
				i_version: 1
			},
			{
				uoid: 'quot-010',
				rfq_vendor_id: 'rfq-vnd-010',
				vendor_code: 'V002',
				vendor_name: 'CV Mitra Sejahtera',
				quotation_number: 'QT-010/2026',
				status: 'SUBMITTED',
				total_amount: 850000,
				payment_terms: 'NET 30',
				delivery_time_days: 5,
				warranty: '6 bulan',
				terms_conditions: 'Harga sudah termasuk PPN, dapat membantu proses perizinan',
				valid_until: '2026-05-15T23:59:59Z',
				submitted_at: '2026-04-16T11:30:00Z',
				withdrawn_at: null,
				withdraw_reason: null,
				evaluation_score: 90,
				evaluation_notes: 'Harga terbaik, garansi lebih lama, berpengalaman dengan perizinan',
				is_winner: false,
				vendor_rfq_number: 'V002-RFQ-005',
				items: [
					{
						uoid: 'quot-dtl-019',
						rfq_detail_id: 'rfq-dtl-008',
						item_code: 'CLN-002',
						item_name: 'Sapu Lidi',
						qty: 20,
						unit_price: 13000,
						total_price: 260000,
						brand: 'Lokal',
						origin: 'Indonesia',
						lead_time_days: 5,
						notes: 'Stok tersedia',
						is_winner: false,
						selection_reason: '',
						equivalents: [],
						budget_price: 15000,
						budget_price_comparison_percent: -13.33,
						last_lpo_price: 14000,
						price_comparison_percent: -7.14
					},
					{
						uoid: 'quot-dtl-020',
						rfq_detail_id: 'rfq-dtl-009',
						item_code: 'CLN-003',
						item_name: 'Pel Lantai',
						qty: 10,
						unit_price: 35000,
						total_price: 350000,
						brand: 'Bolde',
						origin: 'Indonesia',
						lead_time_days: 5,
						notes: 'Stok tersedia',
						is_winner: false,
						selection_reason: '',
						equivalents: [],
						budget_price: 35000,
						budget_price_comparison_percent: 0,
						last_lpo_price: 33000,
						price_comparison_percent: 6.06
					},
					{
						uoid: 'quot-dtl-026',
						rfq_detail_id: 'rfq-dtl-021',
						item_code: 'TEST-001',
						item_name: 'Barang Test Perlu Izin',
						qty: 5,
						unit_price: 48000,
						total_price: 240000,
						brand: 'Premium',
						origin: 'Indonesia',
						lead_time_days: 10,
						notes: 'Sudah berpengalaman dengan proses perizinan departemen',
						is_winner: false,
						selection_reason: '',
						equivalents: [],
						budget_price: 50000,
						budget_price_comparison_percent: -4.00,
						last_lpo_price: null,
						price_comparison_percent: 0
					}
				],
				i_version: 1
			},
			{
				uoid: 'quot-011',
				rfq_vendor_id: 'rfq-vnd-011',
				vendor_code: 'V004',
				vendor_name: 'PT Cahaya Terang',
				quotation_number: 'QT-011/2026',
				status: 'SUBMITTED',
				total_amount: 920000,
				payment_terms: 'NET 45',
				delivery_time_days: 10,
				warranty: '3 bulan',
				terms_conditions: 'Harga sudah termasuk PPN',
				valid_until: '2026-05-15T23:59:59Z',
				submitted_at: '2026-04-16T14:00:00Z',
				withdrawn_at: null,
				withdraw_reason: null,
				evaluation_score: 75,
				evaluation_notes: 'Harga lebih tinggi, pengiriman lebih lama',
				is_winner: false,
				vendor_rfq_number: 'V004-RFQ-005',
				items: [
					{
						uoid: 'quot-dtl-021',
						rfq_detail_id: 'rfq-dtl-008',
						item_code: 'CLN-002',
						item_name: 'Sapu Lidi',
						qty: 20,
						unit_price: 15000,
						total_price: 300000,
						brand: 'Premium',
						origin: 'Indonesia',
						lead_time_days: 10,
						notes: 'Stok tersedia',
						is_winner: false,
						selection_reason: '',
						equivalents: [],
						budget_price: 15000,
						budget_price_comparison_percent: 0,
						last_lpo_price: 14000,
						price_comparison_percent: 7.14
					},
					{
						uoid: 'quot-dtl-022',
						rfq_detail_id: 'rfq-dtl-009',
						item_code: 'CLN-003',
						item_name: 'Pel Lantai',
						qty: 10,
						unit_price: 37000,
						total_price: 370000,
						brand: 'Super Clean',
						origin: 'Indonesia',
						lead_time_days: 10,
						notes: 'Stok tersedia',
						is_winner: false,
						selection_reason: '',
						equivalents: [],
						budget_price: 35000,
						budget_price_comparison_percent: 5.71,
						last_lpo_price: 33000,
						price_comparison_percent: 12.12
					},
					{
						uoid: 'quot-dtl-027',
						rfq_detail_id: 'rfq-dtl-021',
						item_code: 'TEST-001',
						item_name: 'Barang Test Perlu Izin',
						qty: 5,
						unit_price: 50000,
						total_price: 250000,
						brand: 'Standard',
						origin: 'Indonesia',
						lead_time_days: 15,
						notes: 'Belum berpengalaman dengan proses perizinan khusus',
						is_winner: false,
						selection_reason: '',
						equivalents: [],
						budget_price: 50000,
						budget_price_comparison_percent: 0,
						last_lpo_price: null,
						price_comparison_percent: 0
					}
				],
				i_version: 1
			}
		],
		i_version: 1
	},
	'rfq-006': {
		uoid: 'rfq-006',
		rfq_number: 'PH/LB/2026/0005',
		transaction_number: 'PH/LB/2026/0005',
		title: 'Pembelian Barang Khusus Departemen',
		description: 'Pembelian barang khusus yang memerlukan persetujuan departemen',
		process_type: 'RFQ',
		status: 'MENUNGGU_PERSETUJUAN_HO',
		deadline_date: '2026-04-20T23:59:59Z',
		published_at: '2026-04-12T10:00:00Z',
		completed_at: null,
		cancelled_at: null,
		cancellation_reason: null,
		item_count: 2,
		vendor_count: 2,
		contact_person: 'Farhan Kurniawan',
		contact_email: 'farhan@sigma.com',
		contact_phone: '081234567890',
		delivery_location: 'Gudang Pusat',
		approval_document_id: 'doc-006',
		winner_quotation_id: 'quot-012',
		winner_justification: 'Vendor terpilih memiliki pengalaman terbaik dalam menangani barang khusus yang memerlukan perizinan departemen',
		winner_selected_at: '2026-04-18T14:00:00Z',
		department_destination: 'Departemen IT',
		items: [
			{
				uoid: 'rfq-dtl-022',
				purchase_request_dtl_id: 'pr-dtl-020',
				purchase_request_number: 'LB/IT/MR/2026/00073',
				item_code: 'ATK-002',
				item_name: 'Gula Pasir',
				qty: 25,
				uom: 'KG',
				specifications: 'Gula pasir putih premium untuk kebutuhan khusus',
				estimated_price: 18000,
				budget_price: 18000,
				budget_currency: 'IDR',
				budget_fiscal_year: '2026',
				last_lpo_price: null,
				last_lpo_number: null,
				last_lpo_date: null
			},
			{
				uoid: 'rfq-dtl-023',
				purchase_request_dtl_id: 'pr-dtl-021',
				purchase_request_number: 'LB/IT/MR/2026/00074',
				item_code: 'TEST-001',
				item_name: 'Barang Test Perlu Izin',
				qty: 5,
				uom: 'PCS',
				specifications: 'Barang khusus yang memerlukan persetujuan departemen',
				estimated_price: 50000,
				budget_price: 50000,
				budget_currency: 'IDR',
				budget_fiscal_year: '2026',
				last_lpo_price: null,
				last_lpo_number: null,
				last_lpo_date: null
			}
		],
		vendors: [
			{
				uoid: 'rfq-vnd-012',
				vendor_id: 'vnd-002',
				vendor_code: 'V002',
				vendor_name: 'CV Mitra Sejahtera',
				vendor_email: 'vendor2@mitrasejahtera.com',
				status: 'SUBMITTED',
				vendor_rfq_number: 'V002-RFQ-006',
				invited_at: '2026-04-12T10:00:00Z',
				viewed_at: '2026-04-12T14:00:00Z',
				declined_at: null,
				decline_reason: null
			},
			{
				uoid: 'rfq-vnd-013',
				vendor_id: 'vnd-004',
				vendor_code: 'V004',
				vendor_name: 'PT Cahaya Terang',
				vendor_email: 'vendor4@cahayaterang.com',
				status: 'SUBMITTED',
				vendor_rfq_number: 'V004-RFQ-006',
				invited_at: '2026-04-12T10:00:00Z',
				viewed_at: '2026-04-12T15:00:00Z',
				declined_at: null,
				decline_reason: null
			}
		],
		quotations: [
			{
				uoid: 'quot-012',
				rfq_vendor_id: 'rfq-vnd-012',
				vendor_code: 'V002',
				vendor_name: 'CV Mitra Sejahtera',
				quotation_number: 'QT-012/2026',
				status: 'WINNER',
				total_amount: 690000,
				payment_terms: 'NET 30',
				delivery_time_days: 7,
				warranty: '6 bulan',
				terms_conditions: 'Harga sudah termasuk PPN, kami akan membantu proses perizinan departemen',
				valid_until: '2026-05-12T23:59:59Z',
				submitted_at: '2026-04-13T10:00:00Z',
				withdrawn_at: null,
				withdraw_reason: null,
				evaluation_score: 95,
				evaluation_notes: 'Vendor terpilih karena berpengalaman dengan proses perizinan dan harga kompetitif',
				is_winner: true,
				vendor_rfq_number: 'V002-RFQ-006',
				items: [
					{
						uoid: 'quot-dtl-028',
						rfq_detail_id: 'rfq-dtl-022',
						item_code: 'ATK-002',
						item_name: 'Gula Pasir',
						qty: 25,
						unit_price: 17600,
						total_price: 440000,
						brand: 'Gulaku Premium',
						origin: 'Indonesia',
						lead_time_days: 7,
						notes: 'Sudah memiliki izin khusus untuk supply departemen',
						is_winner: true,
						selection_reason: 'Harga terbaik dengan pengalaman perizinan',
						equivalents: [],
						budget_price: 18000,
						budget_price_comparison_percent: -2.22,
						last_lpo_price: null,
						price_comparison_percent: 0
					},
					{
						uoid: 'quot-dtl-029',
						rfq_detail_id: 'rfq-dtl-023',
						item_code: 'TEST-001',
						item_name: 'Barang Test Perlu Izin',
						qty: 5,
						unit_price: 50000,
						total_price: 250000,
						brand: 'Special Approved',
						origin: 'Indonesia',
						lead_time_days: 10,
						notes: 'Sudah memiliki sertifikat dan pengalaman dengan barang khusus departemen',
						is_winner: true,
						selection_reason: 'Satu-satunya vendor dengan sertifikat lengkap',
						equivalents: [],
						budget_price: 50000,
						budget_price_comparison_percent: 0,
						last_lpo_price: null,
						price_comparison_percent: 0
					}
				],
				i_version: 1
			},
			{
				uoid: 'quot-013',
				rfq_vendor_id: 'rfq-vnd-013',
				vendor_code: 'V004',
				vendor_name: 'PT Cahaya Terang',
				quotation_number: 'QT-013/2026',
				status: 'SUBMITTED',
				total_amount: 750000,
				payment_terms: 'NET 45',
				delivery_time_days: 14,
				warranty: '3 bulan',
				terms_conditions: 'Harga sudah termasuk PPN, proses perizinan menjadi tanggung jawab pembeli',
				valid_until: '2026-05-12T23:59:59Z',
				submitted_at: '2026-04-13T14:00:00Z',
				withdrawn_at: null,
				withdraw_reason: null,
				evaluation_score: 70,
				evaluation_notes: 'Harga lebih tinggi dan tidak berpengalaman dengan perizinan khusus',
				is_winner: false,
				vendor_rfq_number: 'V004-RFQ-006',
				items: [
					{
						uoid: 'quot-dtl-030',
						rfq_detail_id: 'rfq-dtl-022',
						item_code: 'ATK-002',
						item_name: 'Gula Pasir',
						qty: 25,
						unit_price: 20000,
						total_price: 500000,
						brand: 'Gulaku',
						origin: 'Indonesia',
						lead_time_days: 14,
						notes: 'Belum memiliki pengalaman khusus dengan supply departemen',
						is_winner: false,
						selection_reason: '',
						equivalents: [],
						budget_price: 18000,
						budget_price_comparison_percent: 11.11,
						last_lpo_price: null,
						price_comparison_percent: 0
					},
					{
						uoid: 'quot-dtl-031',
						rfq_detail_id: 'rfq-dtl-023',
						item_code: 'TEST-001',
						item_name: 'Barang Test Perlu Izin',
						qty: 5,
						unit_price: 50000,
						total_price: 250000,
						brand: 'Standard',
						origin: 'Indonesia',
						lead_time_days: 14,
						notes: 'Belum memiliki sertifikat untuk barang khusus departemen',
						is_winner: false,
						selection_reason: '',
						equivalents: [],
						budget_price: 50000,
						budget_price_comparison_percent: 0,
						last_lpo_price: null,
						price_comparison_percent: 0
					}
				],
				i_version: 1
			}
		],
		i_version: 1
	},
	'rfq-007': {
		uoid: 'rfq-007',
		rfq_number: 'PH/LB/2026/0006',
		transaction_number: 'PH/LB/2026/0006',
		title: 'Pembelian Peralatan IT Khusus',
		description: 'Pembelian peralatan IT yang memerlukan persetujuan Head Office',
		process_type: 'RFQ',
		status: 'TELAH_DIVERIFIKASI',
		deadline_date: '2026-04-15T23:59:59Z',
		published_at: '2026-04-08T10:00:00Z',
		completed_at: '2026-04-20T16:30:00Z',
		cancelled_at: null,
		cancellation_reason: null,
		item_count: 3,
		vendor_count: 2,
		contact_person: 'Farhan Kurniawan',
		contact_email: 'farhan@sigma.com',
		contact_phone: '081234567890',
		delivery_location: 'Gudang Pusat',
		approval_document_id: 'doc-007',
		winner_quotation_id: 'quot-014',
		winner_justification: '2 item telah disetujui oleh Head Office untuk procurement lokal, 1 item dialihkan ke HO untuk proses lebih lanjut',
		winner_selected_at: '2026-04-20T16:30:00Z',
		department_destination: 'Departemen IT',
		items: [
			{
				uoid: 'rfq-dtl-024',
				purchase_request_dtl_id: 'pr-dtl-024',
				purchase_request_number: 'LB/IT/MR/2026/00075',
				item_code: 'IT-001',
				item_name: 'Server Khusus Departemen',
				qty: 1,
				uom: 'UNIT',
				specifications: 'Server dengan spesifikasi khusus untuk kebutuhan departemen IT',
				estimated_price: 25000000,
				budget_price: 25000000,
				budget_currency: 'IDR',
				budget_fiscal_year: '2026',
				last_lpo_price: null,
				last_lpo_number: null,
				last_lpo_date: null,
				ho_approval_status: 'APPROVED',
				ho_approval_staff: 'Ibu Sari Dewi',
				ho_approval_notes: 'Disetujui untuk procurement lokal'
			},
			{
				uoid: 'rfq-dtl-025',
				purchase_request_dtl_id: 'pr-dtl-025',
				purchase_request_number: 'LB/IT/MR/2026/00076',
				item_code: 'IT-003',
				item_name: 'Laptop HP EliteBook',
				qty: 2,
				uom: 'UNIT',
				specifications: 'Laptop HP EliteBook untuk staff IT',
				estimated_price: 15000000,
				budget_price: 15000000,
				budget_currency: 'IDR',
				budget_fiscal_year: '2026',
				last_lpo_price: null,
				last_lpo_number: null,
				last_lpo_date: null,
				ho_approval_status: 'APPROVED',
				ho_approval_staff: 'Ibu Sari Dewi',
				ho_approval_notes: 'Disetujui untuk procurement lokal'
			},
			{
				uoid: 'rfq-dtl-026',
				purchase_request_dtl_id: 'pr-dtl-026',
				purchase_request_number: 'LB/IT/MR/2026/00077',
				item_code: 'IT-004',
				item_name: 'Storage NAS Enterprise',
				qty: 1,
				uom: 'UNIT',
				specifications: 'Storage NAS Enterprise 100TB untuk data center',
				estimated_price: 150000000,
				budget_price: 150000000,
				budget_currency: 'IDR',
				budget_fiscal_year: '2026',
				last_lpo_price: null,
				last_lpo_number: null,
				last_lpo_date: null,
				ho_approval_status: 'TRANSFERRED_TO_HO',
				ho_approval_staff: 'Ibu Sari Dewi',
				ho_approval_notes: 'Budget terlalu besar untuk procurement lokal, dialihkan ke HO untuk proses tender pusat'
			}
		],
		vendors: [
			{
				uoid: 'rfq-vnd-014',
				vendor_id: 'vnd-005',
				vendor_code: 'V005',
				vendor_name: 'CV Mandiri Utama',
				vendor_email: 'vendor5@mandiriutama.com',
				status: 'SUBMITTED',
				vendor_rfq_number: 'V005-RFQ-007',
				invited_at: '2026-04-08T10:00:00Z',
				viewed_at: '2026-04-08T14:00:00Z',
				declined_at: null,
				decline_reason: null
			},
			{
				uoid: 'rfq-vnd-015',
				vendor_id: 'vnd-006',
				vendor_code: 'V006',
				vendor_name: 'PT Sejahtera Jaya',
				vendor_email: 'vendor6@sejahterajaya.com',
				status: 'SUBMITTED',
				vendor_rfq_number: 'V006-RFQ-007',
				invited_at: '2026-04-08T10:00:00Z',
				viewed_at: '2026-04-08T15:00:00Z',
				declined_at: null,
				decline_reason: null
			}
		],
		quotations: [
			{
				uoid: 'quot-014',
				rfq_vendor_id: 'rfq-vnd-014',
				vendor_code: 'V005',
				vendor_name: 'CV Mandiri Utama',
				quotation_number: 'QT-014/2026',
				status: 'WINNER',
				total_amount: 54500000,
				payment_terms: 'NET 30',
				delivery_time_days: 14,
				warranty: '12 bulan',
				terms_conditions: 'Harga sudah termasuk PPN, instalasi dan konfigurasi',
				valid_until: '2026-05-08T23:59:59Z',
				submitted_at: '2026-04-09T10:00:00Z',
				withdrawn_at: null,
				withdraw_reason: null,
				evaluation_score: 90,
				evaluation_notes: 'Harga kompetitif untuk 2 item yang disetujui HO',
				is_winner: true,
				vendor_rfq_number: 'V005-RFQ-007',
				items: [
					{
						uoid: 'quot-dtl-032',
						rfq_detail_id: 'rfq-dtl-024',
						item_code: 'IT-001',
						item_name: 'Server Khusus Departemen',
						qty: 1,
						unit_price: 24500000,
						total_price: 24500000,
						brand: 'Dell PowerEdge',
						origin: 'USA',
						lead_time_days: 14,
						notes: 'Sudah termasuk instalasi dan konfigurasi awal',
						is_winner: true,
						selection_reason: 'Disetujui oleh Head Office dengan harga terbaik',
						equivalents: [],
						budget_price: 25000000,
						budget_price_comparison_percent: -2.00,
						last_lpo_price: null,
						price_comparison_percent: 0,
						ho_approval_status: 'APPROVED',
						ho_approval_staff: 'Ibu Sari Dewi',
						ho_approval_notes: 'Disetujui untuk procurement lokal'
					},
					{
						uoid: 'quot-dtl-034',
						rfq_detail_id: 'rfq-dtl-025',
						item_code: 'IT-003',
						item_name: 'Laptop HP EliteBook',
						qty: 2,
						unit_price: 15000000,
						total_price: 30000000,
						brand: 'HP EliteBook 840 G9',
						origin: 'USA',
						lead_time_days: 10,
						notes: 'Sudah termasuk Windows 11 Pro dan Office 365',
						is_winner: true,
						selection_reason: 'Disetujui oleh Head Office dengan spesifikasi sesuai',
						equivalents: [],
						budget_price: 15000000,
						budget_price_comparison_percent: 0,
						last_lpo_price: null,
						price_comparison_percent: 0,
						ho_approval_status: 'APPROVED',
						ho_approval_staff: 'Ibu Sari Dewi',
						ho_approval_notes: 'Disetujui untuk procurement lokal'
					},
					{
						uoid: 'quot-dtl-035',
						rfq_detail_id: 'rfq-dtl-026',
						item_code: 'IT-004',
						item_name: 'Storage NAS Enterprise',
						qty: 1,
						unit_price: 145000000,
						total_price: 145000000,
						brand: 'Synology RS4021xs+',
						origin: 'Taiwan',
						lead_time_days: 21,
						notes: 'Storage NAS Enterprise dengan kapasitas 100TB',
						is_winner: true,
						selection_reason: 'Item dialihkan ke HO untuk proses tender pusat',
						equivalents: [],
						budget_price: 150000000,
						budget_price_comparison_percent: -3.33,
						last_lpo_price: null,
						price_comparison_percent: 0,
						ho_approval_status: 'TRANSFERRED_TO_HO',
						ho_approval_staff: 'Ibu Sari Dewi',
						ho_approval_notes: 'Budget terlalu besar untuk procurement lokal, dialihkan ke HO untuk proses tender pusat'
					}
				],
				i_version: 1
			},
			{
				uoid: 'quot-015',
				rfq_vendor_id: 'rfq-vnd-015',
				vendor_code: 'V006',
				vendor_name: 'PT Sejahtera Jaya',
				quotation_number: 'QT-015/2026',
				status: 'SUBMITTED',
				total_amount: 58000000,
				payment_terms: 'NET 45',
				delivery_time_days: 21,
				warranty: '24 bulan',
				terms_conditions: 'Harga sudah termasuk PPN, extended warranty',
				valid_until: '2026-05-08T23:59:59Z',
				submitted_at: '2026-04-09T14:00:00Z',
				withdrawn_at: null,
				withdraw_reason: null,
				evaluation_score: 80,
				evaluation_notes: 'Harga lebih tinggi tapi garansi lebih lama',
				is_winner: false,
				vendor_rfq_number: 'V006-RFQ-007',
				items: [
					{
						uoid: 'quot-dtl-033',
						rfq_detail_id: 'rfq-dtl-024',
						item_code: 'IT-001',
						item_name: 'Server Khusus Departemen',
						qty: 1,
						unit_price: 26000000,
						total_price: 26000000,
						brand: 'HP ProLiant',
						origin: 'USA',
						lead_time_days: 21,
						notes: 'Extended warranty 24 bulan, support premium',
						is_winner: false,
						selection_reason: '',
						equivalents: [],
						budget_price: 25000000,
						budget_price_comparison_percent: 4.00,
						last_lpo_price: null,
						price_comparison_percent: 0,
						ho_approval_status: 'APPROVED',
						ho_approval_staff: 'Ibu Sari Dewi',
						ho_approval_notes: 'Disetujui untuk procurement lokal'
					},
					{
						uoid: 'quot-dtl-036',
						rfq_detail_id: 'rfq-dtl-025',
						item_code: 'IT-003',
						item_name: 'Laptop HP EliteBook',
						qty: 2,
						unit_price: 16000000,
						total_price: 32000000,
						brand: 'HP EliteBook 850 G9',
						origin: 'USA',
						lead_time_days: 14,
						notes: 'Spesifikasi lebih tinggi dengan extended warranty',
						is_winner: false,
						selection_reason: '',
						equivalents: [],
						budget_price: 15000000,
						budget_price_comparison_percent: 6.67,
						last_lpo_price: null,
						price_comparison_percent: 0,
						ho_approval_status: 'APPROVED',
						ho_approval_staff: 'Ibu Sari Dewi',
						ho_approval_notes: 'Disetujui untuk procurement lokal'
					},
					{
						uoid: 'quot-dtl-037',
						rfq_detail_id: 'rfq-dtl-026',
						item_code: 'IT-004',
						item_name: 'Storage NAS Enterprise',
						qty: 1,
						unit_price: 155000000,
						total_price: 155000000,
						brand: 'QNAP TS-h2490FU',
						origin: 'Taiwan',
						lead_time_days: 28,
						notes: 'Storage NAS dengan fitur enterprise dan support 24/7',
						is_winner: false,
						selection_reason: '',
						equivalents: [],
						budget_price: 150000000,
						budget_price_comparison_percent: 3.33,
						last_lpo_price: null,
						price_comparison_percent: 0,
						ho_approval_status: 'TRANSFERRED_TO_HO',
						ho_approval_staff: 'Ibu Sari Dewi',
						ho_approval_notes: 'Budget terlalu besar untuk procurement lokal, dialihkan ke HO untuk proses tender pusat'
					}
				],
				i_version: 1
			}
		],
		i_version: 1
	}
};

/**
 * Mock RFQ Summary
 */
const mockRFQSummary: RFQSummary = {
	total_rfq: 20,
	rfq_terkirim: 1,
	rfq_perbandingan_harga: 2,
	total_repeat_order: 3,
	total_proses_lokal: 20
};

/**
 * Mock Eligible Purchase Requests Data
 */
const mockEligiblePRs: EligiblePRItem[] = [
	{
		uoid: 'pr-dtl-001',
		purchase_request_dtl_id: 'pr-dtl-001',
		pr_number: 'LB/LPO/MR/2026/00142',
		pr_date: '2026-04-10T08:00:00Z',
		reference_number: 'REF-2026-142',
		system_reference: 'RO',
		item_uoid: 'item-001',
		item_code: 'ATK-001',
		item_name: 'Tissue Kotak',
		qty: 50,
		uom: 'BOX',
		uom_uoid: 'uom-box-001',
		purpose: 'Kebutuhan operasional kantor',
		requirement_date: '2026-04-30T00:00:00Z',
		requested_by: 'Farhan Kurniawan',
		division: 'Divisi 1',
		approval_status: 'APPROVED',
		local_purchase_approval_status: 'APPROVED',
		approved_at: '2026-04-11T10:00:00Z',
		estimated_price: 15000,
		budget_unit_price: 15000,
		budget_currency: 'IDR',
		budget_fiscal_year: '2026',
		last_lpo_number: 'LPO/2026/03/001',
		last_lpo_date: '2026-03-15',
		last_lpo_vendor_code: 'V002',
		last_lpo_vendor_name: 'CV Mitra Sejahtera',
		last_lpo_unit_price: 14500,
		last_lpo_id: 'lpo-001',
		lpo_history: [
			{
				lpo_number: 'LPO/2026/03/001',
				lpo_date: '2026-03-15',
				vendor_code: 'V002',
				vendor_name: 'CV Mitra Sejahtera',
				unit_price: 14500,
				ordered_qty: 50,
				received_qty: 50,
				status: 'COMPLETED',
				approval_date: '2026-03-16T10:00:00Z'
			},
			{
				lpo_number: 'LPO/2026/02/015',
				lpo_date: '2026-02-10',
				vendor_code: 'V001',
				vendor_name: 'PT Sumber Jaya',
				unit_price: 14800,
				ordered_qty: 40,
				received_qty: 40,
				status: 'COMPLETED',
				approval_date: '2026-02-11T10:00:00Z'
			}
		]
	},
	{
		uoid: 'pr-dtl-002',
		purchase_request_dtl_id: 'pr-dtl-002',
		pr_number: 'LB/LPO/MR/2026/00142',
		pr_date: '2026-04-10T08:00:00Z',
		reference_number: 'REF-2026-142',
		system_reference: 'RO',
		item_uoid: 'item-002',
		item_code: 'ATK-002',
		item_name: 'Gula Pasir',
		qty: 25,
		uom: 'KG',
		uom_uoid: 'uom-kg-001',
		purpose: 'Kebutuhan pantry kantor',
		requirement_date: '2026-04-30T00:00:00Z',
		requested_by: 'Farhan Kurniawan',
		division: 'Divisi 1',
		approval_status: 'APPROVED',
		local_purchase_approval_status: 'APPROVED',
		approved_at: '2026-04-11T10:00:00Z',
		estimated_price: 18000,
		budget_unit_price: 18000,
		budget_currency: 'IDR',
		budget_fiscal_year: '2026',
		last_lpo_number: 'LPO/2026/03/002',
		last_lpo_date: '2026-03-15',
		last_lpo_vendor_code: 'V002',
		last_lpo_vendor_name: 'CV Mitra Sejahtera',
		last_lpo_unit_price: 17500,
		last_lpo_id: 'lpo-002',
		lpo_history: [
			{
				lpo_number: 'LPO/2026/03/002',
				lpo_date: '2026-03-15',
				vendor_code: 'V002',
				vendor_name: 'CV Mitra Sejahtera',
				unit_price: 17500,
				ordered_qty: 25,
				received_qty: 25,
				status: 'COMPLETED',
				approval_date: '2026-03-16T10:00:00Z'
			}
		]
	},
	{
		uoid: 'pr-dtl-003',
		purchase_request_dtl_id: 'pr-dtl-003',
		pr_number: 'LB/LPO/MR/2026/00141',
		pr_date: '2026-04-08T08:00:00Z',
		reference_number: 'REF-2026-141',
		system_reference: 'RFQ',
		item_uoid: 'item-003',
		item_code: 'CLN-001',
		item_name: 'Sabun Cuci Tangan',
		qty: 20,
		uom: 'BTL',
		uom_uoid: 'uom-btl-001',
		purpose: 'Kebutuhan kebersihan kantor',
		requirement_date: '2026-04-28T00:00:00Z',
		requested_by: 'Siti Nurhaliza',
		division: 'Divisi 2',
		approval_status: 'APPROVED',
		local_purchase_approval_status: 'NEEDS_APPROVAL',
		department_destination: 'Departemen IT',
		approved_at: '2026-04-09T10:00:00Z',
		estimated_price: 25000,
		budget_unit_price: 25000,
		budget_currency: 'IDR',
		budget_fiscal_year: '2026',
		last_lpo_number: 'LPO/2026/03/005',
		last_lpo_date: '2026-03-10',
		last_lpo_vendor_code: 'V001',
		last_lpo_vendor_name: 'PT Sumber Jaya',
		last_lpo_unit_price: 24000,
		last_lpo_id: 'lpo-005',
		lpo_history: [
			{
				lpo_number: 'LPO/2026/03/005',
				lpo_date: '2026-03-10',
				vendor_code: 'V001',
				vendor_name: 'PT Sumber Jaya',
				unit_price: 24000,
				ordered_qty: 20,
				received_qty: 20,
				status: 'COMPLETED',
				approval_date: '2026-03-11T10:00:00Z'
			}
		]
	},
	{
		uoid: 'pr-dtl-004',
		purchase_request_dtl_id: 'pr-dtl-004',
		pr_number: 'LB/LPO/MR/2026/00140',
		pr_date: '2026-04-05T08:00:00Z',
		reference_number: 'REF-2026-140',
		system_reference: 'RFQ',
		item_uoid: 'item-004',
		item_code: 'BEV-001',
		item_name: 'Kopi Bubuk',
		qty: 10,
		uom: 'KG',
		uom_uoid: 'uom-kg-001',
		purpose: 'Kebutuhan pantry kantor',
		requirement_date: '2026-04-25T00:00:00Z',
		requested_by: 'Ahmad Fauzi',
		division: 'Divisi 1',
		approval_status: 'APPROVED',
		local_purchase_approval_status: 'APPROVED',
		approved_at: '2026-04-06T10:00:00Z',
		estimated_price: 85000,
		budget_unit_price: 85000,
		budget_currency: 'IDR',
		budget_fiscal_year: '2026',
		last_lpo_number: 'LPO/2026/02/015',
		last_lpo_date: '2026-02-20',
		last_lpo_vendor_code: 'V001',
		last_lpo_vendor_name: 'PT Sumber Jaya',
		last_lpo_unit_price: 82000,
		last_lpo_id: 'lpo-015',
		lpo_history: [
			{
				lpo_number: 'LPO/2026/02/015',
				lpo_date: '2026-02-20',
				vendor_code: 'V001',
				vendor_name: 'PT Sumber Jaya',
				unit_price: 82000,
				ordered_qty: 10,
				received_qty: 10,
				status: 'COMPLETED',
				approval_date: '2026-02-21T10:00:00Z'
			}
		]
	},
	{
		uoid: 'pr-dtl-005',
		purchase_request_dtl_id: 'pr-dtl-005',
		pr_number: 'LB/LPO/MR/2026/00140',
		pr_date: '2026-04-05T08:00:00Z',
		reference_number: 'REF-2026-140',
		system_reference: 'RFQ',
		item_uoid: 'item-005',
		item_code: 'BEV-002',
		item_name: 'Teh Celup',
		qty: 50,
		uom: 'BOX',
		uom_uoid: 'uom-box-001',
		purpose: 'Kebutuhan pantry kantor',
		requirement_date: '2026-04-25T00:00:00Z',
		requested_by: 'Ahmad Fauzi',
		division: 'Divisi 1',
		approval_status: 'APPROVED',
		local_purchase_approval_status: 'APPROVED',
		approved_at: '2026-04-06T10:00:00Z',
		estimated_price: 15000,
		budget_unit_price: 15000,
		budget_currency: 'IDR',
		budget_fiscal_year: '2026',
		last_lpo_number: 'LPO/2026/02/016',
		last_lpo_date: '2026-02-20',
		last_lpo_vendor_code: 'V001',
		last_lpo_vendor_name: 'PT Sumber Jaya',
		last_lpo_unit_price: 14500,
		last_lpo_id: 'lpo-016',
		lpo_history: [
			{
				lpo_number: 'LPO/2026/02/016',
				lpo_date: '2026-02-20',
				vendor_code: 'V001',
				vendor_name: 'PT Sumber Jaya',
				unit_price: 14500,
				ordered_qty: 50,
				received_qty: 50,
				status: 'COMPLETED',
				approval_date: '2026-02-21T10:00:00Z'
			}
		]
	},
	{
		uoid: 'pr-dtl-008',
		purchase_request_dtl_id: 'pr-dtl-008',
		pr_number: 'LB/LPO/MR/2026/00138',
		pr_date: '2026-04-01T08:00:00Z',
		reference_number: 'REF-2026-138',
		system_reference: 'RO',
		item_uoid: 'item-008',
		item_code: 'CLN-002',
		item_name: 'Sapu Lidi',
		qty: 20,
		uom: 'PCS',
		uom_uoid: 'uom-pcs-001',
		purpose: 'Kebutuhan kebersihan kantor',
		requirement_date: '2026-04-22T00:00:00Z',
		requested_by: 'Dewi Lestari',
		division: 'Divisi 2',
		approval_status: 'APPROVED',
		local_purchase_approval_status: 'APPROVED',
		approved_at: '2026-04-02T10:00:00Z',
		estimated_price: 15000,
		budget_unit_price: 15000,
		budget_currency: 'IDR',
		budget_fiscal_year: '2026',
		last_lpo_number: 'LPO/2026/03/010',
		last_lpo_date: '2026-03-10',
		last_lpo_vendor_code: 'V002',
		last_lpo_vendor_name: 'CV Mitra Sejahtera',
		last_lpo_unit_price: 14000,
		last_lpo_id: 'lpo-010',
		lpo_history: [
			{
				lpo_number: 'LPO/2026/03/010',
				lpo_date: '2026-03-10',
				vendor_code: 'V002',
				vendor_name: 'CV Mitra Sejahtera',
				unit_price: 14000,
				ordered_qty: 20,
				received_qty: 20,
				status: 'COMPLETED',
				approval_date: '2026-03-11T10:00:00Z'
			}
		]
	},
	{
		uoid: 'pr-dtl-009',
		purchase_request_dtl_id: 'pr-dtl-009',
		pr_number: 'LB/LPO/MR/2026/00138',
		pr_date: '2026-04-01T08:00:00Z',
		reference_number: 'REF-2026-138',
		system_reference: 'RO',
		item_uoid: 'item-009',
		item_code: 'CLN-003',
		item_name: 'Pel Lantai',
		qty: 10,
		uom: 'PCS',
		uom_uoid: 'uom-pcs-001',
		purpose: 'Kebutuhan kebersihan kantor',
		requirement_date: '2026-04-22T00:00:00Z',
		requested_by: 'Dewi Lestari',
		division: 'Divisi 2',
		approval_status: 'APPROVED',
		local_purchase_approval_status: 'APPROVED',
		approved_at: '2026-04-02T10:00:00Z',
		estimated_price: 35000,
		budget_unit_price: 35000,
		budget_currency: 'IDR',
		budget_fiscal_year: '2026',
		last_lpo_number: 'LPO/2026/03/011',
		last_lpo_date: '2026-03-10',
		last_lpo_vendor_code: 'V002',
		last_lpo_vendor_name: 'CV Mitra Sejahtera',
		last_lpo_unit_price: 33000,
		last_lpo_id: 'lpo-011',
		lpo_history: [
			{
				lpo_number: 'LPO/2026/03/011',
				lpo_date: '2026-03-10',
				vendor_code: 'V002',
				vendor_name: 'CV Mitra Sejahtera',
				unit_price: 33000,
				ordered_qty: 10,
				received_qty: 10,
				status: 'COMPLETED',
				approval_date: '2026-03-11T10:00:00Z'
			}
		]
	},
	{
		uoid: 'pr-dtl-010',
		purchase_request_dtl_id: 'pr-dtl-010',
		pr_number: 'LB/LPO/MR/2026/00141',
		pr_date: '2026-04-08T08:00:00Z',
		reference_number: 'REF-2026-141',
		system_reference: 'RFQ',
		item_uoid: 'item-010',
		item_code: 'CLN-004',
		item_name: 'Pembersih Lantai',
		qty: 15,
		uom: 'BTL',
		uom_uoid: 'uom-btl-001',
		purpose: 'Kebutuhan kebersihan kantor',
		requirement_date: '2026-04-28T00:00:00Z',
		requested_by: 'Siti Nurhaliza',
		division: 'Divisi 2',
		approval_status: 'APPROVED',
		local_purchase_approval_status: 'NEEDS_APPROVAL',
		department_destination: 'Departemen Technology', // Wajib ada departemen untuk status Perlu Izin
		approved_at: '2026-04-09T10:00:00Z',
		estimated_price: 35000,
		budget_unit_price: 35000,
		budget_currency: 'IDR',
		budget_fiscal_year: '2026',
		last_lpo_number: 'LPO/2026/03/006',
		last_lpo_date: '2026-03-10',
		last_lpo_vendor_code: 'V001',
		last_lpo_vendor_name: 'PT Sumber Jaya',
		last_lpo_unit_price: 33000,
		last_lpo_id: 'lpo-006',
		lpo_history: [
			{
				lpo_number: 'LPO/2026/03/006',
				lpo_date: '2026-03-10',
				vendor_code: 'V001',
				vendor_name: 'PT Sumber Jaya',
				unit_price: 33000,
				ordered_qty: 15,
				received_qty: 15,
				status: 'COMPLETED',
				approval_date: '2026-03-11T10:00:00Z'
			}
		]
	},
	{
		uoid: 'pr-dtl-011',
		purchase_request_dtl_id: 'pr-dtl-011',
		pr_number: 'LB/LPO/MR/2026/00141',
		pr_date: '2026-04-08T08:00:00Z',
		reference_number: 'REF-2026-141',
		system_reference: 'RFQ',
		item_uoid: 'item-011',
		item_code: 'CLN-005',
		item_name: 'Pewangi Ruangan',
		qty: 10,
		uom: 'BTL',
		uom_uoid: 'uom-btl-001',
		purpose: 'Kebutuhan kebersihan kantor',
		requirement_date: '2026-04-28T00:00:00Z',
		requested_by: 'Siti Nurhaliza',
		division: 'Divisi 2',
		approval_status: 'APPROVED',
		local_purchase_approval_status: 'APPROVED',
		approved_at: '2026-04-09T10:00:00Z',
		estimated_price: 45000,
		budget_unit_price: 45000,
		budget_currency: 'IDR',
		budget_fiscal_year: '2026',
		last_lpo_number: 'LPO/2026/03/007',
		last_lpo_date: '2026-03-10',
		last_lpo_vendor_code: 'V001',
		last_lpo_vendor_name: 'PT Sumber Jaya',
		last_lpo_unit_price: 42000,
		last_lpo_id: 'lpo-007',
		lpo_history: [
			{
				lpo_number: 'LPO/2026/03/007',
				lpo_date: '2026-03-10',
				vendor_code: 'V001',
				vendor_name: 'PT Sumber Jaya',
				unit_price: 42000,
				ordered_qty: 10,
				received_qty: 10,
				status: 'COMPLETED',
				approval_date: '2026-03-11T10:00:00Z'
			}
		]
	},
	// Items with NEEDS_APPROVAL status (Perlu Izin) - can only do RFQ
	{
		uoid: 'pr-dtl-020',
		purchase_request_dtl_id: 'pr-dtl-020',
		pr_number: 'LB/IT/MR/2026/00073',
		pr_date: '2026-04-15T08:00:00Z',
		reference_number: 'LB/IT/MR/073/2024',
		system_reference: 'RFQ',
		item_uoid: 'item-020',
		item_code: 'ATK-002',
		item_name: 'Gula Pasir',
		qty: 25,
		uom: 'KG',
		uom_uoid: 'uom-kg-001',
		purpose: 'Kebutuhan pantry kantor',
		requirement_date: '2026-05-01T00:00:00Z',
		requested_by: 'Ahmad Fauzi',
		division: 'Divisi IT',
		approval_status: 'APPROVED',
		local_purchase_approval_status: 'NEEDS_APPROVAL',
		department_destination: 'Departemen IT', // Wajib ada departemen untuk status Perlu Izin
		approved_at: '2026-04-16T10:00:00Z',
		estimated_price: 18000,
		budget_unit_price: 18000,
		budget_currency: 'IDR',
		budget_fiscal_year: '2026',
		last_lpo_number: null,
		last_lpo_date: null,
		last_lpo_vendor_code: null,
		last_lpo_vendor_name: null,
		last_lpo_unit_price: null,
		last_lpo_id: null,
		lpo_history: []
	},
	{
		uoid: 'pr-dtl-021',
		purchase_request_dtl_id: 'pr-dtl-021',
		pr_number: 'LB/IT/MR/2026/00074',
		pr_date: '2026-04-16T08:00:00Z',
		reference_number: 'LB/IT/MR/074/2024',
		system_reference: 'RFQ',
		item_uoid: 'item-021',
		item_code: 'TEST-001',
		item_name: 'Barang Test Perlu Izin',
		qty: 5,
		uom: 'PCS',
		uom_uoid: 'uom-pcs-001',
		purpose: 'Kebutuhan khusus departemen',
		requirement_date: '2026-05-02T00:00:00Z',
		requested_by: 'Bambang Suryanto',
		division: 'Divisi IT',
		approval_status: 'APPROVED',
		local_purchase_approval_status: 'NEEDS_APPROVAL',
		department_destination: 'Departemen IT', // Wajib ada departemen untuk status Perlu Izin
		approved_at: '2026-04-17T10:00:00Z',
		estimated_price: 50000,
		budget_unit_price: 50000,
		budget_currency: 'IDR',
		budget_fiscal_year: '2026',
		last_lpo_number: null,
		last_lpo_date: null,
		last_lpo_vendor_code: null,
		last_lpo_vendor_name: null,
		last_lpo_unit_price: null,
		last_lpo_id: null,
		lpo_history: []
	},
	{
		uoid: 'pr-dtl-022',
		purchase_request_dtl_id: 'pr-dtl-022',
		pr_number: 'LB/IT/MR/2026/00075',
		pr_date: '2026-04-17T08:00:00Z',
		reference_number: 'LB/IT/MR/075/2024',
		system_reference: 'RFQ',
		item_uoid: 'item-022',
		item_code: 'IT-002',
		item_name: 'Laptop Dell Latitude',
		qty: 2,
		uom: 'UNIT',
		uom_uoid: 'uom-unit-001',
		purpose: 'Kebutuhan karyawan baru',
		requirement_date: '2026-05-05T00:00:00Z',
		requested_by: 'Andi Wijaya',
		division: 'Divisi IT',
		approval_status: 'APPROVED',
		local_purchase_approval_status: 'NEEDS_APPROVAL',
		department_destination: 'Departemen IT',
		approved_at: '2026-04-18T10:00:00Z',
		estimated_price: 12000000,
		budget_unit_price: 12000000,
		budget_currency: 'IDR',
		budget_fiscal_year: '2026',
		last_lpo_number: null,
		last_lpo_date: null,
		last_lpo_vendor_code: null,
		last_lpo_vendor_name: null,
		last_lpo_unit_price: null,
		last_lpo_id: null,
		lpo_history: []
	},
	{
		uoid: 'pr-dtl-023',
		purchase_request_dtl_id: 'pr-dtl-023',
		pr_number: 'LB/TECH/MR/2026/00012',
		pr_date: '2026-04-18T08:00:00Z',
		reference_number: 'LB/TECH/MR/012/2024',
		system_reference: 'RFQ',
		item_uoid: 'item-023',
		item_code: 'TECH-001',
		item_name: 'Software License Adobe Creative Cloud',
		qty: 5,
		uom: 'LICENSE',
		uom_uoid: 'uom-license-001',
		purpose: 'Kebutuhan tim desain',
		requirement_date: '2026-05-10T00:00:00Z',
		requested_by: 'Rudi Hartono',
		division: 'Divisi Technology',
		approval_status: 'APPROVED',
		local_purchase_approval_status: 'NEEDS_APPROVAL',
		department_destination: 'Departemen Technology',
		approved_at: '2026-04-19T10:00:00Z',
		estimated_price: 8500000,
		budget_unit_price: 8500000,
		budget_currency: 'IDR',
		budget_fiscal_year: '2026',
		last_lpo_number: null,
		last_lpo_date: null,
		last_lpo_vendor_code: null,
		last_lpo_vendor_name: null,
		last_lpo_unit_price: null,
		last_lpo_id: null,
		lpo_history: []
	}
];

/**
 * Mock Vendor Users Data
 */
const mockVendorUsers: RFQVendorUser[] = [
	{
		uoid: 'vendor-user-001',
		username: 'vendor1',
		email: 'vendor1@sumberjaya.com',
		vendor_code: 'V001',
		vendor_name: 'PT Sumber Jaya',
		is_active: true,
		is_email_verified: true,
		registration_status: 'ACTIVE',
		party_id: 'vnd-001',
		activated_at: '2025-01-15T10:00:00Z',
		last_login_at: '2026-04-20T08:30:00Z',
		registration_sent_at: '2025-01-10T09:00:00Z'
	},
	{
		uoid: 'vendor-user-002',
		username: 'vendor2',
		email: 'vendor2@mitrasejahtera.com',
		vendor_code: 'V002',
		vendor_name: 'CV Mitra Sejahtera',
		is_active: true,
		is_email_verified: true,
		registration_status: 'ACTIVE',
		party_id: 'vnd-002',
		activated_at: '2025-02-01T10:00:00Z',
		last_login_at: '2026-04-19T14:20:00Z',
		registration_sent_at: '2025-01-25T09:00:00Z'
	},
	{
		uoid: 'vendor-user-003',
		username: 'vendor3',
		email: 'vendor3@berkah.com',
		vendor_code: 'V003',
		vendor_name: 'UD Berkah Abadi',
		is_active: true,
		is_email_verified: true,
		registration_status: 'ACTIVE',
		party_id: 'vnd-003',
		activated_at: '2025-03-10T10:00:00Z',
		last_login_at: '2026-04-18T11:15:00Z',
		registration_sent_at: '2025-03-05T09:00:00Z'
	},
	{
		uoid: 'vendor-user-004',
		username: 'vendor4',
		email: 'vendor4@cahayaterang.com',
		vendor_code: 'V004',
		vendor_name: 'PT Cahaya Terang',
		is_active: true,
		is_email_verified: true,
		registration_status: 'ACTIVE',
		party_id: 'vnd-004',
		activated_at: '2025-03-20T10:00:00Z',
		last_login_at: '2026-04-17T09:45:00Z',
		registration_sent_at: '2025-03-15T09:00:00Z'
	},
	{
		uoid: 'vendor-user-005',
		username: 'vendor5',
		email: 'vendor5@mandiriutama.com',
		vendor_code: 'V005',
		vendor_name: 'CV Mandiri Utama',
		is_active: true,
		is_email_verified: true,
		registration_status: 'ACTIVE',
		party_id: 'vnd-005',
		activated_at: '2025-04-01T10:00:00Z',
		last_login_at: '2026-04-16T13:30:00Z',
		registration_sent_at: '2025-03-28T09:00:00Z'
	},
	{
		uoid: 'vendor-user-006',
		username: 'vendor6',
		email: 'vendor6@sejahterajaya.com',
		vendor_code: 'V006',
		vendor_name: 'PT Sejahtera Jaya',
		is_active: true,
		is_email_verified: false,
		registration_status: 'PENDING_VERIFICATION',
		party_id: 'vnd-006',
		activated_at: null,
		last_login_at: null,
		registration_sent_at: '2026-04-10T09:00:00Z'
	}
];

/**
 * Mock Head Office Feedback Data
 */
const mockHOFeedbacks: Record<string, {
	rfq_id: string;
	rfq_number: string;
	ho_reference_number: string;
	feedback_date: string;
	feedback_by: string;
	feedback_status: 'APPROVED' | 'REJECTED' | 'NEED_REVISION';
	feedback_notes: string;
	next_action: string;
}> = {
	'rfq-007': {
		rfq_id: 'rfq-007',
		rfq_number: 'PH/LB/2026/0006',
		ho_reference_number: 'HO/PR/2026/00235',
		feedback_date: '2026-04-20T16:30:00Z',
		feedback_by: 'Staff HO - Ibu Sari Dewi',
		feedback_status: 'APPROVED',
		feedback_notes: 'Item server telah disetujui untuk procurement melalui Head Office. Proses akan dilanjutkan dengan vendor terpilih CV Mandiri Utama.',
		next_action: 'Procurement akan diproses melalui sistem Head Office dengan timeline 2-3 minggu'
	}
};

/**
 * Mock SAP Approval Data
 */
const mockSAPApprovals: Record<string, SAPApprovalResponse> = {
	'rfq-006': {
		rfq_id: 'rfq-006',
		rfq_number: 'PH/LB/2026/0005',
		submitted_at: '2026-04-18T14:00:00Z',
		responded_at: '2026-04-19T10:15:00Z',
		ktu_name: 'Bapak Suharto',
		ktu_notes: 'Sebagian item disetujui untuk procurement lokal, item khusus dialihkan ke HO',
		overall_status: 'MIXED',
		items: [
			{
				rfq_detail_id: 'rfq-dtl-022',
				item_code: 'ATK-002',
				item_name: 'Gula Pasir',
				qty: 25,
				uom: 'KG',
				vendor_name: 'CV Mitra Sejahtera',
				unit_price: 17600,
				total_price: 440000,
				approval_status: 'APPROVED',
				approval_reason: 'Budget lokal mencukupi untuk item standar',
				ktu_notes: 'Approved for local procurement'
			},
			{
				rfq_detail_id: 'rfq-dtl-023',
				item_code: 'TEST-001',
				item_name: 'Barang Test Perlu Izin',
				qty: 5,
				uom: 'PCS',
				vendor_name: 'CV Mitra Sejahtera',
				unit_price: 50000,
				total_price: 250000,
				approval_status: 'REJECTED',
				approval_reason: 'Budget lokal tidak mencukupi untuk item khusus',
				ktu_notes: 'Item dialihkan ke Head Office untuk proses lebih lanjut'
			}
		]
	}
};

/**
 * Mock Head Office Transfer Data
 */
const mockHOTransfers: Record<string, HOTransferResponse> = {
	'rfq-006': {
		rfq_id: 'rfq-006',
		rfq_number: 'PH/LB/2026/0005',
		transferred_at: '2026-04-19T10:30:00Z',
		transferred_by: 'System Auto Transfer',
		items: [
			{
				original_rfq_detail_id: 'rfq-dtl-023',
				item_code: 'TEST-001',
				item_name: 'Barang Test Perlu Izin',
				qty: 5,
				uom: 'PCS',
				specifications: 'Barang khusus yang memerlukan persetujuan departemen',
				estimated_price: 50000,
				requester_name: 'Bambang Suryanto',
				requester_division: 'Divisi IT',
				transfer_reason: 'Budget lokal tidak mencukupi - dialihkan dari SAP rejection',
				ho_reference_number: 'HO/PR/2026/00234',
				transferred_at: '2026-04-19T10:30:00Z',
				ho_status: 'PENDING'
			}
		]
	}
};

/**
 * Mock Tracking Data untuk RFQ (Proses Pembelian Lokal)
 * 10 Steps: RFQ Sent → GRN Approved
 */
const mockRFQTrackingData: Record<string, TrackingStatusItem[]> = {
	'rfq-001': [
		// Step 10: GRN Approved (FINAL STEP)
		{
			id: 'track-rfq-001-10',
			module: 'GOODS_RECEIPT',
			module_name: 'Penerimaan Barang',
			document_number: 'GRN/2026/0010',
			status: 'APPROVED',
			status_label: 'Penerimaan Barang Disetujui - Proses Selesai',
			timestamp: '2026-04-26T14:00:00Z',
			performed_by: 'user-003',
			performed_by_name: 'Askep/Tekniker I',
			remarks: 'Items: Kertas HVS A4 (20 box), Pulpen Hitam (50 pcs)',
			related_items: ['ATK-001', 'ATK-002']
		},
		// Step 9: GRN Pending Approval
		{
			id: 'track-rfq-001-9',
			module: 'GOODS_RECEIPT',
			module_name: 'Penerimaan Barang',
			document_number: 'GRN/2026/0010',
			status: 'PENDING_APPROVAL',
			status_label: 'Menunggu Persetujuan Penerimaan Barang oleh Askep/Tekniker I',
			timestamp: '2026-04-26T10:00:00Z',
			performed_by: 'user-006',
			performed_by_name: 'Kepala Gudang',
			remarks: 'Items: Kertas HVS A4 (20 box), Pulpen Hitam (50 pcs)',
			related_items: ['ATK-001', 'ATK-002']
		},
		// Step 8: GRN Draft
		{
			id: 'track-rfq-001-8',
			module: 'GOODS_RECEIPT',
			module_name: 'Penerimaan Barang',
			document_number: 'GRN/2026/0010',
			status: 'DRAFT',
			status_label: 'Barang Diterima - Menunggu Pengajuan oleh Kepala Gudang',
			timestamp: '2026-04-26T09:00:00Z',
			performed_by: 'user-006',
			performed_by_name: 'Kepala Gudang',
			remarks: 'Items: Kertas HVS A4 (20 box), Pulpen Hitam (50 pcs)',
			related_items: ['ATK-001', 'ATK-002']
		},
		// Step 7: Waiting Delivery
		{
			id: 'track-rfq-001-7',
			module: 'GOODS_RECEIPT',
			module_name: 'Penerimaan Barang',
			document_number: 'LPO/2026/0010',
			status: 'WAITING_DELIVERY',
			status_label: 'Menunggu Pengiriman dari Vendor',
			timestamp: '2026-04-25T17:00:00Z',
			performed_by: 'user-002',
			performed_by_name: 'Manager Kebun',
			remarks: 'Items: Kertas HVS A4 (20 box), Pulpen Hitam (50 pcs)',
			related_items: ['ATK-001', 'ATK-002']
		},
		// Step 6: LPO Approved
		{
			id: 'track-rfq-001-6',
			module: 'LOCAL_PURCHASE_ORDER',
			module_name: 'Order Pembelian Lokal',
			document_number: 'LPO/2026/0010',
			status: 'APPROVED',
			status_label: 'LPO Disetujui oleh Manager Kebun',
			timestamp: '2026-04-25T14:00:00Z',
			performed_by: 'user-002',
			performed_by_name: 'Manager Kebun',
			remarks: 'Items: Kertas HVS A4 (20 box), Pulpen Hitam (50 pcs)',
			related_items: ['ATK-001', 'ATK-002']
		},
		// Step 5: LPO Pending Approval
		{
			id: 'track-rfq-001-5',
			module: 'LOCAL_PURCHASE_ORDER',
			module_name: 'Order Pembelian Lokal',
			document_number: 'LPO/2026/0010',
			status: 'PENDING_APPROVAL',
			status_label: 'Menunggu Persetujuan LPO oleh Manager Kebun',
			timestamp: '2026-04-25T09:00:00Z',
			performed_by: 'user-001',
			performed_by_name: 'KTU',
			remarks: 'Items: Kertas HVS A4 (20 box), Pulpen Hitam (50 pcs)',
			related_items: ['ATK-001', 'ATK-002']
		},
		// Step 4: LPO Draft
		{
			id: 'track-rfq-001-4',
			module: 'LOCAL_PURCHASE_ORDER',
			module_name: 'Order Pembelian Lokal',
			document_number: 'LPO/2026/0010',
			status: 'DRAFT',
			status_label: 'LPO Telah Dibuat, Menunggu Pengajuan oleh KTU',
			timestamp: '2026-04-25T08:00:00Z',
			performed_by: 'user-001',
			performed_by_name: 'KTU',
			remarks: 'Items: Kertas HVS A4 (20 box), Pulpen Hitam (50 pcs)',
			related_items: ['ATK-001', 'ATK-002']
		},
		// Step 3: Waiting LPO
		{
			id: 'track-rfq-001-3',
			module: 'LOCAL_PURCHASE_PROCESS',
			module_name: 'Proses Pembelian Lokal',
			document_number: 'PH/LB/2026/0001',
			status: 'WAITING_LPO',
			status_label: 'Menunggu Pembuatan LPO oleh KTU',
			timestamp: '2026-04-24T16:00:00Z',
			performed_by: 'user-001',
			performed_by_name: 'KTU',
			remarks: 'Items: Kertas HVS A4 (20 box), Pulpen Hitam (50 pcs)',
			related_items: ['ATK-001', 'ATK-002']
		},
		// Step 2: Quotation Compared
		{
			id: 'track-rfq-001-2',
			module: 'LOCAL_PURCHASE_PROCESS',
			module_name: 'Proses Pembelian Lokal',
			document_number: 'PH/LB/2026/0001',
			status: 'QUOTATION_COMPARED',
			status_label: 'Perbandingan Harga Vendor oleh KTU',
			timestamp: '2026-04-24T15:00:00Z',
			performed_by: 'user-001',
			performed_by_name: 'KTU',
			remarks: 'Items: Kertas HVS A4 (20 box), Pulpen Hitam (50 pcs)',
			related_items: ['ATK-001', 'ATK-002']
		},
		// Step 1: Quotation Sent
		{
			id: 'track-rfq-001-1',
			module: 'LOCAL_PURCHASE_PROCESS',
			module_name: 'Proses Pembelian Lokal',
			document_number: 'PH/LB/2026/0001',
			status: 'QUOTATION_SENT',
			status_label: 'Permintaan Harga Terkirim ke Vendor oleh KTU',
			timestamp: '2026-04-17T10:00:00Z',
			performed_by: 'user-001',
			performed_by_name: 'KTU',
			remarks: 'Items: Kertas HVS A4 (20 box), Pulpen Hitam (50 pcs)',
			related_items: ['ATK-001', 'ATK-002']
		}
	],
	
	// RO (Repeat Order) Tracking - 7 Steps: LPO → GRN Approved
	'rfq-004': [
		// Step 7: GRN Approved (FINAL STEP for RO)
		{
			id: 'track-ro-004-7',
			module: 'GOODS_RECEIPT',
			module_name: 'Penerimaan Barang',
			document_number: 'GRN/2026/0004',
			status: 'APPROVED',
			status_label: 'Penerimaan Barang Disetujui - Proses Selesai',
			timestamp: '2026-04-19T14:00:00Z',
			performed_by: 'user-003',
			performed_by_name: 'Askep/Tekniker I',
			remarks: 'Items: Tissue Kotak (30 box), Gula Pasir (20 kg)',
			related_items: ['ATK-001', 'ATK-002']
		},
		// Step 6: GRN Pending Approval
		{
			id: 'track-ro-004-6',
			module: 'GOODS_RECEIPT',
			module_name: 'Penerimaan Barang',
			document_number: 'GRN/2026/0004',
			status: 'PENDING_APPROVAL',
			status_label: 'Menunggu Persetujuan Penerimaan Barang oleh Askep/Tekniker I',
			timestamp: '2026-04-19T10:00:00Z',
			performed_by: 'user-006',
			performed_by_name: 'Kepala Gudang',
			remarks: 'Items: Tissue Kotak (30 box), Gula Pasir (20 kg)',
			related_items: ['ATK-001', 'ATK-002']
		},
		// Step 5: GRN Draft
		{
			id: 'track-ro-004-5',
			module: 'GOODS_RECEIPT',
			module_name: 'Penerimaan Barang',
			document_number: 'GRN/2026/0004',
			status: 'DRAFT',
			status_label: 'Barang Diterima - Menunggu Pengajuan oleh Kepala Gudang',
			timestamp: '2026-04-19T09:00:00Z',
			performed_by: 'user-006',
			performed_by_name: 'Kepala Gudang',
			remarks: 'Items: Tissue Kotak (30 box), Gula Pasir (20 kg)',
			related_items: ['ATK-001', 'ATK-002']
		},
		// Step 4: Waiting Delivery
		{
			id: 'track-ro-004-4',
			module: 'GOODS_RECEIPT',
			module_name: 'Penerimaan Barang',
			document_number: 'LPO/2026/0004',
			status: 'WAITING_DELIVERY',
			status_label: 'Menunggu Pengiriman dari Vendor',
			timestamp: '2026-04-18T17:00:00Z',
			performed_by: 'user-002',
			performed_by_name: 'Manager Kebun',
			remarks: 'Items: Tissue Kotak (30 box), Gula Pasir (20 kg)',
			related_items: ['ATK-001', 'ATK-002']
		},
		// Step 3: LPO Approved
		{
			id: 'track-ro-004-3',
			module: 'LOCAL_PURCHASE_ORDER',
			module_name: 'Order Pembelian Lokal',
			document_number: 'LPO/2026/0004',
			status: 'APPROVED',
			status_label: 'LPO Disetujui oleh Manager Kebun',
			timestamp: '2026-04-18T14:00:00Z',
			performed_by: 'user-002',
			performed_by_name: 'Manager Kebun',
			remarks: 'Items: Tissue Kotak (30 box), Gula Pasir (20 kg)',
			related_items: ['ATK-001', 'ATK-002']
		},
		// Step 2: LPO Pending Approval
		{
			id: 'track-ro-004-2',
			module: 'LOCAL_PURCHASE_ORDER',
			module_name: 'Order Pembelian Lokal',
			document_number: 'LPO/2026/0004',
			status: 'PENDING_APPROVAL',
			status_label: 'Menunggu Persetujuan LPO oleh Manager Kebun',
			timestamp: '2026-04-18T09:00:00Z',
			performed_by: 'user-001',
			performed_by_name: 'KTU',
			remarks: 'Items: Tissue Kotak (30 box), Gula Pasir (20 kg)',
			related_items: ['ATK-001', 'ATK-002']
		},
		// Step 1: LPO Draft (FIRST STEP for RO)
		{
			id: 'track-ro-004-1',
			module: 'LOCAL_PURCHASE_ORDER',
			module_name: 'Order Pembelian Lokal',
			document_number: 'LPO/2026/0004',
			status: 'DRAFT',
			status_label: 'LPO Telah Dibuat, Menunggu Pengajuan oleh KTU',
			timestamp: '2026-04-16T08:00:00Z',
			performed_by: 'user-001',
			performed_by_name: 'KTU',
			remarks: 'Items: Tissue Kotak (30 box), Gula Pasir (20 kg)',
			related_items: ['ATK-001', 'ATK-002']
		}
	],

	// RFQ-002: Status TERKIRIM (Early stage)
	'rfq-002': [
		// Step 1: Quotation Sent (CURRENT STEP)
		{
			id: 'track-rfq-002-1',
			module: 'LOCAL_PURCHASE_PROCESS',
			module_name: 'Proses Pembelian Lokal',
			document_number: 'PH/LB/2026/0002',
			status: 'QUOTATION_SENT',
			status_label: 'Permintaan Harga Terkirim ke Vendor oleh KTU',
			timestamp: '2026-04-20T09:00:00Z',
			performed_by: 'user-001',
			performed_by_name: 'KTU',
			remarks: 'Items: Sabun Cuci Tangan (20 btl), Pembersih Lantai (15 btl), Gula Pasir (25 kg)',
			related_items: ['CLN-001', 'CLN-004', 'ATK-002']
		}
	],

	// RFQ-003: Status BUAT_LPO (Winner selected, ready for LPO)
	'rfq-003': [
		// Step 3: Waiting LPO (CURRENT STEP)
		{
			id: 'track-rfq-003-3',
			module: 'LOCAL_PURCHASE_PROCESS',
			module_name: 'Proses Pembelian Lokal',
			document_number: 'PH/LB/2026/0003',
			status: 'WAITING_LPO',
			status_label: 'Menunggu Pembuatan LPO oleh KTU',
			timestamp: '2026-04-18T14:00:00Z',
			performed_by: 'user-001',
			performed_by_name: 'KTU',
			remarks: 'Items: Kopi Bubuk (10 kg), Teh Celup (50 box)',
			related_items: ['BEV-001', 'BEV-002']
		},
		// Step 2: Quotation Compared
		{
			id: 'track-rfq-003-2',
			module: 'LOCAL_PURCHASE_PROCESS',
			module_name: 'Proses Pembelian Lokal',
			document_number: 'PH/LB/2026/0003',
			status: 'QUOTATION_COMPARED',
			status_label: 'Perbandingan Harga Vendor oleh KTU',
			timestamp: '2026-04-17T15:00:00Z',
			performed_by: 'user-001',
			performed_by_name: 'KTU',
			remarks: 'Items: Kopi Bubuk (10 kg), Teh Celup (50 box)',
			related_items: ['BEV-001', 'BEV-002']
		},
		// Step 1: Quotation Sent
		{
			id: 'track-rfq-003-1',
			module: 'LOCAL_PURCHASE_PROCESS',
			module_name: 'Proses Pembelian Lokal',
			document_number: 'PH/LB/2026/0003',
			status: 'QUOTATION_SENT',
			status_label: 'Permintaan Harga Terkirim ke Vendor oleh KTU',
			timestamp: '2026-04-14T10:00:00Z',
			performed_by: 'user-001',
			performed_by_name: 'KTU',
			remarks: 'Items: Kopi Bubuk (10 kg), Teh Celup (50 box)',
			related_items: ['BEV-001', 'BEV-002']
		}
	]
};

/**
 * Mock API Functions - Extended
 */
export const localPurchaseAnalysisMockApi = {
	/**
	 * Get RFQ List
	 */
	getRFQList: async (params: { page: number; limit: number; search?: string }): Promise<RFQListResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		let filteredData = [...mockRFQList];

		if (params.search) {
			const searchLower = params.search.toLowerCase();
			filteredData = filteredData.filter(
				(rfq) =>
					rfq.rfq_number.toLowerCase().includes(searchLower) ||
					rfq.title.toLowerCase().includes(searchLower) ||
					rfq.status.toLowerCase().includes(searchLower)
			);
		}

		const startIndex = (params.page - 1) * params.limit;
		const endIndex = startIndex + params.limit;
		const paginatedData = filteredData.slice(startIndex, endIndex);

		return {
			$schema: 'rfq-list-response',
			data: paginatedData,
			pagination: {
				page: params.page,
				limit: params.limit,
				total_records: filteredData.length,
				total_pages: Math.ceil(filteredData.length / params.limit)
			}
		};
	},

	/**
	 * Get RFQ Detail
	 */
	getRFQDetail: async (rfqId: string): Promise<RFQDetailResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		const detail = mockRFQDetails[rfqId];
		if (!detail) {
			throw new Error(`RFQ with ID ${rfqId} not found`);
		}

		return {
			$schema: 'rfq-detail-response',
			data: detail
		};
	},

	/**
	 * Get RFQ Summary
	 */
	getRFQSummary: async (): Promise<RFQSummaryResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 300));

		return {
			$schema: 'rfq-summary-response',
			data: mockRFQSummary
		};
	},

	/**
	 * Get Quotation Comparison
	 */
	getQuotationComparison: async (rfqId: string): Promise<QuotationComparisonResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		const detail = mockRFQDetails[rfqId];
		if (!detail) {
			throw new Error(`RFQ with ID ${rfqId} not found`);
		}

		// Transform RFQ detail to comparison format
		const comparisonData: QuotationComparisonData = {
			rfq_id: detail.uoid,
			uoid: detail.uoid,
			rfq_number: detail.rfq_number,
			rfq_title: detail.title,
			title: detail.title,
			description: detail.description,
			process_type: detail.process_type,
			status: detail.status,
			deadline_date: detail.deadline_date,
			published_at: detail.published_at,
			completed_at: detail.completed_at,
			cancelled_at: detail.cancelled_at,
			cancellation_reason: detail.cancellation_reason,
			item_count: detail.item_count,
			vendor_count: detail.vendor_count,
			contact_person: detail.contact_person,
			contact_email: detail.contact_email,
			contact_phone: detail.contact_phone,
			delivery_location: detail.delivery_location,
			approval_document_id: detail.approval_document_id,
			winner_quotation_id: detail.winner_quotation_id,
			winner_justification: detail.winner_justification,
			winner_selected_at: detail.winner_selected_at,
			items: detail.items.map((item) => ({
				uoid: item.uoid,
				rfq_detail_id: item.uoid,
				purchase_request_dtl_id: item.purchase_request_dtl_id,
				purchase_request_number: item.purchase_request_number,
				item_code: item.item_code,
				item_name: item.item_name,
				qty: item.qty,
				uom: item.uom,
				specifications: item.specifications,
				estimated_price: item.estimated_price,
				budget_price: item.budget_price,
				budget_currency: item.budget_currency,
				budget_fiscal_year: item.budget_fiscal_year,
				last_lpo_price: item.last_lpo_price,
				last_lpo_number: item.last_lpo_number,
				last_lpo_date: item.last_lpo_date,
				quotations: detail.quotations
					.map((quot) => {
						const quotItem = quot.items.find((qi) => qi.rfq_detail_id === item.uoid);
						if (!quotItem) return null;
						return {
							uoid: quotItem.uoid,
							quotation_id: quot.uoid,
							quotation_number: quot.quotation_number,
							vendor_code: quot.vendor_code,
							vendor_name: quot.vendor_name,
							rfq_detail_id: quotItem.rfq_detail_id,
							item_code: quotItem.item_code,
							item_name: quotItem.item_name,
							qty: quotItem.qty,
							unit_price: quotItem.unit_price,
							total_price: quotItem.total_price,
							brand: quotItem.brand,
							origin: quotItem.origin,
							lead_time_days: quotItem.lead_time_days,
							notes: quotItem.notes,
							is_winner: quotItem.is_winner,
							selection_reason: quotItem.selection_reason,
							equivalents: quotItem.equivalents || [],
							budget_price: quotItem.budget_price,
							budget_price_comparison_percent: quotItem.budget_price_comparison_percent,
							last_lpo_price: quotItem.last_lpo_price,
							price_comparison_percent: quotItem.price_comparison_percent
						};
					})
					.filter((q) => q !== null)
			})),
			vendors: detail.vendors,
			quotations: detail.quotations.map((quot) => ({
				uoid: quot.uoid,
				rfq_vendor_id: quot.rfq_vendor_id,
				vendor_code: quot.vendor_code,
				vendor_name: quot.vendor_name,
				quotation_number: quot.quotation_number,
				status: quot.status,
				total_amount: quot.total_amount,
				payment_terms: quot.payment_terms,
				delivery_time_days: quot.delivery_time_days,
				warranty: quot.warranty,
				terms_conditions: quot.terms_conditions,
				valid_until: quot.valid_until,
				submitted_at: quot.submitted_at,
				withdrawn_at: quot.withdrawn_at,
				withdraw_reason: quot.withdraw_reason,
				evaluation_score: quot.evaluation_score,
				evaluation_notes: quot.evaluation_notes,
				is_winner: quot.is_winner,
				vendor_rfq_number: quot.vendor_rfq_number,
				items: quot.items.map((item) => ({
					...item,
					items: {
						qty: String(item.qty)
					}
				})),
				i_version: quot.i_version
			})),
			pending_vendors: detail.vendors
				.filter((v) => v.status === 'INVITED' || v.status === 'VIEWED')
				.map((v) => ({
					vendor_code: v.vendor_code,
					vendor_name: v.vendor_name,
					viewed_at: v.viewed_at,
					vendor_rfq_number: v.vendor_rfq_number,
					invited_at: v.invited_at ?? '',
					status: v.status
				})),
			i_version: detail.i_version
		};

		return {
			$schema: 'quotation-comparison-response',
			data: comparisonData
		};
	},

	/**
	 * Extend deadline RFQ (Mock)
	 */
	extendDeadline: async (rfqId: string, newDeadline: string): Promise<void> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		const detail = mockRFQDetails[rfqId];
		if (!detail) {
			throw new Error(`RFQ with ID ${rfqId} not found`);
		}

		// Update deadline in mock data
		mockRFQDetails[rfqId] = {
			...detail,
			deadline_date: newDeadline
		};

		// Also update in mockRFQList
		const listIndex = mockRFQList.findIndex((rfq) => rfq.uoid === rfqId);
		if (listIndex !== -1) {
			mockRFQList[listIndex] = {
				...mockRFQList[listIndex],
				deadline_date: newDeadline
			};
		}
	},

	/**
	 * Add vendor to RFQ (Mock)
	 */
	addVendorToRFQ: async (rfqId: string, vendorIds: string[]): Promise<void> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		const detail = mockRFQDetails[rfqId];
		if (!detail) {
			throw new Error(`RFQ with ID ${rfqId} not found`);
		}

		// Mock: Add new vendors to the RFQ
		// In real implementation, backend will create vendor records and send emails
		const newVendors: RFQDetailVendor[] = vendorIds.map((vendorId, index) => ({
			uoid: `rfq-vnd-new-${Date.now()}-${index}`,
			vendor_id: vendorId,
			vendor_code: `V00${index + 4}`,
			vendor_name: `Vendor Baru ${index + 1}`,
			vendor_email: `vendor${index + 4}@example.com`,
			status: 'INVITED',
			vendor_rfq_number: `V00${index + 4}-RFQ-${rfqId.slice(-3)}`,
			invited_at: new Date().toISOString(),
			viewed_at: null,
			declined_at: null,
			decline_reason: null
		}));

		mockRFQDetails[rfqId] = {
			...detail,
			vendors: [...detail.vendors, ...newVendors],
			vendor_count: detail.vendor_count + newVendors.length
		};

		// Also update in mockRFQList
		const listIndex = mockRFQList.findIndex((rfq) => rfq.uoid === rfqId);
		if (listIndex !== -1) {
			mockRFQList[listIndex] = {
				...mockRFQList[listIndex],
				vendor_count: mockRFQList[listIndex].vendor_count + newVendors.length
			};
		}
	},

	/**
	 * Delete item from RFQ (Mock)
	 */
	deleteRFQItem: async (rfqId: string, itemId: string): Promise<void> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		const detail = mockRFQDetails[rfqId];
		if (!detail) {
			throw new Error(`RFQ with ID ${rfqId} not found`);
		}

		// Check if it's the last item
		if (detail.items.length <= 1) {
			throw new Error('Cannot delete the last item. RFQ must have at least 1 item.');
		}

		// Remove item from items array
		const updatedItems = detail.items.filter((item) => item.uoid !== itemId);

		mockRFQDetails[rfqId] = {
			...detail,
			items: updatedItems,
			item_count: updatedItems.length
		};

		// Also update in mockRFQList
		const listIndex = mockRFQList.findIndex((rfq) => rfq.uoid === rfqId);
		if (listIndex !== -1) {
			mockRFQList[listIndex] = {
				...mockRFQList[listIndex],
				item_count: updatedItems.length
			};
		}
	},

	/**
	 * Get vendor users for RFQ invitation (Mock)
	 */
	getVendorUsersForRFQ: async (params: {
		page: number;
		limit: number;
		search?: string;
	}): Promise<RFQVendorUsersResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		let filteredData = [...mockVendorUsers];

		// Filter by search
		if (params.search) {
			const searchLower = params.search.toLowerCase();
			filteredData = filteredData.filter(
				(vendor) =>
					vendor.vendor_name.toLowerCase().includes(searchLower) ||
					vendor.vendor_code.toLowerCase().includes(searchLower) ||
					vendor.email.toLowerCase().includes(searchLower)
			);
		}

		// Pagination
		const startIndex = (params.page - 1) * params.limit;
		const endIndex = startIndex + params.limit;
		const paginatedData = filteredData.slice(startIndex, endIndex);

		return {
			$schema: 'vendor-users-response',
			data: {
				data: paginatedData,
				pagination: {
					page: params.page,
					limit: params.limit,
					total_records: filteredData.length,
					total_pages: Math.ceil(filteredData.length / params.limit)
				}
			}
		};
	},

	/**
	 * Get eligible Purchase Requests for RFQ (Mock)
	 */
	getEligiblePRs: async (params: {
		page: number;
		limit: number;
		search?: string;
	}): Promise<EligiblePRsResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		let filteredData = [...mockEligiblePRs];

		// Filter by search
		if (params.search) {
			const searchLower = params.search.toLowerCase();
			filteredData = filteredData.filter(
				(pr) =>
					pr.pr_number.toLowerCase().includes(searchLower) ||
					pr.item_code.toLowerCase().includes(searchLower) ||
					pr.item_name.toLowerCase().includes(searchLower) ||
					pr.requested_by.toLowerCase().includes(searchLower)
			);
		}

		// Pagination
		const startIndex = (params.page - 1) * params.limit;
		const endIndex = startIndex + params.limit;
		const paginatedData = filteredData.slice(startIndex, endIndex);

		return {
			$schema: 'eligible-prs-response',
			data: paginatedData,
			pagination: {
				page: params.page,
				limit: params.limit,
				total_records: filteredData.length,
				total_pages: Math.ceil(filteredData.length / params.limit)
			}
		};
	},

	/**
	 * Submit RFQ to SAP for approval (Mock)
	 */
	submitToSAP: async (rfqId: string): Promise<{ success: boolean; message: string }> => {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Update RFQ status to waiting for SAP
		const listIndex = mockRFQList.findIndex((rfq) => rfq.uoid === rfqId);
		if (listIndex !== -1) {
			mockRFQList[listIndex] = {
				...mockRFQList[listIndex],
				status: 'MENUNGGU_SAP',
				sap_approval_status: 'PENDING',
				sap_submitted_at: new Date().toISOString()
			};
		}

		return {
			success: true,
			message: 'RFQ berhasil dikirim ke SAP untuk approval'
		};
	},

	/**
	 * Get SAP approval status (Mock)
	 */
	getSAPApproval: async (rfqId: string): Promise<SAPApprovalResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		const approval = mockSAPApprovals[rfqId];
		if (!approval) {
			throw new Error(`SAP approval data for RFQ ${rfqId} not found`);
		}

		return approval;
	},

	/**
	 * Process SAP approval result (Mock)
	 * This will automatically transfer rejected items to HO
	 */
	processSAPApproval: async (rfqId: string): Promise<{
		approved_items: SAPApprovalItem[];
		rejected_items: SAPApprovalItem[];
		ho_transfer: HOTransferResponse | null;
	}> => {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const approval = mockSAPApprovals[rfqId];
		if (!approval) {
			throw new Error(`SAP approval data for RFQ ${rfqId} not found`);
		}

		const approvedItems = approval.items.filter(item => item.approval_status === 'APPROVED');
		const rejectedItems = approval.items.filter(item => item.approval_status === 'REJECTED');

		let hoTransfer = null;
		if (rejectedItems.length > 0) {
			// Auto transfer rejected items to HO
			hoTransfer = mockHOTransfers[rfqId];
		}

		// Update RFQ status
		const listIndex = mockRFQList.findIndex((rfq) => rfq.uoid === rfqId);
		if (listIndex !== -1) {
			mockRFQList[listIndex] = {
				...mockRFQList[listIndex],
				status: approval.overall_status === 'APPROVED' ? 'LPO_DIBUAT' : 'SEBAGIAN_DIPROSES',
				sap_approval_status: approval.overall_status,
				sap_responded_at: approval.responded_at,
				approved_items_count: approvedItems.length,
				rejected_items_count: rejectedItems.length,
				ho_transferred_items_count: hoTransfer ? hoTransfer.items.length : 0
			};
		}

		return {
			approved_items: approvedItems,
			rejected_items: rejectedItems,
			ho_transfer: hoTransfer
		};
	},

	/**
	 * Get HO transfer status (Mock)
	 */
	getHOTransferStatus: async (rfqId: string): Promise<HOTransferResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		const transfer = mockHOTransfers[rfqId];
		if (!transfer) {
			throw new Error(`HO transfer data for RFQ ${rfqId} not found`);
		}

		return transfer;
	},

	/**
	 * Get HO feedback (Mock)
	 */
	getHOFeedback: async (rfqId: string) => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		const feedback = mockHOFeedbacks[rfqId];
		if (!feedback) {
			throw new Error(`HO feedback data for RFQ ${rfqId} not found`);
		}

		return feedback;
	},

	/**
	 * Get tracking history for RFQ (Mock)
	 */
	getTrackingHistory: async (rfqId: string): Promise<TrackingHistoryResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 500));

		const trackingData = mockRFQTrackingData[rfqId];
		if (!trackingData) {
			throw new Error(`Tracking data for RFQ ${rfqId} not found`);
		}

		return {
			$schema: 'tracking-history-response',
			data: trackingData
		};
	}
};
