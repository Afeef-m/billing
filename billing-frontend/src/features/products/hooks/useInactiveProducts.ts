"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Product, ProductListResponse } from "../types/product";

async function getInactiveProducts(
  page: number = 1,
  limit: number = 20,
  sort: string = "name-asc"
): Promise<ProductListResponse> {
  const { data } = await api.get("/products/inactive", {
    params: {
      page,
      limit,
      sort,
    },
  });

  return data;
}

export function useInactiveProducts(
  page: number = 1,
  limit: number = 20,
  sort: string = "name-asc"
) {
  return useQuery({
    queryKey: ["products", "inactive", page, limit, sort],
    queryFn: () => getInactiveProducts(page, limit, sort),
  });
}