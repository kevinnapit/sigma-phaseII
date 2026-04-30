import { z } from 'zod';
import { CreateGroupRequestSchema } from '$lib/generated/administration_and_agronomy/schemas.gen';

export const groupSchema =
   CreateGroupRequestSchema.extend({
      code: z.string().min(1, 'Kode grup wajib diisi'),
      name: z.string().min(1, 'Nama grup wajib diisi'),
      company_id: z.string().min(1, 'Perushaan wajib diisi')
   });

export type groupSchema = z.infer<typeof groupSchema>;