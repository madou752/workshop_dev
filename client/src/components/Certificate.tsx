import type { ReactNode } from "react";
import SunMark from "@/components/brand/SunMark";

interface CertificateProps {
  title: string;
  /** Small line under the title, e.g. who it was issued to. */
  subtitle?: string;
  rows: { label: string; value: ReactNode; emphasis?: boolean }[];
  className?: string;
}

/** The ivory "Certificat d'authenticité" card, printed like the bottle label. */
export default function Certificate({
  title,
  subtitle,
  rows,
  className = "",
}: CertificateProps) {
  return (
    <div
      className={`rounded-sm bg-ivoire p-8 text-nuit shadow-2xl shadow-black/40 sm:p-10 ${className}`}
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gris-fonce">
            Certificat d&rsquo;authenticité
          </p>
          <p className="mt-3 font-serif text-2xl">{title}</p>
          {subtitle && (
            <p className="mt-1 font-serif text-base italic text-gris-fonce">
              {subtitle}
            </p>
          )}
        </div>
        <SunMark tone="etiquette" className="size-12 shrink-0" />
      </div>
      <div className="my-6 h-px w-12 bg-or" />
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-4 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="contents">
            <dt className="text-gris-fonce">{row.label}</dt>
            <dd
              className={`text-right ${row.emphasis ? "font-serif text-lg" : ""}`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-8 border-t border-nuit/15 pt-5 font-serif text-sm italic text-gris-fonce">
        Scellé sur place et numéroté à la main &mdash; Maison Lahist&rsquo;air.
      </p>
    </div>
  );
}
