import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { removeLine, setQuantity } from "@/features/cart/cartSlice";
import AirBottle from "@/components/AirBottle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CartPage() {
  const lines = useAppSelector((state) => state.cart.lines);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const total = lines.reduce(
    (sum, line) => sum + line.priceEUR * line.quantity,
    0,
  );

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="font-serif text-2xl text-ivoire">
          Votre panier est aussi vide que, eh bien, l&rsquo;air.
        </h1>
        <Button asChild size="lg" className="mt-6 rounded-full">
          <Link to="/boutique">Parcourir la collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-serif text-3xl text-ivoire">Votre Panier</h1>

      <ul className="mt-8 divide-y divide-ardoise">
        {lines.map((line) => (
          <li
            key={`${line.productId}-${line.sizeId}`}
            className="flex items-center gap-4 py-5"
          >
            <div className="flex h-20 w-16 items-center justify-center overflow-hidden rounded bg-nuit-profond">
              <AirBottle size="mini" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-ivoire">{line.name}</p>
              <p className="text-sm text-gris">{line.sizeLabel}</p>
              <button
                type="button"
                onClick={() =>
                  dispatch(
                    removeLine({
                      productId: line.productId,
                      sizeId: line.sizeId,
                    }),
                  )
                }
                className="mt-1 text-xs text-ivoire/40 underline underline-offset-4 hover:text-destructive"
              >
                Retirer
              </button>
            </div>
            <Input
              type="number"
              min={1}
              value={line.quantity}
              onChange={(e) =>
                dispatch(
                  setQuantity({
                    productId: line.productId,
                    sizeId: line.sizeId,
                    quantity: Number(e.target.value) || 1,
                  }),
                )
              }
              className="w-16 text-center"
            />
            <p className="w-20 text-right font-medium text-ivoire">
              {line.priceEUR * line.quantity}&nbsp;&euro;
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between border-t border-ardoise pt-6">
        <p className="text-sm uppercase tracking-wide text-gris">Total</p>
        <p className="font-serif text-2xl text-ivoire">{total}&nbsp;&euro;</p>
      </div>

      <Button
        size="lg"
        className="mt-8 w-full rounded-full"
        onClick={() => navigate("/commande")}
      >
        Passer commande
      </Button>
    </div>
  );
}
