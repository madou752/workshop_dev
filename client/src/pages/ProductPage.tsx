import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetProductBySlugQuery } from "@/api/apiSlice";
import { useAppDispatch } from "@/app/hooks";
import { addLine } from "@/features/cart/cartSlice";
import SizeSelector from "@/components/SizeSelector";
import AirBottle from "@/components/AirBottle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useGetProductBySlugQuery(
    slug ?? "",
    { skip: !slug },
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);

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

  const handleAddToCart = () => {
    dispatch(
      addLine({
        productId: product.id,
        sizeId: activeSize.id,
        name: product.name,
        sizeLabel: activeSize.label,
        priceEUR: activeSize.priceEUR,
        quantity: 1,
      }),
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const specs = [
    { label: "Contenance", value: `${activeSize.volumeMl} ml` },
    { label: "Origine", value: product.origin },
    { label: "Composition", value: product.composition },
    { label: "Altitude", value: product.altitude },
    { label: "Lot", value: product.lotNumber },
    { label: "Prix", value: `${activeSize.priceEUR} €`, accent: true },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="grid gap-12 sm:grid-cols-2">
        <div className="relative flex items-center justify-center overflow-hidden rounded-3xl border border-ardoise bg-nuit-profond py-14">
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
        </div>
        <div>
          <div className="flex items-center gap-3">
            <p className="text-xs uppercase tracking-wide text-or">
              {product.origin}
            </p>
            {product.limitedEdition && (
              <Badge className="uppercase tracking-wide">
                Édition Limitée
              </Badge>
            )}
          </div>
          <h1 className="mt-2 font-serif text-3xl text-ivoire">
            {product.name}
          </h1>
          <p className="mt-3 text-ivoire/70">{product.description}</p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {product.notes.map((note) => (
              <li
                key={note}
                className="rounded-full bg-brume px-3 py-1 text-xs text-ivoire/70"
              >
                {note}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <p className="mb-3 text-sm font-medium uppercase tracking-wide text-ivoire/70">
              Choisissez un format
            </p>
            <SizeSelector
              sizes={product.sizes}
              selectedId={activeSize.id}
              onSelect={setSelectedSizeId}
            />
          </div>

          <div className="mt-8 flex items-center gap-4">
            <Button size="lg" className="rounded-full" onClick={handleAddToCart}>
              Ajouter au panier &mdash; {activeSize.priceEUR}&nbsp;&euro;
            </Button>
            {justAdded && (
              <span className="text-sm text-or">Ajouté au panier</span>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              handleAddToCart();
              navigate("/commande");
            }}
            className="mt-3 block text-sm text-ivoire/50 underline underline-offset-4 hover:text-ivoire"
          >
            Acheter maintenant
          </button>

          <Separator className="my-8" />

          <dl className="grid gap-3 text-sm">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="flex items-center justify-between border-b border-ardoise pb-2"
              >
                <dt className="text-gris">{spec.label}</dt>
                <dd className={spec.accent ? "text-or" : "text-ivoire"}>
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
