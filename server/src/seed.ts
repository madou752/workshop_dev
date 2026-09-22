import { closeDatabase, productsCollection } from "./db.js";
import { products } from "./data/products.seed.js";

// Fills the `products` collection from the static catalog.
// Safe to re-run: it always starts from an empty collection.
await productsCollection.deleteMany({});
await productsCollection.insertMany(products.map((product) => ({ ...product })));

// Two products must never share the same URL slug.
await productsCollection.createIndex({ slug: 1 }, { unique: true });

console.log(`Seeded ${products.length} products into the "products" collection.`);

await closeDatabase();
