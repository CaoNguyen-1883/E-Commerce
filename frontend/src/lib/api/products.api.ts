import { apiClient } from "./client";
import {
  Product,
  ProductSummary,
  PageResponse,
  ProductFilterParams,
  Category,
  Brand,
} from "../types";

export const productsApi = {
  // Get all products (paginated)
  getProducts: async (
    params?: ProductFilterParams
  ): Promise<PageResponse<ProductSummary>> => {
    const { page = 0, size = 20, sort = "createdAt,desc", ...filters } = params || {};
    
    const response = await apiClient.get<PageResponse<ProductSummary>>("/products", {
      params: {
        page,
        size,
        sort,
        ...filters,
      },
    });
    return response.data;
  },

  // Search products
  searchProducts: async (
    keyword: string,
    params?: { page?: number; size?: number }
  ): Promise<PageResponse<ProductSummary>> => {
    const { page = 0, size = 20 } = params || {};
    
    const response = await apiClient.get<PageResponse<ProductSummary>>(
      "/products/search",
      {
        params: { keyword, page, size },
      }
    );
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (
    categoryId: string,
    params?: { page?: number; size?: number }
  ): Promise<PageResponse<ProductSummary>> => {
    const { page = 0, size = 20 } = params || {};
    
    const response = await apiClient.get<PageResponse<ProductSummary>>(
      `/products/category/${categoryId}`,
      {
        params: { page, size },
      }
    );
    return response.data;
  },

  // Get products by brand
  getProductsByBrand: async (
    brandId: string,
    params?: { page?: number; size?: number }
  ): Promise<PageResponse<ProductSummary>> => {
    const { page = 0, size = 20 } = params || {};
    
    const response = await apiClient.get<PageResponse<ProductSummary>>(
      `/products/brand/${brandId}`,
      {
        params: { page, size },
      }
    );
    return response.data;
  },

  // Get product by ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Get product by slug (if backend supports)
  getProductBySlug: async (slug: string): Promise<Product> => {
    // Note: Backend might not have this endpoint, using ID for now
    const response = await apiClient.get<Product>(`/products/slug/${slug}`);
    return response.data;
  },

  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>("/categories");
    return response.data;
  },

  // Get all brands
  getBrands: async (): Promise<Brand[]> => {
    const response = await apiClient.get<Brand[]>("/brands");
    return response.data;
  },
};