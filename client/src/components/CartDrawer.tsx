import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { closeCart, openCart } from "@/features/cart/cartSlice";
import CartLineItem from "@/components/CartLineItem";
import { Button } from "@/components/ui/button";

/** Slide-in cart panel, opened from the navbar or after adding a bottle. */
export default function CartDrawer() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const open = useAppSelector((state) => state.cart.drawerOpen);
  const lines = useAppSelector((state) => state.cart.lines);

  const total = lines.reduce((sum, l) => sum + l.priceEUR * l.quantity, 0);
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);

  // Leaving the page (a link inside the panel, back button...) closes it.
  useEffect(() => {
    dispatch(closeCart());
  }, [pathname, dispatch]);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => dispatch(next ? openCart() : closeCart())}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-or/20 bg-nuit text-ivoire shadow-2xl duration-500 data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right">
          <div className="flex items-center justify-between border-b border-ardoise px-6 py-5">
            <div>
              <Dialog.Title className="font-serif text-2xl font-light">
                Votre panier
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-xs uppercase tracking-[0.25em] text-gris">
                {count === 0
                  ? "Aucun flacon"
                  : `${count} flacon${count > 1 ? "s" : ""}`}
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Fermer le panier"
              className="p-2 text-ivoire/70 transition-colors hover:text-or"
            >
              <X className="size-5" strokeWidth={1.25} />
            </Dialog.Close>
          </div>

          {lines.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <p className="font-serif text-xl text-ivoire/80">
                Votre panier est aussi léger que l&rsquo;air.
              </p>
              <Button asChild className="mt-6 rounded-full px-6">
                <Link to="/boutique">Découvrir la collection</Link>
              </Button>
            </div>
          ) : (
            <>
              <ul className="flex-1 divide-y divide-ardoise overflow-y-auto px-6">
                {lines.map((line) => (
                  <CartLineItem
                    key={`${line.productId}-${line.sizeId}`}
                    line={line}
                  />
                ))}
              </ul>

              <div className="border-t border-ardoise px-6 pb-6 pt-5">
                <div className="flex items-baseline justify-between">
                  <p className="text-xs uppercase tracking-[0.25em] text-gris">
                    Sous-total
                  </p>
                  <p className="font-serif text-2xl">{total}&nbsp;&euro;</p>
                </div>
                <p className="mt-2 text-xs text-ivoire/50">
                  Livraison en coffret signature offerte.
                </p>
                <Button
                  size="lg"
                  className="mt-5 w-full rounded-full"
                  onClick={() => navigate("/commande")}
                >
                  Commander
                </Button>
                <Link
                  to="/panier"
                  className="mt-3 block text-center text-xs uppercase tracking-[0.2em] text-ivoire/50 transition-colors hover:text-ivoire"
                >
                  Voir le panier
                </Link>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
