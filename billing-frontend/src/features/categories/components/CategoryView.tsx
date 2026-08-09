"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import CategoryToolbar from "./CategoryToolbar";
import CategoryTable from "./CategoryTable";
import CategoryDialog from "./CategoryDialog";
import DeleteCategoryDialog from "./DeleteCategoryDialog";
import RestoreCategoryDialog from "./RestoreCategoryDialog";

import type { Category } from "../types/category";

export default function CategoryView() {
  const [status, setStatus] = useState<"active" | "inactive">("active");

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [restoreOpen, setRestoreOpen] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  
  const [sort, setSort] = useState("name-asc");
  const [page, setPage] = useState(1);
  const limit = 10;

  const handleAdd = () => {
    setDialogMode("create");
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setDialogMode("edit");
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setDeleteOpen(true);
  };

  const handleRestore = (category: Category) => {
    setSelectedCategory(category);
    setRestoreOpen(true);
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your product categories.
          </p>
        </div>

        <Button onClick={handleAdd}>
          <Plus className="mr-2 size-4" />
          Add Category
        </Button>
      </div>

      {/* Active / Inactive */}
      <div className="mt-6 flex gap-2">
        <Button
          variant={status === "active" ? "default" : "outline"}
          onClick={() => {
            setStatus("active");
            setPage(1);
          }}
        >
          Active
        </Button>

        <Button
          variant={status === "inactive" ? "default" : "outline"}
          onClick={() => {
            setStatus("inactive");
            setPage(1);
          }}
        >
          Inactive
        </Button>
      </div>

      {/* Toolbar */}
      <div className="mt-5">
        <CategoryToolbar
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          sort={sort}
          onSortChange={(value) => {
            setSort(value);
            setPage(1);
          }}
        />
      </div>

      <div className="mt-4">
        <CategoryTable
          search={search}
          status={status}
          sort={sort}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
        />
      </div>
      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        category={selectedCategory}
      />
      <DeleteCategoryDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        category={selectedCategory}
      />
      <RestoreCategoryDialog
        open={restoreOpen}
        onOpenChange={setRestoreOpen}
        category={selectedCategory}
      />
    </main>
  );
}
