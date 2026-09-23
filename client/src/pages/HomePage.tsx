import { Link } from "react-router-dom";
import { useGetProductsQuery } from "@/api/apiSlice";
import ProductCard from "@/components/ProductCard";
import VideoHero from "@/components/VideoHero";

const craftSteps = [
  {
    numeral: "I",
    title: "La captation",
    text: "L'air est recueilli à l'aube, au-dessus de la ligne des nuages, avant que le jour ne le réchauffe.",
  },
  {
    numeral: "II",
    title: "Le scellage",
    text: "Le flacon est fermé sur place. Sa bague en laiton guilloché garantit une étanchéité parfaite.",
  },
  {
    numeral: "III",
    title: "La numérotation",
    text: "Chaque lot reçoit un numéro unique, consigné au registre de la Maison.",
  },
];

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
    slug: "nature",
    label: "Air Sauvage",
    blurb: "Forêts, cascades et sommets.",
  },
];

export default function HomePage() {
  const { data: products } = useGetProductsQuery();
  const featured = products?.slice(0, 3) ?? [];

  return (
    <div>
      <VideoHero />

      <section className="border-b border-ardoise bg-nuit-profond">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 py-24 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div
            role="img"
            aria-label="Détail de l'étiquette Lahist'air"
            className="mx-auto aspect-[4/5] w-full max-w-md rounded-sm border border-ivoire/10 bg-no-repeat lg:max-w-none"
            style={{
              backgroundImage: "url(/hero-altitude.jpg)",
              backgroundSize: "260%",
              backgroundPosition: "50% 62%",
            }}
          />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-or">
              Savoir-faire
            </p>
            <h2 className="mt-4 font-serif text-4xl font-light leading-tight text-ivoire">
              Chaque flacon est une altitude.
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-ivoire/70">
              Nous ne fabriquons rien. Nous choisissons un lieu, une heure,
              une saison &mdash; puis nous refermons le flacon avant que
              l&rsquo;instant ne s&rsquo;échappe.
            </p>
            <ol className="mt-12 divide-y divide-ivoire/10 border-y border-ivoire/10">
              {craftSteps.map((step) => (
                <li key={step.numeral} className="grid grid-cols-[3rem_1fr] gap-4 py-6">
                  <span className="font-serif text-xl text-or">
                    {step.numeral}
                  </span>
                  <div>
                    <p className="font-serif text-xl text-ivoire">
                      {step.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-gris">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-serif text-2xl text-ivoire">Collections</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {categories.map((c, i) => (
            <Link
              key={c.slug}
              to={`/boutique?category=${c.slug}`}
              style={{ animationDelay: `${i * 75}ms` }}
              className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both rounded border border-ardoise p-5 transition-all duration-500 hover:-translate-y-1 hover:border-or"
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
            {featured.map((product, i) => (
              <div
                key={product.id}
                style={{ animationDelay: `${i * 100}ms` }}
                className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
