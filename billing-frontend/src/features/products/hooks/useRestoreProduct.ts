"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restoreProduct } from "../services/products.service";

export function useRestoreProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => restoreProduct(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["products", "search"],
      });

      queryClient.invalidateQueries({
        queryKey: ["inactive-products"],
      });
    },
  });
}