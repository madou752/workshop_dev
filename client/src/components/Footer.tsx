import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Logo from "@/components/brand/Logo";
import { categoryLabel } from "@/lib/categories";
import type { ProductCategory } from "@/types/product";

const heading = "text-[11px] uppercase tracking-[0.3em] text-or";
const link = "text-ivoire/60 transition-colors hover:text-ivoire";

const maisonLinks = [
  { to: "/maison", label: "Notre Maison" },
  { to: "/boutique", label: "La Collection" },
  { to: "/panier", label: "Votre panier" },
];

const legalLinks = [
  { hash: "mentions", label: "Mentions légales" },
  { hash: "cgv", label: "CGV" },
  { hash: "confidentialite", label: "Confidentialité" },
  { hash: "cookies", label: "Cookies" },
];

const services = [
  "Livraison en coffret signature",
  "Emballage cadeau offert",
  "Certificat d'authenticité",
  "Retours sous 30 jours",
];

function Registre() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p className="font-serif text-lg italic text-ivoire/80">
        Merci. Vous serez informé de l&rsquo;ouverture des prochains lots.
      </p>
    );
  }

  // Demo storefront: nothing is sent anywhere, the form only acknowledges.
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="flex items-center border-b border-or/50 transition-colors focus-within:border-or"
    >
      <label htmlFor="registre-email" className="sr-only">
        Adresse e-mail
      </label>
      <input
        id="registre-email"
        type="email"
        required
        placeholder="Votre adresse e-mail"
        className="min-w-0 flex-1 bg-transparent py-3 text-ivoire placeholder:text-ivoire/35 focus:outline-none"
      />
      <button
        type="submit"
        aria-label="S'inscrire au Registre"
        className="p-2 text-or transition-transform hover:translate-x-1"
      >
        <ArrowRight className="size-5" strokeWidth={1.25} />
      </button>
    </form>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-ardoise bg-nuit-profond text-ivoire">
      <div className="relative flex h-72 items-center overflow-hidden sm:h-80">
        {/*
          The peak from the hero render, cropped left of the bottle and kept
          near native scale so it stays crisp. Masks (not overlays) fade the
          edges so no seam shows at fractional DPRs.
        */}
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 w-[620px] max-w-full [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]"
        >
          <div
            className="h-full w-full bg-no-repeat [mask-image:linear-gradient(to_right,transparent,black_45%)]"
            style={{
              backgroundImage: "url(/hero-altitude.jpg)",
              backgroundSize: "1840px auto",
              backgroundPosition: "-20px -600px",
            }}
          />
        </div>
        <div className="relative mx-auto w-full max-w-6xl px-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-or">
            Édition 01
          </p>
          <p className="mt-4 max-w-xl font-serif text-4xl font-light leading-tight sm:text-5xl">
            L&rsquo;air se raréfie.
            <br />
            Nos lots aussi.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-10">
        <div className="grid gap-12 border-t border-ivoire/10 pt-14 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo tone="ivoire" className="h-10 w-auto" />
            <p className={`mt-8 ${heading}`}>Le Registre</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ivoire/60">
              Soyez informé de l&rsquo;ouverture des prochains lots, avant
              leur mise en vente.
            </p>
            <div className="mt-5 max-w-sm">
              <Registre />
            </div>
          </div>

          <div className="grid gap-10 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className={heading}>Collections</p>
              <ul className="mt-5 space-y-3">
                {(Object.keys(categoryLabel) as ProductCategory[]).map((c) => (
                  <li key={c}>
                    <Link to={`/collection/${c}`} className={link}>
                      {categoryLabel[c]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className={heading}>La Maison</p>
              <ul className="mt-5 space-y-3">
                {maisonLinks.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className={link}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className={heading}>Services</p>
              <ul className="mt-5 space-y-3 text-ivoire/60">
                {services.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className={heading}>Conciergerie</p>
              <p className="mt-5 leading-relaxed text-ivoire/60 [overflow-wrap:anywhere]">
                conciergerie@lahistair.example
                <br />
                Lun&ndash;Ven, 9h&ndash;18h
                <br />
                (heure de Paris)
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-ivoire/10 pt-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="shrink-0 space-y-3">
            <p className="text-[11px] uppercase tracking-[0.35em] text-ivoire/50">
              Paris &middot; 2 847 m &middot; Depuis 2026
            </p>
            <nav
              aria-label="Informations légales"
              className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-ivoire/50"
            >
              {legalLinks.map((l) => (
                <Link
                  key={l.hash}
                  to={`/mentions-legales#${l.hash}`}
                  className="transition-colors hover:text-ivoire"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <p className="max-w-xl text-[11px] leading-relaxed text-ivoire/30 sm:text-right">
            &copy; {new Date().getFullYear()} Lahist&rsquo;air. Cette boutique
            est une démonstration parodique réalisée dans le cadre d&rsquo;un
            exercice de code &mdash; aucun paiement réel n&rsquo;est traité et
            rien n&rsquo;est réellement expédié. Les références à des
            personnalités sont utilisées sur le ton de la parodie et ne sont
            ni affiliées ni approuvées par les personnes citées.
          </p>
        </div>
      </div>
    </footer>
  );
}
