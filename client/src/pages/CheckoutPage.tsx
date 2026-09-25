import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { clearCart } from "@/features/cart/cartSlice";
import { usePlaceOrderMutation } from "@/api/apiSlice";
import CreditCardForm, { type CardDetails } from "@/components/CreditCardForm";
import AirBottle from "@/components/AirBottle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { shippingOptions } from "@/lib/shipping";
import type { ShippingMethod } from "@/types/product";

type Step = 1 | 2 | 3;

const steps: { id: Step; label: string }[] = [
  { id: 1, label: "Coordonnées" },
  { id: 2, label: "Livraison" },
  { id: 3, label: "Paiement" },
];

const GIFT_MESSAGE_MAX = 300;

const emptyCard: CardDetails = {
  cardholderName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

/** A finished step collapses to a one-line summary with an edit link. */
function StepSummary({
  label,
  lines,
  onEdit,
}: {
  label: string;
  lines: string[];
  onEdit: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-ardoise py-5">
      <div>
        <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-or">
          <Check className="size-3.5" /> {label}
        </p>
        {lines.map((l) => (
          <p key={l} className="mt-1 text-sm text-ivoire/70">
            {l}
          </p>
        ))}
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="text-xs uppercase tracking-[0.2em] text-ivoire/50 underline-offset-4 transition-colors hover:text-ivoire hover:underline"
      >
        Modifier
      </button>
    </div>
  );
}

export default function CheckoutPage() {
  const lines = useAppSelector((state) => state.cart.lines);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [placeOrder, { isLoading }] = usePlaceOrderMutation();

  const [step, setStep] = useState<Step>(1);
  const [contact, setContact] = useState({ fullName: "", email: "" });
  const [address, setAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "France",
  });
  const [method, setMethod] = useState<ShippingMethod>("signature");
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [hidePrices, setHidePrices] = useState(true);
  const [card, setCard] = useState(emptyCard);
  const [error, setError] = useState<string | null>(null);

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="font-serif text-2xl font-light text-ivoire/80">
          Votre panier est vide &mdash; rien à commander.
        </p>
        <Button asChild size="lg" className="mt-8 rounded-full px-8">
          <Link to="/boutique">Découvrir la collection</Link>
        </Button>
      </div>
    );
  }

  const shipping = shippingOptions.find((o) => o.method === method)!;
  const subtotal = lines.reduce((sum, l) => sum + l.priceEUR * l.quantity, 0);
  const total = subtotal + shipping.priceEUR;

  const handlePay = async (e: React.FormEvent) => {
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
        customer: { ...contact, ...address },
        payment: {
          cardholderName: card.cardholderName,
          cardNumberLast4: digits.slice(-4),
        },
        shippingMethod: method,
        ...(isGift && { gift: { message: giftMessage, hidePrices } }),
      }).unwrap();

      dispatch(clearCart());
      navigate(`/confirmation/${result.orderId}`);
    } catch {
      setError("La cave à air n'a pas pu confirmer votre commande. Réessayez.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <p className="text-[11px] uppercase tracking-[0.3em] text-or">
        Commande
      </p>
      <h1 className="mt-3 font-serif text-4xl font-light text-ivoire">
        Finaliser votre commande
      </h1>

      <ol className="mt-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em]">
        {steps.map((s, i) => (
          <li key={s.id} className="flex items-center gap-3">
            <span
              className={`flex items-center gap-2 ${
                s.id === step
                  ? "text-ivoire"
                  : s.id < step
                    ? "text-or"
                    : "text-ivoire/35"
              }`}
            >
              <span
                className={`flex size-6 items-center justify-center rounded-full border text-[10px] ${
                  s.id === step
                    ? "border-ivoire"
                    : s.id < step
                      ? "border-or"
                      : "border-ivoire/25"
                }`}
              >
                {s.id < step ? <Check className="size-3" /> : s.id}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </span>
            {i < steps.length - 1 && (
              <span className="h-px w-8 bg-ivoire/15 sm:w-14" />
            )}
          </li>
        ))}
      </ol>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          {step > 1 && (
            <StepSummary
              label="Coordonnées"
              lines={[contact.fullName, contact.email]}
              onEdit={() => setStep(1)}
            />
          )}
          {step > 2 && (
            <StepSummary
              label="Livraison"
              lines={[
                `${address.address}, ${address.postalCode} ${address.city}, ${address.country}`,
                shipping.label + (isGift ? " · Emballage cadeau" : ""),
              ]}
              onEdit={() => setStep(2)}
            />
          )}

          {step === 1 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(2);
              }}
              className="animate-in fade-in slide-in-from-bottom-2 space-y-5 duration-500"
            >
              <h2 className="font-serif text-2xl font-light text-ivoire">
                Vos coordonnées
              </h2>
              <Field id="ship-name" label="Nom complet">
                <Input
                  id="ship-name"
                  required
                  autoComplete="name"
                  value={contact.fullName}
                  onChange={(e) =>
                    setContact({ ...contact, fullName: e.target.value })
                  }
                />
              </Field>
              <Field id="ship-email" label="E-mail">
                <Input
                  id="ship-email"
                  required
                  type="email"
                  autoComplete="email"
                  value={contact.email}
                  onChange={(e) =>
                    setContact({ ...contact, email: e.target.value })
                  }
                />
              </Field>
              <Button type="submit" size="lg" className="rounded-full px-8">
                Continuer vers la livraison
              </Button>
            </form>
          )}

          {step === 2 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(3);
              }}
              className="animate-in fade-in slide-in-from-bottom-2 space-y-5 pt-6 duration-500"
            >
              <h2 className="font-serif text-2xl font-light text-ivoire">
                Livraison
              </h2>
              <Field id="ship-address" label="Adresse">
                <Input
                  id="ship-address"
                  required
                  autoComplete="street-address"
                  value={address.address}
                  onChange={(e) =>
                    setAddress({ ...address, address: e.target.value })
                  }
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field id="ship-postal" label="Code postal">
                  <Input
                    id="ship-postal"
                    required
                    autoComplete="postal-code"
                    value={address.postalCode}
                    onChange={(e) =>
                      setAddress({ ...address, postalCode: e.target.value })
                    }
                  />
                </Field>
                <Field id="ship-city" label="Ville">
                  <Input
                    id="ship-city"
                    required
                    autoComplete="address-level2"
                    value={address.city}
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                  />
                </Field>
              </div>
              <Field id="ship-country" label="Pays">
                <Input
                  id="ship-country"
                  required
                  autoComplete="country-name"
                  value={address.country}
                  onChange={(e) =>
                    setAddress({ ...address, country: e.target.value })
                  }
                />
              </Field>

              <fieldset className="space-y-3 pt-2">
                <legend className="mb-3 text-[11px] uppercase tracking-[0.25em] text-gris">
                  Mode de livraison
                </legend>
                {shippingOptions.map((o) => (
                  <label
                    key={o.method}
                    className={`flex cursor-pointer items-center justify-between gap-4 rounded-sm border px-5 py-4 transition-colors ${
                      method === o.method
                        ? "border-or bg-or/5"
                        : "border-ardoise hover:border-gris-fonce"
                    }`}
                  >
                    <span className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="shipping"
                        value={o.method}
                        checked={method === o.method}
                        onChange={() => setMethod(o.method)}
                        className="accent-[#c9a961]"
                      />
                      <span>
                        <span className="block font-serif text-lg text-ivoire">
                          {o.label}
                        </span>
                        <span className="block text-sm text-gris">
                          {o.detail}
                        </span>
                      </span>
                    </span>
                    <span className="text-sm text-ivoire">
                      {o.priceEUR === 0 ? "Offerte" : `${o.priceEUR} €`}
                    </span>
                  </label>
                ))}
              </fieldset>

              <div className="rounded-sm border border-ardoise px-5 py-4">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isGift}
                    onChange={(e) => setIsGift(e.target.checked)}
                    className="accent-[#c9a961]"
                  />
                  <span className="font-serif text-lg text-ivoire">
                    C&rsquo;est un cadeau
                  </span>
                </label>
                {isGift && (
                  <div className="mt-4 animate-in fade-in space-y-4 duration-300">
                    <Field id="gift-message" label="Message manuscrit (facultatif)">
                      <textarea
                        id="gift-message"
                        rows={3}
                        maxLength={GIFT_MESSAGE_MAX}
                        value={giftMessage}
                        onChange={(e) => setGiftMessage(e.target.value)}
                        placeholder="Quelques mots, calligraphiés à la main sur une carte de la Maison."
                        className="w-full rounded-sm border border-input bg-transparent px-3 py-2 text-sm text-ivoire placeholder:text-ivoire/30 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                      />
                    </Field>
                    <p className="-mt-2 text-right text-xs text-ivoire/40">
                      {giftMessage.length}/{GIFT_MESSAGE_MAX}
                    </p>
                    <label className="flex cursor-pointer items-center gap-3 text-sm text-ivoire/70">
                      <input
                        type="checkbox"
                        checked={hidePrices}
                        onChange={(e) => setHidePrices(e.target.checked)}
                        className="accent-[#c9a961]"
                      />
                      Ne pas faire figurer les prix dans le colis
                    </label>
                  </div>
                )}
              </div>

              <Button type="submit" size="lg" className="rounded-full px-8">
                Continuer vers le paiement
              </Button>
            </form>
          )}

          {step === 3 && (
            <form
              onSubmit={handlePay}
              className="animate-in fade-in slide-in-from-bottom-2 space-y-5 pt-6 duration-500"
            >
              <h2 className="font-serif text-2xl font-light text-ivoire">
                Paiement
              </h2>
              <CreditCardForm value={card} onChange={setCard} />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full rounded-full"
              >
                {isLoading ? "Traitement en cours..." : `Payer ${total} €`}
              </Button>
              <p className="text-center text-xs text-ivoire/40">
                Paiement de démonstration &mdash; aucune transaction réelle
                n&rsquo;est effectuée. En commandant, vous acceptez nos{" "}
                <Link
                  to="/mentions-legales#cgv"
                  className="underline underline-offset-4 hover:text-ivoire"
                >
                  conditions
                </Link>{" "}
                et notre{" "}
                <Link
                  to="/mentions-legales#confidentialite"
                  className="underline underline-offset-4 hover:text-ivoire"
                >
                  politique de confidentialité
                </Link>
                .
              </p>
            </form>
          )}
        </div>

        <aside className="h-fit rounded-sm border border-ardoise bg-brume-profond p-6 lg:sticky lg:top-24">
          <p className="text-[11px] uppercase tracking-[0.25em] text-gris">
            Récapitulatif
          </p>
          <ul className="mt-4 divide-y divide-ardoise">
            {lines.map((line) => (
              <li
                key={`${line.productId}-${line.sizeId}`}
                className="flex items-center gap-4 py-4"
              >
                <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-nuit-profond">
                  {line.image ? (
                    <img
                      src={encodeURI(line.image)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <AirBottle size="mini" className="scale-75" />
                  )}
                  <span className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-or text-[10px] font-medium text-nuit">
                    {line.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-base text-ivoire">
                    {line.name}
                  </p>
                  <p className="text-xs text-gris">{line.sizeLabel}</p>
                </div>
                <p className="text-sm text-ivoire">
                  {line.priceEUR * line.quantity}&nbsp;&euro;
                </p>
              </li>
            ))}
          </ul>
          <dl className="mt-2 space-y-2 border-t border-ardoise pt-4 text-sm">
            <div className="flex justify-between text-ivoire/70">
              <dt>Sous-total</dt>
              <dd>{subtotal}&nbsp;&euro;</dd>
            </div>
            <div className="flex justify-between text-ivoire/70">
              <dt>{shipping.label}</dt>
              <dd>
                {shipping.priceEUR === 0
                  ? "Offerte"
                  : `${shipping.priceEUR} €`}
              </dd>
            </div>
            {isGift && (
              <div className="flex justify-between text-ivoire/70">
                <dt>Emballage cadeau</dt>
                <dd>Offert</dd>
              </div>
            )}
            <div className="flex items-baseline justify-between border-t border-or/40 pt-3">
              <dt className="text-ivoire">Total</dt>
              <dd className="font-serif text-2xl text-ivoire">
                {total}&nbsp;&euro;
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
