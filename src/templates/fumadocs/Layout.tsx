import type { Site } from "@/templates/types";

const MAX_FEATURES = 3;

type Feature = { title: string; body?: string };

function readFeatures(copy: Record<string, string>): Feature[] {
  const out: Feature[] = [];
  for (let i = 1; i <= MAX_FEATURES; i++) {
    const title = copy[`feature.${i}.title`];
    if (!title) continue;
    out.push({ title, body: copy[`feature.${i}.body`] });
  }
  return out;
}

/**
 * fumadocs — adapted from fuma-nama/fumadocs (MIT, Fuma Nama).
 * Docs-first marketing landing. Pill badge, big headline with a
 * brand-color accent word and trailing phrase, primary + secondary
 * CTAs, then a rounded-card feature grid.
 *
 * The reference app uses fumadocs-ui internals (animated previews,
 * marquees, code blocks) — those are out of scope. The slot model
 * captures the static structural marketing pattern.
 *
 * Copy slots:
 * - hero.badge              (required)
 * - hero.headlinePart1      (required) — start of headline
 * - hero.headlineAccent     (required) — brand-color accent word
 * - hero.headlinePart2      (optional) — trailing phrase
 * - hero.primaryCtaLabel    (required)
 * - hero.primaryCtaHref     (required)
 * - hero.secondaryCtaLabel  (optional)
 * - hero.secondaryCtaHref   (optional)
 * - features.heading        (optional, defaults to "Features")
 * - feature.{1..3}.title    (each optional; card hidden if title absent)
 * - feature.{1..3}.body     (optional)
 */
export function Layout({ site }: { site: Site }) {
  const c = site.copy;
  const headlinePart2 = c["hero.headlinePart2"];
  const secondaryLabel = c["hero.secondaryCtaLabel"];
  const secondaryHref = c["hero.secondaryCtaHref"];
  const features = readFeatures(c);
  const featuresHeading = c["features.heading"] ?? "Features";

  const BRAND = "#f97316";
  const BRAND_BORDER = "rgba(249, 115, 22, 0.5)";

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#0b0b0d",
        color: "#e5e5e5",
        fontFamily:
          "var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system",
      }}
    >
      <main className="mx-auto w-full max-w-6xl px-6 py-12 md:py-20">
        <section className="rounded-2xl border p-8 md:p-14 max-w-4xl flex flex-col gap-8" style={{ borderColor: "#1f1f23" }}>
          <span
            className="self-start rounded-full px-3 py-1 text-xs font-medium border"
            style={{ color: BRAND, borderColor: BRAND_BORDER }}
          >
            {c["hero.badge"]}
          </span>
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-medium tracking-tight leading-tight">
            {c["hero.headlinePart1"]}{" "}
            <span style={{ color: BRAND }}>{c["hero.headlineAccent"]}</span>
            {headlinePart2 && <>, {headlinePart2}</>}
          </h1>
          <div className="flex flex-row flex-wrap items-center gap-3">
            <a
              href={c["hero.primaryCtaHref"]}
              className="inline-flex justify-center rounded-full px-5 py-3 text-sm font-medium tracking-tight transition"
              style={{ backgroundColor: BRAND, color: "#0b0b0d" }}
            >
              {c["hero.primaryCtaLabel"]}
            </a>
            {secondaryLabel && secondaryHref && (
              <a
                href={secondaryHref}
                rel="noreferrer noopener"
                target="_blank"
                className="inline-flex justify-center rounded-full px-5 py-3 text-sm font-medium tracking-tight border transition hover:bg-white/5"
                style={{ borderColor: "#27272a", color: "#e5e5e5" }}
              >
                {secondaryLabel}
              </a>
            )}
          </div>
        </section>

        {features.length > 0 && (
          <section className="mt-16 md:mt-20 flex flex-col gap-8">
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight">
              {featuresHeading}
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <li
                  key={i}
                  className="rounded-2xl border p-6 flex flex-col gap-3"
                  style={{ borderColor: "#1f1f23", backgroundColor: "#101013" }}
                >
                  <h3 className="text-xl font-medium">{f.title}</h3>
                  {f.body && (
                    <p className="text-sm leading-relaxed text-neutral-400">{f.body}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
