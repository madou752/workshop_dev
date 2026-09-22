export type ProductCategory = "desert" | "city" | "landmark" | "celebrity";

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

export interface Order {
  orderId: string;
  createdAt: string;
  items: OrderItem[];
  customer: OrderCustomer;
  payment: OrderPayment;
  totalEUR: number;
  status: "confirmed";
}

export interface DbSchema {
  products: Product[];
  orders: Order[];
}
