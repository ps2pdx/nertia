import type { SectionProps } from "../types";

interface Tier {
    label: string;
    price: string;
    desc: string;
    ctaLabel: string;
}

function tierFrom(copy: Record<string, string>, n: 1 | 2 | 3): Tier {
    return {
        label: copy[`tier${n}Label`] ?? "",
        price: copy[`tier${n}Price`] ?? "",
        desc: copy[`tier${n}Desc`] ?? "",
        ctaLabel: copy[`tier${n}CtaLabel`] ?? "",
    };
}

export function Component({ copy }: SectionProps) {
    const heading = copy.heading || "Pricing";
    const tiers: Tier[] = [tierFrom(copy, 1), tierFrom(copy, 2), tierFrom(copy, 3)];

    return (
        <section
            className="px-6 py-24 bg-[var(--background)] text-[var(--foreground)]"
            style={{ fontFamily: "var(--font-body)" }}
        >
            <div className="max-w-5xl mx-auto">
                <p
                    className="text-xs uppercase tracking-[0.3em] mb-10 text-center"
                    style={{ color: "var(--accent)" }}
                >
                    {heading}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {tiers.map((t, i) => (
                        <div
                            key={i}
                            className="flex flex-col gap-4 p-6 bg-[var(--card-bg)] border rounded-2xl"
                            style={{ borderColor: "var(--card-border)" }}
                        >
                            {t.label && (
                                <p
                                    className="text-xs uppercase tracking-[0.2em]"
                                    style={{ color: "var(--muted)" }}
                                >
                                    {t.label}
                                </p>
                            )}
                            <p
                                className="text-4xl font-bold"
                                style={{
                                    fontFamily: "var(--font-heading)",
                                    color: "var(--foreground)",
                                }}
                            >
                                {t.price || "—"}
                            </p>
                            {t.desc && (
                                <p
                                    className="text-sm leading-relaxed"
                                    style={{ color: "var(--muted)" }}
                                >
                                    {t.desc}
                                </p>
                            )}
                            {t.ctaLabel && (
                                <a
                                    href="#"
                                    className="mt-auto inline-flex items-center justify-center border px-4 py-2 text-xs uppercase tracking-widest transition-colors hover:opacity-80"
                                    style={{
                                        borderColor: "var(--accent)",
                                        color: "var(--accent)",
                                    }}
                                >
                                    {t.ctaLabel}
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
