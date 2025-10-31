import { ProductVariant } from "../../lib/types";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onVariantChange: (variant: ProductVariant) => void;
}

export const VariantSelector = ({
  variants,
  selectedVariant,
  onVariantChange,
}: VariantSelectorProps) => {
  if (!variants || variants.length === 0) {
    return null;
  }

  // Group variants by attribute name (e.g., "Size", "Color")
  const groupedVariants = variants.reduce((acc, variant) => {
    const key = variant.attributeName || "Variant";
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(variant);
    return acc;
  }, {} as Record<string, ProductVariant[]>);

  return (
    <div className="space-y-4">
      {Object.entries(groupedVariants).map(([attributeName, variantList]) => (
        <div key={attributeName}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {attributeName}
          </label>
          <div className="flex flex-wrap gap-2">
            {variantList.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              const isOutOfStock = variant.stock === 0;

              return (
                <button
                  key={variant.id}
                  onClick={() => !isOutOfStock && onVariantChange(variant)}
                  disabled={isOutOfStock}
                  className={`
                    px-4 py-2 rounded-lg border-2 transition-all font-medium
                    ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }
                    ${
                      isOutOfStock
                        ? "opacity-50 cursor-not-allowed line-through"
                        : "cursor-pointer"
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span>{variant.attributeValue}</span>
                    {variant.additionalPrice > 0 && (
                      <span className="text-xs text-gray-500">
                        +{variant.additionalPrice.toLocaleString()}₫
                      </span>
                    )}
                  </div>
                  {isOutOfStock && (
                    <span className="text-xs text-red-500">Hết hàng</span>
                  )}
                  {!isOutOfStock && variant.stock < 10 && (
                    <span className="text-xs text-orange-500">
                      Còn {variant.stock}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
