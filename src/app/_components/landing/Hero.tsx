import Link from "next/link";

export interface HeroProps {
  eyebrow?: string;
  headline: string;
  sub?: string;
  ctaLabel: string;
  ctaHref: string;
}

export function Hero({ eyebrow, headline, sub, ctaLabel, ctaHref }: HeroProps) {
  return (
    <section className="relative min-h-[88svh] flex flex-col justify-center px-6 md:px-12 py-24 md:py-40 overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div
        aria-hidden
        className="absolute left-6 md:left-12 top-24 md:top-40 w-px h-16 origin-top bg-[var(--accent)]"
        style={{ animation: "nertia-hero-breath 6s ease-in-out infinite" }}
      />

      <div className="relative max-w-4xl space-y-6 md:space-y-8 pt-12">
        {eyebrow && (
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">
            {eyebrow}
          </p>
        )}
        <h1 className="text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight font-[var(--font-heading)]">
          {headline}
        </h1>
        {sub && (
          <p className="max-w-xl text-lg md:text-xl text-muted">
            {sub}
          </p>
        )}
        <div className="pt-4">
          <Link
            href={ctaHref}
            className="inline-flex items-center border border-[var(--accent)] text-[var(--accent)] px-6 py-3 text-sm uppercase tracking-widest transition-colors hover:bg-[var(--accent)]/10"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes nertia-hero-breath {
          0%, 100% { transform: scaleY(0.4); opacity: 0.5; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
