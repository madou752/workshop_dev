import { Minus, Plus } from "lucide-react";
import { useAppDispatch } from "@/app/hooks";
import { removeLine, setQuantity } from "@/features/cart/cartSlice";
import AirBottle from "@/components/AirBottle";
import type { CartLine } from "@/types/product";

/** One cart row: photo, name, format, quantity stepper and line total. */
export default function CartLineItem({ line }: { line: CartLine }) {
  const dispatch = useAppDispatch();
  const key = { productId: line.productId, sizeId: line.sizeId };

  return (
    <li className="flex gap-4 py-5">
      <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-nuit-profond">
        {line.image ? (
          <img
            src={encodeURI(line.image)}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <AirBottle size="mini" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-serif text-lg leading-tight text-ivoire">
              {line.name}
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-gris">
              {line.sizeLabel}
            </p>
          </div>
          <p className="shrink-0 text-sm text-ivoire">
            {line.priceEUR * line.quantity}&nbsp;&euro;
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center rounded-full border border-ardoise">
            <button
              type="button"
              aria-label="Retirer un flacon"
              disabled={line.quantity <= 1}
              onClick={() =>
                dispatch(setQuantity({ ...key, quantity: line.quantity - 1 }))
              }
              className="p-2 text-ivoire/70 transition-colors hover:text-or disabled:opacity-30"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-6 text-center text-sm tabular-nums text-ivoire">
              {line.quantity}
            </span>
            <button
              type="button"
              aria-label="Ajouter un flacon"
              onClick={() =>
                dispatch(setQuantity({ ...key, quantity: line.quantity + 1 }))
              }
              className="p-2 text-ivoire/70 transition-colors hover:text-or"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => dispatch(removeLine(key))}
            className="text-xs text-ivoire/40 underline underline-offset-4 transition-colors hover:text-ivoire"
          >
            Retirer
          </button>
        </div>
      </div>
    </li>
  );
}
