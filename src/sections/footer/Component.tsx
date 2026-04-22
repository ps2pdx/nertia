import type { SectionProps } from "../types";

export function Component({ copy }: SectionProps) {
    const wordmark = copy.wordmark ?? "";
    const tagline = copy.tagline ?? "";
    const links = [1, 2, 3]
        .map((i) => ({ label: copy[`link${i}Label`], href: copy[`link${i}Href`] }))
        .filter((l) => l.label && l.href);

    return (
        <section
            className="px-6 py-12 bg-[var(--background)] border-t"
            style={{ borderColor: "var(--card-border)" }}
        >
            <div className="max-w-3xl mx-auto flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
                {wordmark && (
                    <p
                        className="text-lg"
                        style={{
                            fontFamily: "var(--font-heading)",
                            color: "var(--foreground)",
                        }}
                    >
                        {wordmark}
                    </p>
                )}
                {tagline && (
                    <p
                        className="text-sm"
                        style={{
                            color: "var(--muted)",
                            fontFamily: "var(--font-body)",
                        }}
                    >
                        {tagline}
                    </p>
                )}
            </div>
            {links.length > 0 && (
                <div
                    className="max-w-3xl mx-auto mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm"
                    style={{ fontFamily: "var(--font-body)" }}
                >
                    {links.map((l, i) => (
                        <a
                            key={i}
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "var(--accent)" }}
                        >
                            {l.label} ↗
                        </a>
                    ))}
                </div>
            )}
        </section>
    );
}
