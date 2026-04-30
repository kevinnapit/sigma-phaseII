import { z } from 'zod';
import { CreateRoleRequestSchema } from '$lib/generated/administration_and_agronomy/schemas.gen';

export const roleSchema = CreateRoleRequestSchema.extend({
   name: z
      .string()
      .min(3, 'Nama peran minimal 3 karakter')
      .min(1, 'Nama peran wajib diisi'),
   description: z.string().optional(),
   parent_id: z.number().optional()
});


export type roleSchema = z.infer<typeof roleSchema>;