import { Link } from "react-router-dom";
import type { Product } from "@/types/product";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AirBottle from "@/components/AirBottle";

const categoryLabel: Record<Product["category"], string> = {
  desert: "Air du Désert",
  city: "Air Urbain",
  landmark: "Air de Monument",
  celebrity: "Collab Célébrité",
};

export default function ProductCard({ product }: { product: Product }) {
  const startingPrice = Math.min(...product.sizes.map((s) => s.priceEUR));

  return (
    <Link to={`/produit/${product.slug}`} className="group block">
      <Card className="overflow-hidden border-ardoise bg-brume-profond py-0 transition-shadow hover:shadow-xl hover:shadow-black/30">
        <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-nuit">
          <AirBottle
            size="card"
            tagline={product.tagline}
            volumeMl={product.sizes[0].volumeMl}
            className="scale-90 transition-transform duration-500 group-hover:scale-100"
          />
          {product.limitedEdition && (
            <Badge className="absolute left-3 top-3 uppercase tracking-wide">
              Édition Limitée
            </Badge>
          )}
        </div>
        <CardContent className="p-5">
          <p className="text-xs uppercase tracking-wide text-or">
            {categoryLabel[product.category]}
          </p>
          <h3 className="mt-1 font-serif text-lg text-ivoire">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-gris">
            {product.tagline}
          </p>
          <p className="mt-3 text-sm font-medium text-ivoire">
            &Agrave; partir de {startingPrice}&nbsp;&euro;
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
