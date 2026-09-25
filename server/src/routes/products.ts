import { Router } from "express";
import { findAllProducts, findProductBySlug } from "../db.js";

export const productsRouter = Router();

productsRouter.get("/", async (_req, res) => {
  res.json(await findAllProducts());
});

productsRouter.get("/:slug", async (req, res) => {
  const product = await findProductBySlug(req.params.slug);
  if (!product) {
    res.status(404).json({ error: "Produit introuvable." });
    return;
  }
  res.json(product);
});
