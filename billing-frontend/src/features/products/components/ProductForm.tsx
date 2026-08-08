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
            barcode: product.barcode,
            name: product.name,
            categoryId: product.categoryId,
            brand: product.brand ?? "",
            unit: product.unit,
            purchasePrice: Number(product.purchasePrice),
            retailPrice: Number(product.retailPrice),
            wholesalePrice: Number(product.wholesalePrice),
            mrp: Number(product.mrp),
            currentStock: product.currentStock,
            notes: product.notes ?? "",
            isActive: product.isActive,
          }
        : {
            barcode: "",
            name: "",
            categoryId: 0,
            brand: "",
            unit: "",
            purchasePrice: 0,
            retailPrice: 0,
            wholesalePrice: 0,
            mrp: 0,
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

      <InventorySection form={form} />

      <NotesSection form={form} />

      <div className="flex justify-end gap-3">
        <button type="button">Cancel</button>

        <button type="submit">
          {mode === "create" ? "Save Product" : "Update Product"}
        </button>
      </div>
    </form>
  );
}
