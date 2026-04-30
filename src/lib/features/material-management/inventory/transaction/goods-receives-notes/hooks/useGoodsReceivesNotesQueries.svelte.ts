import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { goodsReceivesNotesApi } from '../api/goods-receives-notes.api';
import { goodsReceivesNotesKeys } from '../api/goods-receives-notes.keys';
import type {
	GRNListParams,
	ApprovedLPOListParams,
	GRNCreatePayload,
	LPOByQRParams,
	LPOItemByQRParams
} from '../types/goods-receives-notes.types';
/**
 * Hook untuk membaca summary statistik GRN
 */
export const useReadGRNSummary = () => {
	const userContext = getUserContext();

	return createQuery(() => ({
		queryKey: goodsReceivesNotesKeys.summary(),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return goodsReceivesNotesApi.getGRNSummary({
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		enabled: !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook untuk membaca semua GRNs dengan pagination dan search
 */
export const useReadAllGRNs = (params: () => GRNListParams, isEnabled?: () => boolean) => {
	const userContext = getUserContext();
	const currentParams = $derived(params());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: goodsReceivesNotesKeys.list(currentParams),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return goodsReceivesNotesApi.getAllGRNs(currentParams, context);
		},
		enabled: enabled && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook untuk membaca detail GRN by ID
 */
export const useReadGRNDetail = (id: () => string, isEnabled?: () => boolean) => {
	const userContext = getUserContext();
	const currentId = $derived(id());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: goodsReceivesNotesKeys.detail(currentId),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return goodsReceivesNotesApi.getGRNDetail(currentId, context);
		},
		enabled: enabled && !!currentId && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook untuk membaca daftar LPO yang sudah disetujui (untuk pembuatan GRN baru)
 */
export const useReadApprovedLPOs = (
	params: () => ApprovedLPOListParams,
	isEnabled?: () => boolean
) => {
	const userContext = getUserContext();
	const currentParams = $derived(params());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: goodsReceivesNotesKeys.approvedLpo(currentParams),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return goodsReceivesNotesApi.getApprovedLPOs(currentParams, context);
		},
		enabled: enabled && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook untuk membaca detail LPO yang sudah disetujui (untuk form create GRN)
 */
export const useReadApprovedLPODetail = (id: () => string, isEnabled?: () => boolean) => {
	const userContext = getUserContext();
	const currentId = $derived(id());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: goodsReceivesNotesKeys.approvedLpoDetail(currentId),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return goodsReceivesNotesApi.getApprovedLPODetail(currentId, context);
		},
		enabled: enabled && !!currentId && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook untuk membuat GRN baru
 */
export const useCreateGRN = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (payload: GRNCreatePayload) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return goodsReceivesNotesApi.createGRN(payload, context);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: goodsReceivesNotesKeys.all });
		}
	}));
};

/**
 * Hook untuk mengajukan GRN (DRAFT → PENDING_APPROVAL)
 */
export const useSubmitGRN = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (grnId: string) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			const context = {
				token: userContext.token,
				estateId: userContext.estate.id
			};
			return goodsReceivesNotesApi.submitGRN(grnId, context);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: goodsReceivesNotesKeys.all });
		}
	}));
};

/**
 * Hook untuk menyetujui GRN
 */
export const useApproveGRN = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: ({ approvalId, remarks }: { approvalId: string; remarks: string }) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return goodsReceivesNotesApi.approveGRN(approvalId, remarks, {
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: goodsReceivesNotesKeys.all });
		}
	}));
};

/**
 * Hook untuk menolak GRN
 */
export const useRejectGRN = () => {
	const userContext = getUserContext();
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: ({ approvalId, remarks }: { approvalId: string; remarks: string }) => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return goodsReceivesNotesApi.rejectGRN(approvalId, remarks, {
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: goodsReceivesNotesKeys.all });
		}
	}));
};

/**
 * Hook untuk membaca riwayat persetujuan GRN
 */
export const useReadGRNApprovalHistory = (approvalId: () => string | undefined) => {
	const userContext = getUserContext();
	const currentId = $derived(approvalId());

	return createQuery(() => ({
		queryKey: goodsReceivesNotesKeys.approvalHistory(currentId ?? ''),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return goodsReceivesNotesApi.getGRNApprovalHistory(currentId!, {
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		enabled: !!currentId && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook untuk cek material berdasarkan item code
 */
export const useCheckMaterial = (materialCode: () => string | undefined) => {
	const userContext = getUserContext();
	const currentCode = $derived(materialCode());

	return createQuery(() => ({
		queryKey: goodsReceivesNotesKeys.materialCheck(currentCode ?? ''),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return goodsReceivesNotesApi.checkMaterial(currentCode!, {
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		enabled: !!currentCode && !!userContext.token && !!userContext.estate?.id,
		staleTime: 0
	}));
};

/**
 * Hook untuk mendapatkan daftar docket (weighment) yang tersedia
 */
export const useReadAvailableDockets = (isEnabled?: () => boolean) => {
	const userContext = getUserContext();
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: goodsReceivesNotesKeys.availableDockets(),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return goodsReceivesNotesApi.getAvailableDockets({
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		enabled: enabled && !!userContext.token && !!userContext.estate?.id
	}));
};

/**
 * Hook untuk mendapatkan detail LPO berdasarkan hasil scan QR code.
 * QR format: "{lpo_number}-{supplier_code}-{supplier_name}"
 * Hanya aktif saat params tersedia (setelah scan berhasil).
 */
export const useGetLPOByQR = (params: () => LPOByQRParams | null) => {
	const userContext = getUserContext();
	const currentParams = $derived(params());

	return createQuery(() => ({
		queryKey: goodsReceivesNotesKeys.lpoByQr(currentParams?.lpo_number ?? ''),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return goodsReceivesNotesApi.getLPOByQR(currentParams!, {
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		enabled: !!currentParams && !!userContext.token && !!userContext.estate?.id,
		retry: false,
		staleTime: 0
	}));
};

/**
 * Hook untuk mendapatkan detail item LPO berdasarkan hasil scan QR code item.
 * Hanya aktif saat params tersedia (setelah scan berhasil).
 */
export const useGetLPOItemByQR = (params: () => LPOItemByQRParams | null) => {
	const userContext = getUserContext();
	const currentParams = $derived(params());

	return createQuery(() => ({
		queryKey: goodsReceivesNotesKeys.lpoItemByQr(
			currentParams?.lpo_number ?? '',
			currentParams?.item_code ?? ''
		),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return goodsReceivesNotesApi.getLPOItemByQR(currentParams!, {
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		enabled: !!currentParams && !!userContext.token && !!userContext.estate?.id,
		retry: false,
		staleTime: 0
	}));
};

/**
 * Hook untuk mendapatkan daftar item storage layouts (untuk pilihan item_storage_dtl_id).
 * Hanya aktif saat isEnabled true.
 */
export const useReadItemStorageLayouts = (search: () => string, isEnabled?: () => boolean) => {
	const userContext = getUserContext();
	const currentSearch = $derived(search());
	const enabled = $derived(isEnabled ? isEnabled() : true);

	return createQuery(() => ({
		queryKey: goodsReceivesNotesKeys.itemStorageLayouts(currentSearch),
		queryFn: () => {
			if (!userContext.token || !userContext.estate?.id) {
				throw new Error('No authentication token or estate selection available');
			}
			return goodsReceivesNotesApi.getItemStorageLayouts(currentSearch || undefined, {
				token: userContext.token,
				estateId: userContext.estate.id
			});
		},
		enabled: enabled && !!userContext.token && !!userContext.estate?.id,
		staleTime: 30_000
	}));
};
