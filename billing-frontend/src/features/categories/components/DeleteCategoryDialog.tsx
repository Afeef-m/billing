"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { useDeleteCategory } from "../hooks/useDeleteCategory";
import type { Category } from "../types/category";

interface DeleteCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

export default function DeleteCategoryDialog({
  open,
  onOpenChange,
  category,
}: DeleteCategoryDialogProps) {
  const deleteCategoryMutation =
    useDeleteCategory();

  const handleDelete = async () => {
    if (!category) return;

    try {
      await deleteCategoryMutation.mutateAsync(
        category.id,
      );

      onOpenChange(false);
    } catch {
      // Toast/error handling will be added next.
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete Category
          </DialogTitle>

          <DialogDescription>
            Are you sure you want to deactivate{" "}
            <span className="font-medium text-foreground">
              {category?.name}
            </span>
            ?
            <br />
            The category will be moved to
            inactive categories.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
            disabled={
              deleteCategoryMutation.isPending
            }
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={
              deleteCategoryMutation.isPending
            }
          >
            {deleteCategoryMutation.isPending
              ? "Deleting..."
              : "Delete Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}