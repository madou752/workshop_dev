import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

const navLink =
  "text-sm tracking-wide uppercase text-air-950/70 hover:text-air-950 transition-colors";
const navLinkActive = "text-air-950 font-medium";

export default function Navbar() {
  const itemCount = useAppSelector((state) =>
    state.cart.lines.reduce((sum, line) => sum + line.quantity, 0),
  );

  return (
    <header className="sticky top-0 z-40 border-b border-air-950/10 bg-air-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          to="/"
          className="font-serif text-2xl tracking-[0.2em] text-air-950"
        >
          AÉTHER
        </Link>
        <nav className="flex items-center gap-8">
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              `${navLink} ${isActive ? navLinkActive : ""}`
            }
          >
            Shop
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${navLink} ${isActive ? navLinkActive : ""}`
            }
          >
            Our Craft
          </NavLink>
          <Link
            to="/cart"
            className="flex items-center gap-2 rounded-full border border-air-950/15 px-4 py-2 text-sm uppercase tracking-wide text-air-950 hover:border-gold-400 hover:text-gold-500 transition-colors"
          >
            Cart
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-air-950 text-xs font-medium text-air-50">
              {itemCount}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
