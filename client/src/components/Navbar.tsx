import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Dialog } from "radix-ui";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { openCart } from "@/features/cart/cartSlice";
import { Button } from "@/components/ui/button";
import Logo from "@/components/brand/Logo";
import { categoryLabel } from "@/lib/categories";
import type { ProductCategory } from "@/types/product";

const navLink =
  "text-sm tracking-wide uppercase text-ivoire/60 hover:text-ivoire transition-colors";
const navLinkActive = "text-ivoire";

/** Height of the bar at rest; pages that don't sit under it get a spacer this tall. */
const NAVBAR_HEIGHT = "h-[72px]";

function useScrolledPast(threshold: number) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [threshold]);

  return scrolled;
}

function MobileMenu() {
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/boutique", label: "La Collection" },
    ...(Object.keys(categoryLabel) as ProductCategory[]).map((c) => ({
      to: `/collection/${c}`,
      label: categoryLabel[c],
      sub: true,
    })),
    { to: "/maison", label: "Notre Maison" },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Ouvrir le menu"
          className="p-2 text-ivoire/80 transition-colors hover:text-or md:hidden"
        >
          <Menu className="size-6" strokeWidth={1.25} />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content className="fixed inset-0 z-50 flex flex-col bg-nuit-profond px-6 pb-10 pt-5 text-ivoire data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out">
          <Dialog.Title className="sr-only">Menu</Dialog.Title>
          <Dialog.Description className="sr-only">
            Navigation principale
          </Dialog.Description>
          <div className="flex items-center justify-between">
            <Logo tone="ivoire" className="h-9 w-auto" />
            <Dialog.Close
              aria-label="Fermer le menu"
              className="p-2 text-ivoire/80 transition-colors hover:text-or"
            >
              <X className="size-6" strokeWidth={1.25} />
            </Dialog.Close>
          </div>
          <nav className="mt-16 flex flex-col gap-6">
            {links.map((l, i) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                style={{ animationDelay: `${i * 60}ms` }}
                className={`animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500 transition-colors hover:text-or ${
                  "sub" in l
                    ? "pl-5 text-sm uppercase tracking-[0.25em] text-ivoire/60"
                    : "font-serif text-4xl font-light"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <p className="mt-auto text-xs uppercase tracking-[0.35em] text-ivoire/40">
            Maison d&rsquo;Air &middot; Paris
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function Navbar() {
  const dispatch = useAppDispatch();
  const itemCount = useAppSelector((state) =>
    state.cart.lines.reduce((sum, line) => sum + line.quantity, 0),
  );
  const { pathname } = useLocation();
  const scrolled = useScrolledPast(40);

  // Only the home hero is designed to run underneath the bar.
  const overHero = pathname === "/";
  const transparent = overHero && !scrolled;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
          transparent
            ? "border-transparent bg-transparent"
            : "border-or/20 bg-nuit/85 backdrop-blur-md"
        }`}
      >
        <div
          className={`mx-auto flex max-w-6xl items-center justify-between px-6 transition-[height] duration-500 ${
            scrolled ? "h-16" : NAVBAR_HEIGHT
          }`}
        >
          <Link to="/" aria-label="Lahist'air — accueil">
            <Logo
              tone="ivoire"
              className={`w-auto transition-[height] duration-500 ${
                scrolled ? "h-8" : "h-10"
              }`}
            />
          </Link>
          <nav className="flex items-center gap-2 md:gap-8">
            <NavLink
              to="/boutique"
              className={({ isActive }) =>
                `hidden md:inline ${navLink} ${isActive ? navLinkActive : ""}`
              }
            >
              Boutique
            </NavLink>
            <NavLink
              to="/maison"
              className={({ isActive }) =>
                `hidden md:inline ${navLink} ${isActive ? navLinkActive : ""}`
              }
            >
              Notre Maison
            </NavLink>
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(openCart())}
              aria-label={`Ouvrir le panier (${itemCount} article${itemCount > 1 ? "s" : ""})`}
              className="gap-2 rounded-full bg-transparent transition-colors hover:border-or hover:text-or"
            >
              <ShoppingBag className="size-4 md:hidden" strokeWidth={1.5} />
              <span className="hidden md:inline">Panier</span>
              <span
                key={itemCount}
                className="animate-in zoom-in-50 duration-300 inline-flex h-5 w-5 items-center justify-center rounded-full bg-or text-xs font-medium text-nuit"
              >
                {itemCount}
              </span>
            </Button>
            <MobileMenu />
          </nav>
        </div>
      </header>
      {!overHero && <div aria-hidden className={NAVBAR_HEIGHT} />}
    </>
  );
}
