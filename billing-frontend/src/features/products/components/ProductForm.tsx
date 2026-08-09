"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { productSchema, ProductFormValues } from "../schemas/product.schema";
import ProductInfoSection from "../sections/ProductInfoSection";
import PricingSection from "../sections/PricingSection";
import InventorySection from "../sections/InventorySection";
import NotesSection from "../sections/NotesSection";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { Product } from "../types/product";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { X, Save } from "lucide-react";

type ProductFormProps = {
  mode: "create" | "edit";
  product: Product | null;
};

export default function ProductForm({ mode, product }: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),

    defaultValues:
      mode === "edit" && product
        ? {
            barcode: product.barcode ?? "",
            name: product.name,
            categoryId: product.categoryId ?? undefined,
            brand: product.brand ?? "",
            unit: product.unit ?? "",
            retailPrice: Number(product.retailPrice),
            wholesalePrice:
              product.wholesalePrice != null
                ? Number(product.wholesalePrice)
                : undefined,
            mrp: product.mrp != null ? Number(product.mrp) : undefined,
            currentStock: product.currentStock,
            notes: product.notes ?? "",
            isActive: product.isActive,
          }
        : {
            barcode: "",
            name: "",
            categoryId: undefined,
            brand: "",
            unit: "",
            retailPrice: 0,
            wholesalePrice: undefined,
            mrp: undefined,
            currentStock: 0,
            notes: "",
            isActive: true,
          },
  });
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  const onSubmit = async (data: ProductFormValues) => {
    try {
      if (mode === "create") {
        await createProductMutation.mutateAsync(data);

        toast.success("Product created successfully");
      } else {
        if (!product) return;

        await updateProductMutation.mutateAsync({
          id: product.id,
          data,
        });

        toast.success("Product updated successfully");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <ProductInfoSection form={form} />

      <PricingSection form={form} />

      {/* <InventorySection form={form} /> */}

      {/* <NotesSection form={form} /> */}

      <div className="sticky bottom-0 z-10 flex justify-end gap-2 border-t bg-background py-4">
        <Button type="button" variant="outline" className="gap-2">
          <X className="h-4 w-4" />
          Cancel
        </Button>

        <Button type="submit" className="gap-2">
          <Save className="h-4 w-4" />

          {mode === "create" ? "Save Product" : "Update Product"}
        </Button>
      </div>
    </form>
  );
}
