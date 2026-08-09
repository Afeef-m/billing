"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/products.service";

export function useProducts(
  page: number = 1,
  limit: number = 20,
  sort: string = "name-asc"
) {
  return useQuery({
    queryKey: ["products", page, limit, sort],
    queryFn: () => getProducts(page, limit, sort),
  });
}