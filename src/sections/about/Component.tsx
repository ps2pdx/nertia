import type { SectionProps } from "../types";

export function Component({ copy }: SectionProps) {
    const heading = copy.heading || "About";
    const body = copy.body ?? "";

    return (
        <section className="px-6 py-24 bg-[var(--token-bg)] text-[var(--token-fg)]">
            <div className="max-w-3xl mx-auto">
                <p
                    className="text-xs uppercase tracking-[0.3em] mb-6"
                    style={{ color: "var(--token-accent)", fontFamily: "var(--token-font-body)" }}
                >
                    {heading}
                </p>
                <p
                    className="text-xl md:text-2xl leading-relaxed"
                    style={{
                        fontFamily: "var(--token-font-body)",
                        color: "var(--token-fg)",
                    }}
                >
                    {body}
                </p>
            </div>
        </section>
    );
}
