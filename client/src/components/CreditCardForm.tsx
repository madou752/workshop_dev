import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  return (
    <div className="space-y-4 rounded border border-ardoise bg-brume-profond p-6">
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
          <span className="text-xs">Paiement sécurisé</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cc-name">Titulaire de la carte</Label>
        <Input
          id="cc-name"
          type="text"
          required
          autoComplete="cc-name"
          value={value.cardholderName}
          onChange={(e) =>
            onChange({ ...value, cardholderName: e.target.value })
          }
          placeholder="Comme indiqué sur la carte"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cc-number">Numéro de carte</Label>
        <Input
          id="cc-number"
          type="text"
          inputMode="numeric"
          required
          autoComplete="cc-number"
          value={value.cardNumber}
          onChange={(e) =>
            onChange({
              ...value,
              cardNumber: formatCardNumber(e.target.value),
            })
          }
          placeholder="1234 5678 9012 3456"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="cc-expiry">Expiration</Label>
          <Input
            id="cc-expiry"
            type="text"
            inputMode="numeric"
            required
            autoComplete="cc-exp"
            value={value.expiry}
            onChange={(e) =>
              onChange({ ...value, expiry: formatExpiry(e.target.value) })
            }
            placeholder="MM/AA"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cc-cvc">CVC</Label>
          <Input
            id="cc-cvc"
            type="text"
            inputMode="numeric"
            required
            autoComplete="cc-csc"
            value={value.cvc}
            onChange={(e) =>
              onChange({
                ...value,
                cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
              })
            }
            placeholder="123"
          />
        </div>
      </div>
    </div>
  );
}
