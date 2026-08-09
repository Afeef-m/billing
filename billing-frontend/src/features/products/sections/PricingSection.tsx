"use client";

import { UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ProductFormValues } from "../schemas/product.schema";


type PricingSectionProps = {
  form: UseFormReturn<ProductFormValues>;
};

export default function PricingSection({
  form,
}: PricingSectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">
          Pricing
        </h3>

        <Separator className="mt-2" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        <div className="space-y-2">
          <Label htmlFor="retailPrice">
            Retail Price
          </Label>

          <Input
            id="retailPrice"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...form.register("retailPrice")}
          />

          {form.formState.errors.retailPrice && (
            <p className="text-sm text-destructive">
              {form.formState.errors.retailPrice.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="wholesalePrice">
            Wholesale Price
          </Label>

          <Input
            id="wholesalePrice"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...form.register("wholesalePrice")}
          />

          {form.formState.errors.wholesalePrice && (
            <p className="text-sm text-destructive">
              {form.formState.errors.wholesalePrice.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="mrp">
            MRP
          </Label>

          <Input
            id="mrp"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...form.register("mrp")}
          />

          {form.formState.errors.mrp && (
            <p className="text-sm text-destructive">
              {form.formState.errors.mrp.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}