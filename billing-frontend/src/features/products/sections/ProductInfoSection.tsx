"use client";

import { Controller, UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";

import { useCategories } from "@/features/categories/hooks/useCategories";
import { ProductFormValues } from "../schemas/product.schema";

type ProductInfoSectionProps = {
  form: UseFormReturn<ProductFormValues>;
};

export default function ProductInfoSection({ form }: ProductInfoSectionProps) {
  const { data: categories = [] } = useCategories();

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Product Information</h3>

        <Separator className="mt-2" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Barcode */}

        <div className="space-y-2">
          <Label htmlFor="barcode">Barcode</Label>

          <Input
            id="barcode"
            placeholder="P000001"
            {...form.register("barcode")}
          />

          {form.formState.errors.barcode && (
            <p className="text-sm text-destructive">
              {form.formState.errors.barcode.message}
            </p>
          )}
        </div>

        {/* Product Name */}

        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>

          <Input id="name" placeholder="Rice 5kg" {...form.register("name")} />

          {form.formState.errors.name && (
            <p className="text-sm text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        {/* Category */}

        <div className="space-y-2">
          <Label>Category</Label>

          <Controller
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <Select
                value={field.value.toString()}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {form.formState.errors.categoryId && (
            <p className="text-sm text-destructive">
              {form.formState.errors.categoryId.message}
            </p>
          )}
        </div>

        {/* Brand */}

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>

          <Input
            id="brand"
            placeholder="India Gate"
            {...form.register("brand")}
          />
        </div>

        {/* Unit */}

        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>

          <Input id="unit" placeholder="KG" {...form.register("unit")} />

          {form.formState.errors.unit && (
            <p className="text-sm text-destructive">
              {form.formState.errors.unit.message}
            </p>
          )}
        </div>

        {/* Status */}

        <div className="space-y-2">
          <Label>Status</Label>

          <Controller
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <Select
                value={field.value ? "true" : "false"}
                onValueChange={(value) => field.onChange(value === "true")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>

                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </section>
  );
}
