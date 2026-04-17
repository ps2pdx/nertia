import { listStableDirections } from "@/directions";

export function DirectionSampler() {
  const directions = listStableDirections();

  if (directions.length === 0) {
    return (
      <section
        data-testid="direction-sampler-empty"
        className="px-6 md:px-12 py-24"
        style={{ backgroundColor: "var(--sampler-bg, #0a0a0a)", color: "var(--sampler-muted, #6b6b6b)" }}
      >
        <p className="text-sm uppercase tracking-[0.2em]">library emerging</p>
      </section>
    );
  }

  return (
    <section
      className="px-6 md:px-12 py-24 md:py-32"
      style={{
        backgroundColor: "var(--sampler-bg, #0a0a0a)",
        color: "var(--sampler-fg, #f5f5f5)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <p
          className="text-xs uppercase tracking-[0.3em] mb-6"
          style={{ color: "var(--sampler-accent, #00d4ff)" }}
        >
          directions
        </p>
        <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {directions.map((dir) => (
            <article
              key={dir.name}
              className="border p-5 md:p-6 transition-colors hover:bg-white/[0.02]"
              style={{ borderColor: "var(--sampler-border, #1f1f1f)" }}
            >
              <h3
                className="text-xl md:text-2xl mb-3 capitalize"
                style={{ fontFamily: "var(--sampler-font-heading, 'Inter', ui-sans-serif)" }}
              >
                {dir.displayName.replace(/-/g, " ")}
              </h3>
              <ul className="flex flex-wrap gap-1.5 mb-0">
                {dir.tags.map((tag) => (
                  <li
                    key={tag}
                    className="text-[10px] uppercase tracking-[0.15em] px-2 py-1"
                    style={{
                      color: "var(--sampler-muted, #9ca3af)",
                      border: "1px solid var(--sampler-border, #1f1f1f)",
                    }}
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
