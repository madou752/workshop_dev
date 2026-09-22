import { Link } from "react-router-dom";
import { useGetProductsQuery } from "@/api/apiSlice";
import ProductCard from "@/components/ProductCard";
import AirBottle from "@/components/AirBottle";
import { Button } from "@/components/ui/button";

const categories = [
  {
    slug: "desert",
    label: "Air du Désert",
    blurb: "Sec, ancien, imperturbable.",
  },
  {
    slug: "city",
    label: "Air Urbain",
    blurb: "Notes d'espresso et d'ambition.",
  },
  {
    slug: "landmark",
    label: "Air de Monument",
    blurb: "Air raréfié des lieux élevés.",
  },
  {
    slug: "celebrity",
    label: "Collab Célébrité",
    blurb: "De l'air, mais glamour.",
  },
];

export default function HomePage() {
  const { data: products } = useGetProductsQuery();
  const featured = products?.slice(0, 3) ?? [];

  return (
    <div>
      <section className="border-b border-ardoise bg-nuit-profond text-ivoire">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-24 sm:grid-cols-2 sm:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-or">
              Édition 01 &mdash; Maison d&rsquo;air d&rsquo;exception
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              Respirer est un luxe.
            </h1>
            <p className="mt-5 max-w-md text-ivoire/70">
              Une identité sobre pour un produit qui ne l&rsquo;est pas. Le
              vide, mis en bouteille, présenté avec le sérieux qu&rsquo;il
              mérite &mdash; du Sahara à l&rsquo;aube jusqu&rsquo;au sommet
              de l&rsquo;Everest.
            </p>
            <Button asChild size="lg" className="mt-8 rounded-full">
              <Link to="/boutique">Découvrir la Collection</Link>
            </Button>
          </div>
          <div className="flex items-center justify-center rounded-3xl border border-ivoire/10 bg-nuit py-12">
            <AirBottle
              size="large"
              tagline="Air de haute altitude"
              altitude="2 847 m"
              volumeMl={500}
              lotNumber="N° 0001"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-serif text-2xl text-ivoire">Collections</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/boutique?category=${c.slug}`}
              className="rounded border border-ardoise p-5 transition-colors hover:border-or"
            >
              <p className="font-serif text-lg text-ivoire">{c.label}</p>
              <p className="mt-1 text-sm text-gris">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <h2 className="font-serif text-2xl text-ivoire">
            Tendance du Moment
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
