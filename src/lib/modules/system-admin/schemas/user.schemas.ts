import { z } from 'zod';
import { CreateUserRequestSchema } from '$lib/generated/administration_and_agronomy/schemas.gen';

export const userSchema = CreateUserRequestSchema.extend({
   name: z.string().min(1, 'Nama pengguna wajib diisi'),
   role_id: z.string().min(1, 'Peran wajib diisi'),
   user_id: z.string().min(1, 'Id pengguna wajib diisi')
});

export type userSchema = z.infer<typeof userSchema>;

export const formFieldMap = {
   userId: 'user_id',
   name: 'name',
   roleId: 'role_id'
} as const satisfies Record<string, keyof userSchema>;