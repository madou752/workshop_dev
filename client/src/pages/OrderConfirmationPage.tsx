import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { OrderConfirmation } from "@/types/product";
import { Button } from "@/components/ui/button";

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
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <p className="text-ivoire/70">Cette commande est introuvable.</p>
        <Link to="/boutique" className="mt-4 inline-block text-or">
          Retour à la collection
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center text-gris">
        Chargement de votre reçu...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-or">
          Commande confirmée
        </p>
        <h1 className="mt-3 font-serif text-3xl text-ivoire">
          Merci. Votre air est en cours de décantation.
        </h1>
        <p className="mt-2 text-sm text-gris">
          Commande {order.orderId} &middot;{" "}
          {new Date(order.createdAt).toLocaleString("fr-FR")}
        </p>
      </div>

      <div
        className="mt-10 rounded border border-ardoise bg-brume-profond p-6"
        // Server-rendered receipt (caveman template) — our own trusted content.
        dangerouslySetInnerHTML={{ __html: order.receiptHtml }}
      />

      <div className="mt-10 text-center">
        <Button asChild size="lg" className="rounded-full">
          <Link to="/boutique">Poursuivre mes achats</Link>
        </Button>
      </div>
    </div>
  );
}
