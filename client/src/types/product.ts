export type ProductCategory =
  | "desert"
  | "city"
  | "landmark"
  | "celebrity";

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
  notes: string[];
  limitedEdition?: boolean;
  sizes: ProductSize[];
  image: string;
}

export interface CartLine {
  productId: string;
  sizeId: string;
  name: string;
  sizeLabel: string;
  priceEUR: number;
  quantity: number;
  image: string;
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
}

export interface OrderConfirmation {
  orderId: string;
  createdAt: string;
  totalEUR: number;
  status: "confirmed";
  receiptHtml: string;
}
