import { z } from 'zod';

/**
 * store schemas with validation
 */

export const createStoreSchema = z.object({
	administrative_unit_id: z.string().min(1, 'Unit administrasi wajib dipilih'),
	code: z
		.string()
		.min(1, 'Kode gudang wajib diisi')
		.refine((val) => !/\s/.test(val), {
			message: 'Kode gudang tidak boleh mengandung spasi'
		}),
	is_active: z.boolean().default(true),
	name: z
		.string()
		.min(1, 'Nama gudang wajib diisi')
		.refine((val) => val.trim() === val, {
			message: 'Nama gudang tidak boleh diawali atau diakhiri dengan spasi'
		})
		.refine((val) => !/\s{2,}/.test(val), {
			message: 'Nama gudang tidak boleh mengandung spasi berturut-turut'
		}),
	parent_store_id: z.string().optional(),
	store_type_id: z.string().min(1, 'Tipe gudang wajib dipilih')
});

export const updateStoreSchema = z.object({
	administrative_unit_id: z.string().min(1, 'Unit administrasi wajib dipilih'),
	code: z
		.string()
		.min(1, 'Kode gudang wajib diisi')
		.refine((val) => !/\s/.test(val), {
			message: 'Kode gudang tidak boleh mengandung spasi'
		}),
	i_version: z.number().min(0, 'Versi tidak valid'),
	is_active: z.boolean(),
	name: z
		.string()
		.min(1, 'Nama gudang wajib diisi')
		.refine((val) => val.trim() === val, {
			message: 'Nama gudang tidak boleh diawali atau diakhiri dengan spasi'
		})
		.refine((val) => !/\s{2,}/.test(val), {
			message: 'Nama gudang tidak boleh mengandung spasi berturut-turut'
		}),
	parent_store_id: z.string().optional(),
	store_type_id: z.string().min(1, 'Tipe gudang wajib dipilih')
});

export const storeListParamsSchema = z.object({
	page: z.number().min(1).default(1),
	size: z.number().min(1).max(100).default(10),
	search: z.string().optional(),
	parent_store_id: z.string().optional()
});

export type CreateStoreSchema = z.infer<typeof createStoreSchema>;
export type UpdateStoreSchema = z.infer<typeof updateStoreSchema>;
export type StoreListParamsSchema = z.infer<typeof storeListParamsSchema>;
