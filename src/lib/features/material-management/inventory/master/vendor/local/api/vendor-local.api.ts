import { env } from '$env/dynamic/public';
import type {
	LocalVendorListResponse,
	LocalVendorDetailResponse,
	LocalVendorAddressListResponse,
	LocalVendorPartyTypesResponse,
	LocalVendorBankListResponse,
	LocalVendorOtherInfoListResponse,
	LocalVendorTaxRegistrationListResponse,
	LocalVendorTransactionTypeListResponse,
	LocalVendorCustomPropertyListResponse,
	CreateLocalVendorRequest,
	UpdateLocalVendorRequest,
	RegisterVendorRequest,
	ResendVendorRegistrationRequest,
	RegisterVendorResponse,
	LocalVendorListParams
} from '../types/vendor-local.types';

interface ApiContext {
	token: string;
	estateId: string;
	contextId: string;
}

/**
 * Parse error message from API response body
 */
async function parseErrorMessage(response: Response): Promise<string> {
	try {
		const body = await response.json();
		return body?.errors?.[0]?.message ?? body?.detail ?? body?.message ?? response.statusText;
	} catch {
		return response.statusText;
	}
}

/**
 * Local Vendor API
 */
export const localVendorApi = {
	/**
	 * Get local vendors list
	 */
	getLocalVendors: async (
		params: LocalVendorListParams,
		context: ApiContext
	): Promise<LocalVendorListResponse> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const searchParams = new URLSearchParams({
			page: params.page.toString(),
			limit: params.limit.toString(),
			party_type: 'local'
		});

		if (params.search) searchParams.append('search', params.search);
		if (params.party_type_id) searchParams.append('party_type_id', params.party_type_id);
		if (params.vendor_registration_status)
			searchParams.append('vendor_registration_status', params.vendor_registration_status);
		if (params.has_vendor_user !== undefined)
			searchParams.append('has_vendor_user', String(params.has_vendor_user));
		if (params.is_active !== undefined) searchParams.append('is_active', String(params.is_active));
		if (params.order_by) searchParams.append('order_by', params.order_by);
		if (params.order_direction) searchParams.append('order_direction', params.order_direction);

		const response = await fetch(`${baseUrl}/api/parties?${searchParams}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Context-ID': context.contextId,
				'X-Estate-Selection': context.estateId
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Get local vendor by ID
	 */
	getLocalVendorById: async (
		uoid: string,
		context: ApiContext
	): Promise<LocalVendorDetailResponse> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(`${baseUrl}/api/parties/${uoid}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Context-ID': context.contextId,
				'X-Estate-Selection': context.estateId
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	},

	/**
	 * Get local vendor addresses by vendor ID
	 */
	getLocalVendorAddresses: async (
		uoid: string,
		context: ApiContext
	): Promise<LocalVendorAddressListResponse> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(`${baseUrl}/api/parties/${uoid}/addresses`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json, application/problem+json',
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
	 * Get local vendor party types (categories) by vendor ID
	 */
	getLocalVendorPartyTypes: async (
		uoid: string,
		context: ApiContext
	): Promise<LocalVendorPartyTypesResponse> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(`${baseUrl}/api/parties/${uoid}/party-types`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json, application/problem+json',
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
	 * Create new local vendor
	 */
	createLocalVendor: async (
		data: CreateLocalVendorRequest,
		context: ApiContext
	): Promise<LocalVendorDetailResponse> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(`${baseUrl}/api/parties`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Context-ID': context.contextId,
				'X-Estate-Selection': context.estateId
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	},

	/**
	 * Update local vendor
	 */
	updateLocalVendor: async (
		uoid: string,
		data: UpdateLocalVendorRequest,
		i_version: number,
		context: ApiContext
	): Promise<LocalVendorDetailResponse> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(`${baseUrl}/api/parties/${uoid}?i_version=${i_version}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Context-ID': context.contextId,
				'X-Estate-Selection': context.estateId
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	},

	/**
	 * Delete local vendor
	 */
	deleteLocalVendor: async (
		uoid: string,
		i_version: number,
		context: ApiContext
	): Promise<void> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(`${baseUrl}/api/parties/${uoid}?i_version=${i_version}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Context-ID': context.contextId,
				'X-Estate-Selection': context.estateId
			}
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}
	},

	/**
	 * Register vendor for user access
	 */
	registerVendor: async (
		data: RegisterVendorRequest,
		context: ApiContext
	): Promise<RegisterVendorResponse> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(`${baseUrl}/api/internal/vendor/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Context-ID': context.contextId,
				'X-Estate-Selection': context.estateId
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		// For successful registration, return success response
		return {
			success: true,
			message: 'Vendor registration sent successfully'
		};
	},

	/**
	 * Resend vendor registration
	 */
	resendVendorRegistration: async (
		data: ResendVendorRegistrationRequest,
		context: ApiContext
	): Promise<RegisterVendorResponse> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(`${baseUrl}/api/internal/vendor/${data.vendor_user_id}/resend`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Context-ID': context.contextId,
				'X-Estate-Selection': context.estateId
			}
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		// For successful resend, return success response
		return {
			success: true,
			message: 'Vendor registration resent successfully'
		};
	},

	/**
	 * Get local vendor banks by vendor ID
	 */
	getLocalVendorBanks: async (
		uoid: string,
		context: ApiContext
	): Promise<LocalVendorBankListResponse> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(`${baseUrl}/api/parties/${uoid}/banks`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json, application/problem+json',
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
	 * Get local vendor other info by vendor ID
	 */
	getLocalVendorOtherInfo: async (
		uoid: string,
		context: ApiContext
	): Promise<LocalVendorOtherInfoListResponse> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(`${baseUrl}/api/parties/${uoid}/other-infos`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json, application/problem+json',
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
	 * Get local vendor tax registrations by vendor ID
	 */
	getLocalVendorTaxRegistrations: async (
		uoid: string,
		context: ApiContext
	): Promise<LocalVendorTaxRegistrationListResponse> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(`${baseUrl}/api/parties/${uoid}/tax-registrations`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json, application/problem+json',
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
	 * Get local vendor transaction types by vendor ID
	 */
	getLocalVendorTransactionTypes: async (
		uoid: string,
		context: ApiContext
	): Promise<LocalVendorTransactionTypeListResponse> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(`${baseUrl}/api/parties/${uoid}/transaction-type`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json, application/problem+json',
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
	 * Get local vendor custom properties by vendor ID
	 */
	getLocalVendorCustomProperties: async (
		uoid: string,
		context: ApiContext
	): Promise<LocalVendorCustomPropertyListResponse> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(`${baseUrl}/api/parties/${uoid}/properties`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json, application/problem+json',
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
	 * Update local vendor addresses (insert or edit)
	 */
	updateLocalVendorAddresses: async (
		uoid: string,
		data: { address: Array<any> },
		context: ApiContext
	): Promise<LocalVendorAddressListResponse> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(`${baseUrl}/api/parties/${uoid}/addresses`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Context-ID': context.contextId,
				'X-Estate-Selection': context.estateId
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	},

	/**
	 * Update local vendor party types (categories) - insert or edit
	 */
	updateLocalVendorPartyTypes: async (
		uoid: string,
		data: { category: Array<any> },
		context: ApiContext
	): Promise<LocalVendorPartyTypesResponse> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(`${baseUrl}/api/parties/${uoid}/party-types`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Context-ID': context.contextId,
				'X-Estate-Selection': context.estateId
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	},

	/**
	 * Update local vendor transaction types - insert or edit
	 */
	updateLocalVendorTransactionTypes: async (
		uoid: string,
		data: { transaction_type: Array<any> },
		context: ApiContext
	): Promise<LocalVendorTransactionTypeListResponse> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(`${baseUrl}/api/parties/${uoid}/transaction-type`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Context-ID': context.contextId,
				'X-Estate-Selection': context.estateId
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	},

	/**
	 * Update local vendor tax registrations - insert or edit
	 */
	updateLocalVendorTaxRegistrations: async (
		uoid: string,
		data: { tax: Array<any> },
		context: ApiContext
	): Promise<LocalVendorTaxRegistrationListResponse> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(`${baseUrl}/api/parties/${uoid}/tax-registrations`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Context-ID': context.contextId,
				'X-Estate-Selection': context.estateId
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	},

	/**
	 * Delete local vendor address
	 */
	deleteLocalVendorAddress: async (
		uoid: string,
		linkId: string,
		i_version: number,
		context: ApiContext
	): Promise<void> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(
			`${baseUrl}/api/parties/${uoid}/addresses/${linkId}?i_version=${i_version}`,
			{
				method: 'DELETE',
				headers: {
					Accept: 'application/json, application/problem+json',
					Authorization: `Bearer ${context.token}`,
					'X-Context-ID': context.contextId,
					'X-Estate-Selection': context.estateId
				}
			}
		);

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}
	},

	/**
	 * Delete local vendor party type (category)
	 */
	deleteLocalVendorPartyType: async (
		uoid: string,
		partyTypeUoid: string,
		i_version: number,
		context: ApiContext
	): Promise<void> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(
			`${baseUrl}/api/parties/${uoid}/party-types/${partyTypeUoid}?i_version=${i_version}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json, application/problem+json',
					Authorization: `Bearer ${context.token}`,
					'X-Context-ID': context.contextId,
					'X-Estate-Selection': context.estateId
				}
			}
		);

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}
	},

	/**
	 * Delete local vendor transaction type
	 */
	deleteLocalVendorTransactionType: async (
		uoid: string,
		transactionTypeUoid: string,
		i_version: number,
		context: ApiContext
	): Promise<void> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(
			`${baseUrl}/api/parties/${uoid}/transaction-type/${transactionTypeUoid}?i_version=${i_version}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json, application/problem+json',
					Authorization: `Bearer ${context.token}`,
					'X-Context-ID': context.contextId,
					'X-Estate-Selection': context.estateId
				}
			}
		);

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}
	},

	/**
	 * Delete local vendor tax registration
	 */
	deleteLocalVendorTaxRegistration: async (
		uoid: string,
		taxRegistrationUoid: string,
		i_version: number,
		context: ApiContext
	): Promise<void> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(
			`${baseUrl}/api/parties/${uoid}/tax-registrations/${taxRegistrationUoid}?i_version=${i_version}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json, application/problem+json',
					Authorization: `Bearer ${context.token}`,
					'X-Context-ID': context.contextId,
					'X-Estate-Selection': context.estateId
				}
			}
		);

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}
	},

	/**
	 * Update local vendor custom properties - insert or edit
	 */
	updateLocalVendorCustomProperties: async (
		uoid: string,
		data: { property: Array<any> },
		context: ApiContext
	): Promise<LocalVendorCustomPropertyListResponse> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(`${baseUrl}/api/parties/${uoid}/properties`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Context-ID': context.contextId,
				'X-Estate-Selection': context.estateId
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	},

	/**
	 * Delete local vendor custom property
	 */
	deleteLocalVendorCustomProperty: async (
		uoid: string,
		customPropertyUoid: string,
		i_version: number,
		context: ApiContext
	): Promise<void> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(
			`${baseUrl}/api/parties/${uoid}/properties/${customPropertyUoid}?i_version=${i_version}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json, application/problem+json',
					Authorization: `Bearer ${context.token}`,
					'X-Context-ID': context.contextId,
					'X-Estate-Selection': context.estateId
				}
			}
		);

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}
	},

	/**
	 * Update local vendor banks - insert or edit
	 */
	updateLocalVendorBanks: async (
		uoid: string,
		data: { bank: Array<any> },
		context: ApiContext
	): Promise<LocalVendorBankListResponse> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(`${baseUrl}/api/parties/${uoid}/banks`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Context-ID': context.contextId,
				'X-Estate-Selection': context.estateId
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	},

	/**
	 * Delete local vendor bank
	 */
	deleteLocalVendorBank: async (
		uoid: string,
		bankId: string,
		i_version: number,
		context: ApiContext
	): Promise<void> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(
			`${baseUrl}/api/parties/${uoid}/banks/${bankId}?i_version=${i_version}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json, application/problem+json',
					Authorization: `Bearer ${context.token}`,
					'X-Context-ID': context.contextId,
					'X-Estate-Selection': context.estateId
				}
			}
		);

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}
	},

	/**
	 * Update local vendor other infos - insert or edit
	 */
	updateLocalVendorOtherInfos: async (
		uoid: string,
		data: { other_info: Array<any> },
		context: ApiContext
	): Promise<LocalVendorOtherInfoListResponse> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(`${baseUrl}/api/parties/${uoid}/other-infos`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json, application/problem+json',
				Authorization: `Bearer ${context.token}`,
				'X-Context-ID': context.contextId,
				'X-Estate-Selection': context.estateId
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}

		return response.json();
	},

	/**
	 * Delete local vendor other info
	 */
	deleteLocalVendorOtherInfo: async (
		uoid: string,
		infoId: string,
		i_version: number,
		context: ApiContext
	): Promise<void> => {
		const baseUrl = env.PUBLIC_T3_API_URL || 'https://apisigma.iwkapps.com/mm';

		const response = await fetch(
			`${baseUrl}/api/parties/${uoid}/other-infos/${infoId}?i_version=${i_version}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json, application/problem+json',
					Authorization: `Bearer ${context.token}`,
					'X-Context-ID': context.contextId,
					'X-Estate-Selection': context.estateId
				}
			}
		);

		if (!response.ok) {
			throw new Error(await parseErrorMessage(response));
		}
	}
};
