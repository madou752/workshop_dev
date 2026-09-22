import { Link } from "react-router-dom";
import type { Product } from "../types/product";

const categoryLabel: Record<Product["category"], string> = {
  desert: "Desert Air",
  city: "City Air",
  landmark: "Landmark Air",
  celebrity: "Celebrity Collab",
};

export default function ProductCard({ product }: { product: Product }) {
  const startingPrice = Math.min(...product.sizes.map((s) => s.priceEUR));

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-air-950/10 bg-air-50 transition-shadow hover:shadow-xl"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-air-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.limitedEdition && (
          <span className="absolute left-3 top-3 rounded-full bg-gold-500 px-3 py-1 text-xs font-medium uppercase tracking-wide text-air-50">
            Limited Edition
          </span>
        )}
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-wide text-gold-500">
          {categoryLabel[product.category]}
        </p>
        <h3 className="mt-1 font-serif text-lg text-air-950">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-air-950/60">
          {product.tagline}
        </p>
        <p className="mt-3 text-sm font-medium text-air-950">
          From &euro;{startingPrice}
        </p>
      </div>
    </Link>
  );
}
