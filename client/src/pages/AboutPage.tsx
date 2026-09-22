const faqs = [
  {
    q: "Isn't this just... air?",
    a: "It's air with provenance. A jar of untraceable air is a novelty. A jar of air harvested at dawn over the Sahara, filtered three times, and sealed under nitrogen is a statement piece.",
  },
  {
    q: "How is the air actually collected?",
    a: "Our harvesting partners use medical-grade vacuum vessels at each origin site, at a time of day chosen for that location's signature atmosphere.",
  },
  {
    q: "Can I open the bottle?",
    a: "You can, but the air inside is immediately replaced by whatever air is in your room. We recommend admiring it sealed.",
  },
  {
    q: "Do the celebrity collabs involve the celebrities?",
    a: "The collab line is a parody concept created for this project and is not affiliated with, endorsed by, or produced in partnership with any named individual.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-gold-500">
        Our Craft
      </p>
      <h1 className="mt-3 font-serif text-3xl text-air-950">
        Air is the last true luxury.
      </h1>
      <p className="mt-6 text-air-950/70">
        Everything else can be manufactured, replicated, or mass-produced.
        Air, at a specific place, at a specific moment, cannot. Aéther exists
        for people who understand that the most meaningful luxuries are the
        ones that can never be remade &mdash; even if, technically, it is
        just air.
      </p>

      <h2 className="mt-12 font-serif text-2xl text-air-950">
        Frequently Asked Questions
      </h2>
      <div className="mt-6 space-y-6">
        {faqs.map((faq) => (
          <div key={faq.q} className="border-b border-air-950/10 pb-6">
            <p className="font-medium text-air-950">{faq.q}</p>
            <p className="mt-2 text-sm text-air-950/60">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
