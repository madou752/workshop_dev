import Caveman from "caveman";
import type { Order, Product } from "./types.js";

interface ReceiptLine {
  name: string;
  sizeLabel: string;
  quantity: number;
  lineTotal: number;
}

// This HTML is generated server-side and injected client-side via
// dangerouslySetInnerHTML, so it never passes through Vite/Tailwind's
// scanner -- inline styles are used instead of Tailwind classes, which
// would otherwise be purged from the client bundle.
//
// Caveman does not escape by default; the "escape" macro is used
// explicitly below for the one field that comes from user input
// (customer name).
const receiptTemplate = `
<div style="font-family:'Jost',sans-serif;color:#EDE8DF;">
  <p style="margin:0 0 12px;font-size:13px;color:#8E9AA6;">Livraison &#224; {{- escape d.customerName}}</p>
  <ul style="list-style:none;margin:0;padding:0;border-top:1px solid #1F2933;">
  {{- for d.lines as line}}
    <li style="display:flex;justify-content:space-between;padding:10px 0;font-size:14px;border-bottom:1px solid #1F2933;">
      <span>{{line.quantity}}&times; {{line.name}} ({{line.sizeLabel}})</span>
      <span>{{line.lineTotal}}&nbsp;&euro;</span>
    </li>
  {{- end}}
  </ul>
  <p style="display:flex;justify-content:space-between;margin:14px 0 0;padding-top:14px;border-top:1px solid #C9A961;font-weight:500;">
    <span>Total</span>
    <span>{{d.total}}&nbsp;&euro;</span>
  </p>
</div>
`;

export function renderReceipt(order: Order, products: Product[]): string {
  const lines: ReceiptLine[] = order.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    const size = product?.sizes.find((s) => s.id === item.sizeId);
    return {
      name: product?.name ?? "Air inconnu",
      sizeLabel: size?.label ?? "",
      quantity: item.quantity,
      lineTotal: (size?.priceEUR ?? 0) * item.quantity,
    };
  });

  return Caveman(receiptTemplate, {
    customerName: order.customer.fullName,
    lines,
    total: order.totalEUR,
  });
}
