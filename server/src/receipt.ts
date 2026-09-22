import Caveman from "caveman";
import type { Order, Product } from "./types.js";

interface ReceiptLine {
  name: string;
  sizeLabel: string;
  quantity: number;
  lineTotal: number;
}

// Caveman does not escape by default; the "escape" macro is used explicitly
// below for the one field that comes from user input (customer name).
const receiptTemplate = `
<div class="space-y-3">
  <p class="text-sm text-air-950/60">Shipping to {{- escape d.customerName}}</p>
  <ul class="divide-y divide-air-950/10">
  {{- for d.lines as line}}
    <li class="flex justify-between py-2 text-sm">
      <span>{{line.quantity}}&times; {{line.name}} ({{line.sizeLabel}})</span>
      <span>&euro;{{line.lineTotal}}</span>
    </li>
  {{- end}}
  </ul>
  <p class="flex justify-between border-t border-air-950/15 pt-3 font-medium">
    <span>Total</span>
    <span>&euro;{{d.total}}</span>
  </p>
</div>
`;

export function renderReceipt(order: Order, products: Product[]): string {
  const lines: ReceiptLine[] = order.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    const size = product?.sizes.find((s) => s.id === item.sizeId);
    return {
      name: product?.name ?? "Unknown Air",
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
