import type { SectionProps } from "../types";

export function Component({ copy }: SectionProps) {
    const headline = copy.headline ?? "";
    const sub = copy.sub ?? "";
    const ctaLabel = copy.ctaLabel ?? "";
    const ctaHref = copy.ctaHref || "#";

    return (
        <section className="min-h-[70svh] flex flex-col items-center justify-center px-6 py-24 text-center bg-[var(--token-bg)] text-[var(--token-fg)]">
            <h1
                className="text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight max-w-4xl"
                style={{
                    fontFamily: "var(--token-font-heading)",
                    letterSpacing: "-0.02em",
                    backgroundImage:
                        "linear-gradient(to right, var(--token-heading-start), var(--token-heading-end))",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                }}
            >
                {headline}
            </h1>
            {sub && (
                <p
                    className="mt-6 max-w-2xl text-lg md:text-xl"
                    style={{ color: "var(--token-muted)", fontFamily: "var(--token-font-body)" }}
                >
                    {sub}
                </p>
            )}
            {ctaLabel && (
                <a
                    href={ctaHref}
                    className="mt-10 inline-flex items-center border px-6 py-3 text-sm uppercase tracking-widest transition-colors hover:opacity-80"
                    style={{
                        borderColor: "var(--token-accent)",
                        color: "var(--token-accent)",
                        fontFamily: "var(--token-font-body)",
                    }}
                >
                    {ctaLabel}
                </a>
            )}
        </section>
    );
}
