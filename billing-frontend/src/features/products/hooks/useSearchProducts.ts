"use client";

import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "../services/products.service";

export function useSearchProducts(
  query: string,
  status: "active" | "inactive"
) {
  return useQuery({
    queryKey: ["products", "search", query, status],
    queryFn: () => searchProducts(query, status),
    enabled: query.trim().length > 0,
  });
}