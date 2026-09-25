import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "@/api/apiSlice";
import ProductCard from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/Skeletons";
import { collections, collectionSlugs } from "@/lib/categories";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import type { ProductCategory } from "@/types/product";

export default function CollectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: products, isLoading, isError } = useGetProductsQuery();

  const category = collectionSlugs.find((c) => c === slug) as
    | ProductCategory
    | undefined;
  useDocumentTitle(category ? collections[category].label : "Collection introuvable");

  if (!category) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="font-serif text-2xl font-light text-ivoire/80">
          Cette collection s&rsquo;est dissipée dans l&rsquo;air.
        </p>
        <Link to="/boutique" className="mt-4 inline-block text-or">
          Voir toute la collection
        </Link>
      </div>
    );
  }

  const collection = collections[category];
  const items = products?.filter((p) => p.category === category) ?? [];
  const others = collectionSlugs.filter((c) => c !== category);

  return (
    <div>
      <section className="border-b border-ardoise bg-nuit-profond">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-14 lg:grid-cols-2 lg:py-20">
          <div className="order-2 lg:order-1">
            <nav
              aria-label="Fil d'Ariane"
              className="text-xs uppercase tracking-[0.25em] text-gris"
            >
              <Link to="/boutique" className="hover:text-ivoire">
                La Collection
              </Link>
              <span className="mx-3 text-gris-fonce">/</span>
              <span className="text-ivoire/80">{collection.label}</span>
            </nav>
            <h1 className="mt-6 animate-in fade-in slide-in-from-bottom-4 font-serif text-5xl font-light text-ivoire duration-700 sm:text-6xl">
              {collection.label}
            </h1>
            <div className="mt-6 h-px w-16 bg-or" />
            <p className="mt-6 max-w-md leading-relaxed text-ivoire/75">
              {collection.intro}
            </p>
          </div>
          <div className="order-1 overflow-hidden rounded-sm border border-ardoise lg:order-2">
            <img
              src={encodeURI(collection.image)}
              alt=""
              fetchPriority="high"
              className="aspect-[4/3] w-full animate-in fade-in object-cover duration-700 lg:aspect-square"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.3em] text-gris">
          {isLoading
            ? "\u00a0"
            : `${items.length} flacon${items.length > 1 ? "s" : ""}`}
        </p>

        {isLoading && (
          <div className="mt-8">
            <ProductGridSkeleton count={3} />
          </div>
        )}

        {isError && (
          <p className="mt-10 text-destructive">
            Impossible d&rsquo;atteindre la cave à air. Le serveur est-il
            lancé&nbsp;?
          </p>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product, i) => (
            <div
              key={product.id}
              style={{ animationDelay: `${i * 80}ms` }}
              className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-ardoise">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-xs uppercase tracking-[0.3em] text-or">
            Poursuivre
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {others.map((c) => (
              <Link
                key={c}
                to={`/collection/${c}`}
                className="group relative flex h-48 items-end overflow-hidden rounded-sm border border-ardoise"
              >
                <img
                  src={encodeURI(collections[c].image)}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-nuit/90 to-nuit/10" />
                <div className="relative p-6">
                  <p className="font-serif text-2xl text-ivoire">
                    {collections[c].label}
                  </p>
                  <p className="mt-1 text-sm text-ivoire/70">
                    {collections[c].blurb}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
