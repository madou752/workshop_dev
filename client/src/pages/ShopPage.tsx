import { useSearchParams } from "react-router-dom";
import { useGetProductsQuery } from "@/api/apiSlice";
import ProductCard from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/Skeletons";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import type { ProductCategory } from "@/types/product";
import { categoryLabel, collectionSlugs } from "@/lib/categories";

const filters: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "Tout" },
  ...collectionSlugs.map((c) => ({ value: c, label: categoryLabel[c] })),
];

export default function ShopPage() {
  useDocumentTitle("La Collection");
  const { data: products, isLoading, isError } = useGetProductsQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "all";

  const visible =
    activeCategory === "all"
      ? products
      : products?.filter((p) => p.category === activeCategory);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="font-serif text-3xl text-ivoire">La Collection</h1>
      <p className="mt-2 max-w-xl text-gris">
        Chaque flacon est scellé à la main et numéroté. Le prix reflète la
        rareté, pas le volume.
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
                ? "border-or bg-or text-nuit"
                : "border-ardoise text-gris hover:border-gris"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="mt-10">
          <ProductGridSkeleton />
        </div>
      )}
      {isError && (
        <p className="mt-10 text-destructive">
          Impossible d&rsquo;atteindre la cave à air. Le serveur est-il
          lancé&nbsp;?
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
