import { z } from 'zod';

/**
 * Purchase Request schemas with validation
 */

// Schema untuk item detail
export const purchaseRequestItemSchema = z
	.object({
		// Required fields
		quantity: z.number().min(0.0001, 'Jumlah wajib diisi dan harus lebih dari 0'),
		uom_id: z.string().min(1, 'Satuan wajib dipilih'),
		uom: z.string().min(1, 'Satuan wajib dipilih'),
		uom_name: z.string().min(1, 'Satuan wajib dipilih'),
		procurement_source: z.enum(['cousin_garden', 'local_purchase', 'head_office'], {
			message: 'Sumber pengadaan wajib dipilih'
		}),
		procurement_source_id: z.string().min(1, 'Sumber pengadaan wajib dipilih'),
		justification: z
			.string()
			.min(1, 'Tujuan Penggunaan wajib diisi')
			.refine((val) => val.trim() === val, {
				message: 'Tujuan Penggunaan tidak boleh diawali atau diakhiri dengan spasi'
			})
			.refine((val) => !/\s{2,}/.test(val), {
				message: 'Tujuan Penggunaan tidak boleh mengandung spasi berturut-turut'
			}),

		// Optional fields
		delivery_date: z.string().optional(),
		is_urgent: z.boolean().default(false),

		// Cousin garden fields
		cousin_garden_code: z.string().optional(),
		estate_id: z.string().optional(),

		// Head office fields
		purchasing_group_id: z.string().optional(),

		// Other fields
		item_id: z.string(),
		item_code: z.string(),
		item_name: z.string(),
		estimated_price: z.number().optional(),
		cousin_garden_name: z.string().optional(),
		cousin_garden_price: z.number().optional(),
		purchasing_group_name: z.string().optional(),
		ho_last_price: z.number().optional(),
		lpo_last_price: z.number().optional()
	})
	.superRefine((data, ctx) => {
		// Validate cousin garden selection
		if (data.procurement_source === 'cousin_garden' && !data.cousin_garden_code) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Kebun sepupu wajib dipilih',
				path: ['cousin_garden_code']
			});
		}

		// Validate head office department
		if (data.procurement_source === 'head_office' && !data.purchasing_group_id) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Departemen tujuan wajib dipilih',
				path: ['purchasing_group_id']
			});
		}

		// Note: Local purchase that needs approval will also require purchasing_group_id
		// This is validated in the component based on procurement source status
	});

// Schema untuk form data
export const purchaseRequestFormSchema = z.object({
	warehouse_id: z.string().optional(),
	warehouse_name: z.string().optional(),
	reference_number: z.string().optional(),
	target_date: z.string().optional(),
	staff_name: z
		.string()
		.min(1, 'Staff peminta wajib diisi')
		.refine((val) => val.trim() === val, {
			message: 'Staff peminta tidak boleh diawali atau diakhiri dengan spasi'
		})
		.refine((val) => !/\s{2,}/.test(val), {
			message: 'Staff peminta tidak boleh mengandung spasi berturut-turut'
		})
});

// Schema untuk preview data (form + items)
export const purchaseRequestPreviewSchema = z.object({
	warehouse_id: z.string().optional(),
	warehouse_name: z.string().optional(),
	reference_number: z.string().optional(),
	target_date: z.string().optional(),
	remarks: z.string().optional(),
	staff_name: z
		.string()
		.min(1, 'Staff peminta wajib diisi')
		.refine((val) => val.trim() === val, {
			message: 'Staff peminta tidak boleh diawali atau diakhiri dengan spasi'
		})
		.refine((val) => !/\s{2,}/.test(val), {
			message: 'Staff peminta tidak boleh mengandung spasi berturut-turut'
		}),
	items: z.array(purchaseRequestItemSchema).min(1, 'Minimal 1 item harus ditambahkan'),
	request_id: z.string().optional(),
	i_version: z.number().optional()
});

export type PurchaseRequestItemSchema = z.infer<typeof purchaseRequestItemSchema>;
export type PurchaseRequestFormSchema = z.infer<typeof purchaseRequestFormSchema>;
export type PurchaseRequestPreviewSchema = z.infer<typeof purchaseRequestPreviewSchema>;
