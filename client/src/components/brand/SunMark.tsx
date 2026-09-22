interface SunMarkProps {
  tone?: "standalone" | "etiquette";
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * The concentric-circle symbol from the charter: a halo mark used both
 * on its own (gold + ivory on a dark ground) and printed on the bottle
 * label (all dark ink on ivory, with a dashed middle ring).
 */
export default function SunMark({
  tone = "standalone",
  compact = false,
  className,
  style,
}: SunMarkProps) {
  const stroke = tone === "standalone" ? undefined : "#0B0F14";
  const outer = tone === "standalone" ? "#C9A961" : stroke;
  const inner = tone === "standalone" ? "#EDE8DF" : stroke;
  const dot = tone === "standalone" ? "#C9A961" : stroke;

  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      role="img"
      aria-label="Symbole Lahist'air"
      className={className}
      style={style}
    >
      <circle cx="100" cy="100" r="86" stroke={outer} strokeWidth="2" />
      {tone === "etiquette" && !compact && (
        <circle
          cx="100"
          cy="100"
          r="62"
          stroke={stroke}
          strokeWidth="1.2"
          strokeDasharray="2 6"
        />
      )}
      <circle cx="100" cy="100" r="38" stroke={inner} strokeWidth="2" />
      <circle cx="100" cy="100" r="5" fill={dot} />
    </svg>
  );
}
