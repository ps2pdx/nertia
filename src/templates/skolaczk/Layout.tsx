import type { Site } from "@/templates/types";

/**
 * skolaczk — adapted from Skolaczk/next-starter (MIT, Michał Skolak).
 * Minimal centered marketing variant: thin top nav with a brand wordmark,
 * a vertically-centered hero with monospace gradient-accent headline,
 * sub copy, and primary + optional secondary CTA buttons.
 *
 * Distinct from precedent's gradient-headline marketing — this leans
 * monospace and architecturally restrained.
 *
 * Copy slots:
 * - nav.brand                (required) — top-left brand wordmark
 * - hero.accent              (required) — gradient-accent lead word
 * - hero.headline            (required) — rest of the headline phrase
 * - hero.sub                 (required)
 * - hero.primaryCtaLabel     (required)
 * - hero.primaryCtaHref      (required)
 * - hero.secondaryCtaLabel   (optional)
 * - hero.secondaryCtaHref    (optional)
 */
export function Layout({ site }: { site: Site }) {
  const c = site.copy;
  const secondaryLabel = c["hero.secondaryCtaLabel"];
  const secondaryHref = c["hero.secondaryCtaHref"];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "#0a0a0a",
        color: "#fafafa",
        fontFamily:
          "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
      }}
    >
      <header className="w-full border-b" style={{ borderColor: "#1a1a1a" }}>
        <div className="mx-auto max-w-6xl px-6 flex h-16 items-center">
          <span className="text-lg font-bold tracking-tight">{c["nav.brand"]}</span>
        </div>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 gap-3">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tighter [word-spacing:-0.5rem] mb-1">
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(to right, #be123c, #db2777)" }}
          >
            {c["hero.accent"]}
          </span>{" "}
          {c["hero.headline"]}
        </h1>
        <p className="max-w-2xl text-base md:text-lg text-neutral-400">{c["hero.sub"]}</p>
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <a
            href={c["hero.primaryCtaHref"]}
            className="inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium transition"
            style={{ backgroundColor: "#fafafa", color: "#0a0a0a" }}
          >
            {c["hero.primaryCtaLabel"]}
          </a>
          {secondaryLabel && secondaryHref && (
            <a
              href={secondaryHref}
              rel="noreferrer noopener"
              target="_blank"
              className="inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium border transition"
              style={{ borderColor: "#262626", color: "#fafafa" }}
            >
              {secondaryLabel}
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
