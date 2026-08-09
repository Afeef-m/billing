import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteCategory } from "../services/categories.service";

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
}