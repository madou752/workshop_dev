import type { ProductSize } from "@/types/product";
import AirBottle from "@/components/AirBottle";

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
  // Silhouettes grow with volume so the formats read at a glance.
  const largest = Math.max(...sizes.map((s) => s.volumeMl));

  return (
    <div className="grid grid-cols-3 gap-3">
      {sizes.map((size) => {
        const isSelected = size.id === selectedId;
        const scale = 0.5 + 0.45 * Math.sqrt(size.volumeMl / largest);
        return (
          <button
            key={size.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(size.id)}
            className={`group flex flex-col items-center rounded-sm border px-3 pb-4 pt-5 text-center transition-colors duration-300 ${
              isSelected
                ? "border-or bg-or/5"
                : "border-ardoise hover:border-gris-fonce"
            }`}
          >
            <div className="flex h-24 items-end">
              <div
                className={`origin-bottom transition-opacity duration-300 ${
                  isSelected ? "opacity-100" : "opacity-50 group-hover:opacity-80"
                }`}
                style={{ transform: `scale(${scale})` }}
              >
                <AirBottle size="mini" />
              </div>
            </div>
            <p className="mt-3 font-serif text-lg leading-none text-ivoire">
              {size.label}
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-gris">
              {size.volumeMl}&nbsp;ml
            </p>
            <p
              className={`mt-3 text-sm ${isSelected ? "text-or" : "text-ivoire/70"}`}
            >
              {size.priceEUR}&nbsp;&euro;
            </p>
          </button>
        );
      })}
    </div>
  );
}
