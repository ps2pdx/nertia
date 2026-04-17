export interface HowItWorksStep {
  label: string;
  description?: string;
}

export interface HowItWorksProps {
  steps: HowItWorksStep[];
}

export function HowItWorks({ steps }: HowItWorksProps) {
  return (
    <section
      className="px-6 md:px-12 py-24 md:py-32"
      style={{
        backgroundColor: "var(--how-bg, #0a0a0a)",
        color: "var(--how-fg, #f5f5f5)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <p
          className="text-xs uppercase tracking-[0.3em] mb-10"
          style={{ color: "var(--how-accent, #00d4ff)" }}
        >
          how it works
        </p>
        <ol className="grid gap-8 md:gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={i} className="flex flex-col gap-3">
              <span
                className="text-[11px] tracking-[0.2em]"
                style={{ color: "var(--how-muted, #6b6b6b)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                className="text-2xl md:text-3xl"
                style={{ fontFamily: "var(--how-font-heading, 'Inter', ui-sans-serif)" }}
              >
                {step.label}
              </h3>
              {step.description && (
                <p className="text-base" style={{ color: "var(--how-muted, #9ca3af)" }}>
                  {step.description}
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
