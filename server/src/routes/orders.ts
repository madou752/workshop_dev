import { Router } from "express";
import { customAlphabet } from "nanoid";
import { db } from "../db.js";
import { renderReceipt } from "../receipt.js";
import type { Order, OrderItem } from "../types.js";

export const ordersRouter = Router();

const nanoid = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 8);

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function toOrderConfirmation(order: Order) {
  return {
    orderId: order.orderId,
    createdAt: order.createdAt,
    totalEUR: order.totalEUR,
    status: order.status,
    receiptHtml: renderReceipt(order, db.data.products),
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
    const product = db.data.products.find((p) => p.id === item.productId);
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
    totalEUR,
    status: "confirmed",
  };

  db.data.orders.push(order);
  await db.write();

  res.status(201).json(toOrderConfirmation(order));
});

ordersRouter.get("/:orderId", (req, res) => {
  const order = db.data.orders.find((o) => o.orderId === req.params.orderId);
  if (!order) {
    res.status(404).json({ error: "Commande introuvable" });
    return;
  }
  res.json(toOrderConfirmation(order));
});
