import { useQuery } from "@tanstack/react-query";

import {
  getCategories,
  getInactiveCategories,
} from "../services/categories.service";

export function useCategories(
  page = 1,
  limit = 20,
  sort = "name-asc",
) {
  return useQuery({
    queryKey: [
      "categories",
      "active",
      page,
      limit,
      sort,
    ],
    queryFn: () =>
      getCategories({
        page,
        limit,
        sort,
      }),
  });
}

export function useInactiveCategories(
  page = 1,
  limit = 20,
  sort = "name-asc",
) {
  return useQuery({
    queryKey: [
      "categories",
      "inactive",
      page,
      limit,
      sort,
    ],
    queryFn: () =>
      getInactiveCategories({
        page,
        limit,
        sort,
      }),
  });
}