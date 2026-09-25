import type { CardDetails } from "@/components/CreditCardForm";

/** Field id → message, in the order the fields appear on screen. */
export type FieldErrors = Record<string, string>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isFrance = (country: string) =>
  country
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") === "france";

export function validateContact(c: { fullName: string; email: string }) {
  const e: FieldErrors = {};
  if (c.fullName.trim().length < 2) e["ship-name"] = "Indiquez votre nom complet.";
  if (!c.email.trim()) e["ship-email"] = "Indiquez votre adresse e-mail.";
  else if (!EMAIL.test(c.email.trim()))
    e["ship-email"] = "Cette adresse e-mail semble incomplète (ex. : prenom@exemple.fr).";
  return e;
}

export function validateAddress(a: {
  address: string;
  postalCode: string;
  city: string;
  country: string;
}) {
  const e: FieldErrors = {};
  if (a.address.trim().length < 5)
    e["ship-address"] = "Indiquez votre adresse (numéro et rue).";
  if (!a.postalCode.trim()) e["ship-postal"] = "Indiquez votre code postal.";
  else if (isFrance(a.country) && !/^\d{5}$/.test(a.postalCode.trim()))
    e["ship-postal"] = "Un code postal français compte 5 chiffres.";
  if (!a.city.trim()) e["ship-city"] = "Indiquez votre ville.";
  if (!a.country.trim()) e["ship-country"] = "Indiquez votre pays.";
  return e;
}

/** Luhn checksum: catches typos in a card number. */
function luhn(digits: string) {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

export function validateCard(c: CardDetails, now = new Date()) {
  const e: FieldErrors = {};
  if (!c.cardholderName.trim())
    e["cc-name"] = "Indiquez le nom inscrit sur la carte.";

  const digits = c.cardNumber.replace(/\D/g, "");
  if (!digits) e["cc-number"] = "Indiquez le numéro de la carte.";
  else if (digits.length < 13) e["cc-number"] = "Ce numéro de carte est incomplet.";
  else if (!luhn(digits)) e["cc-number"] = "Ce numéro de carte n'est pas valide.";

  const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(c.expiry);
  if (!m) e["cc-expiry"] = "Format attendu : MM/AA.";
  else {
    // A card stays valid until the end of its expiry month.
    const endOfMonth = new Date(2000 + Number(m[2]), Number(m[1]), 1);
    if (endOfMonth <= now) e["cc-expiry"] = "Cette carte est expirée.";
  }

  if (!/^\d{3,4}$/.test(c.cvc)) e["cc-cvc"] = "3 ou 4 chiffres, au dos de la carte.";
  return e;
}

/** Puts the cursor in the first field that needs fixing. */
export function focusFirstError(errors: FieldErrors) {
  const first = Object.keys(errors)[0];
  if (first) document.getElementById(first)?.focus();
}
