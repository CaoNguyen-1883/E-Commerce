import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { productsApi } from "../api";
import { queryKeys } from "../queryClient";
import {
  Product,
  ProductSummary,
  PageResponse,
  ProductFilterParams,
} from "../types";

// Get products list
export const useProducts = (
  params?: ProductFilterParams,
  options?: UseQueryOptions<PageResponse<ProductSummary>>
) => {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productsApi.getProducts(params),
    ...options,
  });
};

// Search products
export const useSearchProducts = (
  keyword: string,
  params?: { page?: number; size?: number },
  options?: UseQueryOptions<PageResponse<ProductSummary>>
) => {
  return useQuery({
    queryKey: queryKeys.products.search(keyword, params),
    queryFn: () => productsApi.searchProducts(keyword, params),
    enabled: keyword.length > 0, // Only search if keyword exists
    ...options,
  });
};

// Get product detail
export const useProduct = (
  id: string,
  options?: UseQueryOptions<Product>
) => {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsApi.getProductById(id),
    enabled: !!id,
    ...options,
  });
};

// Get categories
export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => productsApi.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes (categories don't change often)
  });
};

// Get brands
export const useBrands = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: () => productsApi.getBrands(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};