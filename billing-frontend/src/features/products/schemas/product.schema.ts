import { z } from "zod";

export const productSchema = z.object({
  barcode: z.string().optional(),

  name: z.string().min(1, "Product name is required"),

  categoryId: z.coerce.number().min(1, "Category is required"),

  brand: z.string().optional(),

  unit: z.string().min(1, "Unit is required"),

  purchasePrice: z.coerce.number(),

  retailPrice: z.coerce.number(),

  wholesalePrice: z.coerce.number().optional(),

  mrp: z.coerce.number().optional(),

  currentStock: z.coerce.number().min(0),

  notes: z.string().optional(),

  isActive: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;