import { z } from 'zod';
import { CreateCropRequestSchema } from '$lib/generated/administration_and_agronomy/schemas.gen';

export const cropSchema =
   CreateCropRequestSchema.extend({
      code: z.number().min(1, 'Kode panenan wajib diisi'),
      value: z.string().min(1, 'Nama panenan wajib diisi'),
   });

export type cropSchema = z.infer<typeof cropSchema>;