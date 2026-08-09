import { api } from "@/lib/axios";
import { Product, ProductListResponse } from "../types/product";
import { ProductFormValues } from "../schemas/product.schema";

export async function getProducts(
  page: number = 1,
  limit: number = 20,
  sort: string = "name-asc"
): Promise<ProductListResponse> {
  const { data } = await api.get("/products", {
    params: {
      page,
      limit,
      sort,
    },
  });

  return data;
}

export async function searchProducts(
  query: string,
  status: "active" | "inactive",
  page: number = 1,
  limit: number = 20,
  sort: string = "name-asc"
): Promise<ProductListResponse> {
  const { data } = await api.get("/products/search", {
    params: {
      query,
      status,
      page,
      limit,
      sort,
    },
  });

  return data;
}

export async function createProduct(
  payload: ProductFormValues,
): Promise<Product> {
  const { data } = await api.post("/products", payload);
  return data;
}

export async function getInactiveProducts(): Promise<Product[]> {
  const { data } = await api.get("/products/inactive");
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

export async function generateProductBarcode(): Promise<string> {
  const { data } = await api.get("/products/generate-barcode");

  return data.barcode;
}
