import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { removeLine, setQuantity } from "../features/cart/cartSlice";

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
        <h1 className="font-serif text-2xl text-air-950">
          Your cart is as empty as, well, air.
        </h1>
        <Link
          to="/shop"
          className="mt-6 inline-block rounded-full bg-air-950 px-6 py-3 text-sm uppercase tracking-wide text-air-50"
        >
          Browse the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-serif text-3xl text-air-950">Your Cart</h1>

      <ul className="mt-8 divide-y divide-air-950/10">
        {lines.map((line) => (
          <li
            key={`${line.productId}-${line.sizeId}`}
            className="flex items-center gap-4 py-5"
          >
            <img
              src={line.image}
              alt={line.name}
              className="h-20 w-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="font-medium text-air-950">{line.name}</p>
              <p className="text-sm text-air-950/60">{line.sizeLabel}</p>
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
                className="mt-1 text-xs text-air-950/50 underline underline-offset-4 hover:text-red-600"
              >
                Remove
              </button>
            </div>
            <input
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
              className="w-16 rounded-lg border border-air-950/15 px-2 py-1 text-center text-sm"
            />
            <p className="w-20 text-right font-medium text-air-950">
              &euro;{line.priceEUR * line.quantity}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between border-t border-air-950/10 pt-6">
        <p className="text-sm uppercase tracking-wide text-air-950/60">
          Total
        </p>
        <p className="font-serif text-2xl text-air-950">&euro;{total}</p>
      </div>

      <button
        type="button"
        onClick={() => navigate("/checkout")}
        className="mt-8 w-full rounded-full bg-gold-500 py-4 text-sm font-medium uppercase tracking-wide text-air-950 transition-colors hover:bg-gold-400"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
