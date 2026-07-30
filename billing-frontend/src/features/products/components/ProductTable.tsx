"use client";
import type { Product } from "../types/product";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "../hooks/useProducts";
import { useSearchProducts } from "../hooks/useSearchProducts";
import React from "react";

type ProductTableProps = {
  search: string;
  onEdit: (product: Product) => void;
};

export default function ProductTable({ search, onEdit }: ProductTableProps) {
  const allProducts = useProducts();
  const searchedProducts = useSearchProducts(search);

  const productsQuery = search.trim() === "" ? allProducts : searchedProducts;

  const { data: products, isLoading, isError } = productsQuery;

  const clickTimer = React.useRef<NodeJS.Timeout | null>(null);

  const handleRowClick = (product: Product) => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      onEdit(product);

      return;
    }

    clickTimer.current = setTimeout(() => {
      console.log("Selected:", product);

      clickTimer.current = null;
    }, 250);
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading products..." />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Failed to load products"
        description="Please try again."
      />
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="Create your first product."
      />
    );
  }

  const handleView = (product: Product) => {
    console.log("View", product);
  };

  const handleDelete = (product: Product) => {
    console.log("Delete", product);
  };

  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Barcode</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Wholesale</TableHead>
            <TableHead className="text-right">Retail</TableHead>
            <TableHead className="text-right">MRP</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center w-35">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product) => (
            <TableRow
              key={product.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleRowClick(product)}
            >
              <TableCell className="font-mono text-xs">
                {product.barcode}
              </TableCell>

              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{product.name}</span>

                  <span className="text-xs text-muted-foreground">
                    {product.brand || "No Brand"}
                  </span>
                </div>
              </TableCell>

              <TableCell>{product.category.name}</TableCell>

              <TableCell className="text-right">
                ₹{product.wholesalePrice}
              </TableCell>

              <TableCell className="text-right font-semibold">
                ₹{product.retailPrice}
              </TableCell>

              <TableCell className="text-right">₹{product.mrp}</TableCell>

              <TableCell>
                <Badge variant={product.isActive ? "default" : "secondary"}>
                  {product.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex justify-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(product);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(product);
                    }}
                  >
                    <Pencil className="h-4 w-4 text-blue-600" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(product);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
