"use client";

import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "../services/products.service";

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: ["products", "search", query],
    queryFn: () => searchProducts(query),
    enabled: query.trim().length > 0,
  });
}