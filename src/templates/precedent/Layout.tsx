import Link from "next/link";
import type { Site } from "@/templates/types";

/**
 * Precedent — adapted from steven-tey/precedent (MIT).
 * Staggered fade-up hero with gradient headline and a primary/secondary CTA pair.
 *
 * Theme variables (all optional; defaults match original precedent aesthetic):
 *   --hero-bg             canvas
 *   --hero-fg             body text
 *   --hero-muted          sub copy
 *   --hero-accent         pill text / optional accents
 *   --hero-heading        gradient start (and button fill)
 *   --hero-heading-end    gradient end
 *   --hero-font-heading   display font stack
 *   --hero-font-body      body font stack
 *   --hero-pill-bg        optional pill background
 */
export function Layout({ site }: { site: Site }) {
  const c = site.copy;
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24 md:py-40"
      style={{
        backgroundColor: "var(--hero-bg, #ffffff)",
        color: "var(--hero-fg, #0a0a0a)",
        fontFamily:
          "var(--hero-font-body, var(--font-geist-sans), Inter, ui-sans-serif, system-ui)",
      }}
    >
      <div className="w-full max-w-xl flex flex-col items-center">
        {c["hero.pill"] && (
          <span
            className="precedent-fade mb-5 inline-flex items-center rounded-full px-6 py-2"
            style={{
              animationDelay: "0.05s",
              backgroundColor: "var(--hero-pill-bg, #dbeafe)",
            }}
          >
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--hero-accent, #1d9bf0)" }}
            >
              {c["hero.pill"]}
            </span>
          </span>
        )}
        <h1
          className="precedent-fade text-center font-bold tracking-[-0.02em] text-4xl md:text-7xl md:leading-[5rem] [text-wrap:balance]"
          style={{
            animationDelay: "0.15s",
            backgroundImage:
              "linear-gradient(to bottom right, var(--hero-heading, #000000), var(--hero-heading-end, #6b6b6b))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            fontFamily: "var(--hero-font-heading, var(--hero-font-body))",
          }}
        >
          {c["hero.headline"]}
        </h1>
        {c["hero.sub"] && (
          <p
            className="precedent-fade mt-6 text-center md:text-xl [text-wrap:balance]"
            style={{
              animationDelay: "0.25s",
              color: "var(--hero-muted, #6b7280)",
            }}
          >
            {c["hero.sub"]}
          </p>
        )}
        <div
          className="precedent-fade mt-6 flex items-center justify-center gap-5"
          style={{ animationDelay: "0.35s" }}
        >
          {c["hero.primaryCtaLabel"] && c["hero.primaryCtaHref"] && (
            <Link
              href={c["hero.primaryCtaHref"]}
              className="flex items-center justify-center rounded-full px-5 py-2 text-sm transition-colors"
              style={{
                border: "1px solid var(--hero-heading, #000000)",
                backgroundColor: "var(--hero-heading, #000000)",
                color: "var(--hero-bg, #ffffff)",
              }}
            >
              {c["hero.primaryCtaLabel"]}
            </Link>
          )}
          {c["hero.secondaryCtaLabel"] && c["hero.secondaryCtaHref"] && (
            <Link
              href={c["hero.secondaryCtaHref"]}
              className="flex items-center justify-center rounded-full px-5 py-2 text-sm transition-colors"
              style={{
                border: "1px solid var(--hero-muted, #d1d5db)",
                backgroundColor: "var(--hero-bg, #ffffff)",
                color: "var(--hero-muted, #6b7280)",
              }}
            >
              {c["hero.secondaryCtaLabel"]}
            </Link>
          )}
        </div>
      </div>
      <style>{`
        @keyframes precedent-fade-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .precedent-fade {
          opacity: 0;
          animation: precedent-fade-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
