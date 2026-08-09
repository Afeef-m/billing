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

import { useRestoreCategory } from "../hooks/useRestoreCategory";
import type { Category } from "../types/category";

interface RestoreCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

export default function RestoreCategoryDialog({
  open,
  onOpenChange,
  category,
}: RestoreCategoryDialogProps) {
  const restoreCategoryMutation =
    useRestoreCategory();

  const handleRestore = async () => {
    if (!category) return;

    try {
      await restoreCategoryMutation.mutateAsync(
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
            Restore Category
          </DialogTitle>

          <DialogDescription>
            Are you sure you want to restore{" "}
            <span className="font-medium text-foreground">
              {category?.name}
            </span>
            ?
            <br />
            This category will become active again.
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
              restoreCategoryMutation.isPending
            }
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleRestore}
            disabled={
              restoreCategoryMutation.isPending
            }
          >
            {restoreCategoryMutation.isPending
              ? "Restoring..."
              : "Restore Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}