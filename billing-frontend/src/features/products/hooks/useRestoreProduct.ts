"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restoreProduct } from "../services/products.service";

export function useRestoreProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => restoreProduct(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["products", "inactive"],
      });
    },
  });
}