import type { ShippingMethod } from "@/types/product";

// Mirrors the server's table; the server recomputes the real price.
export const shippingOptions: {
  method: ShippingMethod;
  label: string;
  detail: string;
  priceEUR: number;
}[] = [
  {
    method: "signature",
    label: "Coffret signature",
    detail: "3 à 5 jours ouvrés, remis en main propre.",
    priceEUR: 0,
  },
  {
    method: "express",
    label: "Coursier express",
    detail: "Livré sous 24 h, sur rendez-vous.",
    priceEUR: 25,
  },
];
