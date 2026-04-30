import { LoginRequestSchema } from '$lib/generated/auth/schemas.gen';
import { extendSchemaShape } from '$lib/shared/utils/extend-schema-shape';
import z from 'zod';

const SOCFIN_ID_PREFIX = 'socfin-id\\';

export const loginSchema = extendSchemaShape(LoginRequestSchema, (shape) => ({
	...shape,
	user_id: shape.user_id
		.trim()
		.min(1, 'username diperlukan')
		.transform((value) =>
			value.startsWith(SOCFIN_ID_PREFIX) ? value : `${SOCFIN_ID_PREFIX}${value}`
		),
	password: z.string().trim().min(1, 'Kata sandi diperlukan').min(3, 'Kata sandi tidak valid')
}));

export type LoginSchema = z.infer<typeof loginSchema>;
