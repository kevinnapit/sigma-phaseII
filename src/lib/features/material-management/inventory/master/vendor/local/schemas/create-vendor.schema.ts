import { z } from 'zod';

/**
 * Vendor local schemas with validation
 */

export const createVendorLocalSchema = z.object({
	code: z.literal(''),
	name: z
		.string()
		.min(1, 'Nama vendor wajib diisi')
		.refine((val) => val.trim() === val, {
			message: 'Nama vendor tidak boleh diawali atau diakhiri dengan spasi'
		})
		.refine((val) => !/\s{2,}/.test(val), {
			message: 'Nama vendor tidak boleh mengandung spasi berturut-turut'
		}),
	short_name: z
		.string()
		.min(1, 'Nama singkat wajib diisi')
		.refine((val) => val.trim() === val, {
			message: 'Nama singkat tidak boleh diawali atau diakhiri dengan spasi'
		})
		.refine((val) => !/\s{2,}/.test(val), {
			message: 'Nama singkat tidak boleh mengandung spasi berturut-turut'
		}),
	company_name: z
		.string()
		.min(1, 'Nama perusahaan wajib diisi')
		.refine((val) => val.trim() === val, {
			message: 'Nama perusahaan tidak boleh diawali atau diakhiri dengan spasi'
		})
		.refine((val) => !/\s{2,}/.test(val), {
			message: 'Nama perusahaan tidak boleh mengandung spasi berturut-turut'
		}),
	license_registration_number: z.string().optional(),
	notes: z.string().optional(),
	is_active: z.boolean().default(true),
	fk_party_default_category_id: z.string().min(1, 'Kategori standar wajib dipilih'),
	fk_default_account_id: z.string().min(1, 'Akun default wajib dipilih')
});

export type CreateVendorLocalSchema = z.infer<typeof createVendorLocalSchema>;

/**
 * Schema untuk validasi alamat vendor
 */
export const addressSchema = z.object({
	address: z.string().optional(),
	address_type: z.string().optional(),
	city: z.string().optional(),
	communication_type_ids: z.array(z.string()).optional(),
	contact_person: z.string().optional(),
	country_id: z.string().min(1, 'Negara wajib dipilih'),
	designation: z.string().optional(),
	email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
	email_alt: z.string().email('Format email alternatif tidak valid').optional().or(z.literal('')),
	fax: z.string().optional(),
	mobile: z.string().optional(),
	remarks: z.string().optional(),
	state: z.string().optional(),
	tel: z.string().optional(),
	url: z.string().optional(),
	zip: z.string().optional()
});

export type AddressSchema = z.infer<typeof addressSchema>;
