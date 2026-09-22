import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { clearCart } from "@/features/cart/cartSlice";
import { usePlaceOrderMutation } from "@/api/apiSlice";
import CreditCardForm, { type CardDetails } from "@/components/CreditCardForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ShippingDetails {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const emptyShipping: ShippingDetails = {
  fullName: "",
  email: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
};

const emptyCard: CardDetails = {
  cardholderName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

export default function CheckoutPage() {
  const lines = useAppSelector((state) => state.cart.lines);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [placeOrder, { isLoading }] = usePlaceOrderMutation();

  const [shipping, setShipping] = useState(emptyShipping);
  const [card, setCard] = useState(emptyCard);
  const [error, setError] = useState<string | null>(null);

  const total = lines.reduce(
    (sum, line) => sum + line.priceEUR * line.quantity,
    0,
  );

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center text-ivoire/60">
        Votre panier est vide &mdash; rien à commander.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const digits = card.cardNumber.replace(/\D/g, "");
    if (digits.length < 12) {
      setError("Ce numéro de carte semble incomplet.");
      return;
    }

    try {
      const result = await placeOrder({
        items: lines.map((line) => ({
          productId: line.productId,
          sizeId: line.sizeId,
          quantity: line.quantity,
        })),
        customer: {
          fullName: shipping.fullName,
          email: shipping.email,
          address: shipping.address,
          city: shipping.city,
          postalCode: shipping.postalCode,
          country: shipping.country,
        },
        payment: {
          cardholderName: card.cardholderName,
          cardNumberLast4: digits.slice(-4),
        },
      }).unwrap();

      dispatch(clearCart());
      navigate(`/confirmation/${result.orderId}`);
    } catch {
      setError("La cave à air n'a pas pu confirmer votre commande. Réessayez.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="font-serif text-3xl text-ivoire">Commande</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-10 sm:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-4 rounded border border-ardoise bg-brume-profond p-6">
            <p className="text-sm font-medium uppercase tracking-wide text-ivoire/70">
              Coordonnées de livraison
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="ship-name">Nom complet</Label>
              <Input
                id="ship-name"
                required
                value={shipping.fullName}
                onChange={(e) =>
                  setShipping({ ...shipping, fullName: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ship-email">E-mail</Label>
              <Input
                id="ship-email"
                required
                type="email"
                value={shipping.email}
                onChange={(e) =>
                  setShipping({ ...shipping, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ship-address">Adresse</Label>
              <Input
                id="ship-address"
                required
                value={shipping.address}
                onChange={(e) =>
                  setShipping({ ...shipping, address: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="ship-city">Ville</Label>
                <Input
                  id="ship-city"
                  required
                  value={shipping.city}
                  onChange={(e) =>
                    setShipping({ ...shipping, city: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ship-postal">Code postal</Label>
                <Input
                  id="ship-postal"
                  required
                  value={shipping.postalCode}
                  onChange={(e) =>
                    setShipping({ ...shipping, postalCode: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ship-country">Pays</Label>
              <Input
                id="ship-country"
                required
                value={shipping.country}
                onChange={(e) =>
                  setShipping({ ...shipping, country: e.target.value })
                }
              />
            </div>
          </div>

          <CreditCardForm value={card} onChange={setCard} />
        </div>

        <div className="h-fit space-y-4 rounded border border-ardoise bg-brume-profond p-6">
          <p className="text-sm font-medium uppercase tracking-wide text-ivoire/70">
            Récapitulatif
          </p>
          <ul className="space-y-2 text-sm">
            {lines.map((line) => (
              <li
                key={`${line.productId}-${line.sizeId}`}
                className="flex justify-between"
              >
                <span className="text-ivoire/70">
                  {line.name} ({line.sizeLabel}) &times; {line.quantity}
                </span>
                <span className="text-ivoire">
                  {line.priceEUR * line.quantity}&nbsp;&euro;
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t border-ardoise pt-3 font-medium text-ivoire">
            <span>Total</span>
            <span>{total}&nbsp;&euro;</span>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="w-full rounded-full"
          >
            {isLoading ? "Traitement en cours..." : `Payer ${total} €`}
          </Button>
          <p className="text-center text-xs text-ivoire/40">
            Paiement de démonstration &mdash; aucune transaction réelle
            n&rsquo;est effectuée.
          </p>
        </div>
      </form>
    </div>
  );
}
