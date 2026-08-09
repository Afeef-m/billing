"use client";

import {
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";

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

import type { Category } from "../types/category";
import {
  useCategories,
  useInactiveCategories,
} from "../hooks/useCategories";
import { useSearchCategories } from "../hooks/useSearchCategories";

interface CategoryTableProps {
  search: string;
  status: "active" | "inactive";
  sort: string;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;

  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onRestore: (category: Category) => void;
}

export default function CategoryTable({
  search,
  status,
  sort,
  page,
  limit,
  onPageChange,
  onEdit,
  onDelete,
  onRestore,
}: CategoryTableProps) {
 const activeQuery = useCategories(
  page,
  limit,
  sort,
);

const inactiveQuery = useInactiveCategories(
  page,
  limit,
  sort,
);

const searchQuery = useSearchCategories({
  query: search,
  status,
  page,
  limit,
  sort,
});

const currentQuery =
  search.trim().length > 0
    ? searchQuery
    : status === "active"
      ? activeQuery
      : inactiveQuery;
      
  const categories = currentQuery.data?.data ?? [];
  const meta = currentQuery.data?.meta;

  if (currentQuery.isLoading) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        Loading categories...
      </div>
    );
  }

  if (currentQuery.isError) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-destructive">
        Failed to load categories.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>

            <TableHead>Description</TableHead>

            <TableHead>Status</TableHead>

            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-24 text-center"
              >
                No categories found.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">
                  {category.name}
                </TableCell>

                <TableCell>
                  {category.description || "-"}
                </TableCell>

                <TableCell>
                  {category.isActive
                    ? "Active"
                    : "Inactive"}
                </TableCell>

                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    {status === "active" ? (
                      <>
                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() =>
                            onEdit(category)
                          }
                          className="rounded-md p-1.5 text-blue-600 hover:bg-muted"
                        >
                          <Pencil className="size-4" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() =>
                            onDelete(category)
                          }
                          className="rounded-md p-1.5 text-destructive hover:bg-muted"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </>
                    ) : (
                      /* Restore */
                      <button
                        type="button"
                        onClick={() =>
                          onRestore(category)
                        }
                        className="rounded-md p-1.5 hover:bg-muted"
                      >
                        <RotateCcw className="size-4" />
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
     <div className="relative flex items-center border-t px-4 py-3">
  {/* Page info — left */}
  <p className="absolute left-4 text-sm text-muted-foreground">
    Page {meta?.page ?? 1} of {meta?.totalPages ?? 1}
  </p>

  {/* Pagination — center */}
  <div className="mx-auto">
    <Pagination className="w-auto">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            size="default"
            onClick={(event) => {
              event.preventDefault();

              if (page > 1) {
                onPageChange(page - 1);
              }
            }}
            className={
              page <= 1
                ? "pointer-events-none opacity-50"
                : ""
            }
          />
        </PaginationItem>

        {Array.from(
          {
            length: meta?.totalPages ?? 0,
          },
          (_, index) => index + 1,
        ).map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              href="#"
              size="icon"
              isActive={pageNumber === page}
              onClick={(event) => {
                event.preventDefault();
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
            size="default"
            onClick={(event) => {
              event.preventDefault();

              if (
                meta &&
                page < meta.totalPages
              ) {
                onPageChange(page + 1);
              }
            }}
            className={
              !meta || page >= meta.totalPages
                ? "pointer-events-none opacity-50"
                : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  </div>
</div>
    </div>
  );
}