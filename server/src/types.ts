export type ProductCategory = "desert" | "city" | "nature";

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

export interface OrderItem {
  productId: string;
  sizeId: string;
  quantity: number;
}

export interface OrderCustomer {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderPayment {
  cardholderName: string;
  cardNumberLast4: string;
}

export type ShippingMethod = "signature" | "express";

export interface OrderShipping {
  method: ShippingMethod;
  label: string;
  priceEUR: number;
}

export interface OrderGift {
  message: string;
  /** Leave prices off the packing slip. */
  hidePrices: boolean;
}

export interface Order {
  orderId: string;
  createdAt: string;
  items: OrderItem[];
  customer: OrderCustomer;
  payment: OrderPayment;
  // Optional: orders placed before delivery options existed have neither.
  shipping?: OrderShipping;
  gift?: OrderGift;
  totalEUR: number;
  status: "confirmed";
}

export interface DbSchema {
  products: Product[];
  orders: Order[];
}
