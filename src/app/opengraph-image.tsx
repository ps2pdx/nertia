import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "nertia — frameworks for propulsion";

const INK = "#0c0c0c";
const PAPER = "#f3f1ec";
const ACCENT = "#15ef89";
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
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, fontSize: 22, color: PAPER, letterSpacing: -0.5, textTransform: "none" }}>
            <span>n</span>
            <span style={{ color: ACCENT }}>.</span>
            <span style={{ color: QUIET }}>[</span>
            <span>n</span>
            <span style={{ color: QUIET }}>]</span>
            <span>ertia</span>
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
