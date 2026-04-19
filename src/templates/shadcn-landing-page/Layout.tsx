import type { Site } from "@/templates/types";

/**
 * shadcn-landing-page — adapted from leoMirandaa/shadcn-landing-page (MIT).
 * Marketing hero with two-color gradient accent words flanking a plain
 * mid-headline, sub copy, and a primary + optional secondary CTA stack.
 *
 * Copy slots:
 * - hero.accentPrimary       (required) — pink-gradient lead word(s)
 * - hero.headline            (required) — plain mid-headline phrase
 * - hero.accentSecondary     (optional) — blue-gradient second accent
 * - hero.headlineSuffix      (optional) — trailing plain text
 * - hero.sub                 (required) — sub-paragraph
 * - hero.primaryCtaLabel     (required)
 * - hero.primaryCtaHref      (required)
 * - hero.secondaryCtaLabel   (optional, paired with href)
 * - hero.secondaryCtaHref    (optional, paired with label)
 */
export function Layout({ site }: { site: Site }) {
  const c = site.copy;
  const accentSecondary = c["hero.accentSecondary"];
  const headlineSuffix = c["hero.headlineSuffix"];
  const secondaryCtaLabel = c["hero.secondaryCtaLabel"];
  const secondaryCtaHref = c["hero.secondaryCtaHref"];

  return (
    <div
      className="min-h-screen flex items-center"
      style={{
        backgroundColor: "#0b0b0f",
        color: "#f5f5f7",
        fontFamily:
          "var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system",
      }}
    >
      <section className="container mx-auto px-6 py-20 md:py-32 max-w-3xl text-center">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
          <span
            className="bg-gradient-to-r text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(to right, #F596D3, #D247BF)" }}
          >
            {c["hero.accentPrimary"]}
          </span>{" "}
          {c["hero.headline"]}
          {accentSecondary && (
            <>
              {" "}
              <span
                className="bg-gradient-to-r text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(to right, #61DAFB, #03a3d7)" }}
              >
                {accentSecondary}
              </span>
            </>
          )}
          {headlineSuffix && <> {headlineSuffix}</>}
        </h1>

        <p className="mt-6 text-lg md:text-xl text-neutral-400 max-w-xl mx-auto">
          {c["hero.sub"]}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-3 justify-center">
          <a
            href={c["hero.primaryCtaHref"]}
            className="inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium transition"
            style={{ backgroundColor: "#f5f5f7", color: "#0b0b0f" }}
          >
            {c["hero.primaryCtaLabel"]}
          </a>
          {secondaryCtaLabel && secondaryCtaHref && (
            <a
              href={secondaryCtaHref}
              rel="noreferrer noopener"
              target="_blank"
              className="inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium border transition"
              style={{ borderColor: "#2a2a30", color: "#f5f5f7" }}
            >
              {secondaryCtaLabel}
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
