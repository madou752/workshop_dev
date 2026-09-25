import { useEffect } from "react";

const SITE = "Lahist'air";
const DEFAULT_TITLE = `${SITE} — Maison d'air d'exception`;

/** Sets the browser tab title, e.g. "Brume d'Iguazú — Lahist'air". */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE}` : DEFAULT_TITLE;
  }, [title]);
}
