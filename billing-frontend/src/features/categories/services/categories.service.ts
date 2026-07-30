import { api } from "@/lib/axios";
import { Category } from "../types/category";

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get("/categories");
  return data;
}