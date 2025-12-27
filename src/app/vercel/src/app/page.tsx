"use client";

export default function Home() {
  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #050816 0%, #0a0a1a 100%)",
      color: "#f7faff",
      padding: "24px",
      textAlign: "center",
    }}>
      <div style={{ maxWidth: "800px" }}>
        <h1 style={{ fontSize: "48px", marginBottom: "24px", fontWeight: "bold" }}>nertia</h1>
        <p style={{ fontSize: "18px", opacity: 0.9, lineHeight: "1.6", marginBottom: "32px" }}>
          Dear Vercel Team, I didn&apos;t come to Vercel through a job posting. It came to me while building.
        </p>
        <a
          href="https://nertia.ai?utm_source=vercel_recruiter&utm_medium=referral&utm_campaign=vercel_job"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            padding: "12px 28px",
            borderRadius: "10px",
            fontWeight: 600,
            letterSpacing: 0.2,
            color: "#0a0a0a",
            background: "#f7faff",
            border: "1px solid rgba(255,255,255,0.4)",
            textDecoration: "none",
          }}
        >
          Visit Full Experience
        </a>
      </div>
    </div>
  );
}
