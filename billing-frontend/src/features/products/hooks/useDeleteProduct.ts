"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "../services/products.service";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,

    onSuccess: () => {
      // Active products
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      // Search results
      queryClient.invalidateQueries({
        queryKey: ["products", "search"],
      });

      // Inactive products
      queryClient.invalidateQueries({
        queryKey: ["products", "inactive"],
      });
    },
  });
}