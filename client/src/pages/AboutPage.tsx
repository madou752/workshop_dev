const faqs = [
  {
    q: "N'est-ce pas juste... de l'air ?",
    a: "C'est de l'air avec une provenance. Un bocal d'air non traçable est une curiosité. Un bocal d'air récolté à l'aube au-dessus du Sahara, filtré trois fois et scellé sous azote est une pièce de collection.",
  },
  {
    q: "Comment l'air est-il vraiment récolté ?",
    a: "Nos partenaires de récolte utilisent des enceintes à vide de qualité médicale sur chaque site d'origine, à un moment de la journée choisi pour l'atmosphère caractéristique du lieu.",
  },
  {
    q: "Puis-je ouvrir le flacon ?",
    a: "Vous le pouvez, mais l'air qu'il contient est immédiatement remplacé par celui de votre pièce. Nous recommandons de l'admirer scellé.",
  },
  {
    q: "Les collaborations célébrités impliquent-elles vraiment les personnes citées ?",
    a: "La ligne collab est un concept parodique créé pour ce projet et n'est ni affiliée, ni approuvée, ni produite en partenariat avec les personnes nommées.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-or">
        Notre Maison
      </p>
      <h1 className="mt-3 font-serif text-3xl text-ivoire">
        Respirer est un luxe.
      </h1>
      <p className="mt-6 text-ivoire/70">
        Une identité sobre pour un produit qui ne l&rsquo;est pas. Tout le
        reste peut être fabriqué, reproduit, produit en série. L&rsquo;air,
        en un lieu précis, à un instant précis, ne le peut pas. Lahist&rsquo;air
        existe pour celles et ceux qui comprennent que les luxes les plus
        vrais sont ceux qu&rsquo;on ne peut jamais refaire &mdash; même si,
        techniquement, ce n&rsquo;est que de l&rsquo;air.
      </p>

      <h2 className="mt-12 font-serif text-2xl text-ivoire">
        Questions Fréquentes
      </h2>
      <div className="mt-6 space-y-6">
        {faqs.map((faq) => (
          <div key={faq.q} className="border-b border-ardoise pb-6">
            <p className="font-medium text-ivoire">{faq.q}</p>
            <p className="mt-2 text-sm text-gris">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
