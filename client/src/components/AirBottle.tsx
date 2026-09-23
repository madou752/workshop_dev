import SunMark from "@/components/brand/SunMark";

export type AirBottleSize = "large" | "card" | "travel" | "mini";

interface AirBottleProps {
  size: AirBottleSize;
  tagline?: string;
  altitude?: string;
  volumeMl?: number;
  lotNumber?: string;
  className?: string;
  /** Gentle idle float, for hero / spotlight presentations only. */
  floating?: boolean;
}

const capGradient =
  "linear-gradient(90deg,#8E7440,#D8BC7A 45%,#A88A48)";
const neckGradient =
  "linear-gradient(90deg,rgba(255,255,255,0.03),rgba(255,255,255,0.12) 40%,rgba(255,255,255,0.02))";
const bodyGradient =
  "linear-gradient(90deg,rgba(255,255,255,0.02),rgba(255,255,255,0.10) 35%,rgba(255,255,255,0.01) 70%,rgba(255,255,255,0.06))";
const bodyShadow =
  "inset 0 -40px 60px rgba(201,169,97,0.05), 0 24px 48px rgba(0,0,0,0.5)";
const highlightGradient =
  "linear-gradient(180deg,transparent,rgba(255,255,255,0.35) 20%,rgba(255,255,255,0.35) 80%,transparent)";
const glassBorder = "1px solid rgba(237,232,223,0.4)";
const neckBorder = "1px solid rgba(237,232,223,0.35)";

interface Metrics {
  width: number;
  height: number;
  cap: { width: number; height: number; radius: string };
  neck: { width: number; height: number; radius: string };
  bodyRadius: string;
  label: { top: number; padding: string } | null;
  sun: number;
  wordmarkSize: number;
  subSize: number;
  showFull: boolean;
}

const METRICS: Record<AirBottleSize, Metrics> = {
  large: {
    width: 200,
    height: 500,
    cap: { width: 44, height: 52, radius: "4px 4px 0 0" },
    neck: { width: 72, height: 60, radius: "8px 8px 0 0" },
    bodyRadius: "28px 28px 22px 22px",
    label: { top: 130, padding: "32px 20px" },
    sun: 40,
    wordmarkSize: 18,
    subSize: 8,
    showFull: true,
  },
  card: {
    width: 132,
    height: 340,
    cap: { width: 30, height: 35, radius: "3px 3px 0 0" },
    neck: { width: 48, height: 40, radius: "6px 6px 0 0" },
    bodyRadius: "20px 20px 16px 16px",
    label: { top: 92, padding: "20px 14px" },
    sun: 26,
    wordmarkSize: 13,
    subSize: 6.5,
    showFull: false,
  },
  travel: {
    width: 110,
    height: 300,
    cap: { width: 30, height: 34, radius: "3px 3px 0 0" },
    neck: { width: 44, height: 36, radius: "6px 6px 0 0" },
    bodyRadius: "18px 18px 14px 14px",
    label: { top: 70, padding: "20px 10px" },
    sun: 22,
    wordmarkSize: 11,
    subSize: 6,
    showFull: false,
  },
  mini: {
    width: 44,
    height: 96,
    cap: { width: 12, height: 14, radius: "2px 2px 0 0" },
    neck: { width: 20, height: 16, radius: "4px 4px 0 0" },
    bodyRadius: "10px 10px 8px 8px",
    label: null,
    sun: 0,
    wordmarkSize: 0,
    subSize: 0,
    showFull: false,
  },
};

export default function AirBottle({
  size,
  tagline,
  altitude,
  volumeMl = 0,
  lotNumber,
  className,
  floating = false,
}: AirBottleProps) {
  const m = METRICS[size];

  return (
    <div
      className={floating ? `animate-float-bottle ${className ?? ""}` : className}
      style={{
        position: "relative",
        width: m.width,
        height: m.height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: m.cap.width,
          height: m.cap.height,
          background: capGradient,
          borderRadius: m.cap.radius,
        }}
      />
      <div
        style={{
          width: m.neck.width,
          height: m.neck.height,
          background: neckGradient,
          border: neckBorder,
          borderBottom: "none",
          borderRadius: m.neck.radius,
        }}
      />
      <div
        style={{
          position: "relative",
          width: m.width,
          flex: 1,
          border: glassBorder,
          borderTop: "none",
          borderRadius: m.bodyRadius,
          background: bodyGradient,
          boxShadow: bodyShadow,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: m.width * 0.11,
            top: m.height * 0.06,
            bottom: m.height * 0.12,
            width: Math.max(2, m.width * 0.015),
            background: highlightGradient,
            borderRadius: 2,
          }}
        />
        {m.label && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: m.label.top,
              padding: m.label.padding,
              background: "#EDE8DF",
              color: "#0B0F14",
              textAlign: "center",
            }}
          >
            <SunMark
              tone="etiquette"
              compact={!m.showFull}
              style={{ width: m.sun, height: m.sun, margin: "0 auto", display: "block" }}
            />
            <div
              style={{
                marginTop: m.showFull ? 14 : 8,
                fontFamily: "'Cormorant Garamond',serif",
                fontWeight: 300,
                fontSize: m.wordmarkSize,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                paddingLeft: "0.2em",
              }}
            >
              Lahist&apos;air
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: m.subSize,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#4A5561",
              }}
            >
              {m.showFull ? "Maison d'air" : `${volumeMl} ml`}
            </div>
            {m.showFull && (
              <>
                <div
                  style={{
                    margin: "16px auto 0",
                    width: 36,
                    height: 1,
                    background: "#C9A961",
                  }}
                />
                {tagline && (
                  <div
                    style={{
                      marginTop: 12,
                      fontFamily: "'Cormorant Garamond',serif",
                      fontStyle: "italic",
                      fontSize: 14,
                      lineHeight: 1.3,
                    }}
                  >
                    {tagline}
                  </div>
                )}
                {(altitude || lotNumber) && (
                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 7.5,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "#4A5561",
                      lineHeight: 1.8,
                    }}
                  >
                    {altitude && <>{altitude} &middot; {volumeMl} ml</>}
                    {lotNumber && (
                      <>
                        <br />
                        Lot {lotNumber}
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
