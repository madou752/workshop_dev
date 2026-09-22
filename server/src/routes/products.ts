import { Router } from "express";
import { db } from "../db.js";

export const productsRouter = Router();

productsRouter.get("/", (_req, res) => {
  res.json(db.data.products);
});

productsRouter.get("/:slug", (req, res) => {
  const product = db.data.products.find((p) => p.slug === req.params.slug);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
});
