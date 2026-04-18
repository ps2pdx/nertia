import Link from "next/link";
import { listTemplates } from "@/templates";

export function Gallery() {
  const templates = listTemplates();

  if (templates.length === 0) {
    return (
      <section
        data-testid="gallery-empty"
        className="min-h-screen flex items-center justify-center px-6"
        style={{
          backgroundColor: "var(--background, #0a0a0a)",
          color: "var(--muted, #6b6b6b)",
        }}
      >
        <p className="text-sm uppercase tracking-[0.2em]">library emerging</p>
      </section>
    );
  }

  return (
    <section
      className="min-h-screen px-6 md:px-12 py-24 md:py-32"
      style={{
        backgroundColor: "var(--background, #0a0a0a)",
        color: "var(--foreground, #f5f5f5)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <p
            className="text-xs uppercase tracking-[0.3em] mb-3"
            style={{ color: "var(--accent, #00d4ff)" }}
          >
            templates
          </p>
          <h1 className="text-4xl md:text-6xl tracking-tight">Pick a template. Ship it live.</h1>
          <p
            className="mt-4 max-w-xl text-base md:text-lg"
            style={{ color: "var(--muted, #9ca3af)" }}
          >
            Open-source Next.js templates from the Vercel ecosystem. We wrap them with your copy
            and deploy automatically — real React, real Vercel, no proprietary layer in between.
          </p>
        </header>
        <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <Link
              key={t.id}
              href={`/generate/${t.id}`}
              className="group block border p-6 transition-colors hover:bg-white/[0.02]"
              style={{ borderColor: "var(--border, #1f1f1f)" }}
            >
              <h3
                className="text-2xl mb-2 transition-colors"
                style={{
                  fontFamily: "var(--font-heading, Inter)",
                }}
              >
                {t.displayName}
              </h3>
              <p
                className="text-sm mb-4"
                style={{ color: "var(--muted, #9ca3af)" }}
              >
                {t.description}
              </p>
              {t.tags.length > 0 && (
                <ul className="flex flex-wrap gap-1.5 mb-4">
                  {t.tags.map((tag) => (
                    <li
                      key={tag}
                      className="text-[10px] uppercase tracking-[0.15em] px-2 py-1"
                      style={{
                        color: "var(--muted, #9ca3af)",
                        border: "1px solid var(--border, #1f1f1f)",
                      }}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
              <p
                className="text-[10px] uppercase tracking-[0.15em] pt-3 border-t"
                style={{
                  color: "var(--muted, #6b6b6b)",
                  borderColor: "var(--border, #1f1f1f)",
                }}
              >
                {t.sourceAttribution}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
