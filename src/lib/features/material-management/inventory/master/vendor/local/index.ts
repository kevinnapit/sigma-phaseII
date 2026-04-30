/**
 * Exports all local vendor-related functionality
 */

// API exports
export { localVendorApi } from './api/vendor-local.api';
export { localVendorKeys } from './api/vendor-local.keys';

// Hook exports - Queries
export {
	useReadAllLocalVendors,
	useReadDetailLocalVendor,
	useReadLocalVendorAddresses,
	useReadLocalVendorPartyTypes,
	useReadLocalVendorBanks,
	useReadLocalVendorOtherInfo,
	useReadLocalVendorTaxRegistrations,
	useReadLocalVendorTransactionTypes,
	useReadLocalVendorCustomProperties
} from './hooks/useVendorsLocalQueries.svelte';

// Hook exports - Mutations
export {
	useCreateLocalVendor,
	useUpdateLocalVendor,
	useDeleteLocalVendor,
	useRegisterVendor,
	useResendVendorRegistration,
	useUpdateLocalVendorAddresses,
	useUpdateLocalVendorPartyTypes,
	useUpdateLocalVendorTransactionTypes
} from './hooks/useVendorsLocalMutations.svelte';

// Hook exports - Detailed Queries
export {
	useAccountByGroupId,
	useAccountByModuleName,
	useBranchQuery
} from './hooks/useDetailedVendorsQueries.svelte.js';

// Hook exports - Types from Detailed Queries
export type {
	Bank,
	Branch,
	BranchListResponse,
	AccountGroup,
	AccountType,
	AccountItem,
	AccountByGroupIdResponse,
	AccountByModuleNamePagination,
	AccountByModuleNameResponse
} from './hooks/useDetailedVendorsQueries.svelte.js';

// Constants exports
export {
	PARTY_TYPE_ID,
	COUNTRY_TYPE_ID,
	COMMUNICATION_TYPE_ID,
	TRANSACTION_TYPE_ID
} from './constants/vendor-types';

// Schema exports
export { createVendorLocalSchema } from './schemas/create-vendor.schema';
export type { CreateVendorLocalSchema } from './schemas/create-vendor.schema';

// Type exports
export type {
	LocalVendorItem,
	AddressLink,
	AddressItem,
	PartyDetail,
	PartyTypeItem,
	BankItem,
	OtherInfoItem,
	TaxRegistrationItem,
	TransactionTypeItem,
	CustomPropertyItem,
	CreateLocalVendorRequest,
	UpdateLocalVendorRequest,
	RegisterVendorRequest,
	ResendVendorRegistrationRequest,
	RegisterVendorResponse,
	VendorUser,
	LocalVendorListResponse,
	LocalVendorDetailResponse,
	LocalVendorAddressListResponse,
	LocalVendorPartyTypesResponse,
	LocalVendorBankListResponse,
	LocalVendorOtherInfoListResponse,
	LocalVendorTaxRegistrationListResponse,
	LocalVendorTransactionTypeListResponse,
	LocalVendorCustomPropertyListResponse,
	LocalVendorListParams,
	LocalVendorStats,
	LocalVendorStatsResponse,
	WebResponse,
	Paging
} from './types/vendor-local.types';

// Note: Components should be imported directly from their files:
// import ViewLocalVendors from '$lib/features/material-management/inventory/master/vendor/local/components/ViewLocalVendors.svelte';
// import DeleteLocalVendorDialog from '$lib/features/material-management/inventory/master/vendor/local/components/DeleteLocalVendorDialog.svelte';
