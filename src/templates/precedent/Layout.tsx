import Link from "next/link";
import type { Site } from "@/templates/types";

/**
 * Precedent — adapted from steven-tey/precedent (MIT).
 * Staggered fade-up hero with gradient headline and a primary/secondary CTA pair.
 *
 * Copy slots (see copySchema in ./template.tsx):
 * - hero.pill              (optional eyebrow pill)
 * - hero.headline          (required, big gradient text)
 * - hero.sub               (sub copy)
 * - hero.primaryCtaLabel   (required)
 * - hero.primaryCtaHref    (required)
 * - hero.secondaryCtaLabel (optional)
 * - hero.secondaryCtaHref  (optional)
 */
export function Layout({ site }: { site: Site }) {
  const c = site.copy;
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24 md:py-40"
      style={{
        backgroundColor: "#ffffff",
        color: "#0a0a0a",
        fontFamily: "var(--font-geist-sans), Inter, ui-sans-serif, system-ui",
      }}
    >
      <div className="w-full max-w-xl flex flex-col items-center">
        {c["hero.pill"] && (
          <span
            className="precedent-fade mb-5 inline-flex items-center rounded-full bg-blue-100 px-6 py-2"
            style={{ animationDelay: "0.05s" }}
          >
            <span className="text-sm font-semibold text-[#1d9bf0]">
              {c["hero.pill"]}
            </span>
          </span>
        )}
        <h1
          className="precedent-fade text-center font-bold tracking-[-0.02em] text-4xl md:text-7xl md:leading-[5rem] [text-wrap:balance]"
          style={{
            animationDelay: "0.15s",
            backgroundImage: "linear-gradient(to bottom right, #000, #6b6b6b)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {c["hero.headline"]}
        </h1>
        {c["hero.sub"] && (
          <p
            className="precedent-fade mt-6 text-center text-gray-500 md:text-xl [text-wrap:balance]"
            style={{ animationDelay: "0.25s" }}
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
              className="flex items-center justify-center rounded-full border border-black bg-black px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
            >
              {c["hero.primaryCtaLabel"]}
            </Link>
          )}
          {c["hero.secondaryCtaLabel"] && c["hero.secondaryCtaHref"] && (
            <Link
              href={c["hero.secondaryCtaHref"]}
              className="flex items-center justify-center rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 transition-colors hover:border-gray-800 hover:text-black"
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
