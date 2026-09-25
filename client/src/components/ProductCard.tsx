import { Link } from "react-router-dom";
import type { Product } from "@/types/product";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AirBottle from "@/components/AirBottle";
import { categoryLabel } from "@/lib/categories";

export default function ProductCard({ product }: { product: Product }) {
  const startingPrice = Math.min(...product.sizes.map((s) => s.priceEUR));

  return (
    <Link to={`/produit/${product.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden border-ardoise bg-brume-profond py-0 transition-all duration-300 hover:-translate-y-1 hover:border-or/40 hover:shadow-xl hover:shadow-black/30">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-nuit">
          {product.image ? (
            <img
              src={encodeURI(product.image)}
              alt={`Flacon ${product.name}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <AirBottle
              size="card"
              tagline={product.tagline}
              volumeMl={product.sizes[0].volumeMl}
              className="scale-90 transition-transform duration-500 ease-out group-hover:scale-100"
            />
          )}
          {product.limitedEdition && (
            <Badge className="absolute left-3 top-3 uppercase tracking-wide animate-in fade-in zoom-in-50 duration-500">
              Édition limitée
            </Badge>
          )}
        </div>
        {/* Grows to fill the card so every price sits on the same line. */}
        <CardContent className="flex flex-1 flex-col p-5">
          <p className="text-xs uppercase tracking-wide text-or">
            {categoryLabel[product.category]}
          </p>
          <h3 className="mt-1 font-serif text-lg text-ivoire">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-2 min-h-10 text-sm text-gris">
            {product.tagline}
          </p>
          <p className="mt-auto pt-3 text-sm font-medium text-ivoire">
            &Agrave; partir de {startingPrice}&nbsp;&euro;
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
