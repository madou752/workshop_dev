import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { OrderConfirmation } from "../types/product";

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
        <p className="text-air-950/70">We couldn&rsquo;t find that order.</p>
        <Link to="/shop" className="mt-4 inline-block text-gold-500">
          Back to the collection
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center text-air-950/60">
        Loading your receipt...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold-500">
          Order confirmed
        </p>
        <h1 className="mt-3 font-serif text-3xl text-air-950">
          Thank you. Your air is being decanted.
        </h1>
        <p className="mt-2 text-sm text-air-950/60">
          Order {order.orderId} &middot;{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      <div
        className="mt-10 rounded-2xl border border-air-950/10 bg-air-50 p-6"
        // Server-rendered receipt (caveman template) — our own trusted content.
        dangerouslySetInnerHTML={{ __html: order.receiptHtml }}
      />

      <div className="mt-10 text-center">
        <Link
          to="/shop"
          className="inline-block rounded-full bg-air-950 px-6 py-3 text-sm uppercase tracking-wide text-air-50"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
