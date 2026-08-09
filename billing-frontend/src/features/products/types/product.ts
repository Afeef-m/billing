export interface Category {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  barcode: string;
  name: string;

  categoryId?: number | null;
  category?: Category | null;

  brand?: string | null;
  unit?: string | null;

  retailPrice: string;
  wholesalePrice?: string | null;
  mrp?: string | null;

  currentStock: number;

  notes?: string | null;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface ProductPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductListResponse {
  data: Product[];
  meta: ProductPaginationMeta;
}