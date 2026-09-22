interface LogoProps {
  tone?: "ivoire" | "sombre";
  className?: string;
}

/**
 * The Lahist'air wordmark: a bottle drawn in outline with the name
 * enclosed in the glass. Straight from the brand charter -- "la marque
 * est littéralement le contenu."
 */
export default function Logo({ tone = "ivoire", className }: LogoProps) {
  const line = tone === "ivoire" ? "#EDE8DF" : "#0B0F14";
  const cap = tone === "ivoire" ? "#C9A961" : "#0B0F14";
  const gold = tone === "ivoire" ? "#C9A961" : "#0B0F14";

  return (
    <svg
      viewBox="0 0 320 120"
      fill="none"
      role="img"
      aria-label="Lahist'air"
      className={className}
    >
      <rect x="292" y="46" width="22" height="28" rx="2" fill={cap} />
      <path d="M260 50 H292 V70 H260 Z" stroke={line} strokeWidth="1.5" />
      <path
        d="M260 50 C242 30 224 18 202 18 H34 C16 18 6 28 6 46 V74 C6 92 16 102 34 102 H202 C224 102 242 90 260 70"
        stroke={line}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M100 73 H160" stroke={line} strokeWidth="0.8" opacity="0.5" />
      <text
        x="130"
        y="64"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond',serif"
        fontWeight="300"
        fontSize="44"
        letterSpacing="1"
        fill={line}
      >
        Lahist&apos;air
      </text>
      <text
        x="130"
        y="86"
        textAnchor="middle"
        fontFamily="'Jost',sans-serif"
        fontWeight="400"
        fontSize="8"
        letterSpacing="3.2"
        fill={gold}
      >
        MAISON D&apos;AIR
      </text>
    </svg>
  );
}
