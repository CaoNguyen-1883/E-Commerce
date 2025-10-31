import { Link } from "react-router-dom";
import { ProductSummary } from "../../lib/types";
import { formatCurrency } from "../../lib/utils";

interface ProductCardProps {
  product: ProductSummary;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const discount =
    product.basePrice > product.minPrice
      ? Math.round(((product.basePrice - product.minPrice) / product.basePrice) * 100)
      : 0;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.primaryImage || "/placeholder-product.png"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </div>
        )}

        {/* Out of Stock Badge */}
        {!product.hasStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Hết hàng</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category & Brand */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
          <span>{product.categoryName}</span>
          <span>•</span>
          <span>{product.brandName}</span>
        </div>

        {/* Product Name */}
        <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.averageRating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.averageRating.toFixed(1)} ({product.totalReviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          {product.minPrice === product.maxPrice ? (
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(product.minPrice)}
            </span>
          ) : (
            <>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(product.minPrice)}
              </span>
              <span className="text-sm text-gray-500">
                - {formatCurrency(product.maxPrice)}
              </span>
            </>
          )}

          {discount > 0 && (
            <span className="text-sm text-gray-400 line-through">
              {formatCurrency(product.basePrice)}
            </span>
          )}
        </div>

        {/* Stock */}
        <div className="mt-2 text-xs text-gray-500">
          Còn {product.totalStock} sản phẩm
        </div>
      </div>
    </Link>
  );
};