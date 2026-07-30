"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";
import ProductToolbar from "./ProductToolbar";
import ProductTable from "./ProductTable";
import ProductDialog from "./ProductDialog";
import { Product } from "../types/product";

export default function ProductsView() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  console.log("Search:", search);
  return (
    <PageContainer>
      <PageHeader
        title="Products"
        description="Manage your products."
        action={<Button onClick={handleCreate}>Add Product</Button>}
      />
      <ProductToolbar search={search} onSearchChange={setSearch} />

     <ProductTable
  search={search}
  onEdit={handleEdit}
/>

<ProductDialog
  open={dialogOpen}
  onOpenChange={setDialogOpen}
  mode={dialogMode}
  product={selectedProduct}
/>
    </PageContainer>
  );
}
