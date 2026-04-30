// See https://svelte.dev/docs/kit/types#app.d.ts

import type { components as team2Components } from '$lib/generated/administration_and_agronomy/openapi.gen';
import type { components as authComponents } from '$lib/generated/auth/openapi.gen';
import type { components as notificationComponents } from '$lib/generated/notification/openapi.gen';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	type Prettify<T> = {
		[K in keyof T]: T[K];
	} & {};
	type CleanUp<T> = { [K in keyof T]: Prettify<Omit<T[K], '$schema'>> };
	export type Schemas = Prettify<CleanUp<team2Components['schemas']>>;
	export type AuthSchemas = Prettify<CleanUp<authComponents['schemas']>>;
	export type NotificationSchemas = Prettify<CleanUp<notificationComponents['schemas']>>;
	export type Accessor<T> = () => T;
	export type MaybeGetter<T> = T | (() => T);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export type NoGetter<T> = T extends () => any ? never : T;
	export type MaybePromise<T> = T | Promise<T>;
	export type ValidUser = Prettify<
		Required<{
			[K in keyof AuthSchemas['User']]: NonNullable<AuthSchemas['User'][K]>;
		}>
	>;
}

export {};
