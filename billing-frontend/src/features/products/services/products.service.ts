import { api } from "@/lib/axios";
import { Product } from "../types/product";
import { ProductFormValues } from "../schemas/product.schema";

export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get("/products");
  return data;
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data } = await api.get("/products/search", {
    params: { query },
  });

  return data;
}

export async function createProduct(
  payload: ProductFormValues,
): Promise<Product> {
  const { data } = await api.post("/products", payload);
  return data;
}

export async function updateProduct(
  id: number,
  payload: ProductFormValues,
): Promise<Product> {
  const { data } = await api.patch(`/products/${id}`, payload);

  return data;
}

export async function deleteProduct(id: number): Promise<Product> {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}

export async function restoreProduct(id: number): Promise<Product> {
  const { data } = await api.patch(`/products/${id}/restore`);
  return data;
}
