"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Product } from "../types/product";

async function getInactiveProducts(
  sort: string = "name-asc"
): Promise<Product[]> {
  const { data } = await api.get("/products/inactive", {
    params: {
      sort,
    },
  });

  return data;
}

export function useInactiveProducts(sort: string = "name-asc") {
  return useQuery({
    queryKey: ["products", "inactive", sort],
    queryFn: () => getInactiveProducts(sort),
  });
}