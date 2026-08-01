import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductFormValues } from "../schemas/product.schema";
import { api } from "@/lib/axios";

type UpdateProductPayload = {
  id: number;
  data: ProductFormValues;
};

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateProductPayload) => {
      const response = await api.patch(`/products/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["search-products"] });
    },
  });
}