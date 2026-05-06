import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "nertia — campbell, douglas scott";

const INK = "#0a0a0a";
const PAPER = "#f3f1ec";
const ACCENT = "#1fb573";
const QUIET = "#80807a";
const MUTED = "#3a3a36";

// Mirrors slide 1 of the homepage hero — the "[ NERTIA ] / CAMPBELL,
// DOUGLAS SCOTT." identity slide. Composed with the same eyebrow tag,
// 3-line name headline (middle muted), caption, inline CTA, and a
// portrait blueprint silhouette anchored bottom-right.
export default function OpenGraphImage() {
  // Resolve absolute URL for the portrait asset. Satori's <img> needs
  // a fully-qualified URL when running on edge.
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const portraitUrl = `${baseUrl}/scott-portrait-blueprint-green.svg`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: INK,
          color: PAPER,
          display: "flex",
          flexDirection: "column",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Portrait silhouette — anchored bottom-right, layered behind
            the text content via a lower z. */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            right: -40,
            bottom: -40,
            width: 720,
            justifyContent: "flex-end",
            alignItems: "flex-end",
            opacity: 0.85,
          }}
        >
          <img
            src={portraitUrl}
            width={720}
            height={960}
            style={{
              objectFit: "contain",
              objectPosition: "bottom right",
            }}
          />
        </div>

        {/* Text content layer */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "56px 72px",
          }}
        >
          {/* Top bar — eyebrow bracket + role on left, brand mark on right */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              fontFamily: "monospace",
              fontSize: 16,
              letterSpacing: 2.5,
              color: QUIET,
              textTransform: "uppercase",
            }}
          >
            <span style={{ color: PAPER, fontWeight: 600, letterSpacing: 3 }}>
              [ NERTIA ]
            </span>
            <span style={{ width: 56, height: 1, backgroundColor: MUTED }} />
            <span>PORTLAND · 10+ YEARS · PMM × AI-GTM</span>
            <div style={{ display: "flex", flex: 1 }} />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: PAPER,
                textTransform: "none",
                letterSpacing: 0,
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="-1.5 -1.5 12 15"
                style={{ display: "flex" }}
              >
                <path
                  d="M0.6,9.4 L2.5,5.6 L4.0,7.2 L6.6,3.0 L4.6,3.0 M6.6,3.0 L6.6,5.0"
                  fill="none"
                  stroke={PAPER}
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span style={{ fontSize: 20, letterSpacing: -0.5 }}>
                nertia<span style={{ color: ACCENT }}>.</span>ai
              </span>
            </div>
          </div>

          {/* Headline — 3-line name, middle muted, accent dot on the period */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: 0.9,
              letterSpacing: -5,
              fontWeight: 800,
              fontSize: 132,
              maxWidth: 760,
            }}
          >
            <span style={{ display: "flex", color: PAPER }}>CAMPBELL,</span>
            <span style={{ display: "flex", color: MUTED }}>DOUGLAS</span>
            <span style={{ display: "flex", color: PAPER }}>
              SCOTT<span style={{ color: ACCENT }}>.</span>
            </span>
          </div>

          {/* Bottom — caption + CTA */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 32,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontFamily: "monospace",
                fontSize: 15,
                color: QUIET,
                letterSpacing: 0.5,
                lineHeight: 1.55,
                maxWidth: 540,
              }}
            >
              <span>Product marketing operator with full-stack chops.</span>
              <span>Available for IC, lead, and contract roles.</span>
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: "monospace",
                fontSize: 16,
                color: ACCENT,
                letterSpacing: 2,
                textTransform: "uppercase",
                borderBottom: `1px solid ${ACCENT}`,
                paddingBottom: 4,
              }}
            >
              → SEE THE RESUME
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
