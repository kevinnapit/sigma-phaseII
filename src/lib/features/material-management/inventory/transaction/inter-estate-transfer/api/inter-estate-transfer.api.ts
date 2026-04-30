// API functions for Inter Estate Transfer

import { env } from '$env/dynamic/public';
import type {
	InterEstateTransferListParams,
	InterEstateTransferListResponse,
	InterEstateTransferDetailResponse,
	ApprovalRequest,
	RejectionRequest,
	ApprovalResponse
} from '../types/inter-estate-transfer.types';
import {
	getMockInterEstateTransfers,
	getMockInterEstateTransferDetail
} from './inter-estate-transfer.mock';

interface ApiContext {
	token: string;
	estateId: string;
}

const BASE_URL = env.PUBLIC_T3_API_URL || 'https://api.example.com';
const USE_MOCK = true; // Set to false when real API is ready

export const interEstateTransferApi = {
	/**
	 * Get all inter estate transfers with pagination and filters
	 */
	getInterEstateTransfers: async (
		params: InterEstateTransferListParams,
		context: ApiContext
	): Promise<InterEstateTransferListResponse> => {
		if (USE_MOCK) {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 500));
			return getMockInterEstateTransfers(params.page, params.size, params.search, params.status);
		}

		const searchParams = new URLSearchParams({
			page: params.page.toString(),
			size: params.size.toString()
		});

		if (params.search) searchParams.append('search', params.search);
		if (params.status) searchParams.append('status', params.status);
		if (params.from_estate_id) searchParams.append('from_estate_id', params.from_estate_id);
		if (params.to_estate_id) searchParams.append('to_estate_id', params.to_estate_id);
		if (params.date_from) searchParams.append('date_from', params.date_from);
		if (params.date_to) searchParams.append('date_to', params.date_to);

		const response = await fetch(`${BASE_URL}/api/inter-estate-transfers?${searchParams}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Get inter estate transfer detail by ID
	 */
	getInterEstateTransferDetail: async (
		id: string,
		context: ApiContext
	): Promise<InterEstateTransferDetailResponse> => {
		if (USE_MOCK) {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 300));
			return getMockInterEstateTransferDetail(id);
		}

		const response = await fetch(`${BASE_URL}/api/inter-estate-transfers/${id}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Approve inter estate transfer
	 */
	approveTransfer: async (
		id: string,
		payload: ApprovalRequest,
		context: ApiContext
	): Promise<ApprovalResponse> => {
		if (USE_MOCK) {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const detail = await getMockInterEstateTransferDetail(id);
			return {
				data: {
					...detail.data,
					status: 'approved',
					status_label: 'Disetujui',
					approval_date: new Date().toISOString(),
					approval_by: 'Manager Kebun',
					approval_notes: payload.notes
				},
				message: 'Transfer berhasil disetujui'
			};
		}

		const response = await fetch(`${BASE_URL}/api/inter-estate-transfers/${id}/approve`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId
			},
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Reject inter estate transfer
	 */
	rejectTransfer: async (
		id: string,
		payload: RejectionRequest,
		context: ApiContext
	): Promise<ApprovalResponse> => {
		if (USE_MOCK) {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const detail = await getMockInterEstateTransferDetail(id);
			return {
				data: {
					...detail.data,
					status: 'rejected',
					status_label: 'Ditolak',
					approval_date: new Date().toISOString(),
					approval_by: 'Manager Kebun',
					rejection_reason: payload.reason
				},
				message: 'Transfer berhasil ditolak'
			};
		}

		const response = await fetch(`${BASE_URL}/api/inter-estate-transfers/${id}/reject`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${context.token}`,
				'X-Estate-Selection': context.estateId
			},
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
		}

		return response.json();
	}
};
