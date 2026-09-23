import express from "express";
import cors from "cors";
import { productsRouter } from "./routes/products.js";
import { ordersRouter } from "./routes/orders.js";

// The Express app on its own, without listen(): index.ts serves it locally,
// and the Vercel build bundles it as the /api function.
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;
