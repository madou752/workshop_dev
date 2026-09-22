import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSONFilePreset } from "lowdb/node";
import type { DbSchema } from "./types.js";
import { products } from "./data/products.seed.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbFile = path.join(__dirname, "..", "data", "db.json");

const defaultData: DbSchema = { products, orders: [] };

export const db = await JSONFilePreset<DbSchema>(dbFile, defaultData);

if (db.data.products.length === 0) {
  db.data.products = products;
  await db.write();
}
