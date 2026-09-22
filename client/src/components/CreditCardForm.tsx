import { useState } from "react";

export interface CardDetails {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

interface CreditCardFormProps {
  value: CardDetails;
  onChange: (value: CardDetails) => void;
}

function formatCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function CreditCardForm({
  value,
  onChange,
}: CreditCardFormProps) {
  const [focused, setFocused] = useState<string | null>(null);

  return (
    <div className="space-y-4 rounded-2xl border border-air-950/10 bg-air-50 p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium uppercase tracking-wide text-air-950/70">
          Payment details
        </p>
        <div className="flex items-center gap-1 text-air-950/40">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="text-xs">Secure checkout</span>
        </div>
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-air-950/70">
          Cardholder name
        </span>
        <input
          type="text"
          required
          autoComplete="cc-name"
          value={value.cardholderName}
          onFocus={() => setFocused("name")}
          onBlur={() => setFocused(null)}
          onChange={(e) =>
            onChange({ ...value, cardholderName: e.target.value })
          }
          placeholder="As printed on card"
          className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-colors ${
            focused === "name" ? "border-gold-500" : "border-air-950/15"
          }`}
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-air-950/70">
          Card number
        </span>
        <input
          type="text"
          inputMode="numeric"
          required
          autoComplete="cc-number"
          value={value.cardNumber}
          onFocus={() => setFocused("number")}
          onBlur={() => setFocused(null)}
          onChange={(e) =>
            onChange({
              ...value,
              cardNumber: formatCardNumber(e.target.value),
            })
          }
          placeholder="1234 5678 9012 3456"
          className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-colors ${
            focused === "number" ? "border-gold-500" : "border-air-950/15"
          }`}
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-air-950/70">
            Expiry
          </span>
          <input
            type="text"
            inputMode="numeric"
            required
            autoComplete="cc-exp"
            value={value.expiry}
            onFocus={() => setFocused("expiry")}
            onBlur={() => setFocused(null)}
            onChange={(e) =>
              onChange({ ...value, expiry: formatExpiry(e.target.value) })
            }
            placeholder="MM/YY"
            className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-colors ${
              focused === "expiry" ? "border-gold-500" : "border-air-950/15"
            }`}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-air-950/70">
            CVC
          </span>
          <input
            type="text"
            inputMode="numeric"
            required
            autoComplete="cc-csc"
            value={value.cvc}
            onFocus={() => setFocused("cvc")}
            onBlur={() => setFocused(null)}
            onChange={(e) =>
              onChange({
                ...value,
                cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
              })
            }
            placeholder="123"
            className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-colors ${
              focused === "cvc" ? "border-gold-500" : "border-air-950/15"
            }`}
          />
        </label>
      </div>
    </div>
  );
}
