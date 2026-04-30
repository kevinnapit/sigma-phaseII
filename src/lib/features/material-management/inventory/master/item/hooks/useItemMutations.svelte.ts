import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { itemApi } from '../api/item.api';
import { itemKeys } from '../api/item.keys';

/**
 * Mutation for creating item manufacture
 */
export const useCreateItemManufacture = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: async ({
			itemId,
			data
		}: {
			itemId: string;
			data: { name: string; reference_code: string };
		}) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return itemApi.createItemManufacture(itemId, data, context);
		},
		onSuccess: (_, variables) => {
			// Invalidate manufactures query for this item
			queryClient.invalidateQueries({ queryKey: itemKeys.manufactures(variables.itemId) });
		}
	}));
};

/**
 * Mutation for updating item manufacture
 */
export const useUpdateItemManufacture = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: async ({
			itemId,
			manufactureId,
			data
		}: {
			itemId: string;
			manufactureId: string;
			data: { name: string; reference_code: string; i_version: number };
		}) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return itemApi.updateItemManufacture(itemId, manufactureId, data, context);
		},
		onSuccess: (_, variables) => {
			// Invalidate manufactures query for this item
			queryClient.invalidateQueries({ queryKey: itemKeys.manufactures(variables.itemId) });
		}
	}));
};

/**
 * Mutation for deleting item manufacture
 */
export const useDeleteItemManufacture = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: async ({ itemId, manufactureId }: { itemId: string; manufactureId: string }) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return itemApi.deleteItemManufacture(itemId, manufactureId, context);
		},
		onSuccess: (_, variables) => {
			// Invalidate manufactures query for this item
			queryClient.invalidateQueries({ queryKey: itemKeys.manufactures(variables.itemId) });
		}
	}));
};

/**
 * Mutation for creating item UOM link
 */
export const useCreateItemUOMLink = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: async ({
			itemId,
			data
		}: {
			itemId: string;
			data: import('../types/item.types').ItemUOMLinkCreateRequest;
		}) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return itemApi.createItemUOMLink(itemId, data, context);
		},
		onSuccess: (_, variables) => {
			// Invalidate UOM links query for this item
			queryClient.invalidateQueries({ queryKey: itemKeys.uomLinks(variables.itemId) });
		}
	}));
};

/**
 * Mutation for updating item UOM link
 */
export const useUpdateItemUOMLink = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: async ({
			itemId,
			linkId,
			data
		}: {
			itemId: string;
			linkId: string;
			data: {
				fk_master_value_stores_movement_type_id: string;
				fk_uom_hdrid: string;
				i_version: number;
			};
		}) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return itemApi.updateItemUOMLink(itemId, linkId, data, context);
		},
		onSuccess: (_, variables) => {
			// Invalidate UOM links query for this item
			queryClient.invalidateQueries({ queryKey: itemKeys.uomLinks(variables.itemId) });
		}
	}));
};

/**
 * Mutation for deleting item UOM link
 */
export const useDeleteItemUOMLink = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: async ({ itemId, linkId }: { itemId: string; linkId: string }) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return itemApi.deleteItemUOMLink(itemId, linkId, context);
		},
		onSuccess: (_, variables) => {
			// Invalidate UOM links query for this item
			queryClient.invalidateQueries({ queryKey: itemKeys.uomLinks(variables.itemId) });
		}
	}));
};

/**
 * Mutation for creating item usage
 */
export const useCreateItemUsage = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: async ({
			itemId,
			data
		}: {
			itemId: string;
			data: import('../types/item.types').ItemUsageCreateRequest;
		}) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return itemApi.createItemUsage(itemId, data, context);
		},
		onSuccess: (_, variables) => {
			// Invalidate usages query for this item
			queryClient.invalidateQueries({ queryKey: itemKeys.usages(variables.itemId) });
		}
	}));
};

/**
 * Mutation for deleting item usage
 */
export const useDeleteItemUsage = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: async ({ itemId, usageId }: { itemId: string; usageId: string }) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return itemApi.deleteItemUsage(itemId, usageId, context);
		},
		onSuccess: (_, variables) => {
			// Invalidate usages query for this item
			queryClient.invalidateQueries({ queryKey: itemKeys.usages(variables.itemId) });
		}
	}));
};

/**
 * Mutation for creating item stock record
 */
export const useCreateItemStockRecord = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: async ({
			itemId,
			data
		}: {
			itemId: string;
			data: import('../types/item.types').ItemStoreCreateRequest;
		}) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return itemApi.createItemStockRecord(itemId, data, context);
		},
		onSuccess: (_, variables) => {
			// Invalidate stock records query for this item
			queryClient.invalidateQueries({ queryKey: itemKeys.stockRecords(variables.itemId) });
		}
	}));
};

/**
 * Mutation for updating item stock record
 */
export const useUpdateItemStockRecord = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: async ({
			itemId,
			stockId,
			data
		}: {
			itemId: string;
			stockId: string;
			data: import('../types/item.types').ItemStoreUpdateRequest;
		}) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return itemApi.updateItemStockRecord(itemId, stockId, data, context);
		},
		onSuccess: (_, variables) => {
			// Invalidate stock records query for this item
			queryClient.invalidateQueries({ queryKey: itemKeys.stockRecords(variables.itemId) });
		}
	}));
};

/**
 * Mutation for deleting item stock record
 */
export const useDeleteItemStockRecord = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: async ({ itemId, stockId }: { itemId: string; stockId: string }) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return itemApi.deleteItemStockRecord(itemId, stockId, context);
		},
		onSuccess: (_, variables) => {
			// Invalidate stock records query for this item
			queryClient.invalidateQueries({ queryKey: itemKeys.stockRecords(variables.itemId) });
		}
	}));
};

/**
 * Mutation for creating item VRL
 */
export const useCreateItemVRL = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: async ({
			itemId,
			data
		}: {
			itemId: string;
			data: import('../types/item.types').ItemVRLCreateRequest;
		}) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return itemApi.createItemVRL(itemId, data, context);
		},
		onSuccess: (_, variables) => {
			// Invalidate VRL detail query for this item
			queryClient.invalidateQueries({ queryKey: itemKeys.vrlDetail(variables.itemId) });
			queryClient.invalidateQueries({ queryKey: itemKeys.detail(variables.itemId) });
		}
	}));
};

/**
 * Mutation for updating item VRL
 */
export const useUpdateItemVRL = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: async ({
			itemId,
			data
		}: {
			itemId: string;
			data: import('../types/item.types').ItemVRLUpdateRequest;
		}) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return itemApi.updateItemVRL(itemId, data, context);
		},
		onSuccess: (_, variables) => {
			// Invalidate VRL detail query for this item
			queryClient.invalidateQueries({ queryKey: itemKeys.vrlDetail(variables.itemId) });
			queryClient.invalidateQueries({ queryKey: itemKeys.detail(variables.itemId) });
		}
	}));
};

/**
 * Mutation for deleting item VRL
 */
export const useDeleteItemVRL = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: async ({ itemId, i_version }: { itemId: string; i_version: number }) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return itemApi.deleteItemVRL(itemId, i_version, context);
		},
		onSuccess: (_, variables) => {
			// Invalidate VRL detail query for this item
			queryClient.invalidateQueries({ queryKey: itemKeys.vrlDetail(variables.itemId) });
			queryClient.invalidateQueries({ queryKey: itemKeys.detail(variables.itemId) });
		}
	}));
};

/**
 * Mutation for creating item conversion
 */
export const useCreateItemConversion = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: async ({
			itemId,
			data
		}: {
			itemId: string;
			data: import('../types/item.types').ItemConversionCreateRequest;
		}) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return itemApi.createItemConversion(itemId, data, context);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: itemKeys.conversions(variables.itemId) });
			queryClient.invalidateQueries({ queryKey: itemKeys.detail(variables.itemId) });
		}
	}));
};

/**
 * Mutation for updating item conversion
 */
export const useUpdateItemConversion = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: async ({
			itemId,
			conversionId,
			data
		}: {
			itemId: string;
			conversionId: string;
			data: import('../types/item.types').ItemConversionUpdateRequest;
		}) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return itemApi.updateItemConversion(itemId, conversionId, data, context);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: itemKeys.conversions(variables.itemId) });
			queryClient.invalidateQueries({ queryKey: itemKeys.detail(variables.itemId) });
		}
	}));
};

/**
 * Mutation for deleting item conversion
 */
export const useDeleteItemConversion = () => {
	const queryClient = useQueryClient();
	const userContext = getUserContext();

	return createMutation(() => ({
		mutationFn: async ({ itemId, conversionId }: { itemId: string; conversionId: string }) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			};
			return itemApi.deleteItemConversion(itemId, conversionId, context);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: itemKeys.conversions(variables.itemId) });
			queryClient.invalidateQueries({ queryKey: itemKeys.detail(variables.itemId) });
		}
	}));
};
