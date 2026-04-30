import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { localPurchaseOrderApi } from '../api/local-purchase-order.api';
import { localPurchaseOrderKeys } from '../api/local-purchase-order.keys';
import type {
	LPOWinnerVendorParams,
	LPOListParams,
	LPOCreateParams,
	ROCreateParams,
	LPOCancelParams,
	LPOUpdateParams
} from '../types/local-purchase-order.types';

export const useReadWinnerVendors = (params: () => LPOWinnerVendorParams) => {
	const userContext = getUserContext();
	const currentParams = $derived(params());

	return createQuery(() => ({
		queryKey: localPurchaseOrderKeys.winnerVendors(currentParams),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return localPurchaseOrderApi.getWinnerVendors(currentParams, {
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		enabled: !!userContext.token && !!userContext.estate?.id
	}));
};

export const useReadAllLPOs = (params: () => LPOListParams) => {
	const userContext = getUserContext();
	const currentParams = $derived(params());

	return createQuery(() => ({
		queryKey: localPurchaseOrderKeys.list(currentParams),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return localPurchaseOrderApi.getAllLPOs(currentParams, {
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		enabled: !!userContext.token && !!userContext.estate?.id
	}));
};

export const useReadLPOSummary = () => {
	const userContext = getUserContext();

	return createQuery(() => ({
		queryKey: localPurchaseOrderKeys.summary(),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return localPurchaseOrderApi.getSummary({
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		enabled: !!userContext.token && !!userContext.estate?.id
	}));
};

export const useReadLPODetail = (id: () => string) => {
	const userContext = getUserContext();
	const currentId = $derived(id());

	return createQuery(() => ({
		queryKey: localPurchaseOrderKeys.detail(currentId),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return localPurchaseOrderApi.getLPODetail(currentId, {
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		enabled: !!currentId && !!userContext.token && !!userContext.estate?.id
	}));
};

export const useCreateLPO = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (params: LPOCreateParams) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return localPurchaseOrderApi.createLPO(params, {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: localPurchaseOrderKeys.all });
		}
	}));
};

export const useSubmitLPO = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (lpoId: string) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return localPurchaseOrderApi.submitLPO(lpoId, {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: localPurchaseOrderKeys.all });
		}
	}));
};

export const useApproveLPO = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: ({ approvalId, remarks }: { approvalId: string; remarks: string }) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return localPurchaseOrderApi.approveLPO(approvalId, remarks, {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: localPurchaseOrderKeys.all });
		}
	}));
};

export const useRejectLPO = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: ({ approvalId, remarks }: { approvalId: string; remarks: string }) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return localPurchaseOrderApi.rejectLPO(approvalId, remarks, {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: localPurchaseOrderKeys.all });
		}
	}));
};

export const useReadLPOApprovalHistory = (approvalId: () => string | undefined) => {
	const userContext = getUserContext();
	const currentId = $derived(approvalId());

	return createQuery(() => ({
		queryKey: localPurchaseOrderKeys.approvalHistory(currentId ?? ''),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return localPurchaseOrderApi.getApprovalHistory(currentId!, {
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		enabled: !!currentId && !!userContext.token && !!userContext.estate?.id
	}));
};

export const useSendPO = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: ({ lpoId, customMessage }: { lpoId: string; customMessage: string }) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return localPurchaseOrderApi.sendPO(lpoId, customMessage, {
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: localPurchaseOrderKeys.all });
		}
	}));
};

export const useCreateRepeatOrder = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (params: ROCreateParams) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return localPurchaseOrderApi.createRepeatOrder(params, {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: localPurchaseOrderKeys.all });
		}
	}));
};

export const useCancelLPO = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: ({ lpoId, params }: { lpoId: string; params: LPOCancelParams }) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return localPurchaseOrderApi.cancelLPO(lpoId, params, {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: localPurchaseOrderKeys.all });
		}
	}));
};

export const useUpdateLPO = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: ({ lpoId, params }: { lpoId: string; params: LPOUpdateParams }) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return localPurchaseOrderApi.updateLPO(lpoId, params, {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: localPurchaseOrderKeys.all });
		}
	}));
};

export const useResubmitLPO = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (lpoId: string) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return localPurchaseOrderApi.resubmitLPO(lpoId, {
				token: userContext.token,
				estateId: userContext.estate.id,
				contextId: 'c8382058-5ad3-415c-8b23-1930396c4ac4'
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: localPurchaseOrderKeys.all });
		}
	}));
};

export const useReadActivityLogs = (lpoId: () => string) => {
	const userContext = getUserContext();
	const currentId = $derived(lpoId());

	return createQuery(() => ({
		queryKey: localPurchaseOrderKeys.activityLogs(currentId),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return localPurchaseOrderApi.getActivityLogs(currentId, {
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		enabled: !!currentId && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook untuk membaca tracking history LPO by ID
 */
export const useReadLPOTrackingHistory = (lpoId: () => string, isEnabled?: () => boolean) => {
	const userContext = getUserContext();
	const currentId = $derived(lpoId());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: localPurchaseOrderKeys.tracking(currentId),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return localPurchaseOrderApi.getTrackingHistory(currentId, {
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		enabled: enabled && !!currentId && !!userContext.token && !!userContext.estate?.id
	}));
};
