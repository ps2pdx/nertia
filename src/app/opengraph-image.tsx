import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "nertia — frameworks for propulsion";

const INK = "#0c0c0c";
const PAPER = "#f3f1ec";
const ACCENT = "#1fb573";
const QUIET = "#80807a";
const MUTED = "#a8a8a0";

export default function OpenGraphImage() {
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
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* topbar — brand mark + meta */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "monospace",
            fontSize: 16,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: QUIET,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Trending-up arrow — same path as Brand component */}
            <svg
              width="40"
              height="40"
              viewBox="-1.5 -1.5 12 15"
              xmlns="http://www.w3.org/2000/svg"
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
            <span style={{ display: "flex", fontSize: 26, color: PAPER, letterSpacing: -0.5, textTransform: "none" }}>
              nertia<span style={{ color: ACCENT }}>.</span>ai
            </span>
          </div>
          <span>v1 · 2026</span>
        </div>

        {/* huge headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: ACCENT,
            }}
          >
            ↳ FRAMEWORKS FOR PROPULSION
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 144,
              fontWeight: 800,
              letterSpacing: -5,
              lineHeight: 0.92,
              color: PAPER,
            }}
          >
            PROPULSION,
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 144,
              fontWeight: 800,
              letterSpacing: -5,
              lineHeight: 0.92,
              color: PAPER,
            }}
          >
            APPLIED<span style={{ color: ACCENT }}>.</span>
          </div>
        </div>

        {/* footer strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "monospace",
            fontSize: 16,
            color: MUTED,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <span>nertia.ai · portland · scott campbell</span>
          <span>pmm × ai-gtm × full-stack</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
