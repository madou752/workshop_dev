import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Printer } from "lucide-react";
import type { OrderConfirmation } from "@/types/product";
import Certificate from "@/components/Certificate";
import { Button } from "@/components/ui/button";

const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderConfirmation | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/orders/${orderId}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then(setOrder)
      .catch(() => setNotFound(true));
  }, [orderId]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="font-serif text-2xl font-light text-ivoire/80">
          Cette commande est introuvable.
        </p>
        <Link to="/boutique" className="mt-4 inline-block text-or">
          Retour à la collection
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center text-gris">
        Préparation de votre certificat...
      </div>
    );
  }

  const firstName = order.customerName.split(" ")[0];
  const subtotal = order.items.reduce((sum, i) => sum + i.lineTotal, 0);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="text-center print:hidden">
        <p className="text-[11px] uppercase tracking-[0.3em] text-or">
          Commande confirmée
        </p>
        <h1 className="mt-4 font-serif text-4xl font-light text-ivoire sm:text-5xl">
          Merci, {firstName}.
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-ivoire/70">
          Votre air est en cours de préparation. Chaque flacon voyagera
          accompagné de son certificat, que vous trouverez aussi ci-dessous.
        </p>
        <p className="mt-4 text-[11px] uppercase tracking-[0.25em] text-gris">
          Commande {order.orderId} &middot; {longDate(order.createdAt)}
        </p>
      </div>

      <div className="mt-12 space-y-8">
        {order.items.map((item) => (
          <Certificate
            key={`${item.name}-${item.sizeLabel}`}
            className="animate-in fade-in slide-in-from-bottom-4 duration-700 print:break-inside-avoid print:shadow-none"
            title={item.name}
            subtitle={`Délivré à ${order.customerName}`}
            rows={[
              { label: "Lot", value: item.lotNumber, emphasis: true },
              { label: "Origine", value: item.origin },
              { label: "Altitude", value: item.altitude },
              { label: "Format", value: item.sizeLabel },
              ...(item.quantity > 1
                ? [{ label: "Flacons", value: String(item.quantity) }]
                : []),
              { label: "Date", value: longDate(order.createdAt) },
              { label: "Commande", value: order.orderId },
            ]}
          />
        ))}
      </div>

      {order.gift && (
        <div className="mt-12 rounded-sm border border-or/30 px-8 py-7 text-center print:hidden">
          <p className="text-[11px] uppercase tracking-[0.3em] text-or">
            Emballage cadeau
          </p>
          {order.gift.message ? (
            <p className="mt-4 font-serif text-xl italic leading-relaxed text-ivoire/90">
              &laquo;&nbsp;{order.gift.message}&nbsp;&raquo;
            </p>
          ) : (
            <p className="mt-4 text-sm text-ivoire/60">
              Sans message.
            </p>
          )}
          {order.gift.hidePrices && (
            <p className="mt-4 text-xs text-ivoire/50">
              Les prix ne figureront pas dans le colis.
            </p>
          )}
        </div>
      )}

      <div className="mt-12 rounded-sm border border-ardoise bg-brume-profond p-6 print:hidden">
        <p className="text-[11px] uppercase tracking-[0.25em] text-gris">
          Récapitulatif
        </p>
        <ul className="mt-4 divide-y divide-ardoise text-sm">
          {order.items.map((item) => (
            <li
              key={`${item.name}-${item.sizeLabel}`}
              className="flex justify-between gap-4 py-3"
            >
              <span className="text-ivoire/80">
                {item.quantity}&times; {item.name}{" "}
                <span className="text-gris">({item.sizeLabel})</span>
              </span>
              <span className="text-ivoire">{item.lineTotal}&nbsp;&euro;</span>
            </li>
          ))}
        </ul>
        <dl className="mt-2 space-y-2 border-t border-ardoise pt-4 text-sm">
          <div className="flex justify-between text-ivoire/70">
            <dt>Sous-total</dt>
            <dd>{subtotal}&nbsp;&euro;</dd>
          </div>
          {order.shipping && (
            <div className="flex justify-between text-ivoire/70">
              <dt>{order.shipping.label}</dt>
              <dd>
                {order.shipping.priceEUR === 0
                  ? "Offerte"
                  : `${order.shipping.priceEUR} €`}
              </dd>
            </div>
          )}
          <div className="flex items-baseline justify-between border-t border-or/40 pt-3">
            <dt className="text-ivoire">Total réglé</dt>
            <dd className="font-serif text-2xl text-ivoire">
              {order.totalEUR}&nbsp;&euro;
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-6 print:hidden">
        <Button asChild size="lg" className="rounded-full px-8">
          <Link to="/boutique">Poursuivre mes achats</Link>
        </Button>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-ivoire/60 transition-colors hover:text-or"
        >
          <Printer className="size-4" strokeWidth={1.5} />
          Imprimer le certificat
        </button>
      </div>
    </div>
  );
}
