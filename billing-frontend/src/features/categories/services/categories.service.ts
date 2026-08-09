import { api } from "@/lib/axios";
import type {
  Category,
  CategoryListResponse,
} from "../types/category";

export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  sort?: string;
}

export async function getCategories(
  params?: GetCategoriesParams,
): Promise<CategoryListResponse> {
  const response = await api.get<CategoryListResponse>(
    "/categories",
    {
      params,
    },
  );

  return response.data;
}

export async function getInactiveCategories(
  params?: GetCategoriesParams,
): Promise<CategoryListResponse> {
  const response = await api.get<CategoryListResponse>(
    "/categories/inactive",
    {
      params,
    },
  );

  return response.data;
}

export async function getCategory(
  id: number,
): Promise<Category> {
  const response = await api.get<Category>(
    `/categories/${id}`,
  );

  return response.data;
}

export interface SearchCategoriesParams {
  query: string;
  status?: "active" | "inactive";
  page?: number;
  limit?: number;
  sort?: string;
}

export async function searchCategories(
  params: SearchCategoriesParams,
): Promise<CategoryListResponse> {
  const response = await api.get<CategoryListResponse>(
    "/categories/search",
    {
      params,
    },
  );

  return response.data;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
}

export async function createCategory(
  data: CreateCategoryData,
): Promise<Category> {
  const response = await api.post<Category>(
    "/categories",
    data,
  );

  return response.data;
}
export interface UpdateCategoryData {
  name?: string;
  description?: string;
}

export async function updateCategory(
  id: number,
  data: UpdateCategoryData,
): Promise<Category> {
  const response = await api.patch<Category>(
    `/categories/${id}`,
    data,
  );

  return response.data;
}

export async function getCategoryOptions(): Promise<Category[]> {
  const response = await api.get<CategoryListResponse>(
    "/categories",
    {
      params: {
        page: 1,
        limit: 100,
        sort: "name-asc",
      },
    },
  );

  return response.data.data;
}

export async function deleteCategory(
  id: number,
): Promise<Category> {
  const response = await api.delete<Category>(
    `/categories/${id}`,
  );

  return response.data;
}

export async function restoreCategory(
  id: number,
): Promise<Category> {
  const response = await api.patch<Category>(
    `/categories/${id}/restore`,
  );

  return response.data;
}