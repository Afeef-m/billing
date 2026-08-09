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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Eye, Pencil, Trash2, RotateCcw } from "lucide-react";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";

import { useProducts } from "../hooks/useProducts";
import { useSearchProducts } from "../hooks/useSearchProducts";
import { useInactiveProducts } from "../hooks/useInactiveProducts";
import React from "react";

type ProductTableProps = {
  search: string;
  status: "active" | "inactive";
  sort: string;

  page: number;
  limit: number;
  onPageChange: (page: number) => void;

  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onRestore: (product: Product) => void;
};

export default function ProductTable({
  search,
  status,
  sort,
  page,
  limit,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onRestore,
}: ProductTableProps) {
  const activeProducts = useProducts(page, limit, sort);

  const inactiveProducts = useInactiveProducts(page, limit, sort);

  const searchedProducts = useSearchProducts(search, status, page, limit, sort);

  const productsQuery =
    search.trim() === ""
      ? status === "active"
        ? activeProducts
        : inactiveProducts
      : searchedProducts;

  const { data: response, isLoading, isError } = productsQuery;

  const products = response?.data ?? [];
  const meta = response?.meta;

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
      onView(product);

      clickTimer.current = null;
    }, 250);
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
    <div className="rounded-md border">
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
                {product.barcode ?? "-"}
              </TableCell>

              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{product.name}</span>

                  <span className="text-xs text-muted-foreground">
                    {product.brand || "No Brand"}
                  </span>
                </div>
              </TableCell>

              <TableCell>{product.category?.name ?? "No Category"}</TableCell>

              <TableCell className="text-right">
                ₹{product.wholesalePrice ?? "-"}
              </TableCell>

              <TableCell className="text-right font-semibold">
                ₹{product.retailPrice}
              </TableCell>

              <TableCell className="text-right">
                ₹{product.mrp ?? "-"}
              </TableCell>

              <TableCell className="text-right">
                <Badge variant={product.isActive ? "default" : "secondary"}>
                  {product.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex justify-center gap-1">
                  {/* View */}
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
                      title="Restore product"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRestore(product);
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

      {meta && meta.totalPages > 1 && (
  <div className="flex items-center justify-between border-t px-4 py-4">
    <p className="text-sm text-muted-foreground">
      Page {meta.page} of {meta.totalPages}
    </p>

    <Pagination className="w-auto">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();

              if (meta.page > 1) {
                onPageChange(meta.page - 1);
              }
            }}
            className={
              meta.page === 1
                ? "pointer-events-none opacity-50"
                : ""
            }
          />
        </PaginationItem>

        {Array.from(
          { length: meta.totalPages },
          (_, index) => index + 1
        ).map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              href="#"
              isActive={meta.page === pageNumber}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(pageNumber);
              }}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();

              if (meta.page < meta.totalPages) {
                onPageChange(meta.page + 1);
              }
            }}
            className={
              meta.page === meta.totalPages
                ? "pointer-events-none opacity-50"
                : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  </div>
)}
    </div>
  );
}
