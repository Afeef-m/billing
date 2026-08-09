import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updateCategory } from "../services/categories.service";

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: {
        name?: string;
        description?: string;
      };
    }) => updateCategory(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
}