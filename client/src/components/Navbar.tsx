import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import Logo from "@/components/brand/Logo";

const navLink =
  "text-sm tracking-wide uppercase text-ivoire/60 hover:text-ivoire transition-colors";
const navLinkActive = "text-ivoire";

export default function Navbar() {
  const itemCount = useAppSelector((state) =>
    state.cart.lines.reduce((sum, line) => sum + line.quantity, 0),
  );

  return (
    <header className="sticky top-0 z-40 border-b border-ardoise bg-nuit/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" aria-label="Lahist'air — accueil">
          <Logo tone="ivoire" className="h-10 w-auto" />
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
            className="gap-2 rounded-full transition-colors hover:border-or hover:text-or"
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
  );
}
