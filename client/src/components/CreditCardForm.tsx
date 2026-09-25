import { Input } from "@/components/ui/input";
import FormField from "@/components/FormField";
import type { FieldErrors } from "@/lib/checkout";

export interface CardDetails {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

interface CreditCardFormProps {
  value: CardDetails;
  onChange: (value: CardDetails) => void;
  /** Messages keyed by field id (cc-name, cc-number, cc-expiry, cc-cvc). */
  errors?: FieldErrors;
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
  errors = {},
}: CreditCardFormProps) {
  return (
    <div className="space-y-4 rounded-sm border border-ardoise bg-brume-profond p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium uppercase tracking-wide text-ivoire/70">
          Coordonnées de paiement
        </p>
        <div className="flex items-center gap-1 text-gris">
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
          <span className="text-xs">Paiement de démonstration</span>
        </div>
      </div>

      <FormField id="cc-name" label="Titulaire de la carte" error={errors["cc-name"]}>
        {(a11y) => (
          <Input
            id="cc-name"
            type="text"
            autoComplete="cc-name"
            value={value.cardholderName}
            onChange={(e) =>
              onChange({ ...value, cardholderName: e.target.value })
            }
            placeholder="Comme indiqué sur la carte"
            {...a11y}
          />
        )}
      </FormField>

      <FormField id="cc-number" label="Numéro de carte" error={errors["cc-number"]}>
        {(a11y) => (
          <Input
            id="cc-number"
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            value={value.cardNumber}
            onChange={(e) =>
              onChange({
                ...value,
                cardNumber: formatCardNumber(e.target.value),
              })
            }
            placeholder="1234 5678 9012 3456"
            {...a11y}
          />
        )}
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="cc-expiry" label="Expiration" error={errors["cc-expiry"]}>
          {(a11y) => (
            <Input
              id="cc-expiry"
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              value={value.expiry}
              onChange={(e) =>
                onChange({ ...value, expiry: formatExpiry(e.target.value) })
              }
              placeholder="MM/AA"
              {...a11y}
            />
          )}
        </FormField>
        <FormField id="cc-cvc" label="CVC" error={errors["cc-cvc"]}>
          {(a11y) => (
            <Input
              id="cc-cvc"
              type="text"
              inputMode="numeric"
              autoComplete="cc-csc"
              value={value.cvc}
              onChange={(e) =>
                onChange({
                  ...value,
                  cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
                })
              }
              placeholder="123"
              {...a11y}
            />
          )}
        </FormField>
      </div>
    </div>
  );
}
