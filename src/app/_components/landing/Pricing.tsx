import Link from "next/link";

export interface PricingTier {
  name: string;
  tagline?: string;
  price: string;
  bullets: string[];
  cta: { label: string; href: string };
  featured?: boolean;
}

export interface PricingProps {
  tiers: PricingTier[];
}

export function Pricing({ tiers }: PricingProps) {
  return (
    <section
      className="px-6 md:px-12 py-24 md:py-32"
      style={{
        backgroundColor: "var(--pricing-bg, #0a0a0a)",
        color: "var(--pricing-fg, #f5f5f5)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        <p
          className="text-xs uppercase tracking-[0.3em] mb-10"
          style={{ color: "var(--pricing-accent, #00d4ff)" }}
        >
          pricing
        </p>
        <div className="grid gap-6 md:gap-8 md:grid-cols-2">
          {tiers.map((tier) => (
            <article
              key={tier.name}
              className="border p-8 flex flex-col gap-6"
              style={{
                borderColor: tier.featured
                  ? "var(--pricing-accent, #00d4ff)"
                  : "var(--pricing-border, #1f1f1f)",
              }}
            >
              <header className="flex flex-col gap-2">
                <h3
                  className="text-2xl md:text-3xl"
                  style={{ fontFamily: "var(--pricing-font-heading, 'Inter', ui-sans-serif)" }}
                >
                  {tier.name}
                </h3>
                {tier.tagline && (
                  <p style={{ color: "var(--pricing-muted, #9ca3af)" }}>{tier.tagline}</p>
                )}
                <p
                  className="text-3xl md:text-4xl mt-2"
                  style={{ fontFamily: "var(--pricing-font-heading, 'Inter', ui-sans-serif)" }}
                >
                  {tier.price}
                </p>
              </header>
              <ul className="flex flex-col gap-2">
                {tier.bullets.map((bullet, i) => (
                  <li
                    key={i}
                    className="text-sm flex gap-3"
                    style={{ color: "var(--pricing-muted, #d1d5db)" }}
                  >
                    <span style={{ color: "var(--pricing-accent, #00d4ff)" }}>+</span>
                    {bullet}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Link
                  href={tier.cta.href}
                  className="inline-flex items-center border px-6 py-3 text-sm uppercase tracking-widest transition-colors hover:bg-white/5"
                  style={{
                    borderColor: "var(--pricing-accent, #00d4ff)",
                    color: "var(--pricing-accent, #00d4ff)",
                  }}
                >
                  {tier.cta.label}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
