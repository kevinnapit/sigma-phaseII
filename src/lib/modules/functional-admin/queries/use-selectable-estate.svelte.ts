import { getUserContext } from '$lib/modules/auth/context/user.svelte';
import { createQuery } from '@tanstack/svelte-query';

export const useSelectableEstate = (props: () => boolean) => {
	const userCtx = getUserContext();
	return createQuery(() => {
		return {
			queryKey: ['selectable-estates'],
			queryFn: async () => {
				const { data } = await userCtx.authClient().GET('/api/auth/selectable-estates');
				return data?.data ?? ([] as AuthSchemas['SelectableEstateAndCommodity'][]);
			},
			enabled: props(),
			staleTime: 10 * 60 * 1000, // 10 min
			placeholderData: (previousData) => previousData ?? []
		};
	});
};
