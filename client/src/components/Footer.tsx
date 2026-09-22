import { Link } from "react-router-dom";
import Logo from "@/components/brand/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-ardoise bg-nuit-profond text-ivoire">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <Logo tone="ivoire" className="h-9 w-auto" />
            <p className="mt-4 max-w-xs text-sm text-ivoire/60">
              Maison d&rsquo;air d&rsquo;exception. Une identité sobre pour
              un produit qui ne l&rsquo;est pas.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-ivoire/50">
              Explorer
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/boutique" className="hover:text-or">
                  Découvrir la Collection
                </Link>
              </li>
              <li>
                <Link to="/maison" className="hover:text-or">
                  Notre Maison
                </Link>
              </li>
              <li>
                <Link to="/panier" className="hover:text-or">
                  Votre Panier
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-ivoire/50">
              Conciergerie
            </p>
            <p className="mt-3 text-sm text-ivoire/60">
              conciergerie@lahistair.example
              <br />
              Lun&ndash;Ven, 9h&ndash;18h (heure de Paris)
            </p>
          </div>
        </div>
        <p className="mt-12 border-t border-ivoire/10 pt-6 text-xs text-ivoire/40">
          &copy; {new Date().getFullYear()} Lahist&rsquo;air. Cette boutique
          est une démonstration parodique réalisée dans le cadre d&rsquo;un
          exercice de code &mdash; aucun paiement réel n&rsquo;est traité et
          rien n&rsquo;est réellement expédié. Les références à des
          personnalités sont utilisées sur le ton de la parodie et ne sont
          ni affiliées ni approuvées par les personnes citées.
        </p>
      </div>
    </footer>
  );
}
