"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { productSchema, ProductFormValues } from "../schemas/product.schema";
import ProductInfoSection from "../sections/ProductInfoSection";
import PricingSection from "../sections/PricingSection";
import InventorySection from "../sections/InventorySection";
import NotesSection from "../sections/NotesSection";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { useEffect } from "react";
import { Product } from "../types/product";

type ProductFormProps = {
  mode: "create" | "edit";
  product: Product | null;
};

export default function ProductForm({
  mode,
  product,
}: ProductFormProps) {

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
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
  useEffect(() => {
  if (mode === "edit" && product) {
    form.reset({
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
    });
  }

  if (mode === "create") {
    form.reset({
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
    });
  }
}, [mode, product, form]);
  const createProductMutation = useCreateProduct();

  const onSubmit = async (data: ProductFormValues) => {
    try {
      await createProductMutation.mutateAsync(data);

      console.log("Product created successfully");

      form.reset();
    } catch (error) {
      console.error(error);
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
  {mode === "create"
    ? "Save Product"
    : "Update Product"}
</button>
      </div>
    </form>
  );
}
