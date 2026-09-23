import { Router } from "express";
import { customAlphabet } from "nanoid";
import { findAllProducts, findOrderById, findProductById, insertOrder } from "../db.js";
import { renderReceipt } from "../receipt.js";
import type { Order, OrderGift, OrderItem, OrderShipping, ShippingMethod } from "../types.js";

export const ordersRouter = Router();

const nanoid = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 8);

// The server owns delivery prices, just like product prices.
const SHIPPING: Record<ShippingMethod, Omit<OrderShipping, "method">> = {
  signature: { label: "Coffret signature — 3 à 5 jours", priceEUR: 0 },
  express: { label: "Coursier express — 24 h", priceEUR: 25 },
};

const GIFT_MESSAGE_MAX = 300;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

async function toOrderConfirmation(order: Order) {
  const products = await findAllProducts();
  return {
    orderId: order.orderId,
    createdAt: order.createdAt,
    totalEUR: order.totalEUR,
    status: order.status,
    customerName: order.customer.fullName,
    shipping: order.shipping ?? null,
    gift: order.gift ?? null,
    // Everything the certificate needs, so the client does no lookups.
    items: order.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const size = product?.sizes.find((s) => s.id === item.sizeId);
      return {
        name: product?.name ?? "Air inconnu",
        sizeLabel: size ? `${size.label} · ${size.volumeMl} ml` : "",
        quantity: item.quantity,
        lineTotal: (size?.priceEUR ?? 0) * item.quantity,
        lotNumber: product?.lotNumber ?? "",
        origin: product?.origin ?? "",
        altitude: product?.altitude ?? "",
        image: product?.image ?? null,
      };
    }),
    receiptHtml: renderReceipt(order, products),
  };
}

ordersRouter.post("/", async (req, res) => {
  const body = req.body ?? {};
  const items: OrderItem[] = Array.isArray(body.items) ? body.items : [];
  const customer = body.customer ?? {};
  const payment = body.payment ?? {};

  if (items.length === 0) {
    res.status(400).json({ error: "Le panier est vide." });
    return;
  }
  if (!isNonEmptyString(customer.fullName) || !isNonEmptyString(customer.email)) {
    res.status(400).json({ error: "Coordonnées de livraison manquantes." });
    return;
  }
  if (!isNonEmptyString(payment.cardholderName)) {
    res.status(400).json({ error: "Coordonnées de paiement manquantes." });
    return;
  }

  // Prices are always recomputed from the server's own catalog — the
  // client never gets to dictate what an order actually costs.
  let totalEUR = 0;
  const validatedItems: OrderItem[] = [];
  for (const item of items) {
    const product = await findProductById(item.productId);
    const size = product?.sizes.find((s) => s.id === item.sizeId);
    if (!product || !size) {
      res.status(400).json({ error: "Produit inconnu dans le panier." });
      return;
    }
    const quantity = Math.max(1, Number(item.quantity) || 1);
    totalEUR += size.priceEUR * quantity;
    validatedItems.push({
      productId: product.id,
      sizeId: size.id,
      quantity,
    });
  }

  const method: ShippingMethod = body.shippingMethod === "express" ? "express" : "signature";
  const shipping: OrderShipping = { method, ...SHIPPING[method] };
  totalEUR += shipping.priceEUR;

  let gift: OrderGift | undefined;
  if (body.gift && typeof body.gift === "object") {
    gift = {
      message: String(body.gift.message ?? "").trim().slice(0, GIFT_MESSAGE_MAX),
      hidePrices: body.gift.hidePrices !== false,
    };
  }

  const order: Order = {
    orderId: `LHA-${nanoid()}`,
    createdAt: new Date().toISOString(),
    items: validatedItems,
    customer: {
      fullName: customer.fullName,
      email: customer.email,
      address: String(customer.address ?? ""),
      city: String(customer.city ?? ""),
      postalCode: String(customer.postalCode ?? ""),
      country: String(customer.country ?? ""),
    },
    payment: {
      cardholderName: payment.cardholderName,
      cardNumberLast4: String(payment.cardNumberLast4 ?? "").slice(-4),
    },
    shipping,
    ...(gift && { gift }),
    totalEUR,
    status: "confirmed",
  };

  await insertOrder(order);

  res.status(201).json(await toOrderConfirmation(order));
});

ordersRouter.get("/:orderId", async (req, res) => {
  const order = await findOrderById(req.params.orderId);
  if (!order) {
    res.status(404).json({ error: "Commande introuvable" });
    return;
  }
  res.json(await toOrderConfirmation(order));
});
