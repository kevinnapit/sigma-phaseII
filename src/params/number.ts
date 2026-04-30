import { z } from 'zod/v4';

export function match(value: string) {
	return z.coerce.number().min(1).safeParse(value).success;
}
