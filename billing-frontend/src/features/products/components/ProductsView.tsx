"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import ProductToolbar from "./ProductToolbar";
import ProductTable from "./ProductTable";
import ProductDialog from "./ProductDialog";
import DeleteProductDialog from "./DeleteProductDialog";

import { Product } from "../types/product";
import ProductDetailsDialog from "./ProductDetailsDialog";

export default function ProductsView() {
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [status, setStatus] = useState<"active" | "inactive">("active");

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setDialogMode("create");
    setDialogOpen(true);
  };

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setDetailsOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteOpen(true);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Products"
        description="Manage your products."
        action={<Button onClick={handleCreate}>Add Product</Button>}
      />

      {/* Active / Inactive */}
      <div className="mt-6 flex gap-2">
        <Button
          variant={status === "active" ? "default" : "outline"}
          onClick={() => setStatus("active")}
        >
          Active
        </Button>

        <Button
          variant={status === "inactive" ? "default" : "outline"}
          onClick={() => setStatus("inactive")}
        >
          Inactive
        </Button>
      </div>

      <ProductToolbar search={search} onSearchChange={setSearch} />

      <ProductTable
        search={search}
        status={status}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        product={selectedProduct}
      />

      <ProductDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        product={selectedProduct}
      />

      <DeleteProductDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        product={selectedProduct}
        onDeleted={() => {
          setStatus("active");
          setSelectedProduct(null);
        }}
      />
    </PageContainer>
  );
}
