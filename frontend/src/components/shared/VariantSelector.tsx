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



  return (
    <>
    </>
  );
};
