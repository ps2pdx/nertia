import type { Site } from "@/templates/types";

/**
 * chiang-v4 — adapted from bchiang7/v4 (MIT, Brittany Chiang).
 * Dark navy + teal accent dev portfolio hero. Monospace teal eyebrow,
 * massive name + tagline, slate-toned bio paragraph, and a single
 * outline-button CTA. Staggered fade-up motion via CSS.
 *
 * Copy slots:
 * - hero.eyebrow    (required) — small monospace teal line
 * - hero.name       (required) — h1, huge
 * - hero.tagline    (required) — h2, second large line, slightly muted
 * - hero.bio        (required) — paragraph
 * - hero.ctaLabel   (required)
 * - hero.ctaHref    (required)
 */
export function Layout({ site }: { site: Site }) {
  const c = site.copy;

  return (
    <div
      className="min-h-screen px-6 md:px-12 py-20 md:py-32 flex items-center"
      style={{
        backgroundColor: "#0a192f",
        color: "#ccd6f6",
        fontFamily:
          "var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system",
      }}
    >
      <div className="mx-auto w-full max-w-3xl flex flex-col gap-5">
        <p
          className="cv4-stagger text-sm"
          style={{
            ["--index" as string]: 0,
            color: "#64ffda",
            fontFamily:
              "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >
          {c["hero.eyebrow"]}
        </p>
        <h1
          className="cv4-stagger text-5xl md:text-7xl font-bold tracking-tight leading-none"
          style={{ ["--index" as string]: 1, color: "#ccd6f6" }}
        >
          {c["hero.name"]}
        </h1>
        <h2
          className="cv4-stagger text-4xl md:text-6xl font-bold tracking-tight leading-tight"
          style={{ ["--index" as string]: 2, color: "#8892b0" }}
        >
          {c["hero.tagline"]}
        </h2>
        <p
          className="cv4-stagger mt-2 max-w-xl text-base md:text-lg leading-relaxed"
          style={{ ["--index" as string]: 3, color: "#8892b0" }}
        >
          {c["hero.bio"]}
        </p>
        <div className="cv4-stagger mt-8" style={{ ["--index" as string]: 4 }}>
          <a
            href={c["hero.ctaHref"]}
            className="inline-block rounded border px-7 py-4 text-sm md:text-base font-medium transition hover:bg-white/5"
            style={{
              borderColor: "#64ffda",
              color: "#64ffda",
              fontFamily:
                "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          >
            {c["hero.ctaLabel"]}
          </a>
        </div>
      </div>
      <style>{`
        @keyframes cv4-fade-up {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .cv4-stagger {
          opacity: 0;
          animation: cv4-fade-up 0.6s ease-out forwards;
          animation-delay: calc(var(--index, 0) * 0.12s + 0.05s);
        }
      `}</style>
    </div>
  );
}
