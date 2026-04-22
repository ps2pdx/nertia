import type { SectionProps } from "../types";

export function Component({ copy }: SectionProps) {
    const heading = copy.heading || "About";
    const body = copy.body ?? "";

    return (
        <section className="px-6 py-24 bg-[var(--background)] text-[var(--foreground)]">
            <div className="max-w-3xl mx-auto">
                <p
                    className="text-xs uppercase tracking-[0.3em] mb-6"
                    style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}
                >
                    {heading}
                </p>
                <p
                    className="text-xl md:text-2xl leading-relaxed"
                    style={{
                        fontFamily: "var(--font-body)",
                        color: "var(--foreground)",
                    }}
                >
                    {body}
                </p>
            </div>
        </section>
    );
}
