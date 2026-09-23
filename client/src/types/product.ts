export type ProductCategory =
  | "desert"
  | "city"
  | "nature";

export interface ProductSize {
  id: string;
  label: string;
  volumeMl: number;
  priceEUR: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  tagline: string;
  description: string;
  origin: string;
  altitude: string;
  composition: string;
  lotNumber: string;
  /** Path of the product photo in client/public. */
  image?: string;
  notes: string[];
  limitedEdition?: boolean;
  sizes: ProductSize[];
}

export interface CartLine {
  productId: string;
  sizeId: string;
  name: string;
  sizeLabel: string;
  priceEUR: number;
  quantity: number;
  /** Product photo, shown in the cart and checkout summary. */
  image?: string;
}

export type ShippingMethod = "signature" | "express";

export interface OrderGift {
  message: string;
  hidePrices: boolean;
}

export interface OrderRequest {
  items: {
    productId: string;
    sizeId: string;
    quantity: number;
  }[];
  customer: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  payment: {
    cardholderName: string;
    cardNumberLast4: string;
  };
  shippingMethod: ShippingMethod;
  gift?: OrderGift;
}

export interface OrderConfirmationItem {
  name: string;
  sizeLabel: string;
  quantity: number;
  lineTotal: number;
  lotNumber: string;
  origin: string;
  altitude: string;
  image: string | null;
}

export interface OrderConfirmation {
  orderId: string;
  createdAt: string;
  totalEUR: number;
  status: "confirmed";
  customerName: string;
  items: OrderConfirmationItem[];
  shipping: { method: ShippingMethod; label: string; priceEUR: number } | null;
  gift: OrderGift | null;
  receiptHtml: string;
}
