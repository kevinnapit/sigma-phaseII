import { z } from 'zod';
import { CreateProjectRequestSchema } from '$lib/generated/administration_and_agronomy/schemas.gen';
import { isBefore, isBeforeToday } from '$lib/shared/utils/date-validation';

export const projectSchema =
   CreateProjectRequestSchema.extend({
      admin_unit_id: z.string().min(1, 'Admin unit wajib diisi'),
      code: z.string().min(1, 'Kode proyek wajib diisi'),
      name: z.string().min(1, 'Nama proyek wajib diisi'),
      project_type_id: z.string().min(1, 'Tipe proyek wajib diisi'),
      end_date: z.string().min(1, 'Tanggal akhir wajib diisi'),
      start_date: z.string().min(1, 'Tanggal mulai perusahaan wajib diisi'),
   })
      .superRefine((data, ctx) => {

         if (!data.start_date || !data.end_date) return;

         const start = new Date(data.start_date);
         const end = new Date(data.end_date);

         if (isBeforeToday(start)) {
            ctx.addIssue({
               code: z.ZodIssueCode.custom,
               message: 'Tanggal mulai tidak boleh sebelum hari ini',
               path: ['start_date']
            });
         }

         if (isBefore(end, start)) {
            ctx.addIssue({
               code: z.ZodIssueCode.custom,
               message: 'Tanggal berakhir tidak boleh mendahului tanggal mulai',
               path: ['end_date']
            });
         }
      });

export type projectSchema = z.infer<typeof projectSchema>;