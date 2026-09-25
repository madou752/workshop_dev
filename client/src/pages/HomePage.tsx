import { Link } from "react-router-dom";
import { useGetProductsQuery } from "@/api/apiSlice";
import ProductCard from "@/components/ProductCard";
import VideoHero from "@/components/VideoHero";
import { craftSteps } from "@/lib/maison";
import { collections, collectionSlugs } from "@/lib/categories";

export default function HomePage() {
  const { data: products } = useGetProductsQuery();
  const featured = products?.slice(0, 3) ?? [];

  return (
    <div>
      <VideoHero />

      <section className="border-b border-ardoise bg-nuit-profond">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 py-24 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div className="relative flex justify-center py-6">
            {/* Soft gold halo behind the cut-out bottle. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 45% 50% at 50% 45%, rgba(201,169,97,0.16), transparent 70%)",
              }}
            />
            <picture className="relative">
              <source srcSet="/flacon-lahistair-detoure.webp" type="image/webp" />
              <img
                src="/flacon-lahistair-detoure.png"
                alt="Flacon Lahist'air, Air de haute altitude"
                loading="lazy"
                width={406}
                height={1400}
                className="animate-float-bottle h-[420px] w-auto drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)] sm:h-[520px]"
              />
            </picture>
          </div>
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

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-[11px] uppercase tracking-[0.3em] text-or">
          Les collections
        </p>
        <h2 className="mt-3 font-serif text-4xl font-light text-ivoire">
          Trois territoires
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {collectionSlugs.map((c, i) => (
            <Link
              key={c}
              to={`/collection/${c}`}
              style={{ animationDelay: `${i * 90}ms` }}
              className="group relative flex aspect-[3/4] animate-in fade-in slide-in-from-bottom-2 fill-mode-both items-end overflow-hidden rounded-sm border border-ardoise duration-500"
            >
              <img
                src={encodeURI(collections[c].image)}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-nuit via-nuit/40 to-transparent" />
              <div className="relative p-6">
                <p className="font-serif text-2xl text-ivoire">
                  {collections[c].label}
                </p>
                <p className="mt-1 text-sm text-ivoire/70">
                  {collections[c].blurb}
                </p>
                <p className="mt-4 text-[11px] uppercase tracking-[0.25em] text-or opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Découvrir &rarr;
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <h2 className="font-serif text-2xl text-ivoire">
            Tendance du moment
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
