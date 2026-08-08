"use client";

import { Eye, Pencil, RotateCcw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "../types/product";

type ProductCardProps = {
  product: Product;
  status: "active" | "inactive";
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onRestore: (product: Product) => void;
  restorePending?: boolean;
};

export default function ProductCard({
  product,
  status,
  onView,
  onEdit,
  onDelete,
  onRestore,
  restorePending = false,
}: ProductCardProps) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold">
            {product.name}
          </h3>

          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {product.brand || "No Brand"}
            {" • "}
            {product.category.name}
          </p>
        </div>

        <Badge
          variant={product.isActive ? "default" : "secondary"}
          className="shrink-0"
        >
          {product.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      {/* Pricing */}
      <div className="mt-4 grid grid-cols-3 gap-3 rounded-lg bg-muted/40 p-3">
        <div>
          <p className="text-[11px] text-muted-foreground">
            Wholesale
          </p>
          <p className="mt-1 text-sm font-medium tabular-nums">
            ₹{product.wholesalePrice}
          </p>
        </div>

        <div>
          <p className="text-[11px] text-muted-foreground">
            Retail
          </p>
          <p className="mt-1 text-sm font-semibold tabular-nums">
            ₹{product.retailPrice}
          </p>
        </div>

        <div>
          <p className="text-[11px] text-muted-foreground">
            MRP
          </p>
          <p className="mt-1 text-sm font-medium tabular-nums">
            ₹{product.mrp}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] text-muted-foreground">
            Barcode
          </p>

          <p className="truncate font-mono text-xs">
            {product.barcode}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[11px] text-muted-foreground">
            Stock
          </p>

          <p className="text-xs font-medium">
            {product.currentStock} {product.unit}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-end gap-1 border-t pt-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onView(product)}
          title="View product"
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">View product</span>
        </Button>

        {status === "active" ? (
          <>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(product)}
              title="Edit product"
            >
              <Pencil className="h-4 w-4 text-blue-600" />
              <span className="sr-only">Edit product</span>
            </Button>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete(product)}
              title="Delete product"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
              <span className="sr-only">Delete product</span>
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={restorePending}
            onClick={() => onRestore(product)}
            title="Restore product"
          >
            <RotateCcw className="h-4 w-4 text-green-600" />
            <span className="sr-only">Restore product</span>
          </Button>
        )}
      </div>
    </div>
  );
}