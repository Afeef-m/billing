"use client";

import { toast } from "sonner";

import ConfirmDialog from "@/components/common/ConfirmDialog";

import { Product } from "../types/product";
import { useDeleteProduct } from "../hooks/useDeleteProduct";

type DeleteProductDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onDeleted?: () => void;
};

export default function DeleteProductDialog({
  open,
  onOpenChange,
  product,
  onDeleted
}: DeleteProductDialogProps) {
  const deleteMutation = useDeleteProduct();

  async function handleDelete() {
    if (!product) return;

    try {
      await deleteMutation.mutateAsync(product.id);

      toast.success("Product deleted successfully");

      onOpenChange(false);
      onDeleted?.();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Product"
      description={`Are you sure you want to delete "${product?.name}"? This action will mark the product as inactive.`}
      confirmText="Delete"
      loading={deleteMutation.isPending}
      onConfirm={handleDelete}
    />
  );
}