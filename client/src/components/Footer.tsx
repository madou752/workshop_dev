import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-air-950/10 bg-air-900 text-air-100">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-serif text-xl tracking-[0.2em]">AÉTHER</p>
            <p className="mt-3 max-w-xs text-sm text-air-100/70">
              Since 2019, the world&rsquo;s most discerning collectors have
              trusted Aéther to capture air worth remembering.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-air-100/60">
              Explore
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/shop" className="hover:text-gold-400">
                  Shop the Collection
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold-400">
                  Our Craft
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-gold-400">
                  Your Cart
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-air-100/60">
              Concierge
            </p>
            <p className="mt-3 text-sm text-air-100/70">
              concierge@aether-air.example
              <br />
              Mon&ndash;Fri, 9:00&ndash;18:00 CET
            </p>
          </div>
        </div>
        <p className="mt-12 border-t border-air-100/10 pt-6 text-xs text-air-100/50">
          &copy; {new Date().getFullYear()} Aéther Air Co. This is a parody
          demo storefront built for a coding exercise &mdash; no real
          payments are processed and nothing is actually shipped. All
          celebrity references are used in jest and are not affiliated with
          or endorsed by the individuals named.
        </p>
      </div>
    </footer>
  );
}
