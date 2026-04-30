import { z } from 'zod/v4';

export function match(value: string) {
	return z.uuid().safeParse(value).success;
}
