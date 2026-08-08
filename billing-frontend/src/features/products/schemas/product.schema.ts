import { z } from "zod";

export const productSchema = z.object({
  barcode: z.string().optional(),

  name: z.string().min(1, "Product name is required"),

  categoryId: z.coerce.number().optional(),

  brand: z.string().optional(),

  unit: z.string().optional(),

  retailPrice: z.coerce.number().min(0),

  wholesalePrice: z.coerce.number().optional(),

  mrp: z.coerce.number().optional(),

  currentStock: z.coerce.number().min(0),

  notes: z.string().optional(),

  isActive: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
