import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearCart } from "../features/cart/cartSlice";
import { usePlaceOrderMutation } from "../api/apiSlice";
import CreditCardForm, { type CardDetails } from "../components/CreditCardForm";

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
      <div className="mx-auto max-w-3xl px-6 py-20 text-center text-air-950/70">
        Your cart is empty &mdash; nothing to check out.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const digits = card.cardNumber.replace(/\D/g, "");
    if (digits.length < 12) {
      setError("That card number looks incomplete.");
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
      navigate(`/order/${result.orderId}`);
    } catch {
      setError("The air cellar couldn't confirm your order. Try again.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="font-serif text-3xl text-air-950">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-10 sm:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-4 rounded-2xl border border-air-950/10 bg-air-50 p-6">
            <p className="text-sm font-medium uppercase tracking-wide text-air-950/70">
              Shipping details
            </p>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-air-950/70">
                Full name
              </span>
              <input
                required
                value={shipping.fullName}
                onChange={(e) =>
                  setShipping({ ...shipping, fullName: e.target.value })
                }
                className="w-full rounded-lg border border-air-950/15 bg-white px-3 py-2 text-sm outline-none focus:border-gold-500"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-air-950/70">
                Email
              </span>
              <input
                required
                type="email"
                value={shipping.email}
                onChange={(e) =>
                  setShipping({ ...shipping, email: e.target.value })
                }
                className="w-full rounded-lg border border-air-950/15 bg-white px-3 py-2 text-sm outline-none focus:border-gold-500"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-air-950/70">
                Address
              </span>
              <input
                required
                value={shipping.address}
                onChange={(e) =>
                  setShipping({ ...shipping, address: e.target.value })
                }
                className="w-full rounded-lg border border-air-950/15 bg-white px-3 py-2 text-sm outline-none focus:border-gold-500"
              />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-air-950/70">
                  City
                </span>
                <input
                  required
                  value={shipping.city}
                  onChange={(e) =>
                    setShipping({ ...shipping, city: e.target.value })
                  }
                  className="w-full rounded-lg border border-air-950/15 bg-white px-3 py-2 text-sm outline-none focus:border-gold-500"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-air-950/70">
                  Postal code
                </span>
                <input
                  required
                  value={shipping.postalCode}
                  onChange={(e) =>
                    setShipping({ ...shipping, postalCode: e.target.value })
                  }
                  className="w-full rounded-lg border border-air-950/15 bg-white px-3 py-2 text-sm outline-none focus:border-gold-500"
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-air-950/70">
                Country
              </span>
              <input
                required
                value={shipping.country}
                onChange={(e) =>
                  setShipping({ ...shipping, country: e.target.value })
                }
                className="w-full rounded-lg border border-air-950/15 bg-white px-3 py-2 text-sm outline-none focus:border-gold-500"
              />
            </label>
          </div>

          <CreditCardForm value={card} onChange={setCard} />
        </div>

        <div className="h-fit space-y-4 rounded-2xl border border-air-950/10 bg-air-100 p-6">
          <p className="text-sm font-medium uppercase tracking-wide text-air-950/70">
            Order summary
          </p>
          <ul className="space-y-2 text-sm">
            {lines.map((line) => (
              <li
                key={`${line.productId}-${line.sizeId}`}
                className="flex justify-between"
              >
                <span className="text-air-950/70">
                  {line.name} ({line.sizeLabel}) &times; {line.quantity}
                </span>
                <span className="text-air-950">
                  &euro;{line.priceEUR * line.quantity}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t border-air-950/15 pt-3 font-medium text-air-950">
            <span>Total</span>
            <span>&euro;{total}</span>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-air-950 py-4 text-sm font-medium uppercase tracking-wide text-air-50 transition-colors hover:bg-air-900 disabled:opacity-50"
          >
            {isLoading ? "Processing..." : `Pay €${total}`}
          </button>
          <p className="text-center text-xs text-air-950/40">
            Demo checkout &mdash; no real payment is processed.
          </p>
        </div>
      </form>
    </div>
  );
}
