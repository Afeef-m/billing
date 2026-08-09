"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  categorySchema,
  type CategoryFormValues,
} from "../schemas/category.schema";

import { useCreateCategory } from "../hooks/useCreateCategory";
import { useUpdateCategory } from "../hooks/useUpdateCategory";
import type { Category } from "../types/category";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  mode: "create" | "edit";

  category?: Category | null;
}

export default function CategoryDialog({
  open,
  onOpenChange,
  mode,
  category,
}: CategoryDialogProps) {
  const createCategoryMutation = useCreateCategory();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const updateCategoryMutation = useUpdateCategory();

  useEffect(() => {
    if (!open) {
      form.reset();
      return;
    }

    if (mode === "edit" && category) {
      form.reset({
        name: category.name,
        description: category.description ?? "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
      });
    }
  }, [open, mode, category, form]);

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      if (mode === "create") {
        await createCategoryMutation.mutateAsync(values);
      } else {
        if (!category) return;

        await updateCategoryMutation.mutateAsync({
          id: category.id,
          data: values,
        });
      }

      onOpenChange(false);
      form.reset();
    } catch {
      // Toast/error handling will be added next.
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Category" : "Edit Category"}
          </DialogTitle>

          <DialogDescription>
            {mode === "create"
              ? "Create a new product category."
              : "Update the category details."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>

            <Input
              id="name"
              placeholder="e.g. Grocery"
              {...form.register("name")}
            />

            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>

            <Textarea
              id="description"
              placeholder="Category description"
              {...form.register("description")}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                createCategoryMutation.isPending ||
                updateCategoryMutation.isPending
              }
            >
              {createCategoryMutation.isPending ||
              updateCategoryMutation.isPending
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                  ? "Create Category"
                  : "Update Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
