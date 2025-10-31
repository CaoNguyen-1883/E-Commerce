import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Star, ShoppingCart, Heart, Share2, ChevronRight } from "lucide-react";
import { useProduct } from "../../lib/hooks/useProducts";
import { useCartStore } from "../../lib/stores/cartStore";
import { useAuthStore } from "../../lib/stores/authStore";
import { ImageGallery } from "../../components/shared/ImageGallery";
import { VariantSelector } from "../../components/shared/VariantSelector";
import { QuantitySelector } from "../../components/shared/QuantitySelector";
import { Button } from "../../components/ui/Button";
import { ProductVariant } from "../../lib/types";

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct(id!);
  const { addToCart, isLoading: isAddingToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">(
    "description"
  );

  // Auto-select first available variant
  useEffect(() => {
    if (product?.variants && product.variants.length > 0 && !selectedVariant) {
      const firstAvailable = product.variants.find((v) => v.stock > 0);
      if (firstAvailable) {
        setSelectedVariant(firstAvailable);
      }
    }
  }, [product, selectedVariant]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/products/${id}` } });
      return;
    }

    if (!selectedVariant) {
      alert("Vui lòng chọn phiên bản sản phẩm");
      return;
    }

    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity,
      });
      // Show success message (you can use toast notification here)
      alert("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const calculateFinalPrice = () => {
    if (!product) return 0;
    const basePrice = product.basePrice;
    const additionalPrice = selectedVariant?.additionalPrice || 0;
    return basePrice + additionalPrice;
  };

  const maxQuantity = selectedVariant?.stock || 0;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy sản phẩm
          </h2>
          <Button onClick={() => navigate("/products")}>
            Quay lại danh sách sản phẩm
          </Button>
        </div>
      </div>
    );
  }

  const finalPrice = calculateFinalPrice();
  const hasDiscount = product.basePrice > finalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - finalPrice) / product.basePrice) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-gray-700">
          Trang chủ
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/products" className="hover:text-gray-700">
          Sản phẩm
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          to={`/products?categoryId=${product.category.id}`}
          className="hover:text-gray-700"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      {/* Product Detail */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Left: Image Gallery */}
        <div>
          <ImageGallery images={product.images} productName={product.name} />
        </div>

        {/* Right: Product Info */}
        <div className="space-y-6">
          {/* Product Name */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600">{product.shortDescription}</p>
          </div>

          {/* Rating & Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{product.averageRating}</span>
              <span className="text-gray-500">
                ({product.totalReviews} đánh giá)
              </span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <span className="text-gray-600">
              Đã bán: {product.purchaseCount}
            </span>
            <div className="h-4 w-px bg-gray-300"></div>
            <span className="text-gray-600">
              Lượt xem: {product.viewCount}
            </span>
          </div>

          {/* Price */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-blue-600">
                {finalPrice.toLocaleString()}₫
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    {product.basePrice.toLocaleString()}₫
                  </span>
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold">
                    -{discountPercent}%
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Brand & Category */}
          <div className="flex gap-4 text-sm">
            <div>
              <span className="text-gray-500">Thương hiệu: </span>
              <Link
                to={`/products?brandId=${product.brand.id}`}
                className="text-blue-600 hover:underline font-medium"
              >
                {product.brand.name}
              </Link>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <div>
              <span className="text-gray-500">Danh mục: </span>
              <Link
                to={`/products?categoryId=${product.category.id}`}
                className="text-blue-600 hover:underline font-medium"
              >
                {product.category.name}
              </Link>
            </div>
          </div>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <VariantSelector
              variants={product.variants}
              selectedVariant={selectedVariant}
              onVariantChange={setSelectedVariant}
            />
          )}

          {/* Quantity Selector */}
          {selectedVariant && selectedVariant.stock > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số lượng
              </label>
              <QuantitySelector
                value={quantity}
                min={1}
                max={maxQuantity}
                onChange={setQuantity}
              />
            </div>
          )}

          {/* Stock Status */}
          <div className="text-sm">
            {product.totalStock === 0 ? (
              <span className="text-red-600 font-semibold">Hết hàng</span>
            ) : product.totalStock < 10 ? (
              <span className="text-orange-600 font-semibold">
                Chỉ còn {product.totalStock} sản phẩm
              </span>
            ) : (
              <span className="text-green-600 font-semibold">Còn hàng</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={
                !selectedVariant ||
                selectedVariant.stock === 0 ||
                isAddingToCart
              }
              isLoading={isAddingToCart}
              size="lg"
              className="flex-1"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Thêm vào giỏ hàng
            </Button>
            <Button variant="outline" size="lg">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          {/* Seller Info */}
          <div className="border-t pt-4">
            <div className="text-sm text-gray-600">
              Người bán: <span className="font-medium">{product.sellerName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Specs, Reviews */}
      <div className="border-t">
        <div className="flex gap-8 border-b">
          <button
            onClick={() => setActiveTab("description")}
            className={`py-4 px-2 font-medium transition-colors ${
              activeTab === "description"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Mô tả sản phẩm
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`py-4 px-2 font-medium transition-colors ${
              activeTab === "specs"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Thông số kỹ thuật
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`py-4 px-2 font-medium transition-colors ${
              activeTab === "reviews"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Đánh giá ({product.totalReviews})
          </button>
        </div>

        <div className="py-8">
          {activeTab === "description" && (
            <div className="prose max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}

          {activeTab === "specs" && (
            <div className="space-y-4">
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 text-gray-600 w-1/3">Thương hiệu</td>
                    <td className="py-3 font-medium">{product.brand.name}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 text-gray-600">Danh mục</td>
                    <td className="py-3 font-medium">{product.category.name}</td>
                  </tr>
                  {product.variants && product.variants.length > 0 && (
                    <tr className="border-b">
                      <td className="py-3 text-gray-600">Phiên bản</td>
                      <td className="py-3 font-medium">
                        {product.variants
                          .map((v) => v.attributeValue)
                          .join(", ")}
                      </td>
                    </tr>
                  )}
                  <tr className="border-b">
                    <td className="py-3 text-gray-600">Tình trạng</td>
                    <td className="py-3 font-medium">
                      {product.totalStock > 0 ? "Còn hàng" : "Hết hàng"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="text-center text-gray-500 py-8">
              Chức năng đánh giá sẽ được phát triển trong module tiếp theo
            </div>
          )}
        </div>
      </div>
    </div>
  );
};