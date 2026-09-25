import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { clearCart } from "@/features/cart/cartSlice";
import { usePlaceOrderMutation } from "@/api/apiSlice";
import CreditCardForm, { type CardDetails } from "@/components/CreditCardForm";
import AirBottle from "@/components/AirBottle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormField from "@/components/FormField";
import {
  focusFirstError,
  isFrance,
  validateAddress,
  validateCard,
  validateContact,
  type FieldErrors,
} from "@/lib/checkout";
import { shippingOptions } from "@/lib/shipping";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
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
        <p className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-or">
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
  useDocumentTitle("Commande");
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
  // Field messages appear once a step has been submitted, then follow typing.
  const [attempted, setAttempted] = useState<Record<Step, boolean>>({
    1: false,
    2: false,
    3: false,
  });

  // French postcode → matching towns, from the public geo.api.gouv.fr API.
  const [towns, setTowns] = useState({ postalCode: "", names: [] as string[] });
  const autoFilledCity = useRef("");
  const postal = address.postalCode.trim();
  const lookUpTowns = isFrance(address.country) && /^\d{5}$/.test(postal);

  useEffect(() => {
    if (!lookUpTowns) return;
    const controller = new AbortController();
    fetch(
      `https://geo.api.gouv.fr/communes?codePostal=${postal}&fields=nom&format=json`,
      { signal: controller.signal },
    )
      .then((res) => (res.ok ? res.json() : []))
      .then((list: { nom: string }[]) => {
        const names = [...new Set(list.map((c) => c.nom))].sort((x, y) =>
          x.localeCompare(y, "fr"),
        );
        setTowns({ postalCode: postal, names });
        // A single town: fill it in, unless the visitor typed their own.
        if (names.length === 1) {
          setAddress((a) => {
            if (a.city.trim() && a.city !== autoFilledCity.current) return a;
            autoFilledCity.current = names[0];
            return { ...a, city: names[0] };
          });
        }
      })
      // Offline or API down: the visitor simply types the city.
      .catch(() => {});
    return () => controller.abort();
  }, [postal, lookUpTowns]);

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

  const townSuggestions =
    lookUpTowns && towns.postalCode === postal ? towns.names : [];

  const stepErrors = (s: Step): FieldErrors =>
    s === 1
      ? validateContact(contact)
      : s === 2
        ? validateAddress(address)
        : validateCard(card);
  const errors: FieldErrors = attempted[step] ? stepErrors(step) : {};

  /** Validates a step; moves on if it's complete, otherwise shows why. */
  const submitStep = (s: Step, next: () => void) => (e: React.FormEvent) => {
    e.preventDefault();
    const found = stepErrors(s);
    if (Object.keys(found).length > 0) {
      setAttempted((a) => ({ ...a, [s]: true }));
      focusFirstError(found);
      return;
    }
    next();
  };

  const shipping = shippingOptions.find((o) => o.method === method)!;
  const subtotal = lines.reduce((sum, l) => sum + l.priceEUR * l.quantity, 0);
  const total = subtotal + shipping.priceEUR;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cardErrors = validateCard(card);
    if (Object.keys(cardErrors).length > 0) {
      setAttempted((a) => ({ ...a, 3: true }));
      focusFirstError(cardErrors);
      return;
    }
    const digits = card.cardNumber.replace(/\D/g, "");

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
      <p className="text-xs uppercase tracking-[0.3em] text-or">
        Commande
      </p>
      <h1 className="mt-3 font-serif text-4xl font-light text-ivoire">
        Finaliser votre commande
      </h1>

      <ol className="mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.2em]">
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
                className={`flex size-6 items-center justify-center rounded-full border text-[11px] ${
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
      {/* Phones hide the step names above: say where we are in words. */}
      <div className="mt-4 sm:hidden">
        <p className="text-xs uppercase tracking-[0.2em] text-ivoire/70">
          Étape {step} sur 3 &middot;{" "}
          <span className="text-ivoire">{steps[step - 1].label}</span>
        </p>
        <div className="mt-2 h-px w-full bg-ivoire/15">
          <div
            className="h-px bg-or transition-[width] duration-500 motion-reduce:transition-none"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

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
              noValidate
              onSubmit={submitStep(1, () => setStep(2))}
              className="animate-in fade-in slide-in-from-bottom-2 space-y-5 duration-500"
            >
              <h2 className="font-serif text-2xl font-light text-ivoire">
                Vos coordonnées
              </h2>
              <FormField id="ship-name" label="Nom complet" error={errors["ship-name"]}>
                {(a11y) => (
                  <Input
                    id="ship-name"
                    autoComplete="name"
                    value={contact.fullName}
                    onChange={(e) =>
                      setContact({ ...contact, fullName: e.target.value })
                    }
                    {...a11y}
                  />
                )}
              </FormField>
              <FormField id="ship-email" label="E-mail" error={errors["ship-email"]}>
                {(a11y) => (
                  <Input
                    id="ship-email"
                    type="email"
                    autoComplete="email"
                    value={contact.email}
                    onChange={(e) =>
                      setContact({ ...contact, email: e.target.value })
                    }
                    {...a11y}
                  />
                )}
              </FormField>
              <Button type="submit" size="lg" className="rounded-full px-8">
                Continuer vers la livraison
              </Button>
            </form>
          )}

          {step === 2 && (
            <form
              noValidate
              onSubmit={submitStep(2, () => setStep(3))}
              className="animate-in fade-in slide-in-from-bottom-2 space-y-5 pt-6 duration-500"
            >
              <h2 className="font-serif text-2xl font-light text-ivoire">
                Livraison
              </h2>
              <FormField id="ship-address" label="Adresse" error={errors["ship-address"]}>
                {(a11y) => (
                  <Input
                    id="ship-address"
                    autoComplete="street-address"
                    value={address.address}
                    onChange={(e) =>
                      setAddress({ ...address, address: e.target.value })
                    }
                    {...a11y}
                  />
                )}
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField id="ship-postal" label="Code postal" error={errors["ship-postal"]}>
                  {(a11y) => (
                    <Input
                      id="ship-postal"
                      autoComplete="postal-code"
                      inputMode={isFrance(address.country) ? "numeric" : "text"}
                      value={address.postalCode}
                      onChange={(e) =>
                        setAddress({ ...address, postalCode: e.target.value })
                      }
                      {...a11y}
                    />
                  )}
                </FormField>
                <FormField
                  id="ship-city"
                  label="Ville"
                  error={errors["ship-city"]}
                  hint={
                    townSuggestions.length > 1
                      ? `${townSuggestions.length} communes pour ce code postal`
                      : undefined
                  }
                >
                  {(a11y) => (
                    <Input
                      id="ship-city"
                      autoComplete="address-level2"
                      list="ship-city-towns"
                      value={address.city}
                      onChange={(e) =>
                        setAddress({ ...address, city: e.target.value })
                      }
                      {...a11y}
                    />
                  )}
                </FormField>
                <datalist id="ship-city-towns">
                  {townSuggestions.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </div>
              <FormField id="ship-country" label="Pays" error={errors["ship-country"]}>
                {(a11y) => (
                  <Input
                    id="ship-country"
                    autoComplete="country-name"
                    value={address.country}
                    onChange={(e) =>
                      setAddress({ ...address, country: e.target.value })
                    }
                    {...a11y}
                  />
                )}
              </FormField>

              <fieldset className="space-y-3 pt-2">
                <legend className="mb-3 text-xs uppercase tracking-[0.25em] text-gris">
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
                    <FormField id="gift-message" label="Message manuscrit (facultatif)" error={errors["gift-message"]}>
                      {(a11y) => (
                        <textarea
                          id="gift-message"
                          rows={3}
                          maxLength={GIFT_MESSAGE_MAX}
                          value={giftMessage}
                          onChange={(e) => setGiftMessage(e.target.value)}
                          placeholder="Quelques mots, calligraphiés à la main sur une carte de la Maison."
                          className="w-full rounded-sm border border-input bg-transparent px-3 py-2 text-sm text-ivoire placeholder:text-ivoire/30 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                          {...a11y}
                        />
                      )}
                    </FormField>
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
              noValidate
              onSubmit={handlePay}
              className="animate-in fade-in slide-in-from-bottom-2 space-y-5 pt-6 duration-500"
            >
              <h2 className="font-serif text-2xl font-light text-ivoire">
                Paiement
              </h2>
              <CreditCardForm value={card} onChange={setCard} errors={errors} />
              {error && <p className="text-sm text-alerte">{error}</p>}
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full rounded-full"
              >
                {isLoading ? "Traitement en cours..." : `Payer ${total} €`}
              </Button>
              <p className="text-center text-xs text-ivoire/55">
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
          <p className="text-xs uppercase tracking-[0.25em] text-gris">
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
                  <span className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-or text-[11px] font-medium text-nuit">
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
