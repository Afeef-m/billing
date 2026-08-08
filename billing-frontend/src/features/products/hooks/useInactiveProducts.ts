"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Product } from "../types/product";

async function getInactiveProducts(): Promise<Product[]> {
  const { data } = await api.get("/products/inactive");

  return data;
}

export function useInactiveProducts() {
  return useQuery({
     queryKey: ["products", "inactive"],
    queryFn: getInactiveProducts,
  });
}