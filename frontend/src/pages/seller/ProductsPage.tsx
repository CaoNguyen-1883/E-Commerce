import { useState } from "react";
import { useMyProducts, useDeleteProduct } from "../../lib/hooks/useProducts";
import { ProductStatus } from "../../lib/types";
import { Search, Filter, ChevronLeft, ChevronRight, Eye, Edit, Trash2, Plus, Package } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

export const SellerProductsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "">(
    (searchParams.get("status") as ProductStatus) || ""
  );

  const { data: productsData, isLoading } = useMyProducts({
    keyword: keyword || undefined,
    status: statusFilter || undefined,
    page: currentPage,
    size: 12,
    sort: "createdAt,desc",
  });

  const deleteMutation = useDeleteProduct();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      alert("Product deleted successfully!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to delete product");
    }
  };

  const getStatusBadge = (status: ProductStatus) => {
    const styles = {
      [ProductStatus.PENDING_APPROVAL]: "bg-yellow-100 text-yellow-700",
      [ProductStatus.APPROVED]: "bg-green-100 text-green-700",
      [ProductStatus.REJECTED]: "bg-red-100 text-red-700",
      [ProductStatus.INACTIVE]: "bg-gray-100 text-gray-700",
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {status.replace("_", " ")}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-600 mt-1">Manage your product listings</p>
        </div>
        <Link
          to="/seller/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search your products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline w-4 h-4 mr-1" />
                Product Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as ProductStatus | "");
                  setCurrentPage(0);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                {Object.values(ProductStatus).map((status) => (
                  <option key={status} value={status}>
                    {status.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading products...</div>
        </div>
      ) : productsData?.content.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <div className="text-gray-500 text-lg mb-2">No products found</div>
          <p className="text-sm text-gray-400 mb-4">
            Get started by adding your first product
          </p>
          <Link
            to="/seller/products/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Your First Product
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsData?.content.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
              >
                <img
                  src={product.primaryImage || "https://via.placeholder.com/400x300"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
                      {product.name}
                    </h3>
                    {getStatusBadge(product.status)}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {product.shortDescription}
                  </p>
                  <div className="flex items-center gap-2 text-sm mb-3">
                    <span className="font-medium text-blue-600">
                      ${product.minPrice.toFixed(2)}
                    </span>
                    {product.minPrice !== product.maxPrice && (
                      <>
                        <span>-</span>
                        <span className="font-medium text-blue-600">
                          ${product.maxPrice.toFixed(2)}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>⭐ {product.averageRating.toFixed(1)} ({product.totalReviews})</span>
                    <span className={product.totalStock > 0 ? "text-green-600" : "text-red-600"}>
                      Stock: {product.totalStock}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center justify-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/seller/products/edit/${product.id}`)}
                      className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      disabled={deleteMutation.isPending}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {productsData && productsData.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-lg shadow px-6 py-4">
              <div className="text-sm text-gray-600">
                Showing page {currentPage + 1} of {productsData.totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= productsData.totalPages - 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};