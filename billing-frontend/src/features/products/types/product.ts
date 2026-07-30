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
  categoryId: number;

  brand: string;
  unit: string;

  purchasePrice: string;
  retailPrice: string;
  wholesalePrice: string;
  mrp: string;

  currentStock: number;

  notes: string;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;

  category: Category;
}