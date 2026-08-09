"use client";

import ProductForm from "./ProductForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "../types/product";

type ProductDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  product: Product | null;
};

export default function ProductDialog({
  open,
  onOpenChange,
  mode,
  product,
}: ProductDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          flex
          max-h-[90vh]
          flex-col
          overflow-hidden
          sm:max-w-4xl
        "
      >
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl font-semibold">
            {mode === "create" ? "Add Product" : "Edit Product"}
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto pr-2">
          <ProductForm
            key={product?.id ?? "create"}
            mode={mode}
            product={product}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
