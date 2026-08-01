"use client";

import { UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ProductFormValues } from "../schemas/product.schema";

type InventorySectionProps = {
  form: UseFormReturn<ProductFormValues>;
};

export default function InventorySection({
  form,
}: InventorySectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">
          Inventory
        </h3>

        <Separator className="mt-2" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="currentStock">
          Current Stock
        </Label>

        <Input
          id="currentStock"
          type="number"
          placeholder="0"
          {...form.register("currentStock", {
            valueAsNumber: true,
          })}
        />

        {form.formState.errors.currentStock && (
          <p className="text-sm text-destructive">
            {form.formState.errors.currentStock.message}
          </p>
        )}
      </div>
    </section>
  );
}