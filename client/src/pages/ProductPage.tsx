import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetProductBySlugQuery } from "../api/apiSlice";
import { useAppDispatch } from "../app/hooks";
import { addLine } from "../features/cart/cartSlice";
import SizeSelector from "../components/SizeSelector";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useGetProductBySlugQuery(
    slug ?? "",
    { skip: !slug },
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-air-950/60">
        Loading...
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-air-950/70">This bottle sold out of existence.</p>
        <Link to="/shop" className="mt-4 inline-block text-gold-500">
          Back to the collection
        </Link>
      </div>
    );
  }

  const activeSize =
    product.sizes.find((s) => s.id === selectedSizeId) ?? product.sizes[0];

  const handleAddToCart = () => {
    dispatch(
      addLine({
        productId: product.id,
        sizeId: activeSize.id,
        name: product.name,
        sizeLabel: activeSize.label,
        priceEUR: activeSize.priceEUR,
        quantity: 1,
        image: product.image,
      }),
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="grid gap-12 sm:grid-cols-2">
        <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-air-100">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gold-500">
            {product.origin}
          </p>
          <h1 className="mt-2 font-serif text-3xl text-air-950">
            {product.name}
          </h1>
          <p className="mt-3 text-air-950/70">{product.description}</p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {product.notes.map((note) => (
              <li
                key={note}
                className="rounded-full bg-air-100 px-3 py-1 text-xs text-air-950/70"
              >
                {note}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <p className="mb-3 text-sm font-medium uppercase tracking-wide text-air-950/70">
              Choose a size
            </p>
            <SizeSelector
              sizes={product.sizes}
              selectedId={activeSize.id}
              onSelect={setSelectedSizeId}
            />
          </div>

          <div className="mt-8 flex items-center gap-4">
            <button
              type="button"
              onClick={handleAddToCart}
              className="rounded-full bg-air-950 px-7 py-3 text-sm font-medium uppercase tracking-wide text-air-50 transition-colors hover:bg-air-900"
            >
              Add to Cart &mdash; &euro;{activeSize.priceEUR}
            </button>
            {justAdded && (
              <span className="text-sm text-gold-500">Added to cart</span>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              handleAddToCart();
              navigate("/checkout");
            }}
            className="mt-3 block text-sm text-air-950/60 underline underline-offset-4 hover:text-air-950"
          >
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
}
