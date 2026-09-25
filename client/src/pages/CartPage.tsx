import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import CartLineItem from "@/components/CartLineItem";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  useDocumentTitle("Votre panier");
  const lines = useAppSelector((state) => state.cart.lines);
  const navigate = useNavigate();

  const total = lines.reduce(
    (sum, line) => sum + line.priceEUR * line.quantity,
    0,
  );

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-serif text-3xl font-light text-ivoire">
          Votre panier est aussi léger que l&rsquo;air.
        </h1>
        <Button asChild size="lg" className="mt-8 rounded-full px-8">
          <Link to="/boutique">Découvrir la collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <p className="text-xs uppercase tracking-[0.3em] text-or">Panier</p>
      <h1 className="mt-3 font-serif text-4xl font-light text-ivoire">
        Votre sélection
      </h1>

      <ul className="mt-8 divide-y divide-ardoise border-y border-ardoise">
        {lines.map((line) => (
          <CartLineItem key={`${line.productId}-${line.sizeId}`} line={line} />
        ))}
      </ul>

      <div className="mt-8 flex items-baseline justify-between">
        <p className="text-xs uppercase tracking-[0.25em] text-gris">
          Sous-total
        </p>
        <p className="font-serif text-3xl text-ivoire">{total}&nbsp;&euro;</p>
      </div>
      <p className="mt-2 text-right text-xs text-ivoire/50">
        Livraison en coffret signature offerte.
      </p>

      <Button
        size="lg"
        className="mt-8 w-full rounded-full"
        onClick={() => navigate("/commande")}
      >
        Commander
      </Button>
    </div>
  );
}
