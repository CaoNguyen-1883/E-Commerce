import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts, useCategories, useBrands } from "../../lib/hooks";
import { ProductCard } from "../../components/shared/ProductCard";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("keyword") || "");

  // Get filter params from URL
  const keyword = searchParams.get("keyword") || undefined;
  const categoryId = searchParams.get("categoryId") || undefined;
  const brandId = searchParams.get("brandId") || undefined;
  const page = parseInt(searchParams.get("page") || "0");

  // Fetch data
  const { data: productsData, isLoading, error } = useProducts({
    keyword,
    categoryId,
    brandId,
    page,
    size: 20,
  });

  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ keyword: searchInput.trim() });
    } else {
      setSearchParams({});
    }
  };

  // Handle filter change
  const handleFilterChange = (key: string, value: string | undefined) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete("page"); // Reset page on filter change
    setSearchParams(newParams);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchInput("");
    setSearchParams({});
  };

  const hasActiveFilters = keyword || categoryId || brandId;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Sản phẩm</h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <Input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Tìm kiếm</Button>
        </form>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-sm text-gray-600">Bộ lọc:</span>
            {keyword && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Từ khóa: {keyword}
                <button
                  onClick={() => handleFilterChange("keyword", undefined)}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {categoryId && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Danh mục: {categories?.find((c) => c.id === categoryId)?.name}
                <button
                  onClick={() => handleFilterChange("categoryId", undefined)}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {brandId && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Thương hiệu: {brands?.find((b) => b.id === brandId)?.name}
                <button
                  onClick={() => handleFilterChange("brandId", undefined)}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-sm text-red-600 hover:text-red-700 underline"
            >
              Xóa tất cả
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Danh mục</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleFilterChange("categoryId", undefined)}
                  className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                    !categoryId ? "bg-blue-50 text-blue-700 font-medium" : ""
                  }`}
                >
                  Tất cả
                </button>
                {categories?.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleFilterChange("categoryId", category.id)}
                    className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                      categoryId === category.id
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : ""
                    }`}
                  >
                    {category.name}
                    {category.productCount && (
                      <span className="text-sm text-gray-500 ml-1">
                        ({category.productCount})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Thương hiệu</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleFilterChange("brandId", undefined)}
                  className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                    !brandId ? "bg-blue-50 text-blue-700 font-medium" : ""
                  }`}
                >
                  Tất cả
                </button>
                {brands?.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => handleFilterChange("brandId", brand.id)}
                    className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                      brandId === brand.id
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : ""
                    }`}
                  >
                    {brand.name}
                    {brand.productCount && (
                      <span className="text-sm text-gray-500 ml-1">
                        ({brand.productCount})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {/* Loading */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-800 p-4 rounded-lg">
              Không thể tải sản phẩm. Vui lòng thử lại sau.
            </div>
          )}

          {/* Empty */}
          {productsData && productsData.content.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Không tìm thấy sản phẩm nào</p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={handleClearFilters}>
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          )}

          {/* Products Grid */}
          {productsData && productsData.content.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {productsData.content.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {productsData.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                  >
                    ← Trước
                  </Button>

                  <span className="text-sm text-gray-600">
                    Trang {page + 1} / {productsData.totalPages}
                  </span>

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= productsData.totalPages - 1}
                  >
                    Sau →
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};