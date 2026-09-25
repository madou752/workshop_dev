import { Link } from "react-router-dom";
import { useGetProductsQuery } from "@/api/apiSlice";
import { craftSteps } from "@/lib/maison";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import type { Product } from "@/types/product";

const faqs = [
  {
    q: "N'est-ce pas simplement… de l'air ?",
    a: "C'est de l'air avec une provenance. Un flacon d'air non traçable est une curiosité. Un flacon d'air récolté à l'aube au-dessus du Sahara, filtré trois fois et scellé sous azote est une pièce de collection.",
  },
  {
    q: "Comment l'air est-il vraiment récolté ?",
    a: "Nos partenaires de récolte utilisent des enceintes à vide de qualité médicale sur chaque site d'origine, à un moment de la journée choisi pour l'atmosphère caractéristique du lieu.",
  },
  {
    q: "Puis-je ouvrir le flacon ?",
    a: "Vous le pouvez, mais l'air qu'il contient est immédiatement remplacé par celui de votre pièce. Nous recommandons de l'admirer scellé.",
  },
];

/** Top of the altitude scale, just above our highest capture. */
const SCALE_MAX_M = 3000;
const SCALE_TICKS_M = [0, 500, 1000, 2000, 3000];
const SCALE_HEIGHT_PX = 1100;

const metres = (p: Product) => Number(p.altitude.replace(/\D/g, "")) || 0;

/**
 * Square-root scale: most captures sit below 600 m, a linear axis would
 * pile them all at the bottom.
 */
const scaleTop = (m: number) =>
  (1 - Math.sqrt(Math.min(m, SCALE_MAX_M) / SCALE_MAX_M)) * SCALE_HEIGHT_PX;

function AltitudeEntry({ product, side }: { product: Product; side: "left" | "right" }) {
  return (
    <Link
      to={`/produit/${product.slug}`}
      className={`group flex items-center gap-4 ${
        side === "left" ? "flex-row-reverse text-right" : ""
      }`}
    >
      <div className="size-12 shrink-0 overflow-hidden rounded-full border border-or/30 bg-nuit-profond">
        {product.image && (
          <img
            src={encodeURI(product.image)}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
      </div>
      <div>
        <p className="font-serif text-lg leading-tight text-ivoire transition-colors group-hover:text-or">
          {product.name}
        </p>
        <p className="text-xs uppercase tracking-[0.25em] text-gris">
          {product.altitude} &middot; {product.origin}
        </p>
      </div>
    </Link>
  );
}

function AltitudeScale({ products }: { products: Product[] }) {
  const sorted = [...products].sort((a, b) => metres(b) - metres(a));

  return (
    <>
      {/* Desktop: a vertical axis, entries alternating either side. */}
      <div
        className="relative mx-auto hidden md:block"
        style={{ height: SCALE_HEIGHT_PX }}
      >
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-or via-or/40 to-ivoire/10" />
        {SCALE_TICKS_M.map((m) => (
          <div
            key={m}
            className="absolute left-1/2 -translate-y-1/2 pl-3 text-[11px] tracking-[0.2em] text-ivoire/25"
            style={{ top: scaleTop(m) }}
          >
            {m.toLocaleString("fr-FR")} m
          </div>
        ))}
        {sorted.map((p, i) => {
          const side = i % 2 === 0 ? "left" : "right";
          return (
            <div
              key={p.id}
              className="absolute inset-x-0 -translate-y-1/2"
              style={{ top: scaleTop(metres(p)) }}
            >
              <span className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-or ring-4 ring-nuit" />
              <span
                className={`absolute top-1/2 h-px w-10 bg-or/40 ${
                  side === "left" ? "right-1/2 mr-2" : "left-1/2 ml-2"
                }`}
              />
              <div
                className={`absolute top-1/2 w-[calc(50%-4.5rem)] -translate-y-1/2 ${
                  side === "left" ? "right-[calc(50%+3.5rem)]" : "left-[calc(50%+3.5rem)]"
                }`}
              >
                <AltitudeEntry product={p} side={side} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: the same order as a simple descending list. */}
      <ol className="space-y-6 border-l border-or/40 pl-6 md:hidden">
        {sorted.map((p) => (
          <li key={p.id} className="relative">
            <span className="absolute -left-[29px] top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-or" />
            <AltitudeEntry product={p} side="right" />
          </li>
        ))}
      </ol>
    </>
  );
}

export default function AboutPage() {
  useDocumentTitle("Notre Maison");
  const { data: products } = useGetProductsQuery();

  return (
    <div>
      <section className="relative overflow-hidden border-b border-ardoise">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-35 [mask-image:linear-gradient(to_bottom,black,transparent)]"
          style={{ backgroundImage: "url(/montverde.jpg)" }}
        />
        <div className="relative mx-auto max-w-3xl px-6 py-28 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-or">
            Notre Maison
          </p>
          <h1 className="mt-5 font-serif text-5xl font-light leading-tight text-ivoire sm:text-6xl">
            Respirer est un luxe.
          </h1>
          <div className="mx-auto mt-8 h-px w-16 bg-or" />
          <p className="mx-auto mt-8 max-w-xl leading-relaxed text-ivoire/75">
            Tout le reste peut être fabriqué, reproduit, produit en série.
            L&rsquo;air, en un lieu précis, à un instant précis, ne le peut
            pas. Lahist&rsquo;air existe pour celles et ceux qui savent que les
            luxes les plus vrais sont ceux qu&rsquo;on ne refera jamais.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="font-serif text-3xl font-light italic leading-snug text-ivoire/90 sm:text-4xl">
          &laquo;&nbsp;Nous ne fabriquons rien. Nous choisissons un lieu, une
          heure, une saison &mdash; puis nous refermons le flacon avant que
          l&rsquo;instant ne s&rsquo;échappe.&nbsp;&raquo;
        </p>
        <p className="mt-6 text-xs uppercase tracking-[0.3em] text-or">
          Le manifeste de la Maison
        </p>
      </section>

      <section className="border-y border-ardoise bg-nuit-profond">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="text-center text-xs uppercase tracking-[0.3em] text-or">
            Savoir-faire
          </p>
          <h2 className="mt-4 text-center font-serif text-4xl font-light text-ivoire">
            Trois gestes, jamais davantage.
          </h2>
          <ol className="mt-16 grid gap-12 md:grid-cols-3">
            {craftSteps.map((step) => (
              <li key={step.numeral} className="border-t border-or/40 pt-6">
                <span className="font-serif text-3xl text-or">
                  {step.numeral}
                </span>
                <p className="mt-4 font-serif text-2xl text-ivoire">
                  {step.title}
                </p>
                <p className="mt-3 leading-relaxed text-gris">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {products && products.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-24">
          <p className="text-center text-xs uppercase tracking-[0.3em] text-or">
            Nos altitudes
          </p>
          <h2 className="mt-4 text-center font-serif text-4xl font-light text-ivoire">
            Du niveau de la mer aux cimes.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-center leading-relaxed text-ivoire/60">
            Chaque flacon porte l&rsquo;altitude exacte de sa captation.
            Parcourez la collection du plus haut au plus bas.
          </p>
          <div className="mt-16">
            <AltitudeScale products={products} />
          </div>
        </section>
      )}

      <section className="border-t border-ardoise">
        <div className="mx-auto max-w-3xl px-6 py-24">
          <h2 className="font-serif text-3xl font-light text-ivoire">
            Questions fréquentes
          </h2>
          <div className="mt-8 divide-y divide-ardoise border-y border-ardoise">
            {faqs.map((faq) => (
              <details key={faq.q} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-serif text-xl text-ivoire marker:hidden">
                  {faq.q}
                  <span className="text-or transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 leading-relaxed text-gris">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
