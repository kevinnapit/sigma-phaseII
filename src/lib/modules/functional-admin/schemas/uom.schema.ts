import { z } from 'zod';
import { CreateUOMBodySchema } from '$lib/generated/administration_and_agronomy/schemas.gen';

export const uomSchema =
   CreateUOMBodySchema.extend({
      code: z.string().min(1, 'Kode satuan ukuran wajib diisi'),
      name: z.string().min(1, 'Nama satuan ukuran wajib diisi'),
   });

export type uomSchema = z.infer<typeof uomSchema>;