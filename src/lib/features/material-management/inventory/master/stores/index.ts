/**
 *
 * Exports all store-related functionality
 */

// API exports
export { storeApi } from './api/store.api';
export { storesKeys } from './api/stores.keys';

// Hook exports - Queries
export {
	useReadAllStores,
	useReadDetailStore,
	useReadStoreStats
} from './hooks/useStoresQueries.svelte';
export { useStoreDivisionListQuery } from './hooks/useDetailedStoresQueries.svelte';
export type { StoreDivisionListParams } from './hooks/useDetailedStoresQueries.svelte';

// Hook exports - Mutations
export { useCreateStore, useUpdateStore, useDeleteStore } from './hooks/useStoresMutations.svelte';

// Schema exports
export {
	createStoreSchema,
	updateStoreSchema,
	storeListParamsSchema,
	type CreateStoreSchema,
	type UpdateStoreSchema,
	type StoreListParamsSchema
} from './schemas/create-store.schema';

// Type exports
export type {
	StoreItem,
	StoreData,
	AdministrativeUnit,
	StoreType,
	CreateStoreRequest,
	UpdateStoreRequest,
	StoreListResponse,
	StoreDetailResponse,
	StoreStatsResponse,
	StoreSummary,
	StoreTypeCount,
	StoreListParams,
	WebResponse,
	Paging
} from './types/store.types';

// Note: Components should be imported directly from their files:
// import ViewStores from '$lib/features/material-managements/inventory/master/stores/components/ViewStores.svelte';
// import StoreStats from '$lib/features/material-managements/inventory/master/stores/components/StoreStats.svelte';
// import CreateStoreForm from '$lib/features/material-managements/inventory/master/stores/components/CreateStoreForm.svelte';
// import EditStoreForm from '$lib/features/material-managements/inventory/master/stores/components/EditStoreForm.svelte';
// import EditStoreInfoCard from '$lib/features/material-managements/inventory/master/stores/components/EditStoreInfoCard.svelte';
// import ParentStoreInfoCard from '$lib/features/material-managements/inventory/master/stores/components/ParentStoreInfoCard.svelte';
// import DeleteStoreDialog from '$lib/features/material-managements/inventory/master/stores/components/DeleteStoreDialog.svelte';
// import InfoFormSection from '$lib/features/material-managements/inventory/master/stores/components/form-sections/InfoFormSection.svelte';
