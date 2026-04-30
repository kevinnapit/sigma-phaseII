import { del, get, set } from 'idb-keyval';
import type { PersistedClient, Persister } from '@tanstack/svelte-query-persist-client';

export function createIDBPersister(idbValidKey: IDBValidKey = 'reactQuery') {
	return {
		persistClient: async (client: PersistedClient) => {
			await set(idbValidKey, client);
		},
		restoreClient: async () => {
			return await get<PersistedClient>(idbValidKey);
		},
		removeClient: async () => {
			await del(idbValidKey);
		}
	} as Persister;
}
