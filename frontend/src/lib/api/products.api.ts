import { apiClient } from "./client";
import {
  Product,
  PageResponse,
  ProductFilterParams,
  CreateProductRequest,
  Category,
} from "../types";

export const productsApi = {
  // Get all products with filters and pagination
  getProducts: async (
    params?: ProductFilterParams
  ): Promise<PageResponse<Product>> => {
    const response = await apiClient.get<PageResponse<Product>>("/products", {
      params,
    });
    return response.data;
  },

  // Get product by ID
  getProductById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Get product by slug
  getProductBySlug: async (slug: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/slug/${slug}`);
    return response.data;
  },

  // Create product (Seller)
  createProduct: async (data: CreateProductRequest): Promise<Product> => {
    const response = await apiClient.post<Product>("/products", data);
    return response.data;
  },

  // Update product (Seller)
  updateProduct: async (
    id: number,
    data: Partial<CreateProductRequest>
  ): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  // Delete product (Seller)
  deleteProduct: async (id: number): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  // Get categories
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>("/categories");
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (id: number): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  },

  // Search products
  searchProducts: async (
    query: string,
    params?: ProductFilterParams
  ): Promise<PageResponse<Product>> => {
    const response = await apiClient.get<PageResponse<Product>>(
      "/products/search",
      {
        params: { search: query, ...params },
      }
    );
    return response.data;
  },
};