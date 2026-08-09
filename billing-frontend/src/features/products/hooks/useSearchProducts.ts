"use client";

import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "../services/products.service";

export function useSearchProducts(
  query: string,
  status: "active" | "inactive",
  page: number = 1,
  limit: number = 20,
  sort: string = "name-asc"
) {
  return useQuery({
    queryKey: [
      "products",
      "search",
      query,
      status,
      page,
      limit,
      sort,
    ],

    queryFn: () =>
      searchProducts(
        query,
        status,
        page,
        limit,
        sort
      ),

    enabled: query.trim().length > 0,
  });
}