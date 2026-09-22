import type { ProductSize } from "../types/product";

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
            className={`rounded-xl border px-4 py-3 text-left transition-colors ${
              isSelected
                ? "border-gold-500 bg-gold-500/10"
                : "border-air-950/15 hover:border-air-950/40"
            }`}
          >
            <p className="text-sm font-medium text-air-950">{size.label}</p>
            <p className="text-xs text-air-950/60">{size.volumeMl} mL</p>
            <p className="mt-1 text-sm font-medium text-gold-500">
              &euro;{size.priceEUR}
            </p>
          </button>
        );
      })}
    </div>
  );
}
