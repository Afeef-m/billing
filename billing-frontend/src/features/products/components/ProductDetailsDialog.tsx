"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { Product } from "../types/product";

type ProductDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
};

export default function ProductDetailsDialog({
  open,
  onOpenChange,
  product,
}: ProductDetailsDialogProps) {
  if (!product) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Product Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Header */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {product.name}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {product.brand || "No Brand"}
                </p>
              </div>

              <Badge
                variant={
                  product.isActive
                    ? "default"
                    : "secondary"
                }
              >
                {product.isActive
                  ? "Active"
                  : "Inactive"}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Basic Information */}
          <section className="space-y-4">
            <h3 className="font-semibold">
              Product Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <DetailItem
                label="Barcode"
                value={product.barcode}
              />

              <DetailItem
                label="Category"
                value={product.category.name}
              />

              <DetailItem
                label="Brand"
                value={product.brand || "—"}
              />

              <DetailItem
                label="Unit"
                value={product.unit}
              />
            </div>
          </section>

          <Separator />

          {/* Pricing */}
          <section className="space-y-4">
            <h3 className="font-semibold">
              Pricing
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <DetailItem
                label="Wholesale"
                value={`₹${product.wholesalePrice}`}
              />

              <DetailItem
                label="Retail"
                value={`₹${product.retailPrice}`}
              />

              <DetailItem
                label="MRP"
                value={`₹${product.mrp}`}
              />
            </div>
          </section>

          <Separator />

          {/* Inventory */}
          <section className="space-y-4">
            <h3 className="font-semibold">
              Inventory
            </h3>

            <DetailItem
              label="Current Stock"
              value={`${product.currentStock} ${product.unit}`}
            />
          </section>

          {/* Notes */}
          {product.notes && (
            <>
              <Separator />

              <section className="space-y-2">
                <h3 className="font-semibold">
                  Notes
                </h3>

                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {product.notes}
                </p>
              </section>
            </>
          )}

          <Separator />

          {/* Dates */}
          <section className="grid grid-cols-2 gap-4">
            <DetailItem
              label="Created"
              value={formatDate(product.createdAt)}
            />

            <DetailItem
              label="Last Updated"
              value={formatDate(product.updatedAt)}
            />
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="text-sm font-medium">
        {value}
      </p>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}