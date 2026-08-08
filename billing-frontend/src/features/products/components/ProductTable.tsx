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

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Eye, Pencil, Trash2, RotateCcw } from "lucide-react";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";

import { useProducts } from "../hooks/useProducts";
import { useSearchProducts } from "../hooks/useSearchProducts";
import { useInactiveProducts } from "../hooks/useInactiveProducts";
import { useRestoreProduct } from "../hooks/useRestoreProduct";

import React from "react";

type ProductTableProps = {
  search: string;
  status: "active" | "inactive";
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export default function ProductTable({
  search,
  status,
  onView,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const allProducts = useProducts();

  const searchedProducts = useSearchProducts(search);

  const inactiveProducts = useInactiveProducts();

  const restoreMutation = useRestoreProduct();

  const activeProductsQuery =
    search.trim() === "" ? allProducts : searchedProducts;

  const productsQuery =
    status === "active" ? activeProductsQuery : inactiveProducts;

  const { data: products, isLoading, isError } = productsQuery;

  const clickTimer = React.useRef<NodeJS.Timeout | null>(null);

  const handleRowClick = (product: Product) => {
    if (status === "inactive") {
      return;
    }

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

  const handleRestore = async (product: Product) => {
    try {
      await restoreMutation.mutateAsync(product.id);
    } catch (error) {
      console.error("Failed to restore product", error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading products..." />;
  }

  if (isError) {
    return (
      <EmptyState
        title={
          status === "active"
            ? "Failed to load products"
            : "Failed to load inactive products"
        }
        description="Please try again."
      />
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title={
          status === "active" ? "No products found" : "No inactive products"
        }
        description={
          status === "active"
            ? "Create your first product."
            : "Deleted products will appear here."
        }
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">Barcode</TableHead>

            <TableHead className="font-bold">Product</TableHead>

            <TableHead className="font-bold">Category</TableHead>

            <TableHead className="text-right font-bold">Wholesale</TableHead>

            <TableHead className="text-right font-bold">Retail</TableHead>

            <TableHead className="text-right font-bold">MRP</TableHead>

            <TableHead className="text-right font-bold">Status</TableHead>

            <TableHead className="w-35 text-center font-bold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product) => (
            <TableRow
              key={product.id}
              className={
                status === "active"
                  ? "cursor-pointer hover:bg-muted/50"
                  : "hover:bg-muted/50"
              }
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

              <TableCell className="text-right">
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
                      onView(product);
                    }}
                    title="View product"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  {status === "active" ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(product);
                        }}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4 text-blue-600" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(product);
                        }}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={restoreMutation.isPending}
                      title="Restore product"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(product);
                      }}
                    >
                      <RotateCcw className="h-4 w-4 text-green-600" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
