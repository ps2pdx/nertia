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
    <section
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 py-24 md:py-40 overflow-hidden"
      style={{
        backgroundColor: "var(--hero-bg, #0a0a0a)",
        color: "var(--hero-fg, #f5f5f5)",
        fontFamily: "var(--hero-font-body, 'Inter', ui-sans-serif, system-ui)",
      }}
    >
      <div
        aria-hidden
        className="absolute left-6 md:left-12 top-24 md:top-40 w-px h-16 origin-top"
        style={{
          backgroundColor: "var(--hero-accent, #00d4ff)",
          animation: "nertia-hero-breath 6s ease-in-out infinite",
        }}
      />

      <div className="relative max-w-4xl space-y-6 md:space-y-8 pt-12">
        {eyebrow && (
          <p
            className="text-xs uppercase tracking-[0.3em]"
            style={{ color: "var(--hero-accent, #00d4ff)" }}
          >
            {eyebrow}
          </p>
        )}
        <h1
          className="text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight"
          style={{ fontFamily: "var(--hero-font-heading, 'Inter', ui-sans-serif)" }}
        >
          {headline}
        </h1>
        {sub && (
          <p
            className="max-w-xl text-lg md:text-xl"
            style={{ color: "var(--hero-muted, #9ca3af)" }}
          >
            {sub}
          </p>
        )}
        <div className="pt-4">
          <Link
            href={ctaHref}
            className="inline-flex items-center border px-6 py-3 text-sm uppercase tracking-widest transition-colors hover:bg-white/5"
            style={{
              borderColor: "var(--hero-accent, #00d4ff)",
              color: "var(--hero-accent, #00d4ff)",
            }}
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
