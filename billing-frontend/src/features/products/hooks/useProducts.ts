"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/products.service";

export function useProducts(sort: string = "name-asc") {
  return useQuery({
    queryKey: ["products", sort],
    queryFn: () => getProducts(sort),
  });
}