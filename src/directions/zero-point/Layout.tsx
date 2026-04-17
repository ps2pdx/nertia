import type { SiteConfig } from "@/directions/types";

export function Layout({ site }: { site: SiteConfig }) {
  const { palette, copy, typography } = site;
  const cssVars = {
    "--bg": palette.bg,
    "--fg": palette.fg,
    "--accent": palette.accent,
    "--muted": palette.muted,
    "--font-heading": typography.heading,
    "--font-body": typography.body,
  } as React.CSSProperties;

  return (
    <div
      style={cssVars}
      className="min-h-screen"
    >
      <div
        style={{
          backgroundColor: "var(--bg)",
          color: "var(--fg)",
          fontFamily: "var(--font-body), ui-sans-serif, system-ui",
          minHeight: "100vh",
        }}
      >
        <main className="mx-auto max-w-4xl px-6 py-24 md:py-40">
          {/* Hero */}
          <section className="space-y-8">
            {copy.hero.eyebrow && (
              <p
                className="text-xs uppercase tracking-[0.3em]"
                style={{ color: "var(--accent)" }}
              >
                {copy.hero.eyebrow}
              </p>
            )}
            <h1
              className="text-5xl md:text-7xl leading-[1.05] tracking-tight"
              style={{ fontFamily: "var(--font-heading), ui-sans-serif" }}
            >
              {copy.hero.headline}
            </h1>
            {copy.hero.sub && (
              <p className="max-w-xl text-lg md:text-xl" style={{ color: "var(--muted)" }}>
                {copy.hero.sub}
              </p>
            )}
            {copy.hero.cta && (
              <button
                type="button"
                className="mt-4 inline-flex items-center rounded-none border px-6 py-3 text-sm uppercase tracking-widest transition"
                style={{
                  borderColor: "var(--accent)",
                  color: "var(--accent)",
                }}
              >
                {copy.hero.cta}
              </button>
            )}
          </section>

          {/* Sections */}
          {copy.sections.length > 0 && (
            <div className="mt-32 space-y-24">
              {copy.sections.map((section, i) => (
                <section key={i} className="grid md:grid-cols-2 gap-8 items-start">
                  <div>
                    {section.headline && (
                      <h2
                        className="text-3xl md:text-4xl"
                        style={{ fontFamily: "var(--font-heading), ui-sans-serif" }}
                      >
                        {section.headline}
                      </h2>
                    )}
                  </div>
                  <div>
                    {section.body && (
                      <p className="text-base md:text-lg" style={{ color: "var(--muted)" }}>
                        {section.body}
                      </p>
                    )}
                    {section.cta && (
                      <button
                        type="button"
                        className="mt-6 inline-flex items-center px-6 py-3 text-sm uppercase tracking-widest transition"
                        style={{ borderColor: "var(--accent)", color: "var(--accent)", border: "1px solid" }}
                      >
                        {section.cta}
                      </button>
                    )}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
