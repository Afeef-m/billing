import { useQuery } from "@tanstack/react-query";

import { getCategories } from "../services/categories.service";

export function useCategoryOptions() {
  return useQuery({
    queryKey: ["categories", "options"],

    queryFn: async () => {
      const response = await getCategories({
        page: 1,
        limit: 100,
        sort: "name-asc",
      });

      return response.data;
    },
  });
}