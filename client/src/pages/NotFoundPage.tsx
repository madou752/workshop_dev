import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export default function NotFoundPage() {
  useDocumentTitle("Page introuvable");

  return (
    <div className="mx-auto flex min-h-[60svh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-or">Erreur 404</p>
      <h1 className="mt-5 font-serif text-5xl font-light text-ivoire sm:text-6xl">
        Cet air s&rsquo;est dissipé.
      </h1>
      <div className="mt-8 h-px w-16 bg-or" />
      <p className="mt-8 max-w-md leading-relaxed text-ivoire/70">
        La page que vous cherchez n&rsquo;existe pas, ou plus. Peut-être
        a-t-elle été mise en flacon ailleurs.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
        <Button asChild size="lg" className="rounded-full px-8">
          <Link to="/boutique">Découvrir la collection</Link>
        </Button>
        <Link
          to="/"
          className="text-sm uppercase tracking-[0.2em] text-ivoire/60 transition-colors hover:text-or"
        >
          Retour à l&rsquo;accueil
        </Link>
      </div>
    </div>
  );
}
