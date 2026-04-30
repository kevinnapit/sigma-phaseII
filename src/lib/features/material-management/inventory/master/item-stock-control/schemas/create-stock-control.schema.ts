import { z } from 'zod';

export const createStockControlSchema = z.object({
	item_id: z.string().min(1, 'Barang wajib dipilih'),
	proposed_min_stock: z
		.string()
		.min(1, 'Nilai stok minimum wajib diisi')
		.refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
			message: 'Nilai stok minimum harus berupa angka positif'
		}),
	fk_master_value_valuation_type_id: z.string().min(1, 'Tipe penilaian wajib dipilih'),
	fk_master_value_frequency_of_valuation_id: z.string().min(1, 'Frekuensi penilaian wajib dipilih')
});

export type CreateStockControlFormInput = z.infer<typeof createStockControlSchema>;
