import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "nertia — a zero-point website generator";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#0a0a0a",
          color: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Cyan emission dot — zero-point focal point */}
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 72,
            width: 10,
            height: 10,
            borderRadius: 10,
            backgroundColor: "#00d4ff",
            boxShadow: "0 0 24px #00d4ff, 0 0 60px #00d4ff",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginLeft: 34,
            fontSize: 14,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#00d4ff",
          }}
        >
          ZERO-POINT · NERTIA.AI
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 112,
              fontWeight: 600,
              letterSpacing: -2.5,
              lineHeight: 1.02,
              color: "#f5f5f5",
            }}
          >
            A website emerges from your brief.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#9ca3af",
              maxWidth: 820,
              lineHeight: 1.35,
            }}
          >
            Free. Hosted. Live in under a minute.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 18,
            color: "#6b6b6b",
            letterSpacing: 1.2,
          }}
        >
          <span>nertia.ai</span>
          <span style={{ fontFamily: "monospace", fontSize: 14 }}>
            ver / 0.1 · 2026
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
