import { useState, type PointerEvent } from "react";

interface ZoomImageProps {
  src: string;
  alt: string;
  /** How much the photo is magnified once zoomed. */
  scale?: number;
}

/** Cursor position inside the photo, as a CSS transform-origin. */
function originFrom(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - r.left) / r.width) * 100;
  const y = ((e.clientY - r.top) / r.height) * 100;
  return `${x}% ${y}%`;
}

/**
 * Product photo the visitor can inspect up close: a click (or tap, or Enter)
 * zooms in where it lands, moving the mouse explores the label and the cap,
 * and a second click — or leaving the photo — zooms back out.
 */
export default function ZoomImage({ src, alt, scale = 2.2 }: ZoomImageProps) {
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={zoomed}
      aria-label={zoomed ? "Dézoomer la photo" : "Zoomer sur la photo"}
      className={`overflow-hidden rounded-sm border border-ardoise bg-nuit-profond ${
        zoomed ? "cursor-zoom-out" : "cursor-zoom-in"
      }`}
      onPointerUp={(e) => {
        if (e.button !== 0) return;
        setOrigin(originFrom(e));
        setZoomed((z) => !z);
      }}
      onPointerMove={(e) => {
        if (zoomed && e.pointerType === "mouse") setOrigin(originFrom(e));
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setZoomed(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOrigin("50% 50%");
          setZoomed((z) => !z);
        } else if (e.key === "Escape") {
          setZoomed(false);
        }
      }}
    >
      <img
        src={src}
        alt={alt}
        fetchPriority="high"
        draggable={false}
        style={{
          transform: zoomed ? `scale(${scale})` : undefined,
          transformOrigin: origin,
        }}
        className="aspect-square w-full select-none animate-in fade-in object-cover transition-transform duration-300 ease-out motion-reduce:transition-none"
      />
    </div>
  );
}
