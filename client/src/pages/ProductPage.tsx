import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ConciergeBell, Gift, Package } from "lucide-react";
import {
  useGetProductBySlugQuery,
  useGetProductsQuery,
} from "@/api/apiSlice";
import { useAppDispatch } from "@/app/hooks";
import { addLine, openCart } from "@/features/cart/cartSlice";
import SizeSelector from "@/components/SizeSelector";
import AirBottle from "@/components/AirBottle";
import ProductCard from "@/components/ProductCard";
import Certificate from "@/components/Certificate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categoryLabel } from "@/lib/categories";
import type { Product } from "@/types/product";

const noteTiers = ["Note de tête", "Note de cœur", "Note de fond"];

const services = [
  { icon: Package, label: "Livraison en coffret signature" },
  { icon: Gift, label: "Emballage cadeau offert" },
  { icon: ConciergeBell, label: "Conciergerie dédiée" },
];

const eyebrow = "text-[11px] uppercase tracking-[0.3em] text-or";

/** True once `el` has scrolled up past the top of the viewport. */
function useScrolledPastElement(el: HTMLElement | null) {
  const [past, setPast] = useState(false);

  useEffect(() => {
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setPast(!entry.isIntersecting && entry.boundingClientRect.top < 0),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [el]);

  return past;
}

function relatedProducts(all: Product[] | undefined, current: Product) {
  if (!all) return [];
  const others = all.filter((p) => p.id !== current.id);
  const sameCategory = others.filter((p) => p.category === current.category);
  const rest = others.filter((p) => p.category !== current.category);
  return [...sameCategory, ...rest].slice(0, 3);
}

function Breadcrumb({ product, className = "" }: { product: Product; className?: string }) {
  return (
    <nav
      aria-label="Fil d'Ariane"
      className={`text-[11px] uppercase tracking-[0.25em] text-gris ${className}`}
    >
      <Link to="/boutique" className="hover:text-ivoire">
        La Collection
      </Link>
      <span className="mx-3 text-gris-fonce">/</span>
      <Link
        to={`/collection/${product.category}`}
        className="hover:text-ivoire"
      >
        {categoryLabel[product.category]}
      </Link>
      <span className="mx-3 text-gris-fonce">/</span>
      <span className="text-ivoire/80">{product.name}</span>
    </nav>
  );
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useGetProductBySlugQuery(
    slug ?? "",
    { skip: !slug },
  );
  const { data: allProducts } = useGetProductsQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  // State, not a ref: the buy row only mounts once the product has loaded.
  const [buyRow, setBuyRow] = useState<HTMLDivElement | null>(null);
  const showBuyBar = useScrolledPastElement(buyRow);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-gris">
        Chargement...
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-ivoire/70">Ce flacon a disparu dans l&rsquo;air.</p>
        <Link to="/boutique" className="mt-4 inline-block text-or">
          Retour à la collection
        </Link>
      </div>
    );
  }

  const activeSize =
    product.sizes.find((s) => s.id === selectedSizeId) ?? product.sizes[0];

  const handleAddToCart = (showCart = true) => {
    dispatch(
      addLine({
        productId: product.id,
        sizeId: activeSize.id,
        name: product.name,
        sizeLabel: activeSize.label,
        priceEUR: activeSize.priceEUR,
        quantity: 1,
        image: product.image,
      }),
    );
    if (showCart) dispatch(openCart());
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const provenance = [
    { label: "Origine", value: product.origin },
    { label: "Altitude", value: product.altitude },
    { label: "Composition", value: product.composition },
    { label: "Contenance", value: `${activeSize.volumeMl} ml` },
  ];

  const related = relatedProducts(allProducts, product);

  return (
    <div>
      {/* Slides in under the navbar once the main buy button is out of view. */}
      <div
        aria-hidden={!showBuyBar}
        className={`fixed inset-x-0 top-16 z-30 border-b border-or/20 bg-nuit/90 backdrop-blur-md transition-all duration-500 ${
          showBuyBar
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
          <p className="truncate text-sm text-ivoire">
            <span className="font-serif text-base">{product.name}</span>
            <span className="text-gris">
              {" "}
              &middot; {activeSize.volumeMl}&nbsp;ml &middot;{" "}
            </span>
            <span className="text-or">{activeSize.priceEUR}&nbsp;&euro;</span>
          </p>
          <Button
            size="sm"
            className="shrink-0 rounded-full px-5"
            onClick={() => handleAddToCart()}
            tabIndex={showBuyBar ? 0 : -1}
          >
            {justAdded ? "Ajouté" : "Ajouter au panier"}
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-10 lg:pt-14">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Breadcrumb and photo stick together, from where they start, so
              neither shifts while the details scroll past. */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Breadcrumb product={product} className="mb-8" />
            {product.image ? (
              <div className="overflow-hidden rounded-sm border border-ardoise bg-nuit-profond">
                <img
                  src={encodeURI(product.image)}
                  alt={`Flacon ${product.name}, ${product.origin}`}
                  fetchPriority="high"
                  className="aspect-square w-full animate-in fade-in object-cover duration-700"
                />
              </div>
            ) : (
              <div className="relative flex items-center justify-center overflow-hidden rounded-sm border border-ardoise bg-nuit-profond py-14 lg:h-[calc(100svh-13rem)] lg:py-0">
                <div
                  className="animate-drift pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse 50% 60% at 65% 55%, rgba(201,169,97,0.1), transparent 70%)",
                  }}
                />
                <AirBottle
                  key={activeSize.id}
                  size="large"
                  tagline={product.tagline}
                  altitude={product.altitude}
                  volumeMl={activeSize.volumeMl}
                  lotNumber={product.lotNumber}
                  floating
                  className="relative animate-in fade-in zoom-in-95 duration-300"
                />
                <p className="absolute bottom-5 left-0 right-0 text-center text-[10px] uppercase tracking-[0.3em] text-gris">
                  Lot {product.lotNumber} &middot; {product.altitude}
                </p>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-3">
              <p className={eyebrow}>{product.origin}</p>
              {product.limitedEdition && (
                <Badge className="uppercase tracking-wide">
                  Édition limitée
                </Badge>
              )}
            </div>
            <h1 className="mt-4 font-serif text-4xl font-light leading-tight text-ivoire sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-3 font-serif text-xl italic text-ivoire/70">
              {product.tagline}
            </p>
            <div className="mt-6 h-px w-16 bg-or" />
            <p className="mt-6 leading-relaxed text-ivoire/70">
              {product.description}
            </p>

            <div className="mt-10">
              <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-ivoire/60">
                Choisissez un format
              </p>
              <SizeSelector
                sizes={product.sizes}
                selectedId={activeSize.id}
                onSelect={setSelectedSizeId}
              />
            </div>

            <div ref={setBuyRow} className="mt-8 flex flex-wrap items-center gap-6">
              <Button
                size="lg"
                className="rounded-full px-8"
                onClick={() => handleAddToCart()}
              >
                Ajouter au panier &mdash; {activeSize.priceEUR}&nbsp;&euro;
              </Button>
              <button
                type="button"
                onClick={() => {
                  handleAddToCart(false);
                  navigate("/commande");
                }}
                className="text-sm uppercase tracking-[0.2em] text-ivoire/60 transition-colors hover:text-or"
              >
                Acheter maintenant
              </button>
            </div>
            <p
              aria-live="polite"
              className="mt-3 h-5 text-sm text-or"
            >
              {justAdded && "Ajouté au panier"}
            </p>

            <ul className="mt-8 grid gap-4 border-y border-ivoire/10 py-6 sm:grid-cols-3">
              {services.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm text-ivoire/70">
                  <Icon className="size-4 shrink-0 text-or" strokeWidth={1.25} />
                  {label}
                </li>
              ))}
            </ul>

            <section className="mt-14">
              <p className={eyebrow}>Notes</p>
              <h2 className="mt-3 font-serif text-2xl font-light text-ivoire">
                La composition olfactive
              </h2>
              <dl className="mt-6 divide-y divide-ivoire/10 border-y border-ivoire/10">
                {product.notes.map((note, i) => (
                  <div
                    key={note}
                    className="flex items-baseline justify-between gap-6 py-5"
                  >
                    <dt className="text-[11px] uppercase tracking-[0.25em] text-gris">
                      {noteTiers[i] ?? "Note"}
                    </dt>
                    <dd className="font-serif text-2xl font-light text-ivoire">
                      {note}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="mt-14">
              <p className={eyebrow}>Provenance</p>
              <dl className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {provenance.map((item) => (
                  <div key={item.label} className="border-t border-ivoire/10 pt-4">
                    <dt className="text-[11px] uppercase tracking-[0.25em] text-gris">
                      {item.label}
                    </dt>
                    <dd className="mt-2 text-ivoire">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="mt-14">
              <p className={eyebrow}>Authenticité</p>
              <Certificate
                className="mt-6"
                title={product.name}
                rows={[
                  { label: "Lot", value: product.lotNumber, emphasis: true },
                  { label: "Origine", value: product.origin },
                  { label: "Altitude", value: product.altitude },
                ]}
              />
            </section>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-28 border-t border-ivoire/10 pt-16">
            <p className={eyebrow}>La Collection</p>
            <h2 className="mt-3 font-serif text-3xl font-light text-ivoire">
              Vous aimerez aussi
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
