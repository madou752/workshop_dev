import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import Logo from "@/components/brand/Logo";

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

export default function Navbar() {
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
          <nav className="flex items-center gap-8">
            <NavLink
              to="/boutique"
              className={({ isActive }) =>
                `${navLink} ${isActive ? navLinkActive : ""}`
              }
            >
              Boutique
            </NavLink>
            <NavLink
              to="/maison"
              className={({ isActive }) =>
                `${navLink} ${isActive ? navLinkActive : ""}`
              }
            >
              Notre Maison
            </NavLink>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="gap-2 rounded-full bg-transparent transition-colors hover:border-or hover:text-or"
            >
              <Link to="/panier">
                Panier
                <span
                  key={itemCount}
                  className="animate-in zoom-in-50 duration-300 inline-flex h-5 w-5 items-center justify-center rounded-full bg-or text-xs font-medium text-nuit"
                >
                  {itemCount}
                </span>
              </Link>
            </Button>
          </nav>
        </div>
      </header>
      {!overHero && <div aria-hidden className={NAVBAR_HEIGHT} />}
    </>
  );
}
