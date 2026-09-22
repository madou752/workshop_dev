import type { ProductSize } from "@/types/product";

interface SizeSelectorProps {
  sizes: ProductSize[];
  selectedId: string;
  onSelect: (sizeId: string) => void;
}

export default function SizeSelector({
  sizes,
  selectedId,
  onSelect,
}: SizeSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {sizes.map((size) => {
        const isSelected = size.id === selectedId;
        return (
          <button
            key={size.id}
            type="button"
            onClick={() => onSelect(size.id)}
            className={`rounded border px-4 py-3 text-left transition-colors ${
              isSelected
                ? "border-or bg-or/10"
                : "border-ardoise hover:border-gris"
            }`}
          >
            <p className="text-sm font-medium text-ivoire">{size.label}</p>
            <p className="text-xs text-gris">{size.volumeMl}&nbsp;mL</p>
            <p className="mt-1 text-sm font-medium text-or">
              {size.priceEUR}&nbsp;&euro;
            </p>
          </button>
        );
      })}
    </div>
  );
}
