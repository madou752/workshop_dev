import "dotenv/config";
import { MongoClient } from "mongodb";
import type { Order, Product } from "./types.js";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    "MONGODB_URI is missing. Copy server/.env.example to server/.env and paste your Atlas connection string.",
  );
}

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10_000 });

// A dead database should produce an explanation, not a stack trace.
try {
  await client.connect();
} catch (error) {
  const reason = error instanceof Error ? error.message : String(error);
  console.error("\n  Impossible de se connecter à MongoDB.");
  console.error(`  ${reason}\n`);
  console.error("  Pistes :");
  console.error("  - MONGODB_URI est-il correct dans server/.env ?");
  console.error("  - votre IP est-elle autorisée dans Atlas > Network Access ?");
  console.error("  - erreur 'querySrv' ou 'ECONNREFUSED' : problème de DNS,");
  console.error("    voir la section Dépannage de server/DATABASE.md\n");
  process.exit(1);
}

const database = client.db(process.env.MONGODB_DB ?? "lahistair");

// Two collections, one per kind of document. A collection is simply a list
// of JSON documents -- the same shape the old db.json file used to hold.
export const productsCollection = database.collection<Product>("products");
export const ordersCollection = database.collection<Order>("orders");

// Mongo adds its own technical `_id` to every document. The API contract
// (and the client's types) never mention it, so we hide it on every read.
export const withoutMongoId = { projection: { _id: 0 } } as const;

export async function findAllProducts(): Promise<Product[]> {
  return productsCollection.find({}, withoutMongoId).toArray();
}

export async function findProductBySlug(slug: string): Promise<Product | null> {
  return productsCollection.findOne({ slug }, withoutMongoId);
}

export async function findProductById(id: string): Promise<Product | null> {
  return productsCollection.findOne({ id }, withoutMongoId);
}

export async function insertOrder(order: Order): Promise<void> {
  await ordersCollection.insertOne({ ...order });
}

export async function findOrderById(orderId: string): Promise<Order | null> {
  return ordersCollection.findOne({ orderId }, withoutMongoId);
}

export async function closeDatabase(): Promise<void> {
  await client.close();
}
