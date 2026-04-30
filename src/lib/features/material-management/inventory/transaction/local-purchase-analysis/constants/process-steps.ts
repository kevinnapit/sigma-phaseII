import type { ProcessStep, ProcessStepInfo } from '../types/local-purchase-analysis.types';

export const PROCESS_STEPS: ProcessStepInfo[] = [
	{
		id: 'select-items',
		title: 'Pilih Item MR',
		description: 'Pilih item ',
		completed: false
	},
	{
		id: 'select-vendor',
		title: 'Pilih Vendor',
		description: 'Pilih vendor',
		completed: false
	},
	{
		id: 'review-submit',
		title: 'Review & Kirim',
		description: 'Review dan kirim',
		completed: false
	},
	{
		id: 'rfq-sent-status',
		title: 'Status Terkirim',
		description: 'terkirim',
		completed: false
	},
	{
		id: 'price-comparison',
		title: 'Perbandingan Harga',
		description: 'Bandingkan',
		completed: false
	},
	{
		id: 'create-lpo',
		title: 'Buat LPO',
		description: 'Buat LPO',
		completed: false
	}
];

export const SESSION_STORAGE_KEY = 'lpa_selected_items';
export const SESSION_STORAGE_VENDORS_KEY = 'lpa_selected_vendors';

/**
 * Mapping dari API status ke display label dan step tujuan
 */
export const RFQ_STATUS_CONFIG: Record<
	string,
	{ displayLabel: string; step: ProcessStep; stepIndex: number }
> = {
	TERKIRIM: {
		displayLabel: 'Terkirim',
		step: 'rfq-sent-status',
		stepIndex: 3
	},
	PERBANDINGAN_HARGA: {
		displayLabel: 'Perbandingan harga',
		step: 'price-comparison',
		stepIndex: 4
	},
	BUAT_LPO: {
		displayLabel: 'Buat LPO',
		step: 'create-lpo',
		stepIndex: 5
	},
	LPO_DIBUAT: {
		displayLabel: 'LPO dibuat',
		step: 'create-lpo',
		stepIndex: 5
	},
	MENUNGGU_PERSETUJUAN_HO: {
		displayLabel: 'Menunggu Persetujuan Staff HO',
		step: 'create-lpo',
		stepIndex: 5
	},
	TELAH_DIVERIFIKASI: {
		displayLabel: 'Telah Diverifikasi',
		step: 'create-lpo',
		stepIndex: 5
	},
	SEBAGIAN_DIPROSES: {
		displayLabel: 'Sebagian diproses',
		step: 'create-lpo',
		stepIndex: 5
	},
	// Legacy support (jika ada data lama)
	open: {
		displayLabel: 'Terkirim',
		step: 'rfq-sent-status',
		stepIndex: 3
	},
	evaluation: {
		displayLabel: 'Perbandingan harga',
		step: 'price-comparison',
		stepIndex: 4
	},
	closed: {
		displayLabel: 'Perbandingan harga',
		step: 'price-comparison',
		stepIndex: 4
	},
	winner_selected: {
		displayLabel: 'Buat LPO',
		step: 'create-lpo',
		stepIndex: 5
	},
	winning_selected: {
		displayLabel: 'LPO dibuat',
		step: 'create-lpo',
		stepIndex: 5
	}
};

/**
 * Get display label for RFQ status
 */
export function getRFQStatusDisplay(status: string): string {
	return RFQ_STATUS_CONFIG[status]?.displayLabel || status;
}

/**
 * Get step ID for RFQ status
 */
export function getRFQStepFromStatus(status: string): ProcessStep {
	return RFQ_STATUS_CONFIG[status]?.step || 'rfq-sent-status';
}

/**
 * Get step index for RFQ status
 */
export function getRFQStepIndexFromStatus(status: string): number {
	return RFQ_STATUS_CONFIG[status]?.stepIndex ?? 3;
}
