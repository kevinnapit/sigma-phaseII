import { z } from 'zod';
import { CreateKebangsaanRequestSchema } from '$lib/generated/administration_and_agronomy/schemas.gen';

export const nationalitySchema =
   CreateKebangsaanRequestSchema.extend({
      name: z.string().min(1, 'Nama kebangsaan wajib diisi'),
      country_id: z.string().min(1, 'Negara wajib diisi')
   });

export type nationalitySchema = z.infer<typeof nationalitySchema>;