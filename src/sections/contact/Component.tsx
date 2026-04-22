import type { SectionProps } from "../types";

export function Component({ copy }: SectionProps) {
    const heading = copy.heading || "Get in touch.";
    const body = copy.body ?? "";
    const email = copy.email ?? "";
    const ctaLabel = copy.ctaLabel ?? (email ? "Email" : "");
    const ctaHref = copy.ctaHref || (email ? `mailto:${email}` : "#");

    return (
        <section
            className="px-6 py-24 bg-[var(--background)] text-[var(--foreground)]"
            style={{ fontFamily: "var(--font-body)" }}
        >
            <div className="max-w-3xl mx-auto text-center">
                <h2
                    className="text-3xl sm:text-4xl font-bold mb-6"
                    style={{ fontFamily: "var(--font-heading)" }}
                >
                    {heading}
                </h2>
                {body && (
                    <p
                        className="text-base max-w-xl mx-auto mb-8"
                        style={{ color: "var(--muted)" }}
                    >
                        {body}
                    </p>
                )}
                {ctaLabel && (
                    <a
                        href={ctaHref}
                        className="inline-flex items-center border px-6 py-3 text-sm uppercase tracking-widest transition-colors hover:opacity-80"
                        style={{
                            borderColor: "var(--accent)",
                            color: "var(--accent)",
                        }}
                    >
                        {ctaLabel}
                    </a>
                )}
            </div>
        </section>
    );
}
