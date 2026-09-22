import { Link } from "react-router-dom";
import { useGetProductsQuery } from "../api/apiSlice";
import ProductCard from "../components/ProductCard";

const categories = [
  {
    slug: "desert",
    label: "Desert Air",
    blurb: "Dry, ancient, unbothered.",
  },
  {
    slug: "city",
    label: "City Air",
    blurb: "Notes of ambition and espresso.",
  },
  {
    slug: "landmark",
    label: "Landmark Air",
    blurb: "Thin air from tall places.",
  },
  {
    slug: "celebrity",
    label: "Celebrity Collab",
    blurb: "Air, but make it famous.",
  },
];

export default function HomePage() {
  const { data: products } = useGetProductsQuery();
  const featured = products?.slice(0, 3) ?? [];

  return (
    <div>
      <section className="border-b border-air-950/10 bg-air-900 text-air-50">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-24 sm:grid-cols-2 sm:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold-400">
              Est. 2019 &mdash; Small-batch atmosphere
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              The air is different up here.
            </h1>
            <p className="mt-5 max-w-md text-air-100/80">
              Aéther sources, filters, and bottles the world&rsquo;s most
              coveted air &mdash; from the Sahara at dawn to the summit of
              Everest &mdash; for collectors who have everything except this.
            </p>
            <Link
              to="/shop"
              className="mt-8 inline-block rounded-full bg-gold-500 px-7 py-3 text-sm font-medium uppercase tracking-wide text-air-950 transition-colors hover:bg-gold-400"
            >
              Shop the Collection
            </Link>
          </div>
          <div className="aspect-square overflow-hidden rounded-3xl border border-air-50/10">
            <img
              src="https://picsum.photos/seed/aether-hero/800/800"
              alt="A bottle of Aéther air on display"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-serif text-2xl text-air-950">Collections</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/shop?category=${c.slug}`}
              className="rounded-2xl border border-air-950/10 p-5 transition-colors hover:border-gold-400"
            >
              <p className="font-serif text-lg text-air-950">{c.label}</p>
              <p className="mt-1 text-sm text-air-950/60">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <h2 className="font-serif text-2xl text-air-950">
            Currently Trending
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
