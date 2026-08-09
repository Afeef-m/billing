import { useQuery } from "@tanstack/react-query";

import {
  searchCategories,
  type SearchCategoriesParams,
} from "../services/categories.service";

export function useSearchCategories(params: SearchCategoriesParams) {
  return useQuery({
    queryKey: ["categories", "search", params],

    queryFn: () => searchCategories(params),

    enabled: params.query.trim().length > 0,
  });
}
