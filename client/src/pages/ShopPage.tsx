import { useSearchParams } from "react-router-dom";
import { useGetProductsQuery } from "../api/apiSlice";
import ProductCard from "../components/ProductCard";
import type { ProductCategory } from "../types/product";

const filters: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "desert", label: "Desert Air" },
  { value: "city", label: "City Air" },
  { value: "landmark", label: "Landmark Air" },
  { value: "celebrity", label: "Celebrity Collab" },
];

export default function ShopPage() {
  const { data: products, isLoading, isError } = useGetProductsQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "all";

  const visible =
    activeCategory === "all"
      ? products
      : products?.filter((p) => p.category === activeCategory);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="font-serif text-3xl text-air-950">The Collection</h1>
      <p className="mt-2 max-w-xl text-air-950/60">
        Every bottle is hand-sealed and numbered. Prices reflect rarity, not
        volume.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() =>
              f.value === "all"
                ? setSearchParams({})
                : setSearchParams({ category: f.value })
            }
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              activeCategory === f.value
                ? "border-air-950 bg-air-950 text-air-50"
                : "border-air-950/15 text-air-950/70 hover:border-air-950/40"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <p className="mt-10 text-air-950/60">Loading the collection...</p>
      )}
      {isError && (
        <p className="mt-10 text-red-600">
          Couldn&rsquo;t reach the air cellar. Is the server running?
        </p>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
