import type { ReactNode } from "react";

const sections: { id: string; title: string; body: ReactNode }[] = [
  {
    id: "mentions",
    title: "Mentions légales",
    body: (
      <>
        <p>
          Lahist&rsquo;air est une <strong>marque fictive</strong>. Ce site est
          un projet étudiant réalisé dans le cadre d&rsquo;un cours de
          développement web : ce n&rsquo;est pas une entreprise, il n&rsquo;a
          ni numéro SIRET ni activité commerciale.
        </p>
        <p>
          <strong>Édition et publication :</strong> l&rsquo;équipe du projet
          Lahist&rsquo;air &mdash; conciergerie@lahistair.example.
        </p>
        <p>
          <strong>Hébergement du site :</strong> Vercel Inc., 440 N Barranca
          Ave #4133, Covina, CA 91723, États-Unis &mdash; vercel.com.
        </p>
        <p>
          <strong>Hébergement des données :</strong> MongoDB Atlas, MongoDB
          Inc., 1633 Broadway, 38th Floor, New York, NY 10019, États-Unis
          &mdash; mongodb.com.
        </p>
        <p>
          <strong>Propriété intellectuelle :</strong> les visuels des flacons
          ont été générés par intelligence artificielle pour ce projet. Les
          textes et l&rsquo;identité de la marque sont des créations de
          l&rsquo;équipe.
        </p>
      </>
    ),
  },
  {
    id: "cgv",
    title: "Conditions générales de vente",
    body: (
      <>
        <p>
          <strong>Aucune vente réelle n&rsquo;a lieu sur ce site.</strong> Les
          produits, les prix et les délais de livraison sont fictifs. Une
          commande passée ici n&rsquo;engage personne : rien n&rsquo;est
          facturé ni expédié.
        </p>
        <p>
          Le paiement est une démonstration : aucune transaction n&rsquo;est
          transmise à une banque. N&rsquo;utilisez pas votre vraie carte
          &mdash; un numéro de test comme 4242&nbsp;4242&nbsp;4242&nbsp;4242
          suffit.
        </p>
        <p>
          Faute de vente, le droit de rétractation de 14 jours prévu par le
          Code de la consommation ne s&rsquo;applique pas.
        </p>
      </>
    ),
  },
  {
    id: "confidentialite",
    title: "Politique de confidentialité",
    body: (
      <>
        <p>
          <strong>Données collectées :</strong> lors d&rsquo;une commande,
          votre nom, votre e-mail, votre adresse de livraison et, le cas
          échéant, votre message cadeau. De la carte, seuls les{" "}
          <strong>4 derniers chiffres</strong> sont conservés ; le numéro
          complet n&rsquo;est jamais enregistré.
        </p>
        <p>
          <strong>Finalité :</strong> uniquement faire fonctionner la
          démonstration (afficher la confirmation et le certificat de
          commande). Les données ne sont ni vendues, ni partagées, ni
          utilisées à des fins publicitaires.
        </p>
        <p>
          <strong>Conservation :</strong> jusqu&rsquo;à la fin du projet, puis
          suppression de la base de données.
        </p>
        <p>
          <strong>Vos droits (RGPD) :</strong> vous pouvez demander
          l&rsquo;accès, la rectification ou la suppression de vos données à
          conciergerie@lahistair.example. Vous pouvez aussi adresser une
          réclamation à la CNIL (cnil.fr).
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    body: (
      <p>
        Ce site n&rsquo;utilise <strong>aucun cookie</strong> ni outil de
        mesure d&rsquo;audience ou de publicité. C&rsquo;est pourquoi aucun
        bandeau de consentement ne s&rsquo;affiche.
      </p>
    ),
  },
];

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-[11px] uppercase tracking-[0.3em] text-or">
        Informations légales
      </p>
      <h1 className="mt-4 font-serif text-4xl font-light text-ivoire sm:text-5xl">
        Mentions &amp; conditions
      </h1>

      <nav
        aria-label="Sommaire"
        className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-[0.2em]"
      >
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="text-ivoire/60 transition-colors hover:text-or"
          >
            {s.title}
          </a>
        ))}
      </nav>

      <div className="mt-12 divide-y divide-ardoise border-y border-ardoise">
        {sections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-24 py-10">
            <h2 className="font-serif text-2xl font-light text-ivoire">
              {s.title}
            </h2>
            <div className="mt-5 space-y-4 leading-relaxed text-ivoire/70 [&_strong]:font-medium [&_strong]:text-ivoire">
              {s.body}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-8 text-xs text-ivoire/40">
        Dernière mise à jour : septembre 2026.
      </p>
    </div>
  );
}
