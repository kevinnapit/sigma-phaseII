import { z } from 'zod';
import { CreateCompanyRequestSchema } from '$lib/generated/administration_and_agronomy/schemas.gen';

export const companySchema =
   CreateCompanyRequestSchema.extend({
      code: z.string().min(1, 'Kode perusahaan wajib diisi'),
      name: z.string().min(1, 'Nama perusahaan wajib diisi'),
   });

export type companySchema = z.infer<typeof companySchema>;